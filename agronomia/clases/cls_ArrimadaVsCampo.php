<?php
include_once('../../nucleo/clases/cls_Conexion.php');
include_once('../../nucleo/clases/cls_Mensaje_Sistema.php');
include_once('cls_AccesoZona.php');
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
       $registros=$this->f_Listar('validacion');
       if(count($registros)!=0){
         $success=1;
         $respuesta['registros']=$registros;
       }else{
         $respuesta['success'] = 0;
         $respuesta['mensaje'] = $lobj_Mensaje->buscarMensaje(8);
       }
       break;

     case 'buscarValidacionRelacionada':
       $registros=$this->f_Listar('relacionada');
       if(count($registros)!=0){
         $success=1;
         $respuesta['registros']=$registros;
       }else{
         $respuesta['success'] = 0;
         $respuesta['mensaje'] = $lobj_Mensaje->buscarMensaje(8);
       }
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

 private function f_Buscar(){
   $lb_Enc=false;
   //Busco El rol
   $ls_Sql="SELECT * FROM agronomia.vzona where codigo_zona='".$this->aa_Atributos['codigo']."'";
   $this->f_Con();
   $lr_tabla=$this->f_Filtro($ls_Sql);
   if($la_registros=$this->f_Arreglo($lr_tabla)){
     $la_respuesta['codigo']=$la_registros['codigo_zona'];
     $la_respuesta['nombre']=$la_registros['nombre'];
     $la_respuesta['descripcion']=$la_registros['descripcion'];
     $lb_Enc=true;
   }
   $this->f_Cierra($lr_tabla);
   $this->f_Des();

   if($lb_Enc){
     //guardo en atributo de la zona
     $this->aa_Atributos['registro']=$la_respuesta;
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
   $respuesta = $lobj_AccesoZona->gestionar();

   $cadenaBusqueda = ' where codigo_zona in(';
   if($respuesta['success'] == 1){
     for($x = 0;$x < count($respuesta['registros']) - 1; $x++){
       $cadenaBusqueda .= $respuesta['registros'][$x].',';
     }
     $cadenaBusqueda .= $respuesta['registros'][count($respuesta['registros']) - 1].' ';
   }else{
     $cadenaBusqueda .= '-1';
     $respuesta['mensaje']='usuario no posee zona asignada';
   }
   $cadenaBusqueda .= ') ';
   if($this->aa_Atributos['valor']!=''){
     $cadenaBusqueda .="and nombrefinca like '%".$this->aa_Atributos['valor']."%'";
   }
   return $cadenaBusqueda;
 }
}
?>
