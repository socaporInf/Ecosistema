<?php
include_once('../../nucleo/clases/cls_Conexion.php');
include_once('../../nucleo/clases/cls_Mensaje_Sistema.php');
class cls_Finca extends cls_Conexion{

 private $aa_Atributos = array();
 private $aa_Campos = array('nombre_finca','codigo_zona','kilometros_central','codigo_municipio','codigo_productor','id_finca','letra','codigo_tipo_carretera','codigo_tipo_afiliacion');

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

    case 'buscarHijos':
     $registros=$this->f_BuscarFincasPorProductor();
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

     case 'guardar':
       $lb_Hecho=$this->f_Guardar();
       if($lb_Hecho){
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
   $ls_Sql="SELECT * FROM agronomia.vfinca ";
   $this->f_Con();
   $lr_tabla=$this->f_Filtro($ls_Sql);
   while($la_registros=$this->f_Arreglo($lr_tabla)){
     $la_respuesta[$x]['codigo']=$la_registros['codigo_productor'];
     $la_respuesta[$x]['nombre_completo']=$la_registros['nombre_completo'];
     $x++;
   }
   $this->f_Cierra($lr_tabla);
   $this->f_Des();
   return $la_respuesta;
 }
 private function f_BuscarFincasPorProductor(){
   $x=0;
   $la_respuesta=array();
   $ls_Sql="SELECT * FROM agronomia.vfinca  WHERE codigo_productor = ".$this->aa_Atributos['codigo_productor'];
   $this->f_Con();
   $lr_tabla=$this->f_Filtro($ls_Sql);
   while($la_registros=$this->f_Arreglo($lr_tabla)){
     $la_respuesta[$x]['codigo']=$la_registros['id_finca'];
     $la_respuesta[$x]['id_finca']=$la_registros['id_finca'];
     $la_respuesta[$x]['nombre_finca_completo']=$la_registros['codigo_productor'].'-'.$la_registros['letra'].' '.$la_registros['nombre_finca'];
     $la_respuesta[$x]['codigo_productor']=$la_registros['codigo_productor'];
     $la_respuesta[$x]['nombre_completo']=$la_registros['nombre_completo'];
     $la_respuesta[$x]['letra']=$la_registros['letra'];
     $la_respuesta[$x]['nombre_finca']=$la_registros['nombre_finca'];
     $la_respuesta[$x]['kilometros_central']=$la_registros['kilometros_central'];
     $la_respuesta[$x]['codigo_tipo_carretera']=$la_registros['codigo_tipo_carretera'];
     $la_respuesta[$x]['tipo_carretera']=$la_registros['nombre_tipo_carretera'];
     $la_respuesta[$x]['codigo_tipo_afiliacion']=$la_registros['codigo_tipo_afiliacion'];
     $la_respuesta[$x]['tipo_afiliacion']=$la_registros['nombre_tipo_afiliacion'];
     $la_respuesta[$x]['codigo_zona']=$la_registros['codigo_zona'];
     $la_respuesta[$x]['zona']=$la_registros['nombre_zona'];
     $la_respuesta[$x]['codigo_municipio']=$la_registros['codigo_municipio'];
     $la_respuesta[$x]['municipio']=$la_registros['nombre_municipio'];
     $x++;
   }
   $this->f_Cierra($lr_tabla);
   $this->f_Des();
   return $la_respuesta;
}
private function f_Buscar(){
  $lb_Enc = false;
  $la_respuesta=array();
  $ls_Sql="SELECT * FROM agronomia.vfinca where id_finca = '".$this->aa_Atributos['codigo']."'";
  $this->f_Con();
  $lr_tabla=$this->f_Filtro($ls_Sql);
  if($la_registros=$this->f_Arreglo($lr_tabla)){
    $la_respuesta['codigo']=$la_registros['id_finca'];
    $la_respuesta['id_finca']=$la_registros['id_finca'];
    $la_respuesta['nombre_finca_completo']=$la_registros['codigo_productor'].'-'.$la_registros['letra'].' '.$la_registros['nombre_finca'];
    $la_respuesta['nombre']=$la_registros['codigo_productor'].'-'.$la_registros['letra'].' '.$la_registros['nombre_finca'];
    $la_respuesta['codigo_productor']=$la_registros['codigo_productor'];
    $la_respuesta['nombre_completo']=$la_registros['nombre_completo'];
    $la_respuesta['letra']=$la_registros['letra'];
    $la_respuesta['nombre_finca']=$la_registros['nombre_finca'];
    $la_respuesta['kilometros_central']=$la_registros['kilometros_central'];
    $la_respuesta['codigo_tipo_carretera']=$la_registros['codigo_tipo_carretera'];
    $la_respuesta['tipo_carretera']=$la_registros['nombre_tipo_carretera'];
    $la_respuesta['codigo_tipo_afiliacion']=$la_registros['codigo_tipo_afiliacion'];
    $la_respuesta['tipo_afiliacion']=$la_registros['nombre_tipo_afiliacion'];
    $la_respuesta['codigo_zona']=$la_registros['codigo_zona'];
    $la_respuesta['zona']=$la_registros['nombre_zona'];
    $la_respuesta['codigo_municipio']=$la_registros['codigo_municipio'];
    $la_respuesta['municipio']=$la_registros['nombre_municipio'];
    $lb_Enc = true;
  }
  $this->f_Cierra($lr_tabla);
  $this->f_Des();
  if($lb_Enc){
     $this->aa_Atributos['registro'] = $la_respuesta;
  }
  return $lb_Enc;
}
 private function f_Guardar(){

   $lb_Hecho=false;
   $ls_Sql="INSERT INTO agronomia.vfinca (codigo_productor,letra,nombre_finca,kilometros_central,codigo_zona,codigo_municipio,codigo_tipo_afiliacion,codigo_tipo_carretera) values
      ('".$this->aa_Atributos['codigo_productor']."','".$this->aa_Atributos['letra']."',
      '".$this->aa_Atributos['nombre_finca']."','".$this->aa_Atributos['kilometros_central']."',
      '".$this->aa_Atributos['codigo_zona']."','".$this->aa_Atributos['codigo_municipio']."',
      '".$this->aa_Atributos['codigo_tipo_afiliacion']."','".$this->aa_Atributos['codigo_tipo_carretera']."')";
   $this->f_Con();
   $lb_Hecho=$this->f_Ejecutar($ls_Sql);
   $this->f_Des();
   return $lb_Hecho;
 }
 private function f_Modificar(){
   $lb_Hecho=false;
   $contCampos = 0;
   $ls_Sql="UPDATE agronomia.vfinca SET ";

   //arma la cadena sql en base a los campos pasados en la peticion
   $ls_Sql.=$this->armarCamposUpdate($this->aa_Campos,$this->aa_Atributos);

   $ls_Sql.="WHERE id_finca ='".$this->aa_Atributos['id_finca']."'";
   $this->f_Con();
   $lb_Hecho=$this->f_Ejecutar($ls_Sql);
   $this->f_Des();


   if($lb_Hecho){
     $this->aa_Atributos['codigo'] = $this->aa_Atributos['id_finca'];
     $this->f_Buscar();
     $respuesta['registro'] = $this->aa_Atributos['registro'];
     $respuesta['success'] = 1;
   }
   return $respuesta;
 }
}
?>
