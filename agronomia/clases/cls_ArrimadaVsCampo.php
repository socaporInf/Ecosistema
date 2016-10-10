<?php
include_once('../../nucleo/clases/cls_Conexion.php');
include_once('../../nucleo/clases/cls_Mensaje_Sistema.php');
include_once('cls_AccesoZona.php');
include_once('cls_DiaZafra.php');
include_once('../../seguridad/clases/cls_Registro_Virtual.php');
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

    case 'buscarDatosCalendario':
      //obtengo los dias de zafra
      $lobj_Dia = new cls_DiaZafra;
      $lobj_Dia->setPeticion(array('operacion' => 'buscarDiasZafraActiva'));
      $respuesta['dias'] = $lobj_Dia->gestionar()['registros'];

      //busco los estado de proceso dia para la leyenda
      $lobj_RV = new cls_Registro_Virtual;
      $lobj_RV->setPeticion(array(
        'operacion' => 'listar',
        'nombre_tabla' => 'PROCESO_DIA_ZAFRA'
        )
      );
      $respuesta['procesos'] = $lobj_RV->gestionar()['registros'];
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
            (select sum(pesoneto_ton) peso  from agronomia.vvalidacion_soca where fechadia = '$fecha_dia') - 
            (select sum(pesoneto_ton) peso  from agronomia.vvalidacion_soca_relacionado where fechadia = '$fecha_dia') 
            as diferencia;";
  $this->f_Con();
  $lr_tabla=$this->f_Filtro($ls_Sql);
  if($la_registros=$this->f_Arreglo($lr_tabla)){
    $la_respuesta['diferencia']=$la_registros['diferencia'];
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
