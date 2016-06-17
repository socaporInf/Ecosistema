<?php
include_once('cls_Conexion.php');
class cls_Noticia extends cls_Conexion{

 private $aa_Atributos = array();
 private $aa_Campos = array('codigo_noticia','titulo','cuerpo','usuario','codigo_tipo_noticia');

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
         $respuesta['mensaje'] = 'Insercion realizada con exito';
         $success=1;
       }
       break;

     case 'modificar':
       $respuesta = $this->f_Modificar();
       break;

     default:
       $respuesta['mensaje'] = 'Operacion "'.strtoupper($this->aa_Atributos['operacion']).'" no existe para esta entidad';
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
   $ls_Sql="SELECT * FROM global.vnoticia ";
   $this->f_Con();
   $lr_tabla=$this->f_Filtro($ls_Sql);
   while($la_registros=$this->f_Arreglo($lr_tabla)){
     $la_respuesta[$x]['codigo']=$la_registros['codigo_noticia'];
     $la_respuesta[$x]['titulo']=$la_registros['titulo'];
     $la_respuesta[$x]['cuerpo']=$la_registros['cuerpo'];
     $la_respuesta[$x]['usuario']=$la_registros['usuario'];
     $la_respuesta[$x]['tipo']=$la_registros['codigo_tipo_noticia'];
     $la_respuesta[$x]['color']=$la_registros['color'];
     $x++;
   }
   $this->f_Cierra($lr_tabla);
   $this->f_Des();
   return $la_respuesta;
 }

 private function f_Buscar(){
   $lb_Enc=false;
   //Busco El rol
   $ls_Sql="SELECT * FROM global.vnoticia where codigo_noticia='".$this->aa_Atributos['codigo']."'";
   $this->f_Con();
   $lr_tabla=$this->f_Filtro($ls_Sql);
   if($la_registros=$this->f_Arreglo($lr_tabla)){
      $la_respuesta['codigo']=$la_registros['codigo_noticia'];
      $la_respuesta['titulo']=$la_registros['titulo'];
      $la_respuesta['cuerpo']=$la_registros['cuerpo'];
      $la_respuesta['usuario']=$la_registros['usuario'];
      $la_respuesta['codigo_tipo_noticia']=$la_registros['codigo_tipo_noticia'];
      $la_respuesta['color']=$la_registros['color'];
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
   $ls_Sql="INSERT INTO global.vnoticia (titulo,cuerpo,usuario,codigo_tipo_noticia) values
       ('".$this->aa_Atributos['titulo']."','".$this->aa_Atributos['cuerpo']."','".$this->aa_Atributos['usuario']."',
       '".$this->aa_Atributos['codigo_tipo_noticia']."')";
   $this->f_Con();
   $lb_Hecho=$this->f_Ejecutar($ls_Sql);
   $this->f_Des();
   return $lb_Hecho;
 }

 private function f_Modificar(){
   $lb_Hecho=false;
   $contCampos = 0;
   $ls_Sql="UPDATE global.vnoticia SET ";

   //arma la cadena sql en base a los campos pasados en la peticion
   $ls_Sql.=$this->armarCamposUpdate($this->aa_Campos,$this->aa_Atributos);

   $ls_Sql.="WHERE codigo_noticia ='".$this->aa_Atributos['codigo']."'";
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
