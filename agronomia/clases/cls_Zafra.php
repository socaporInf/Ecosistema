<?php
include_once('../../nucleo/clases/cls_Conexion.php');
include_once('../../nucleo/clases/cls_Mensaje_Sistema.php');
class cls_Zafra extends cls_Conexion{

 protected $aa_Atributos = array();
 private $aa_Campos = array('codigo_zafra','nombre','estado','fecha_dia','fecha_inicio','fecha_final');

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
       $lb_Enc=$this->f_buscar();
       if($lb_Enc){
         $respuesta['registros']=$this->aa_Atributos['registro'];
         $success=1;
       }
       break;

     case 'buscarActivo':
      $lb_Enc=$this->f_buscar('activo');
      if($lb_Enc){
        $respuesta['registro']=$this->aa_Atributos['registro'];
        $success=1;
      }
      break;

     case 'guardar':
       $lb_Hecho=$this->f_Guardar();
       if($lb_Hecho){
         $this->f_Buscar('ultimo');
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
   $ls_Sql="SELECT * FROM agronomia.vzafra ";
   $this->f_Con();
   $lr_tabla=$this->f_Filtro($ls_Sql);
   while($la_registros=$this->f_Arreglo($lr_tabla)){
     $la_respuesta[$x]['codigo']=$la_registros['codigo_zafra'];
     $la_respuesta[$x]['nombre']=$la_registros['nombre'];
     $x++;
   }
   $this->f_Cierra($lr_tabla);
   $this->f_Des();
   return $la_respuesta;
 }

 private function f_Buscar($tipo){
   $lb_Enc=false;
   //Busco
   if($tipo == 'ultimo'){
      $ls_Sql="SELECT * from agronomia.vzafra WHERE codigo_zafra = (SELECT MAX(codigo_zafra) from agronomia.vzafra) ";
   }else if($tipo == 'activo'){
      $ls_Sql="SELECT * from agronomia.vzafra WHERE codigo_zafra = (SELECT codigo_zafra from agronomia.vzafra WHERE estado = 'A') ";
   }else {
      $ls_Sql="SELECT * FROM agronomia.vzafra where codigo_zafra='".$this->aa_Atributos['codigo']."'";
   }
   $this->f_Con();
   $lr_tabla=$this->f_Filtro($ls_Sql);
   if($la_registros=$this->f_Arreglo($lr_tabla)){
     $la_respuesta['codigo']=$la_registros['codigo_zafra'];
     $la_respuesta['nombre']=$la_registros['nombre'];
     $la_respuesta['estado']=$la_registros['estado'];
     $la_respuesta['fecha_dia']=$la_registros['fecha_dia'];
     $la_respuesta['fecha_inicio']=$la_registros['fecha_inicio'];
     $la_respuesta['fecha_final']=$la_registros['fecha_final'];
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
   $ls_Sql="INSERT INTO agronomia.vzafra (nombre,estado,fecha_inicio,fecha_final) values
       ('".$this->aa_Atributos['nombre']."','".$this->aa_Atributos['estado']."',";
   $ls_Sql.="'".$this->aa_Atributos['fecha_inicio']."','".$this->aa_Atributos['fecha_final']."')";
   $this->f_Con();
   $lb_Hecho=$this->f_Ejecutar($ls_Sql);
   $this->f_Des();
   return $lb_Hecho;
 }

 private function f_Modificar(){
   $lb_Hecho=false;
   $contCampos = 0;
   if(isset($this->aa_Atributos['nombre'])){
     $this->aa_Atributos['nom'] = $this->aa_Atributos['nombre'];
   }
   $ls_Sql="UPDATE agronomia.vzafra SET ";

   //arma la cadena sql en base a los campos pasados en la peticion
   $ls_Sql.=$this->armarCamposUpdate($this->aa_Campos,$this->aa_Atributos);

   $ls_Sql.="WHERE codigo_zafra ='".$this->aa_Atributos['codigo']."'";
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
