<?php
include_once('../../nucleo/clases/cls_Conexion.php');
include_once('../../nucleo/clases/cls_Mensaje_Sistema.php');
include_once('cls_AccesoZona.php');
include_once('cls_DiaZafra.php');
include_once('cls_ProcesoDiaZafra.php');
class cls_ArrimadaVsCampo extends cls_Conexion{

 protected $aa_Atributos = array();
 private $aa_Campos = array('codigo_zona','nombre','descripcion');

 public function setPeticion($pa_Peticion){
   $this->aa_Atributos=$pa_Peticion;
   $this->setDatosConexion($_SESSION['Con']['Nombre'],$_SESSION['Con']['Pass']);
 }

 public function getAtributos(){
   return $this->aa_Atributos;
 }

 public function gestionar(){
  $lobj_Mensaje = new cls_Mensaje_Sistema;
  switch ($this->aa_Atributos['operacion']) {
    case 'buscarValidacion':
      $this->aa_Atributos['diaZafra'] = $this->buscarDiaZafra();
      $registros=$this->f_Listar('validacion');
      if($this->aa_Atributos['diaZafra']['fecha_dia']==''){
          $respuesta['success'] = 0;
          $respuesta['mensaje'] = $lobj_Mensaje->buscarMensaje(30);
      }else{
        if(count($registros)!=0){
          $success=1;
          $respuesta['registros']=$registros;
          $respuesta['diaZafra'] = $this->aa_Atributos['diaZafra'];
        }else{
          $respuesta['success'] = 0;
          $respuesta['mensaje'] = $lobj_Mensaje->buscarMensaje(8);
        }
      }
      break;

    case 'buscarValidacionRelacionada':
      $this->aa_Atributos['diaZafra'] = $this->buscarDiaZafra();
      $registros=$this->f_Listar('relacionada');
      if($this->aa_Atributos['diaZafra']['fecha_dia']==''){
          $respuesta['success'] = 0;
          $respuesta['mensaje'] = $lobj_Mensaje->buscarMensaje(30);
      }else{
        if(count($registros)!=0){
          $success=1;
          $respuesta['registros']=$registros;
          $respuesta['diaZafra'] = $this->aa_Atributos['diaZafra'];
        }else{
          $respuesta['success'] = 0;
          $respuesta['mensaje'] = $lobj_Mensaje->buscarMensaje(8);
        }
      }
      break;

    case 'buscarDiferencia':
      $this->aa_Atributos['diaZafra'] = $this->buscarDiaZafra();
      $registros=$this->f_BuscarDif();
      if($this->aa_Atributos['diaZafra']['fecha_dia']==''){
          $respuesta['success'] = 0;
          $respuesta['mensaje'] = $lobj_Mensaje->buscarMensaje(30);
      }else{
        if(count($registros)!=0){
          $success=1;
          $respuesta['diferencia']=$this->aa_Atributos['diferencia'];
        }else{
          $respuesta['success'] = 0;
          $respuesta['mensaje'] = $lobj_Mensaje->buscarMensaje(8);
        }
      }
      break;

      case 'buscarElementosFaltantes':
        $registros=$this->f_BuscarElementosFaltantes();
        if(count($registros)!=0){
          $success=1;
          $respuesta['faltantes']=$registros;
        }else{
          $respuesta['success'] = 0;
          $respuesta['mensaje'] = $lobj_Mensaje->buscarMensaje(8);
        }
        break;

    case 'buscarDatosCalendario':
      //obtengo los dias de zafra
      $lobj_Dia = new cls_DiaZafra;
      $lobj_Dia->setPeticion(array('operacion' => 'buscarDiasZafraActiva'));
      $respuesta['dias'] = $lobj_Dia->gestionar()['registros'];

      //busco los estado de proceso dia para la leyenda
      $lobj_PDZ = new cls_ProcesoDiaZafra;
      $lobj_PDZ->setPeticion(array(
        'operacion' => 'buscar'
        )
      );
      $respuesta['procesos'] = $lobj_PDZ->gestionar()['registros'];
      $success = '1';
      break;

     default:
       $valores = array('{OPERACION}' => strtoupper($this->aa_Atributos['operacion']), '{ENTIDAD}' => strtoupper($this->aa_Atributos['entidad']));
       $respuesta['mensaje'] = $lobj_Mensaje->completarMensaje(11,$valores);
       $success = 0;
       break;
   }
   if(!isset($respuesta['success'])){
     $respuesta['success']=$success;
   }
   return $respuesta;
 }
 private function f_Listar($tipo){
   $x=0;
   $la_respuesta=array();
   $cadenaBusqueda = $this->armarBusqueda();
   if($tipo == 'relacionada'){
     $ls_Sql="SELECT * FROM agronomia.vvalidacion_soca_relacionado $cadenaBusqueda order by codcanicultor, letrafinca, codigotablon, boletoromana ";
   }else if($tipo ==  'validacion'){
     $ls_Sql="SELECT * FROM agronomia.vvalidacion_soca $cadenaBusqueda order by codcanicultor, letrafinca, codigotablon, boletoromana ";
   }
   $this->f_Con();
   $lr_tabla=$this->f_Filtro($ls_Sql);
   while($la_registros=$this->f_Arreglo($lr_tabla)){
     $la_respuesta[$x]['boleto'] = $la_registros['boletoromana'];
     $la_respuesta[$x]['remesa'] = $la_registros['numeroremesa'];
     $la_respuesta[$x]['finca'] = $la_registros['nombrefinca'];
     $la_respuesta[$x]['tablon'] = $la_registros['codigotablon'];
     $la_respuesta[$x]['fechadia'] = $la_registros['fechadia'];
     $la_respuesta[$x]['pesoneto/ton'] = $la_registros['pesoneto_ton'];
     $la_respuesta[$x]['azucar'] = $la_registros['azucarprobable'];
     $la_respuesta[$x]['rendimiento'] = $la_registros['rendimiento'];
     $la_respuesta[$x]['pesoneto'] = $la_registros['pesoneto'];
     $x++;
   }
   $this->f_Cierra($lr_tabla);
   $this->f_Des();
   return $la_respuesta;
 }

 private function f_BuscarDif(){
  $fecha_dia = $this->aa_Atributos['diaZafra']['fecha_dia'];
  $lb_Enc=false;
  $ls_Sql="SELECT
            (SELECT sum(pesoneto_ton) peso  from agronomia.vvalidacion_soca where fechadia = '$fecha_dia') -
            (SELECT sum(pesoneto_ton) peso  from agronomia.vvalidacion_soca_relacionado where fechadia = '$fecha_dia')
            as diferencia;";
  $this->f_Con();
  $lr_tabla=$this->f_Filtro($ls_Sql);
  if($la_registros=$this->f_Arreglo($lr_tabla)){
    $la_respuesta['diferencia']=$la_registros['diferencia'];
      if(floatval($la_registros['diferencia']) == 0){
         $lobj_Dia = new cls_DiaZafra;
         //sin diferencias
         $lobj_Dia->setPeticion(array(
           "operacion" => 'cambioAtributos',
           "codigo_proceso_dia" => 4,
           "codigo" =>  $this->aa_Atributos['diaZafra']['codigo']
         ));
         $lobj_Dia->gestionar();
      }
    $lb_Enc=true;
  }
  $this->f_Cierra($lr_tabla);
  $this->f_Des();

  if($lb_Enc){
    //guardo en atributo de la zona
    $this->aa_Atributos['diferencia']=$la_respuesta['diferencia'];
  }

  return $lb_Enc;
 }

 private function f_BuscarElementosFaltantes(){
  $x=0;
  //productores
  $ls_SqlPro="SELECT codcanicultor from agronomia.vvalidacion_soca where codcanicultor not in(
            	SELECT codigo_productor from agronomia.vproductor
            )
            group by codcanicultor";

  //fincas
  $ls_SqlFin="SELECT codcanicultor||letrafinca as finca
              from agronomia.vvalidacion_soca where codcanicultor||letrafinca not in(
              	select codigo_productor||letra from agronomia.vfinca
              )
              group by codcanicultor,letrafinca";

  //tablones
  $ls_SqlTab ="SELECT codcanicultor||letrafinca as finca, codigotablon
               from agronomia.vvalidacion_soca_relacionado
               where pesoneto = 0 group by codcanicultor,letrafinca, codigotablon";

  $this->f_Con();
  //productores
  $lr_tabla=$this->f_Filtro($ls_SqlPro);
  while($la_registros=$this->f_Arreglo($lr_tabla)){
    $la_respuesta['productores'][$x]['codigo']=$la_registros['codcanicultor'];
    $x++;
  }
  $this->f_Cierra($lr_tabla);
  //fincas
  $x=0;
  $lr_tabla=$this->f_Filtro($ls_SqlFin);
  while($la_registros=$this->f_Arreglo($lr_tabla)){
    $la_respuesta['fincas'][$x]['codigo']=$la_registros['finca'];
    $x++;
  }
  $this->f_Cierra($lr_tabla);
  //tablones
  $x=0;
  $lr_tabla=$this->f_Filtro($ls_SqlTab);
  while($la_registros=$this->f_Arreglo($lr_tabla)){
    $la_respuesta['tablones'][$x]['finca']=$la_registros['finca'];
    $la_respuesta['tablones'][$x]['codigo']=$la_registros['codigotablon'];
    $x++;
  }
  $this->f_Cierra($lr_tabla);

  $this->f_Des();

  return $la_respuesta;
 }

 private function armarBusqueda(){
   //instancio el objeto de busqueda de zonas asignadas al usuario
   $lobj_AccesoZona = new cls_AccesoZona;
   //creo la peticion
   $pet = array(
     'operacion' => 'buscarZonas',
     'codigo_usuario' => $_SESSION['Con']['Nombre']
   );
   //guardo los datos en el objeto y gestiono para obtener una respuesta
   $lobj_AccesoZona->setPeticion($pet);
   $zona = $lobj_AccesoZona->gestionar();

   $cadenaBusqueda = ' where codigo_zona in(';
   if($zona['success'] == 1){
     for($x = 0;$x < count($zona['registros']) - 1; $x++){
       $cadenaBusqueda .= $zona['registros'][$x].',';
     }
     $cadenaBusqueda .= $zona['registros'][count($zona['registros']) - 1].' ';
   }else{
     $cadenaBusqueda .= '-1';
     $zona['mensaje']='usuario no posee zona asignada';
   }
   $cadenaBusqueda .= ") ";
   if($this->aa_Atributos['diaZafra']['fecha_dia']!=''){
    $cadenaBusqueda.= "and fechadia ='".$this->aa_Atributos['diaZafra']['fecha_dia']."' ";
   }
   if($this->aa_Atributos['valor']!=''){
     $cadenaBusqueda .="and nombrefinca like '%".$this->aa_Atributos['valor']."%'";
   }
   return $cadenaBusqueda;
 }

  private function buscarDiaZafra(){
    $lobj_Dia = new cls_DiaZafra;
    if($this->aa_Atributos['dia']!=''){
      //si el dia fue enviado como parametro lo busco
      //creo la peticion
      $pet = array(
        'operacion' => 'estadoDia',
        'codigo' => $this->aa_Atributos['dia']
      );
    }else{
      //si el dia no fue enviado como parametro busco el dia activo
      //creo la peticion
      $pet = array(
        'operacion' => 'buscarActivo'
      );
    }
    //guardo los datos en el objeto y gestiono para obtener una respuesta
    $lobj_Dia->setPeticion($pet);
    $dia = $lobj_Dia->gestionar()['registro'];
    if($dia['fecha_dia']==""){
      $pet = array(
        'operacion' => 'buscarUltimoConDatos'
      );
      $lobj_Dia->setPeticion($pet);
      $dia = $lobj_Dia->gestionar();
    }
    return $dia;
  }
}
?>
