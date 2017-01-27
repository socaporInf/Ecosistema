<?php
include_once('../../nucleo/clases/cls_Conexion.php');
include_once('../../nucleo/clases/cls_Mensaje_Sistema.php');
class cls_ReportesPagos extends cls_Conexion{

 protected $aa_Atributos = array();
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
   switch ($this->aa_Atributos['reporte']) {
    case 'liquidacionNucleo':
      $registros = $this->mostrarLiquidacion();
      if(count($registros['liquidaciones'])>0){
        $respuesta['success'] = 1;
        $respuesta['detalle'] = $registros['detalle'];
        $respuesta['liquidaciones'] = $registros['liquidaciones'];
      }else{
          $respuesta['success'] = 0;
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

 private function mostrarLiquidacion(){
   $x=0;
   $this->aa_Atributos['codigo_calculo']=($this->aa_Atributos['codigo_calculo']=='null')?'':$this->aa_Atributos['codigo_calculo'];
   $this->aa_Atributos['finca']=($this->aa_Atributos['finca']=='null')?'':$this->aa_Atributos['finca'];
   $ls_Sql="SELECT * from agronomia.spcon_liquidacion_cabecera('".$this->aa_Atributos['finca']."','".$this->aa_Atributos['codigo_calculo']."') order by codigo_productor,finca_letra";
   $this->f_Con();
   $lr_tabla=$this->f_Filtro($ls_Sql);
   while($la_registros=$this->f_Arreglo($lr_tabla)){
     $la_liquidaciones[$x]['codigo_liquidacion'] =$la_registros['id_liq_nuc'];
     $la_liquidaciones[$x]['id_finca'] =$la_registros['id_finca'];
     $la_liquidaciones[$x]['codigo_productor'] =$la_registros['codigo_productor'];
     $la_liquidaciones[$x]['finca_letra'] =$la_registros['finca_letra'];
     $la_liquidaciones[$x]['fecha_calculo'] =$this->fFechaBD($la_registros['fecha_calculo']);
     $la_liquidaciones[$x]['fecha_inicio'] =$this->fFechaBD($la_registros['fecha_inicio_calculo']);
     $la_liquidaciones[$x]['fecha_final'] =$this->fFechaBD($la_registros['fecha_final_calculo']);
     $la_liquidaciones[$x]['codigo_calculo'] =$la_registros['id_calculo'];
     $la_liquidaciones[$x]['numero'] =$la_registros['numero'];
     $la_liquidaciones[$x]['zafra'] =$la_registros['zafra'];
     $la_liquidaciones[$x]['nombre_finca'] =$la_registros['nombre_finca'];
     $la_liquidaciones[$x]['nombre_productor'] =$la_registros['nombre_productor'];
     $x++;
   }
   $this->f_Cierra($lr_tabla);
   $this->f_Des();
   $ls_Sql="SELECT * from agronomia.spcon_liquidacion_detalle('".$this->aa_Atributos['finca']."','".$this->aa_Atributos['codigo_calculo']."') order by id_liq_nuc,codigo_nucleo";
   $this->f_Con();
   $x=0;
   $lr_tabla=$this->f_Filtro($ls_Sql);
   while($la_registros=$this->f_Arreglo($lr_tabla)){
     $la_respuesta[$x]['codigo_liquidacion'] =$la_registros['id_liq_nuc'];
     $la_respuesta[$x]['tarifa'] =$la_registros['tar'];
     $la_respuesta[$x]['toneladas'] =$la_registros['ton'];
     $la_respuesta[$x]['por_iva'] =$la_registros['por_iva'];
     $la_respuesta[$x]['tot_con_iva'] =$la_registros['tot_con_iva'];
     $la_respuesta[$x]['subtotal'] =$la_registros['monto'];
     $la_respuesta[$x]['concepto'] =$la_registros['concepto'];
     $la_respuesta[$x]['comportamiento'] =$la_registros['comportamiento'];
     $la_respuesta[$x]['nombre_nucleo'] =$la_registros['nombre_nucleo'];
     $la_respuesta[$x]['codigo_nucleo'] =$la_registros['codigo_nucleo'];
     $x++;
   }
   $this->f_Cierra($lr_tabla);
   $this->f_Des();

   $la_data["liquidaciones"] = $la_liquidaciones;
   $la_data['detalle'] = $la_respuesta;
   return $la_data;
 }

}
?>
