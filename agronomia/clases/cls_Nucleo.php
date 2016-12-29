<?php
include_once('../../nucleo/clases/cls_Conexion.php');
include_once('../../nucleo/clases/cls_Mensaje_Sistema.php');
include_once('../../global/clases/cls_Organizacion.php');
class cls_Nucleo extends cls_Conexion{

 protected $aa_Atributos = array();
 private $aa_Campos = array('codigo_nucleo','nombre_completo','rif','codigo_tipo_persona','tipo_persona');

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

    case 'listarNucleos':
     $lb_Enc=$this->f_ListarNucleos();
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
         $this->f_Buscar();
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

     case 'consultarOrganizacion':
       $lb_Enc=$this->f_ConsultarOrganizacion();
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
   $cadenaBusqueda = ($this->aa_Atributos['valor']=='')?'':"where rif like '%".$this->aa_Atributos['valor']."%'";
   $la_respuesta=array();
   $ls_SqlBase="SELECT * FROM agronomia.vnucleo $cadenaBusqueda";
   $ls_Sql = $this->f_ArmarPaginacion($ls_SqlBase,$orden);

   $this->f_Con();
   $lr_tabla=$this->f_Filtro($ls_Sql);
   while($la_registros=$this->f_Arreglo($lr_tabla)){
     $la_respuesta[$x]['codigo']=$la_registros['codigo_nucleo'];
     $la_respuesta[$x]['nombre_completo']=$la_registros['nombre_completo'];
     $la_respuesta[$x]['rif']=$la_registros['rif'];
     $x++;
   }

   $this->f_Cierra($lr_tabla);
   $this->f_Des();
   $this->aa_Atributos['registros'] = $la_respuesta;
   $lb_Enc=($x == 0)?false:true;
   return $lb_Enc;
 }

 private function f_ListarNucleos(){
   $x=0;
   //varibles paginacion
   $cadenaBusqueda = ($this->aa_Atributos['valor']=='')?'':"where nombre_completo like '%".$this->aa_Atributos['valor']."%'";
   $la_respuesta=array();
   $ls_SqlBase="SELECT * FROM agronomia.vnucleo_organizacion $cadenaBusqueda";
   $orden = "order by nombre_completo";
   $ls_Sql = $this->f_ArmarPaginacion($ls_SqlBase,$orden);
   $this->f_Con();
   $lr_tabla=$this->f_Filtro($ls_Sql);
   while($la_registros=$this->f_Arreglo($lr_tabla)){
     $la_respuesta[$x]['codigo']=$la_registros['codigo_nucleo'];
     $la_respuesta[$x]['nombre_completo']=$la_registros['nombre_completo'];
     $la_respuesta[$x]['rif']=$la_registros['rif'];
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
   $ls_Sql="SELECT * FROM agronomia.vnucleo where codigo_nucleo='".$this->aa_Atributos['codigo']."'";
   $this->f_Con();
   $lr_tabla=$this->f_Filtro($ls_Sql);
   if($la_registros=$this->f_Arreglo($lr_tabla)){
     $la_respuesta['codigo']=$la_registros['codigo_nucleo'];
     $la_respuesta['nombre_completo']=$la_registros['nombre_completo'];
     $la_respuesta['rif']=$la_registros['rif'];
     $la_respuesta['codigo_tipo_persona']=$la_registros['codigo_tipo_persona'];
     $la_respuesta['tipo_persona']=$la_registros['tipo_persona'];
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
   $lb_Enc= false;
   $lobj_Entidad = new cls_Organizacion();
   //busco si existe ese rif como organizacion
   $la_Peticion = array('codigo' => $this->aa_Atributos['rif']);
   $la_Peticion['operacion'] = 'buscarRegistro';
   $lobj_Entidad->setPeticion($la_Peticion);
   $lb_Enc = $lobj_Entidad->gestionar()['success'];
   if(!$lb_Enc){
     $lb_Hecho=false;
     $la_Peticion = $this->aa_Atributos;
     $la_Peticion['operacion'] = 'guardar';
     $la_Peticion['codigo'] = $this->aa_Atributos['rif'];
     $lobj_Entidad->setPeticion($la_Peticion);
     $lb_Hecho = $lobj_Entidad->gestionar();
   }else{
     $lb_Hecho=true;
   }
   if($lb_Hecho){
     $lb_Hecho=false;
     $ls_Sql="INSERT INTO agronomia.vnucleo (rif,codigo_nucleo) values
        ('".$this->aa_Atributos['rif']."','".$this->aa_Atributos['codigo']."')";
     $this->f_Con();
     $lb_Hecho=$this->f_Ejecutar($ls_Sql);
     $this->f_Des();
   }
   return $lb_Hecho;
 }
   private function f_Modificar(){
      $lb_Hecho=false;
      $contCampos = 0;
      $ls_Sql="UPDATE agronomia.vproductor SET ";

      //arma la cadena sql en base a los campos pasados en la peticion
      $ls_Sql.=$this->armarCamposUpdate($this->aa_Campos,$this->aa_Atributos);

      $ls_Sql.="WHERE codigo_nucleo ='".$this->aa_Atributos['codigo']."'";
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
   private function f_ConsultarOrganizacion(){
      $lobj_Entidad = new cls_Organizacion();
      //busco si existe ese rif como organizacion
      $la_Peticion = $this->aa_Atributos;
      $la_Peticion['operacion'] = 'buscar';
      $lobj_Entidad->setPeticion($la_Peticion);
		  $respuesta = $lobj_Entidad->gestionar();
      //si lo consigue lo busco como productor
      if(count($respuesta['registro'])){
         $this->f_Buscar();
      }
   }
}
?>
