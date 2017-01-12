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
      if(count($registros['registros'])>0){
        $respuesta['success'] = 1;
        $respuesta['registros'] = $registros['registros'];
        $respuesta['zafra'] = $registros['zafra'];
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
   $this->aa_Atributos['fecha_desde']=($this->aa_Atributos['fecha_desde']=='null')?'':$this->fFechaPHP($this->aa_Atributos['fecha_desde']);
   $this->aa_Atributos['fecha_hasta']=($this->aa_Atributos['fecha_hasta']=='null')?'':$this->fFechaPHP($this->aa_Atributos['fecha_hasta']);
   $ls_Sql="SELECT * from agronomia.spcon_ministerio_rango('".$this->aa_Atributos['fecha_desde']."','".$this->aa_Atributos['fecha_hasta']."')";
   $this->f_Con();
   $lr_tabla=$this->f_Filtro($ls_Sql);
   while($la_registros=$this->f_Arreglo($lr_tabla)){
     $la_respuesta[$x]['municipio'] =$la_registros['municipio'];
     $la_respuesta[$x]['nomestado'] =$la_registros['estado'];
     $la_respuesta[$x]['codestado'] =$la_registros['codigo_estado'];
     $la_respuesta[$x]['cod_mun'] =$la_registros['cod_mun'];
     $la_respuesta[$x]['peso'] =$la_registros['peso'];
     $la_respuesta[$x]['azucar'] =$la_registros['azucar'];
     $la_respuesta[$x]['area'] =$la_registros['area'];
     $x++;
   }
   $this->f_Cierra($lr_tabla);
   $this->f_Des();

   $ls_Sql = "SELECT * from agronomia.vzafra where estado = 'A'";
   $this->f_Con();
   $lr_tabla=$this->f_Filtro($ls_Sql);
   if($la_registros=$this->f_Arreglo($lr_tabla)){
     $la_zafra['fechainicio'] = $this->fFechaBD($la_registros['fecha_inicio']);
     $la_zafra['fechafinal'] = $this->fFechaBD($la_registros['fecha_final']);
     $la_zafra['feczafra'] = $this->fFechaBD($la_registros['fecha_dia']);
   }
   $this->f_Cierra($lr_tabla);
   $this->f_Des();
   $la_zafra['desde']=($this->aa_Atributos['fecha_desde']=='')?$la_zafra['fechainicio']:$this->fFechaBD($this->aa_Atributos['fecha_desde']);
   $la_zafra['hasta']=($this->aa_Atributos['fecha_hasta']=='')?$la_zafra['feczafra']:$this->fFechaBD($this->aa_Atributos['fecha_hasta']);

   $la_data["zafra"] = $la_zafra;
   $la_data['registros'] = $la_respuesta;
   return $la_data;
 }

}
?>
