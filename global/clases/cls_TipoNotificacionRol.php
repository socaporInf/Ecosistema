<?php
include_once('../../nucleo/clases/cls_Conexion.php');
include_once('../../nucleo/clases/cls_Mensaje_Sistema.php');
class cls_TipoNotificacionRol extends cls_Conexion{

 protected $aa_Atributos = array();
 private $aa_Campos = array('id_tipo_notificacion_rol','codigo_rol','codigo_tipo_notificacion');

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
      case 'buscarRolesAsignados':
       $registros=$this->f_buscarAsignados();
       if(count($registros)!=0){
         $success=1;
         $respuesta['registros']=$registros;
       }else{
         $respuesta['success'] = 0;
         $respuesta['mensaje'] = $lobj_Mensaje->buscarMensaje(8);
       }
       break;

     case 'asignar':
       $lb_Hecho=$this->f_Asignar();
       if($lb_Hecho){
         $this->f_BuscarUltimo();
         $respuesta['registro'] = $this->aa_Atributos['registro'];
         $respuesta['mensaje'] = $lobj_Mensaje->buscarMensaje(9);
         $success = 1;
       }else{
         $respuesta['mensaje'] = $lobj_Mensaje->buscarMensaje(10);
         $success = 0;
       }
       break;

    case 'desincorporar':
     $lb_Hecho=$this->f_Desincorporar();
     if($lb_Hecho){
       $respuesta['mensaje'] = $lobj_Mensaje->buscarMensaje(18);
       $success = 1;
     }else{
       $respuesta['mensaje'] = $lobj_Mensaje->buscarMensaje(19);
       $success = 0;
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
 private function f_buscarAsignados(){
   $x=0;
   $la_respuesta=array();
   $ls_Sql="SELECT * FROM global.vtipo_notificacion_rol WHERE codigo_tipo_notificacion='".$this->aa_Atributos['codigo_tipo_notificacion']."'";
   $this->f_Con();
   $lr_tabla=$this->f_Filtro($ls_Sql);
   while($la_registros=$this->f_Arreglo($lr_tabla)){
     $la_respuesta[$x]['codigo']=$la_registros['id_tipo_notificacion_rol'];
     $la_respuesta[$x]['nombre_tipo_notificacion']=$la_registros['nombre_tipo_notificacion'];
     $la_respuesta[$x]['nombre_rol']=$la_registros['nombre_rol'];
     $x++;
   }
   $this->f_Cierra($lr_tabla);
   $this->f_Des();
   return $la_respuesta;
 }
 private function f_Asignar(){
   $lb_Hecho=false;
   $ls_Sql="INSERT INTO global.vtipo_notificacion_rol (codigo_tipo_notificacion,codigo_rol) values
       ('".$this->aa_Atributos['codigo_tipo_notificacion']."','".$this->aa_Atributos['codigo_rol']."')";
   $this->f_Con();
   $lb_Hecho=$this->f_Ejecutar($ls_Sql);
   $this->f_Des();
   return $lb_Hecho;
 }
 private function f_Desincorporar(){
   $lb_Hecho=false;
   $ls_Sql="DELETE FROM global.vtipo_notificacion_rol WHERE id_tipo_notificacion_rol = '".$this->aa_Atributos['codigo']."'";
   $this->f_Con();
   $lb_Hecho=$this->f_Ejecutar($ls_Sql);
   $this->f_Des();
   return $lb_Hecho;
 }
 private function f_BuscarUltimo(){
   $lb_Enc=false;
   //Busco El rol
   $la_respuesta=array();
   $ls_Sql="SELECT * FROM global.vtipo_notificacion_rol WHERE id_tipo_notificacion_rol = (SELECT MAX(id_tipo_notificacion_rol) from global.vtipo_notificacion_rol)";
   $this->f_Con();
   $lr_tabla=$this->f_Filtro($ls_Sql);
   if($la_registros=$this->f_Arreglo($lr_tabla)){
     $la_respuesta['codigo']=$la_registros['id_tipo_notificacion_rol'];
     $la_respuesta['nombre_tipo_notificacion']=$la_registros['codigo_tipo_notificacion'];
     $la_respuesta['nombre_rol']=$la_registros['nombre_rol'];
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
}
?>
