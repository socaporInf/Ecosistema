<?php
include_once('../../nucleo/clases/cls_Conexion.php');
include_once('../../nucleo/clases/cls_Mensaje_Sistema.php');
class cls_PlantillaNotificacion extends cls_Conexion{

 protected $aa_Atributos = array();
 private $aa_Campos = array('codigo_plantilla','cuerpo','titulo','nombre_plantilla','codigo_prioridad','codigo_tipo_notificacion');

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
     case 'buscar':
       $registros=$this->f_Listar();
       if(count($registros)!=0){
         $success=1;
         $respuesta['registros']=$registros;
       }else{
         $respuesta['success'] = 0;
         $respuesta['mensaje'] = $lobj_Mensaje->buscarMensaje(8);
       }
       break;

     case 'buscarRegistro':
       $lb_Enc=$this->f_buscar('codigo');
       if($lb_Enc){
         $respuesta['registros']=$this->aa_Atributos['registro'];
         $success=1;
       }
       break;

    case 'buscarPorNombre':
      $lb_Enc=$this->f_buscar('nombre');
      if($lb_Enc){
        $respuesta['registro']=$this->aa_Atributos['registro'];
        $success=1;
      }
      break;

     case 'guardar':
       $lb_Hecho=$this->f_Guardar();
       if($lb_Hecho){
         $this->f_BuscarUltimo();
         $respuesta['registros'] = $this->aa_Atributos['registro'];
         $respuesta['mensaje'] = $lobj_Mensaje->buscarMensaje(9);
         $success = 1;
       }else{
         $respuesta['mensaje'] = $lobj_Mensaje->buscarMensaje(10);
         $success = 0;
       }
       break;

     case 'modificar':
       $respuesta = $this->f_Modificar();
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
 private function f_Listar(){
   $x=0;
   $la_respuesta=array();
   if(isset($this->aa_Atributos['codigo_padre'])){
      $ls_Sql="SELECT * FROM global.vplantilla_notificacion where codigo_tipo_notificacion = ".$this->aa_Atributos['codigo_padre'];
   }else{
      $ls_Sql="SELECT * FROM global.vplantilla_notificacion ";
   }
   $this->f_Con();
   $lr_tabla=$this->f_Filtro($ls_Sql);
   while($la_registros=$this->f_Arreglo($lr_tabla)){
     $la_respuesta[$x]['codigo']=$la_registros['codigo_plantilla'];
     $la_respuesta[$x]['nombre_plantilla']=$la_registros['nombre_plantilla'];
     $x++;
   }
   $this->f_Cierra($lr_tabla);
   $this->f_Des();
   return $la_respuesta;
 }

 private function f_Buscar($tipo){
   $lb_Enc=false;
   if($tipo == 'nombre'){
      $ls_Sql="SELECT * FROM global.vplantilla_notificacion where nombre_plantilla='".$this->aa_Atributos['nombre']."'";
   }else{
      $ls_Sql="SELECT * FROM global.vplantilla_notificacion where codigo_plantilla='".$this->aa_Atributos['codigo']."'";
   }
   $this->f_Con();
   $lr_tabla=$this->f_Filtro($ls_Sql);
   if($la_registros=$this->f_Arreglo($lr_tabla)){
     $la_respuesta['codigo']=$la_registros['codigo_plantilla'];
     $la_respuesta['nombre_plantilla']=$la_registros['nombre_plantilla'];
     $la_respuesta['titulo']=$la_registros['titulo'];
     $la_respuesta['cuerpo']=$la_registros['cuerpo'];
     $la_respuesta['codigo_prioridad']=$la_registros['codigo_prioridad'];
     $la_respuesta['nombre_prioridad']=$la_registros['nombre_prioridad'];
     $la_respuesta['codigo_tipo_notificacion']=$la_registros['codigo_tipo_notificacion'];
     $la_respuesta['nombre_tipo_notificacion']=$la_registros['nombre_tipo_notificacion'];
     $lb_Enc=true;
   }
   $this->f_Cierra($lr_tabla);
   $this->f_Des();

   if($lb_Enc){
     //guardo en atributo de la estado
     $this->aa_Atributos['registro']=$la_respuesta;
   }

   return $lb_Enc;
 }
 private function f_Guardar(){

   $lb_Hecho=false;
   $ls_Sql="INSERT INTO global.vplantilla_notificacion (cuerpo,titulo,nombre_plantilla,codigo_prioridad,codigo_tipo_notificacion) values
       ('".$this->aa_Atributos['cuerpo']."','".$this->aa_Atributos['titulo']."','".$this->aa_Atributos['nombre_plantilla']."',
       '".$this->aa_Atributos['codigo_prioridad']."','".$this->aa_Atributos['codigo_tipo_notificacion']."')";
   $this->f_Con();
   $lb_Hecho=$this->f_Ejecutar($ls_Sql);
   $this->f_Des();
   return $lb_Hecho;
 }

 private function f_BuscarUltimo(){
   $lb_Enc=false;
   $ls_Sql="SELECT * from global.vplantilla_notificacion WHERE codigo_plantilla = (SELECT MAX(codigo_plantilla) from global.vplantilla_notificacion) ";
   $this->f_Con();
   $lr_tabla=$this->f_Filtro($ls_Sql);
   if($la_registros=$this->f_Arreglo($lr_tabla)){
     $la_respuesta['codigo']=$la_registros['codigo_plantilla'];
     $la_respuesta['nombre']=$la_registros['nombre_plantilla'];
     $la_respuesta['titulo']=$la_registros['titulo'];
     $la_respuesta['cuerpo']=$la_registros['cuerpo'];
     $la_respuesta['codigo_prioridad']=$la_registros['codigo_prioridad'];
     $la_respuesta['nombre_prioridad']=$la_registros['nombre_prioridad'];
     $la_respuesta['codigo_tipo_notificacion']=$la_registros['codigo_tipo_notificacion'];
     $la_respuesta['nombre_tipo_notificacion']=$la_registros['nombre_tipo_notificacion'];
     $lb_Enc=true;
   }
   $this->f_Cierra($lr_tabla);
   $this->f_Des();

   if($lb_Enc){
     //guardo en atributo de la estado
     $this->aa_Atributos['registro']=$la_respuesta;
   }

   return $lb_Enc;
 }

 private function f_Modificar(){
   $lb_Hecho=false;
   $contCampos = 0;
   $ls_Sql="UPDATE global.vplantilla_notificacion SET ";

   //arma la cadena sql en base a los campos pasados en la peticion
   $ls_Sql.=$this->armarCamposUpdate($this->aa_Campos,$this->aa_Atributos);

   $ls_Sql.="WHERE codigo_plantilla ='".$this->aa_Atributos['codigo']."'";
   $this->f_Con();
   $lb_Hecho=$this->f_Ejecutar($ls_Sql);
   $this->f_Des();


   if($lb_Hecho){
     $this->f_Buscar();
     $respuesta['registro'] = $this->aa_Atributos['registro'];
     $respuesta['success'] = 1;
   }
   return $respuesta;
 }
}
?>
