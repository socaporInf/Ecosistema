<?php
include_once('../../nucleo/clases/cls_Conexion.php');
include_once('../../nucleo/clases/cls_Mensaje_Sistema.php');
class cls_AccesoZona extends cls_Conexion{

 private $aa_Atributos = array();
 private $aa_Campos = array('id_acceso_zona','codigo_zona','codigo_usuario');

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
      case 'buscarResponsables':
       $registros=$this->f_buscarResponsables();
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
 private function f_buscarResponsables(){
   $x=0;
   $la_respuesta=array();
   $ls_Sql="SELECT * FROM agronomia.vacceso_zona WHERE codigo_zona='".$this->aa_Atributos['codigo_zona']."'";
   $this->f_Con();
   $lr_tabla=$this->f_Filtro($ls_Sql);
   while($la_registros=$this->f_Arreglo($lr_tabla)){
     $la_respuesta[$x]['codigo']=$la_registros['id_acceso_zona'];
     $la_respuesta[$x]['nombre']=$la_registros['codigo_usuario'];
     $la_respuesta[$x]['nombre_zona']=$la_registros['nombre_zona'];
     $x++;
   }
   $this->f_Cierra($lr_tabla);
   $this->f_Des();
   return $la_respuesta;
 }
 private function f_Asignar(){
   $lb_Hecho=false;
   $ls_Sql="INSERT INTO agronomia.vacceso_zona (codigo_zona,codigo_usuario) values
       ('".$this->aa_Atributos['codigo_zona']."','".$this->aa_Atributos['codigo_usuario']."')";
   $this->f_Con();
   $lb_Hecho=$this->f_Ejecutar($ls_Sql);
   $this->f_Des();
   return $lb_Hecho;
 }
 private function f_Desincorporar(){
   $lb_Hecho=false;
   $ls_Sql="DELETE FROM agronomia.vacceso_zona WHERE id_acceso_zona = '".$this->aa_Atributos['codigo']."'";
   $this->f_Con();
   $lb_Hecho=$this->f_Ejecutar($ls_Sql);
   $this->f_Des();
   return $lb_Hecho;
 }
 private function f_BuscarUltimo(){
   $lb_Enc=false;
   //Busco El rol
   $la_respuesta=array();
   $ls_Sql="SELECT * FROM agronomia.vacceso_zona WHERE id_acceso_zona = (SELECT MAX(id_acceso_zona) from agronomia.vacceso_zona)";
   $this->f_Con();
   $lr_tabla=$this->f_Filtro($ls_Sql);
   if($la_registros=$this->f_Arreglo($lr_tabla)){
     $la_respuesta['codigo']=$la_registros['id_acceso_zona'];
     $la_respuesta['nombre']=$la_registros['codigo_usuario'];
     $la_respuesta['nombre_zona']=$la_registros['nombre_zona'];
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
