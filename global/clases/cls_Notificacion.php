<?php
include_once('../../nucleo/clases/cls_Conexion.php');
include_once('../../nucleo/clases/cls_Mensaje_Sistema.php');
include_once('cls_PlantillaNotificacion.php');
class cls_Notificacion extends cls_Conexion{

 protected $aa_Atributos = array();
 private $aa_Campos = array('codigo','titulo','cuerpo','codigo_prioridad','codigo_tipo_notificacion');

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

     case 'buscarNotificacionesUsu':
       $lb_Enc=$this->f_ConsultarNotificacionesUsu();
       if($lb_Enc){
         $success=1;
         $respuesta['registros']=$this->aa_Atributos['registros'];
         $respuesta['paginas']=$this->aa_Atributos['paginas'];
       }else{
         $respuesta['success'] = 0;
         $respuesta['mensaje'] = $lobj_Mensaje->buscarMensaje(8);
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

     case 'crearNotificacionPorPlantilla':
      $lb_hecho = $this->f_crearNotificacionPorPlantilla();
      if($lb_hecho){
         $success = 1;
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
 private function f_Listar(){
   $x=0;
   $la_respuesta=array();
   $cadenaBusqueda = ($this->aa_Atributos['valor']=='')?'':"where titulo like '%".$this->aa_Atributos['valor']."%'";
   $ls_SqlBase="SELECT * FROM global.vnotificacion  $cadenaBusqueda";
   $orden = " ORDER BY fecha_hora ";
   $ls_Sql = $this->f_ArmarPaginacion($ls_SqlBase,$orden);
   $this->f_Con();
   $lr_tabla=$this->f_Filtro($ls_Sql);
   while($la_registros=$this->f_Arreglo($lr_tabla)){
     $la_respuesta[$x]['codigo'] = $la_registros['codigo'];
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
   $this->aa_Atributos['registros'] = $la_respuesta;
   $lb_Enc=($x == 0)?false:true;
   return $lb_Enc;
 }

 private function f_Buscar(){
   $lb_Enc=false;
   $ls_Sql="SELECT * FROM global.vnotificacion where codigo='".$this->aa_Atributos['codigo']."'";
   $this->f_Con();
   $lr_tabla=$this->f_Filtro($ls_Sql);
   if($la_registros=$this->f_Arreglo($lr_tabla)){
     $la_respuesta[$x]['codigo'] = $la_registros['codigo'];
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
   $ls_Sql="INSERT INTO global.vnotificacion (titulo,cuerpo,codigo_prioridad,codigo_tipo_notificacion) values
       ('".$this->aa_Atributos['titulo']."','".$this->aa_Atributos['cuerpo']."','".$this->aa_Atributos['codigo_prioridad']."',
       '".$this->aa_Atributos['codigo_tipo_notificacion']."')";
   $this->f_Con();
   $lb_Hecho=$this->f_Ejecutar($ls_Sql);
   $this->f_Des();
   return $lb_Hecho;
 }

 private function f_crearNotificacionPorPlantilla(){
   $plt = $this->f_buscarPlantilla();
   $lb_Hecho=false;
   $ls_Sql="INSERT INTO global.vnotificacion (titulo,cuerpo,codigo_prioridad,codigo_tipo_notificacion) values
       ('".$plt['titulo']."','".$plt['cuerpo']."','".$plt['codigo_prioridad']."','".$plt['codigo_tipo_notificacion']."')";
   $this->f_Con();
   $lb_Hecho=$this->f_Ejecutar($ls_Sql);
   $this->f_Des();
   return $lb_Hecho;
 }

 private function f_buscarPlantilla(){
   $lobj_Plantilla = new cls_PlantillaNotificacion();
   $pet = array(
      'operacion' =>  'buscarPorNombre',
      'nombre' => $this->aa_Atributos['plantilla']
   );
   $lobj_Plantilla->setPeticion($pet);
   $plantilla = $this->completarNotificacion($lobj_Plantilla->gestionar()['registro'],$this->aa_Atributos['valores']);
   return $plantilla;
 }
 public function completarNotificacion($plt,$valores){
    foreach ($valores as $aCambiar => $nuevo) {
      $aCambiar = '{'.strtoupper($aCambiar).'}';
      $plt['titulo'] = str_replace($aCambiar, $nuevo, $plt['titulo']);
      $plt['cuerpo'] = str_replace($aCambiar, $nuevo, $plt['cuerpo']);
    }
    return $plt;
}
 private function f_Modificar(){
   $lb_Hecho=false;
   $contCampos = 0;
   $ls_Sql="UPDATE global.vnotificacion SET ";

   //arma la cadena sql en base a los campos pasados en la peticion
   $ls_Sql.=$this->armarCamposUpdate($this->aa_Campos,$this->aa_Atributos);

   $ls_Sql.="WHERE codigo ='".$this->aa_Atributos['codigo']."'";
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
   $cadenaBusqueda = ($this->aa_Atributos['valor']=='')?'':"And titulo like '%".$this->aa_Atributos['valor']."%'";
   $ls_Sql2="SELECT codigo_rol from seguridad.vllave_acceso where llave_acceso IN (";
   //agrego las llaves a la consulta
   $llaves = $_SESSION['Usuario']['llaves_acceso'];
   for ($i = 0; $i < count($llaves); $i++) {
     $ls_Sql2.="'".$llaves[$i]."'";
     if ($i != (count($llaves) - 1)) {
       $ls_Sql2.=",";
     }
   }
   $ls_Sql2.=')';
   $ls_SqlBase ="SELECT * FROM global.vnotificacion where codigo_tipo_notificacion in
            (
            	SELECT codigo_tipo_notificacion FROM global.vtipo_notificacion_rol WHERE codigo_rol IN (
            		$ls_Sql2
            	)
            ) $cadenaBusqueda";
   $orden = " ORDER BY fecha_hora DESC";
   $ls_Sql = $this->f_ArmarPaginacion($ls_SqlBase,$orden);
   $this->f_Con();
   $lr_tabla=$this->f_Filtro($ls_Sql);
   while($la_registros=$this->f_Arreglo($lr_tabla)){
     $la_respuesta[$x]['codigo']=$la_registros['codigo'];
     $la_respuesta[$x]['nombre']=$la_registros['titulo'];
     $la_respuesta[$x]['titulo']=$la_registros['titulo'];
     $la_respuesta[$x]['cuerpo']=$la_registros['cuerpo'];
     $la_respuesta[$x]['codigo_tipo_notificacion']=$la_registros['codigo_tipo_notificacion'];
     $la_respuesta[$x]['nombre_tipo_notificacion']=$la_registros['nombre_tipo_notificacion'];
     $la_respuesta[$x]['codigo_prioridad']=$la_registros['codigo_prioridad'];
     $la_respuesta[$x]['nombre_prioridad']=$la_registros['nombre_prioridad'];
     $la_respuesta[$x]['fecha_hora']=$la_registros['fecha_hora'];
     $x++;
   }
   $this->f_Cierra($lr_tabla);
   $this->f_Des();
   $this->aa_Atributos['registros'] = $la_respuesta;
   $lb_Enc=($x == 0)?false:true;
   return $lb_Enc;
 }

}
?>
