<?php
include_once('../../nucleo/clases/cls_Conexion.php');
include_once('../../nucleo/clases/cls_Mensaje_Sistema.php');
class cls_M01_Tipo_Formula_Tipo_Garantia extends cls_Conexion{

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
       $lb_Enc=$this->f_buscar();
       if($lb_Enc){
         $respuesta['registros']=$this->aa_Atributos['registro'];
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
   $ls_Sql="SELECT tftg.*,tf.descripcion FROM agronomia.vm01_tipo_formula_tipo_garantia AS tftg
            JOIN agronomia.vm01_tipo_formula AS tf ON(tf.codigo_tipo_formula=tftg.codigo_tipo_formula)";
   $this->f_Con();
   $lr_tabla=$this->f_Filtro($ls_Sql);
   while($la_registros=$this->f_Arreglo($lr_tabla)){
     $la_respuesta[$x]['codigo']=$la_registros['codigo_tipo_formula_tipo_garantia'];
     $la_respuesta[$x]['tipo garantia']=$la_registros['codigo_tipo_garantia'];
     $la_respuesta[$x]['tipo formula']=$la_registros['codigo_tipo_formula'];
     $la_respuesta[$x]['zafra']=$la_registros['codigo_zafra'];
     $x++;
   }
   $this->f_Cierra($lr_tabla);
   $this->f_Des();
   return $la_respuesta;
 }

 private function f_Buscar(){
   $lb_Enc=false;
   //Busco El rol
   $ls_Sql="SELECT * FROM agronomia.vm01_tipo_formula_tipo_garantia where codigo_tipo_formula_tipo_garantia='".$this->aa_Atributos['codigo']."'";
   $this->f_Con();
   $lr_tabla=$this->f_Filtro($ls_Sql);
   if($la_registros=$this->f_Arreglo($lr_tabla)){
     $la_respuesta['codigo']=$la_registros['codigo_tipo_formula_tipo_garantia'];
     $la_respuesta['tip_gar']=$la_registros['codigo_tipo_garantia'];
     $la_respuesta['tip_for']=$la_registros['codigo_tipo_formula'];
     $la_respuesta['zafra']=$la_registros['codigo_zafra'];
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

 private function f_Guardar(){

   $lb_Hecho=false;
   $ls_Sql="INSERT INTO agronomia.vm01_tipo_formula_tipo_garantia (codigo_tipo_formula,codigo_tipo_garantia) values
       ('".$this->aa_Atributos['tip_for']."',
       '".$this->aa_Atributos['tip_gar']."'
       )";
   $this->f_Con();
   $lb_Hecho=$this->f_Ejecutar($ls_Sql);
   $this->f_Des();
   return $lb_Hecho;
 }

 private function f_BuscarUltimo(){
   $lb_Enc=false;
   //Busco El rol
   $ls_Sql="SELECT * from agronomia.vm01_tipo_formula_tipo_garantia WHERE codigo_tipo_formula_tipo_garantia = (SELECT MAX(codigo_tipo_formula_tipo_garantia) from agronomia.vm01_tipo_formula_tipo_garantia) ";
   $this->f_Con();
   $lr_tabla=$this->f_Filtro($ls_Sql);
   if($la_registros=$this->f_Arreglo($lr_tabla)){
     $la_respuesta['codigo']=$la_registros['codigo_tipo_formula_tipo_garantia'];
     $la_respuesta['tip_gar']=$la_registros['codigo_tipo_garantia'];
     $la_respuesta['zafra']=$la_registros['codigo_zafra'];
     $la_respuesta['tip_for']=$la_registros['codigo_tipo_formula'];
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

 private function f_Modificar(){
   $lb_Hecho=false;
   $contCampos = 0;

   $ls_Sql="UPDATE agronomia.vm01_tipo_formula_tipo_garantia SET 
    codigo_tipo_garantia='".$this->aa_Atributos['tip_gar']."',
    codigo_tipo_formula='".$this->aa_Atributos['tip_for']."',
    codigo_zafra='".$this->aa_Atributos['zafra']."'
    WHERE codigo_tipo_formula_tipo_garantia ='".$this->aa_Atributos['codigo']."'";
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
