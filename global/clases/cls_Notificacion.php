<?php
include_once('../../nucleo/clases/cls_Conexion.php');
include_once('../../nucleo/clases/cls_Mensaje_Sistema.php');
class cls_Notificacion extends cls_Conexion{

 protected $aa_Atributos = array();
 private $aa_Campos = array('codigo_notificacion','titulo','cuerpo','usuario','codigo_tipo_notificacion');

 public function setPeticion($pa_Peticion){
   $this->aa_Atributos=$pa_Peticion;
   $this->setDatosConexion($_SESSION['Con']['Nombre'],$_SESSION['Con']['Pass']);
 }

 public function getAtributos(){
   return $this->aa_Atributos;
 }

 public function gestionar(){
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

     case 'buscarNotificacionesUsu':
       $registros=$this->f_ConsultarNotificacionesUsu();
       if(count($registros)!=0){
         $success=1;
         $respuesta['registros']=$registros;
       }
       break;

     case 'buscarRegistro':
       $lb_Enc=$this->f_buscar();
       if($lb_Enc){
         $respuesta['registros']=$this->aa_Atributos['registro'];
         $success=1;
       }
       break;

     case 'guardar':
       $lb_Hecho=$this->f_Guardar();
       if($lb_Hecho){
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
   $ls_Sql="SELECT * FROM global.vnotificacion ";
   $this->f_Con();
   $lr_tabla=$this->f_Filtro($ls_Sql);
   while($la_registros=$this->f_Arreglo($lr_tabla)){
     $la_respuesta[$x]['codigo'] = $la_registros['codigo_notificacion'];
     $la_respuesta[$x]['titulo'] = $la_registros['titulo'];
     $la_respuesta[$x]['cuerpo'] = $la_registros['cuerpo'];
     $la_respuesta[$x]['tipo'] = $la_registros['codigo_tipo_notificacion'];
     $la_respuesta[$x]['nombreTipoNotificacion'] = $la_registros['tipo_notificacion'];
     $la_respuesta[$x]['codigo_prioridad'] = $la_registros['codigo_prioridad'];
     $la_respuesta[$x]['prioridad'] = $la_registros['prioridad'];
     $x++;
   }
   $this->f_Cierra($lr_tabla);
   $this->f_Des();
   return $la_respuesta;
 }

 private function f_Buscar(){
   $lb_Enc=false;
   $ls_Sql="SELECT * FROM global.vnotificacion where codigo_notificacion='".$this->aa_Atributos['codigo']."'";
   $this->f_Con();
   $lr_tabla=$this->f_Filtro($ls_Sql);
   if($la_registros=$this->f_Arreglo($lr_tabla)){
     $la_respuesta[$x]['codigo'] = $la_registros['codigo_notificacion'];
     $la_respuesta[$x]['titulo'] = $la_registros['titulo'];
     $la_respuesta[$x]['cuerpo'] = $la_registros['cuerpo'];
     $la_respuesta[$x]['tipo'] = $la_registros['codigo_tipo_notificacion'];
     $la_respuesta[$x]['nombreTipoNotificacion'] = $la_registros['tipo_notificacion'];
     $la_respuesta[$x]['codigo_prioridad'] = $la_registros['codigo_prioridad'];
     $la_respuesta[$x]['prioridad'] = $la_registros['prioridad'];
     $lb_Enc=true;
   }
   $this->f_Cierra($lr_tabla);
   $this->f_Des();

   if($lb_Enc){
     //guardo en atributo de la clase
     $this->aa_Atributos['registro']=$la_respuesta;
   }

   return $lb_Enc;
 }

 private function f_Guardar(){
   $lb_Hecho=false;
   $ls_Sql="INSERT INTO global.vnotificacion (titulo,cuerpo,usuario,codigo_tipo_notificacion) values
       ('".$this->aa_Atributos['titulo']."','".$this->aa_Atributos['cuerpo']."','".$this->aa_Atributos['usuario']."',
       '".$this->aa_Atributos['codigo_tipo_notificacion']."')";
   $this->f_Con();
   $lb_Hecho=$this->f_Ejecutar($ls_Sql);
   $this->f_Des();
   return $lb_Hecho;
 }

 private function f_Modificar(){
   $lb_Hecho=false;
   $contCampos = 0;
   $ls_Sql="UPDATE global.vnotificacion SET ";

   //arma la cadena sql en base a los campos pasados en la peticion
   $ls_Sql.=$this->armarCamposUpdate($this->aa_Campos,$this->aa_Atributos);

   $ls_Sql.="WHERE codigo_notificacion ='".$this->aa_Atributos['codigo']."'";
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
 private function f_ConsultarNotificacionesUsu(){
   $x=0;
   $la_respuesta=array();
   $ls_Sql="SELECT * FROM global.vnotificacion_rol WHERE llave_acceso IN (";
   //agrego las llaves a la consulta
   for ($i = 0; $i < count($_SESSION['Usuario']['llaves_acceso']); $i++) {
     $ls_Sql.="'".$_SESSION['Usuario']['llaves_acceso'][$i]."'";
     if ($i != (count($_SESSION['Usuario']['llaves_acceso']) - 1)) {
       $ls_Sql.=",";
     }
   }
   $ls_Sql.=')';
   $this->f_Con();
   $lr_tabla=$this->f_Filtro($ls_Sql);
   while($la_registros=$this->f_Arreglo($lr_tabla)){
     $la_respuesta[$x]['codigo']=$la_registros['codigo_notificacion'];
     $la_respuesta[$x]['nombre']=$la_registros['titulo'];
     $la_respuesta[$x]['titulo']=$la_registros['titulo'];
     $la_respuesta[$x]['cuerpo']=$la_registros['cuerpo'];
     $la_respuesta[$x]['codigo_tipo']=$la_registros['codigo_tipo_notificacion'];
     $la_respuesta[$x]['nombre_tipo']=$la_registros['tipo_notificacion'];
     $la_respuesta[$x]['codigo_prioridad']=$la_registros['prioridad'];
     $la_respuesta[$x]['prioridad']=$la_registros['prioridad'];
     $la_respuesta[$x]['fecha_hora']=$la_registros['fecha_hora'];
     $x++;
   }
   $this->f_Cierra($lr_tabla);
   $this->f_Des();
   return $la_respuesta;
 }

}
?>
