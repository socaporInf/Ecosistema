<?php
include_once('../../nucleo/clases/cls_Conexion.php');
include_once('../../nucleo/clases/cls_Mensaje_Sistema.php');
class cls_DiaZafra extends cls_Conexion{

 protected $aa_Atributos = array();
 private $aa_Campos = array('codigo_dia_zafra','numero','estado_dia_zafra','fecha_dia','codigo_tipo_carga','codigo_proceso_dia','codigo_estado_datos');

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

    case 'estadoDia':
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

    case 'buscarDiasZafraActiva':
       $registros=$this->f_buscarDiasZafraActiva();
       if(count($registros)!=0){
         $success=1;
         $respuesta['registros']=$registros;
       }else{
         $respuesta['success'] = 0;
         $respuesta['mensaje'] = $lobj_Mensaje->buscarMensaje(8);
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
   $ls_Sql="SELECT * FROM agronomia.vdia_zafra where codigo_zafra =".$this->aa_Atributos['codigo'];
   $this->f_Con();
   $lr_tabla=$this->f_Filtro($ls_Sql);
   while($la_registros=$this->f_Arreglo($lr_tabla)){
     $la_respuesta[$x]['codigo']=$la_registros['codigo_dia_zafra'];
     $la_respuesta[$x]['numero']=$la_registros['numero'];
     $la_respuesta[$x]['estado']=$la_registros['estado_dia_zafra'];
     $la_respuesta[$x]['fecha_dia']=$la_registros['fecha_dia'];
     $la_respuesta[$x]['codigo_zafra']=$la_registros['codigo_zafra'];
     $la_respuesta[$x]['nombre_zafra']=$la_registros['nombre_zafra'];
     $la_respuesta[$x]['estado_zafra']=$la_registros['estado_zafra'];
     $la_respuesta[$x]['codigo_proceso_dia']=$la_registros['codigo_proceso_dia'];
     $la_respuesta[$x]['nombre_proceso_dia']=$la_registros['nombre_proceso_dia'];
     $la_respuesta[$x]['codigo_tipo_carga']=$la_registros['codigo_tipo_carga'];
     $la_respuesta[$x]['nombre_tipo_carga']=$la_registros['nombre_tipo_carga'];
     $la_respuesta[$x]['codigo_estado_datos']=$la_registros['codigo_estado_datos'];
     $la_respuesta[$x]['nombre_estado_datos']=$la_registros['nombre_estado_datos'];
     $la_respuesta[$x]['fechadia']=$this->fFechaBD($la_registros['fecha_dia']);
     $x++;
   }
   $this->f_Cierra($lr_tabla);
   $this->f_Des();
   return $la_respuesta;
 }
 private function f_buscarDiasZafraActiva(){
   $x=0;
   $la_respuesta=array();
   $ls_Sql="SELECT * FROM agronomia.vdia_zafra where codigo_zafra =(SELECT codigo_zafra FROM agronomia.vzafra where estado = 'A')";
   $this->f_Con();
   $lr_tabla=$this->f_Filtro($ls_Sql);
   while($la_registros=$this->f_Arreglo($lr_tabla)){
     $la_respuesta[$x]['codigo']=$la_registros['codigo_dia_zafra'];
     $la_respuesta[$x]['numero']=$la_registros['numero'];
     $la_respuesta[$x]['estado']=$la_registros['estado_dia_zafra'];
     $la_respuesta[$x]['fecha_dia']=$la_registros['fecha_dia'];
     $la_respuesta[$x]['fechadia']=$this->fFechaBD($la_registros['fecha_dia']);
     $la_respuesta[$x]['codigo_zafra']=$la_registros['codigo_zafra'];
     $la_respuesta[$x]['nombre_zafra']=$la_registros['nombre_zafra'];
     $la_respuesta[$x]['estado_zafra']=$la_registros['estado_zafra'];
     $la_respuesta[$x]['codigo_proceso_dia']=$la_registros['codigo_proceso_dia'];
     $la_respuesta[$x]['nombre_proceso_dia']=$la_registros['nombre_proceso_dia'];
     $la_respuesta[$x]['codigo_tipo_carga']=$la_registros['codigo_tipo_carga'];
     $la_respuesta[$x]['nombre_tipo_carga']=$la_registros['nombre_tipo_carga'];
     $la_respuesta[$x]['codigo_estado_datos']=$la_registros['codigo_estado_datos'];
     $la_respuesta[$x]['nombre_estado_datos']=$la_registros['nombre_estado_datos'];
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
      $ls_Sql="SELECT * from agronomia.vdia_zafra WHERE codigo_dia_zafra = (SELECT MAX(codigo_zafra) from agronomia.vdia_Zafra) ";
   }else if($tipo == 'activo'){
      $ls_Sql="SELECT * from agronomia.vdia_zafra WHERE codigo_dia_zafra = (SELECT codigo_dia_zafra from agronomia.vdia_zafra WHERE estado_dia_zafra = 'A') ";
   }else {
      $ls_Sql="SELECT * FROM agronomia.vdia_zafra where codigo_dia_zafra='".$this->aa_Atributos['codigo']."'";
   }
   $this->f_Con();
   $lr_tabla=$this->f_Filtro($ls_Sql);
   if($la_registros=$this->f_Arreglo($lr_tabla)){
     $la_respuesta['codigo']=$la_registros['codigo_dia_zafra'];
     $la_respuesta['numero']=$la_registros['numero'];
     $la_respuesta['estado']=$la_registros['estado_dia_zafra'];
     $la_respuesta['fecha_dia']=$la_registros['fecha_dia'];
     $la_respuesta['codigo_zafra']=$la_registros['codigo_zafra'];
     $la_respuesta['nombre_zafra']=$la_registros['nombre_zafra'];
     $la_respuesta['estado_zafra']=$la_registros['estado_zafra'];
     $la_respuesta['codigo_proceso_dia']=$la_registros['codigo_proceso_dia'];
     $la_respuesta['nombre_proceso_dia']=$la_registros['nombre_proceso_dia'];
     $la_respuesta['codigo_tipo_carga']=$la_registros['codigo_tipo_carga'];
     $la_respuesta['nombre_tipo_carga']=$la_registros['nombre_tipo_carga'];
     $la_respuesta['codigo_estado_datos']=$la_registros['codigo_estado_datos'];
     $la_respuesta['nombre_estado_datos']=$la_registros['nombre_estado_datos'];
     $la_respuesta['fechadia']=$this->fFechaBD($la_registros['fecha_dia']);
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
   //valores por defecto en la base de datos
   //Armo la peticion
   $peticion = Array(
         'operacion'=>'buscarParametros',
         'nombre'=>'CREACION DIA ZAFRA'
      );
   //incluyo e instancio
   include_once('../../seguridad/clases/cls_Proceso.php');
   $lobj_Proceso = new cls_Proceso();
   //seteo la peticion
   $lobj_Proceso->setPeticion($peticion);
   //gestiono y obtengo el resultado
   $parametros = $lobj_Proceso->gestionar();
   //Uso los parametro
   $tipo_carga = "("."SELECT codigo_registro FROM global.vregistro_virtual WHERE codigo_registro = ".$parametros['TIPO CARGA'].")";
   $proceso_dia = "("."SELECT codigo_registro FROM global.vregistro_virtual WHERE codigo_registro = ".$parametros['PROCESO DIA ZAFRA'].")";
   $estado_datos = "("."SELECT codigo_registro FROM global.vregistro_virtual WHERE codigo_registro = ".$parametros['ESTADO DATOS'].")";
   $ls_Sql="INSERT INTO agronomia.vdia_zafra (codigo_zafra,numero,fecha_dia,codigo_tipo_carga,codigo_proceso_dia,codigo_estado_datos)
            values
            ('".$this->aa_Atributos['zafra']."','".$this->aa_Atributos['numero']."','".$this->aa_Atributos['fechadia']."',
            ".$tipo_carga.",".$proceso_dia.",".$estado_datos.")";
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
   $ls_Sql="UPDATE agronomia.vdia_zafra SET ";

   //arma la cadena sql en base a los campos pasados en la peticion
   $ls_Sql.=$this->armarCamposUpdate($this->aa_Campos,$this->aa_Atributos);

   $ls_Sql.="WHERE codigo_dia_zafra ='".$this->aa_Atributos['codigo']."'";
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
 private function f_VerificarDia(){
   $lb_Enc = false;
   $ls_Sql = "SELECT fecha_dia FROM agronomia.vdia_zafra WHERE codigo_zafra = ".$this->aa_atributos['zafra']." AND estado_dia_zafra ='A'";
   $this->f_Con();
   $lr_tabla=$this->f_Filtro($ls_Sql);
   if($la_registros=$this->f_Arreglo($lr_tabla)){
     if($this->aa_atributos['fechadia']==$la_registros['fecha_dia']){
       $lb_Enc=true;
     }
   }
   $this->f_Cierra($lr_tabla);
   $this->f_Des();

   return $lb_Enc;
 }
}
?>