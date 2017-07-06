<?php
include_once('../../nucleo/clases/cls_Conexion.php');
include_once('../../nucleo/clases/cls_Mensaje_Sistema.php');
class cls_Liquidacion extends cls_Conexion{

 protected $aa_Atributos = array();

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
     $lb_Enc=$this->f_Listar();
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
       $lb_Enc=$this->f_buscar('codigo');
       if($lb_Enc){
         $respuesta['registros']=$this->aa_Atributos['registro'];
         $success=1;
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
   $cadenaBusqueda = ($this->aa_Atributos['valor']=='')?'':"where numero::text||codigo_productor::text||letra like '%".$this->aa_Atributos['valor']."%'";
   if(isset($this->aa_Atributos['codigo_padre'])){
      $ls_SqlBase="SELECT * FROM agronomia.vliquidacion_nucleo where codigo_calculo = ".$this->aa_Atributos['codigo_padre']." $cadenaBusqueda";
   }else{
      $ls_SqlBase="SELECT * FROM agronomia.vliquidacion_nucleo $cadenaBusqueda";
   }
   $orden = " order by codigo_calculo,numero,codigo_productor,letra ";
   $ls_Sql = $this->f_ArmarPaginacion($ls_SqlBase,$orden);
   $this->f_Con();
   $lr_tabla=$this->f_Filtro($ls_Sql);
   while($la_registros=$this->f_Arreglo($lr_tabla)){
     $la_respuesta[$x]['nombre']='Liquidacion: '.$la_registros['numero'].' '.$la_registros['codigo_productor'].$la_registros['letra'];
     $la_respuesta[$x]['codigo']=$la_registros['codigo_liquidacion'];
     $la_respuesta[$x]['codigo_calculo']=$la_registros['codigo_calculo'];
     $la_respuesta[$x]['id_finca']=$la_registros['id_finca'];
     $la_respuesta[$x]['fecha_calculo']=$la_registros['fecha_calculo'];
     $la_respuesta[$x]['codigo_liquidacion']=$la_registros['codigo_liquidacion'];
     $la_respuesta[$x]['numero']=$la_registros['numero'];
     $la_respuesta[$x]['codigo_productor']=$la_registros['codigo_productor'];
     $la_respuesta[$x]['letra']=$la_registros['letra'];
     $la_respuesta[$x]['nombre_finca']=$la_registros['nombre_finca'];
     $la_respuesta[$x]['nombre_productor']=$la_registros['nombre_productor'];
     $x++;
   }
   $this->f_Cierra($lr_tabla);
   $this->f_Des();
   $this->aa_Atributos['registros'] = $la_respuesta;
   $lb_Enc=($x == 0)?false:true;
   return $lb_Enc;
 }

 private function f_Buscar($tipo){
   $lb_Enc=false;
   $ls_Sql="SELECT * FROM agronomia.vliquidacion_nucleo where codigo_liquidacion='".$this->aa_Atributos['codigo']."'";
   $this->f_Con();
   $lr_tabla=$this->f_Filtro($ls_Sql);
   if($la_registros=$this->f_Arreglo($lr_tabla)){
     $la_respuesta['nombre']='Liquidacion: '.$la_registros['numero'].' '.$la_registros['codigo_productor'].$la_registros['letra'];
     $la_respuesta['codigo_calculo']=$la_registros['codigo_calculo'];
     $la_respuesta['id_finca']=$la_registros['id_finca'];
     $la_respuesta['fecha_calculo']=$la_registros['fecha_calculo'];
     $la_respuesta['codigo_liquidacion']=$la_registros['codigo_liquidacion'];
     $la_respuesta['codigo']=$la_registros['codigo_liquidacion'];
     $la_respuesta['numero']=$la_registros['numero'];
     $la_respuesta['codigo_productor']=$la_registros['codigo_productor'];
     $la_respuesta['letra']=$la_registros['letra'];
     $la_respuesta['nombre_productor']=$la_registros['nombre_productor'];
     $la_respuesta['nombre_finca']=$la_registros['nombre_finca'];
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
}
?>
