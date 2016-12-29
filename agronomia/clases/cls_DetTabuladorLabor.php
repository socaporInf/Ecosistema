<?php
include_once('../../nucleo/clases/cls_Conexion.php');
include_once('../../nucleo/clases/cls_Mensaje_Sistema.php');
class cls_DetTabuladorLabor extends cls_Conexion{

 protected $aa_Atributos = array();
 private $aa_Campos = array('codigo','codigo_tabulador','codigo_labor','tarifa');

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
      $ls_Sql="SELECT * FROM agronomia.vdet_tabulador_labor where codigo_tabulador = ".$this->aa_Atributos['codigo_padre'];
   }else{
      $ls_Sql="SELECT * FROM agronomia.vdet_tabulador_labor ";
   }
   $this->f_Con();
   $lr_tabla=$this->f_Filtro($ls_Sql);
   while($la_registros=$this->f_Arreglo($lr_tabla)){
     $la_respuesta[$x]['nombre_tabulador']=$la_registros['nombre_tabulador'];
     $la_respuesta[$x]['nombre_labor']=$la_registros['nombre_labor'];
     $la_respuesta[$x]['tarifa']=$la_registros['tarifa'];
     $la_respuesta[$x]['codigo']=$la_registros['codigo'];
     $la_respuesta[$x]['codigo_labor']=$la_registros['codigo_labor'];
     $la_respuesta[$x]['codigo_tabulador']=$la_registros['codigo_tabulador'];
     $la_respuesta[$x]['fecha_desde']=$this->fFechaBD($la_registros['fecha_desde']);
     $la_respuesta[$x]['fecha_hasta']=$this->fFechaBD($la_registros['fecha_hasta']);
     $x++;
   }
   $this->f_Cierra($lr_tabla);
   $this->f_Des();
   return $la_respuesta;
 }

 private function f_Buscar($tipo){
   $lb_Enc=false;
   $ls_Sql="SELECT * FROM agronomia.vdet_tabulador_labor where codigo='".$this->aa_Atributos['codigo']."'";
   $this->f_Con();
   $lr_tabla=$this->f_Filtro($ls_Sql);
   if($la_registros=$this->f_Arreglo($lr_tabla)){
     $la_respuesta['nombre_tabulador']=$la_registros['nombre_tabulador'];
     $la_respuesta['nombre_labor']=$la_registros['nombre_labor'];
     $la_respuesta['tarifa']=$la_registros['tarifa'];
     $la_respuesta['codigo']=$la_registros['codigo'];
     $la_respuesta['codigo_labor']=$la_registros['codigo_labor'];
     $la_respuesta['codigo_tabulador']=$la_registros['codigo_tabulador'];
     $la_respuesta['fecha_desde']=$this->fFechaBD($la_registros['fecha_desde']);
     $la_respuesta['fecha_hasta']=$this->fFechaBD($la_registros['fecha_hasta']);
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
   $ls_Sql="INSERT INTO agronomia.vdet_tabulador_labor (codigo_labor,codigo_tabulador,tarifa) values
       ('".$this->aa_Atributos['codigo_labor']."','".$this->aa_Atributos['codigo_tabulador']."',
       '".$this->aa_Atributos['tarifa']."')";
   $this->f_Con();
   $lb_Hecho=$this->f_Ejecutar($ls_Sql);
   $this->f_Des();
   return $lb_Hecho;
 }

 private function f_BuscarUltimo(){
   $lb_Enc=false;
   $ls_Sql="SELECT * from agronomia.vdet_tabulador_labor WHERE codigo = (SELECT MAX(codigo) from agronomia.vdet_tabulador_labor) ";
   $this->f_Con();
   $lr_tabla=$this->f_Filtro($ls_Sql);
   if($la_registros=$this->f_Arreglo($lr_tabla)){
     $la_respuesta['nombre_tabulador']=$la_registros['nombre_tabulador'];
     $la_respuesta['nombre_labor']=$la_registros['nombre_labor'];
     $la_respuesta['tarifa']=$la_registros['tarifa'];
     $la_respuesta['codigo']=$la_registros['codigo'];
     $la_respuesta['codigo_labor']=$la_registros['codigo_labor'];
     $la_respuesta['codigo_tabulador']=$la_registros['codigo_tabulador'];
     $la_respuesta['fecha_desde']=$this->fFechaBD($la_registros['fecha_desde']);
     $la_respuesta['fecha_hasta']=$this->fFechaBD($la_registros['fecha_hasta']);
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
   $ls_Sql="UPDATE agronomia.vdet_tabulador_labor SET ";

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
}
?>
