<?php
include_once('../../nucleo/clases/cls_Conexion.php');
include_once('../../nucleo/clases/cls_Mensaje_Sistema.php');
class cls_Componente extends cls_Conexion{

 protected $aa_Atributos = array();
 private $aa_Campos = array('codigo_componente','titulo','componente_padre','tipo','color','icono','enlace','descripcion');

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
       $lb_Enc=$this->f_buscar();
       if($lb_Enc){
         $respuesta['registros']=$this->aa_Atributos['registro'];
         $success=1;
       }
       break;

     case 'guardar':
       $lb_Hecho=$this->f_Guardar();
       if($lb_Hecho){
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
   $cadenaBusqueda = ($this->aa_Atributos['valor']=='')?'':"where titulo like '%".$this->aa_Atributos['valor']."%'";
   $ls_SqlBase="SELECT * FROM seguridad.vcomponente $cadenaBusqueda";
   $orden = " ORDER BY componente_padre ";
   $ls_Sql = $this->f_ArmarPaginacion($ls_SqlBase,$orden);
   $this->f_Con();
   $lr_tabla=$this->f_Filtro($ls_Sql);
   while($la_registros=$this->f_Arreglo($lr_tabla)){
     $la_respuesta[$x]['titulo']=$la_registros['titulo'];
     $la_respuesta[$x]['color']=$la_registros['color'];
     $la_respuesta[$x]['Componente Padre']=$la_registros['titulo_padre'];
     $la_respuesta[$x]['enlace']=$la_registros['enlace'];
     $la_respuesta[$x]['icono']=$la_registros['icono'];
     $la_respuesta[$x]['descripcion']=$la_registros['descripcion'];
     $la_respuesta[$x]['padre']=$la_registros['componente_padre'];
     $la_respuesta[$x]['codigo']=$la_registros['codigo_componente'];
     $la_respuesta[$x]['nombre']=$la_registros['titulo'];
     $la_respuesta[$x]['tipocomponente']=$la_registros['tipo'];
     $x++;
   }
   $this->f_Cierra($lr_tabla);
   $this->f_Des();
   $this->aa_Atributos['registros'] = $la_respuesta;
   $lb_Enc=($x == 0)?false:true;
   return $lb_Enc;
 }

 private function f_Buscar(){
   $lb_Enc=false;
   //Busco El rol
   $ls_Sql="SELECT * FROM seguridad.vcomponente where codigo_componente='".$this->aa_Atributos['codigo']."'";
   $this->f_Con();
   $lr_tabla=$this->f_Filtro($ls_Sql);
   if($la_registros=$this->f_Arreglo($lr_tabla)){
     $la_respuesta['titulo']=$la_registros['titulo'];
     $la_respuesta['color']=$la_registros['color'];
     $la_respuesta['tipocomponente']=$la_registros['tipo'];
     $la_respuesta['descripcion']=$la_registros['descripcion'];
     $la_respuesta['Componente Padre']=$la_registros['titulo_padre'];
     $la_respuesta['enlace']=$la_registros['enlace'];
     $la_respuesta['icono']=$la_registros['icono'];
     $la_respuesta['padre']=$la_registros['componente_padre'];
     $la_respuesta['codigo']=$la_registros['codigo_componente'];
     $la_respuesta['nombre']=$la_registros['titulo'];
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
   if($this->aa_Atributos['enlace']=='null'){
      $this->aa_Atributos['enlace'] ='';
   }
   $ls_Sql="INSERT INTO seguridad.vcomponente (titulo,color,icono,enlace,componente_padre,tipo,descripcion) values
       ('".$this->aa_Atributos['titulo']."','".$this->aa_Atributos['color']."','".$this->aa_Atributos['icono']."',
       '".$this->aa_Atributos['enlace']."','".$this->aa_Atributos['padre']."','".$this->aa_Atributos['tipocomponente']."',
       '".$this->aa_Atributos['descripcion']."')";
   $this->f_Con();
   $lb_Hecho=$this->f_Ejecutar($ls_Sql);
   $this->f_Des();
   return $lb_Hecho;
 }

 private function f_Modificar(){
   $lb_Hecho=false;
   $contCampos = 0;
   if($this->aa_Atributos['enlace']=='null'){
      $this->aa_Atributos['enlace'] ='';
   }
   $ls_Sql="UPDATE seguridad.vcomponente SET ";

   //arma la cadena sql en base a los campos pasados en la peticion
   $ls_Sql.=$this->armarCamposUpdate($this->aa_Campos,$this->aa_Atributos);

   $ls_Sql.="WHERE codigo_componente ='".$this->aa_Atributos['codigo']."'";
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
   public function f_BuscarArbol(){
      $x=0;
      $la_Privilegios=array();
      $ls_Sql="SELECT * from seguridad.varbol_componente ";
      $this->f_Con();
      $lr_tabla=$this->f_Filtro($ls_Sql);
      while($la_registro=$this->f_Arreglo($lr_tabla)){
         $la_Privilegios[$x]['titulo']=$la_registro['titulo'];
         $la_Privilegios[$x]['codigo']=$la_registro['codigo'];
         $la_Privilegios[$x]['padre']=$la_registro['padre'];
         $la_Privilegios[$x]['tit_componente_padre']=$la_registro['titulo_componente_padre'];
         $la_Privilegios[$x]['tipo']=$la_registro['tipo'];
         $x++;
      }
      $this->f_Cierra($lr_tabla);
      $this->f_Des();
      return $la_Privilegios;
   }
}
?>
