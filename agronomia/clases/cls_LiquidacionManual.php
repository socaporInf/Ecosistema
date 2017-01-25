<?php
include_once('../../nucleo/clases/cls_Conexion.php');
include_once('../../nucleo/clases/cls_Mensaje_Sistema.php');
class cls_LiquidacionManual extends cls_Conexion{

 protected $aa_Atributos = array();
 private $aa_Campos = array('id_det_liq_nuc','id_liq_nuc','id_nuc','id_con','tar','ton','por_iva','tot_con_iva','monto');

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
      $ls_Sql="SELECT * FROM agronomia.vdet_liquidacion_nucleo_manual where id_liq_nuc = ".$this->aa_Atributos['codigo_padre'];
   }else{
      $ls_Sql="SELECT * FROM agronomia.vdet_liquidacion_nucleo_manual ";
   }
   $this->f_Con();
   $lr_tabla=$this->f_Filtro($ls_Sql);
   while($la_registros=$this->f_Arreglo($lr_tabla)){
     $la_respuesta[$x]['Liquidacion Numero']=$la_registros['numero'];
     $la_respuesta[$x]['concepto']=$la_registros['descripcion'];
     $la_respuesta[$x]['Total']=$la_registros['tot_con_iva'];
     $la_respuesta[$x]['tot_con_iva']=$la_registros['tot_con_iva'];
     $la_respuesta[$x]['id_liq_nuc']=$la_registros['id_liq_nuc'];
     $la_respuesta[$x]['id_con']=$la_registros['id_con'];
     $la_respuesta[$x]['tar']=$la_registros['tar'];
     $la_respuesta[$x]['ton']=$la_registros['ton'];
     $la_respuesta[$x]['por_iva']=$la_registros['por_iva'];
     $la_respuesta[$x]['monto']=$la_registros['monto'];
     $x++;
   }
   $this->f_Cierra($lr_tabla);
   $this->f_Des();
   return $la_respuesta;
 }

 private function f_Buscar($tipo){
   $lb_Enc=false;
   $ls_Sql="SELECT * FROM agronomia.vdet_liquidacion_nucleo_manual where id_det_liq_nuc='".$this->aa_Atributos['id_det_liq_nuc']."'";
   $this->f_Con();
   $lr_tabla=$this->f_Filtro($ls_Sql);
   if($la_registros=$this->f_Arreglo($lr_tabla)){
     $la_respuesta['id_det_liq_nuc']=$la_registros['id_det_liq_nuc'];
     $la_respuesta['id_liq_nuc']=$la_registros['id_liq_nuc'];
     $la_respuesta['id_nuc']=$la_registros['id_nuc'];
     $la_respuesta['id_con']=$la_registros['id_con'];
     $la_respuesta['tar']=$la_registros['tar'];
     $la_respuesta['ton']=$la_registros['ton'];
     $la_respuesta['por_iva']=$la_registros['por_iva'];
     $la_respuesta['tot_con_iva']=$la_registros['ton_con_iva'];
     $la_respuesta['monto']=$la_registros['monto'];
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
   $this->aa_Atributos['id_nuc']=($this->aa_Atributos['id_nuc']=='')?'null':$this->aa_Atributos['id_nuc'];
   $this->aa_Atributos['tar']=($this->aa_Atributos['tar']=='')?'null':$this->aa_Atributos['tar'];
   $this->aa_Atributos['ton']=($this->aa_Atributos['ton']=='')?'null':$this->aa_Atributos['ton'];
   $lb_Hecho=false;
   $ls_Sql="INSERT INTO agronomia.vdet_liquidacion_nucleo_manual (id_liq_nuc,id_nuc,id_con,tar,ton,por_iva,tot_con_iva,monto) values
       ('".$this->aa_Atributos['id_liq_nuc']."',
       ".$this->aa_Atributos['id_nuc'].",'".$this->aa_Atributos['id_con']."',
       ".$this->aa_Atributos['tar'].",".$this->aa_Atributos['ton'].",
       '".$this->aa_Atributos['por_iva']."','".$this->aa_Atributos['tot_con_iva']."',
       '".$this->aa_Atributos['monto']."')";
   $this->f_Con();
   $lb_Hecho=$this->f_Ejecutar($ls_Sql);
   $this->f_Des();
   return $lb_Hecho;
 }

 private function f_Modificar(){
   $lb_Hecho=false;
   $contCampos = 0;
   $ls_Sql="UPDATE agronomia.vdet_liquidacion_nucleo_manual SET ";

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
