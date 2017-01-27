<?php
include_once('../../nucleo/clases/cls_Conexion.php');
include_once('../../nucleo/clases/cls_Mensaje_Sistema.php');
class cls_CalculoLiquidacion extends cls_Conexion{

 protected $aa_Atributos = array();
 private $aa_Campos = array('codigo_calculo','codigo_tipo_liquidacion','codigo_zafra','numero','fecha_desde','fecha_hasta','estado');

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

     case 'aperturar':
       $lb_Hecho = $this->f_Aperturar();
       if($lb_Hecho){
          $success=1;
          $respuesta['mensaje'] = $lobj_Mensaje->buscarMensaje(14);
       }else{
          $respuesta['mensaje'] = $lobj_Mensaje->buscarMensaje(15);
          $success=0;
       }
       break;

     case 'cerrar':
       $lb_Hecho = $this->f_Cerrar();
       if($lb_Hecho){
          $success=1;
          $respuesta['mensaje'] = $lobj_Mensaje->buscarMensaje(14);
       }else{
          $respuesta['mensaje'] = $lobj_Mensaje->buscarMensaje(15);
          $success=0;
       }
       break;

     case 'generar':
       $lb_Hecho = $this->f_GenerarLiquidaciones();
       if($lb_Hecho){
          $success=1;
          $respuesta['mensaje'] = $lobj_Mensaje->buscarMensaje(14);
       }else{
          $respuesta['mensaje'] = $lobj_Mensaje->buscarMensaje(15);
          $success=0;
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
   if(isset($this->aa_Atributos['codigo_padre'])){
      $ls_Sql="SELECT * FROM agronomia.vcalculo_liquidacion where codigo_tipo_liquidacion = ".$this->aa_Atributos['codigo_padre']." order by numero";
   }else{
      $ls_Sql="SELECT * FROM agronomia.vcalculo_liquidacion order by numero";
   }
   $this->f_Con();
   $lr_tabla=$this->f_Filtro($ls_Sql);
   while($la_registros=$this->f_Arreglo($lr_tabla)){
     $la_respuesta[$x]['nombre']='Semana '.$la_registros['numero'];
     $la_respuesta[$x]['numero']=$la_registros['numero'];
     $la_respuesta[$x]['estado']=$la_registros['estado'];
     $la_respuesta[$x]['codigo_zafra']=$la_registros['codigo_zafra'];
     $la_respuesta[$x]['codigo_calculo']=$la_registros['codigo_calculo'];
     $la_respuesta[$x]['codigo']=$la_registros['codigo_calculo'];
     $la_respuesta[$x]['codigo_tipo_liquidacion']=$la_registros['codigo_tipo_liquidacion'];
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
   $ls_Sql="SELECT * FROM agronomia.vcalculo_liquidacion where codigo_calculo='".$this->aa_Atributos['codigo']."'";
   $this->f_Con();
   $lr_tabla=$this->f_Filtro($ls_Sql);
   if($la_registros=$this->f_Arreglo($lr_tabla)){
     $la_respuesta['codigo_calculo']=$la_registros['codigo_calculo'];
     $la_respuesta['numero']=$la_registros['numero'];
     $la_respuesta['estado']=$la_registros['estado'];
     $la_respuesta['codigo_zafra']=$la_registros['codigo_zafra'];
     $la_respuesta['codigo_tipo_liquidacion']=$la_registros['codigo_tipo_liquidacion'];
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
   $ls_Sql="INSERT INTO agronomia.vcalculo_liquidacion (codigo_zafra,codigo_tipo_liquidacion,numero,fecha_desde,fecha_hasta,estado) values
       ('".$this->aa_Atributos['codigo_zafra']."','".$this->aa_Atributos['codigo_tipo_liquidacion']."',
       '".$this->aa_Atributos['numero']."','".$this->aa_Atributos['fecha_desde']."','".$this->aa_Atributos['fecha_hasta']."','C')";
   $this->f_Con();
   $lb_Hecho=$this->f_Ejecutar($ls_Sql);
   $this->f_Des();
   return $lb_Hecho;
 }

 private function f_Aperturar(){
   $lb_Hecho=false;
   $ls_Sql="UPDATE agronomia.vactivacion_calculo set estado = 'A' where codigo_calculo='".$this->aa_Atributos['codigo_calculo']."'";
   $this->f_Con();
   $lb_Hecho=$this->f_Ejecutar($ls_Sql);
   $this->f_Des();
   return $lb_Hecho;
 }

 private function f_Cerrar(){
   $lb_Hecho=false;
   $ls_Sql="UPDATE agronomia.vactivacion_calculo set estado = 'C' where codigo_calculo='".$this->aa_Atributos['codigo_calculo']."'";
   $this->f_Con();
   $lb_Hecho=$this->f_Ejecutar($ls_Sql);
   $this->f_Des();
   return $lb_Hecho;
 }

 private function f_GenerarLiquidaciones(){
   $lb_Hecho=false;
   $ls_Sql="SELECT agronomia.spcalc_liquidacion_nucleo('".$this->aa_Atributos['codigo_tipo_liquidacion']."')";
   $this->f_Con();
   $lb_Hecho=$this->f_Ejecutar($ls_Sql);
   $this->f_Des();
   return $lb_Hecho;
 }

 private function f_BuscarUltimo(){
   $lb_Enc=false;
   $ls_Sql="SELECT * from agronomia.vcalculo_liquidacion WHERE codigo_calculo = (SELECT MAX(codigo_calculo) from agronomia.vcalculo_liquidacion) ";
   $this->f_Con();
   $lr_tabla=$this->f_Filtro($ls_Sql);
   if($la_registros=$this->f_Arreglo($lr_tabla)){
     $la_respuesta['codigo_calculo']=$la_registros['codigo_calculo'];
     $la_respuesta['numero']=$la_registros['numero'];
     $la_respuesta['estado']=$la_registros['estado'];
     $la_respuesta['codigo_zafra']=$la_registros['codigo_zafra'];
     $la_respuesta['codigo_tipo_liquidacion']=$la_registros['codigo_tipo_liquidacion'];
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
   $ls_Sql="UPDATE agronomia.vcalculo_liquidacion SET ";

   //arma la cadena sql en base a los campos pasados en la peticion
   $ls_Sql.=$this->armarCamposUpdate($this->aa_Campos,$this->aa_Atributos);

   $ls_Sql.="WHERE codigo_calculo ='".$this->aa_Atributos['codigo']."'";
   print($ls_Sql);
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
