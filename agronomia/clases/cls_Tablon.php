<?php
include_once('../../nucleo/clases/cls_Conexion.php');
include_once('../../nucleo/clases/cls_Mensaje_Sistema.php');
class cls_Tablon extends cls_Conexion{

 private $aa_Atributos = array();
 private $aa_Campos = array('id_tablon','codigo_tablon','codigo_lote','codigo_clase','codigo_variedad','codigo_tipo_corte','codigo_indicador_cana_diferida','area_cana','area_semilla','fecha_siembra_corte','fecha_ultimo_arrime','toneladas_estimadas_hectarea','toneladas_real','toneladas_azucar');

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

    case 'buscarHijos':
     $registros=$this->f_BuscarTablonesPorLote();
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
   $ls_Sql="SELECT * FROM agronomia.vtablon ";
   $this->f_Con();
   $lr_tabla=$this->f_Filtro($ls_Sql);
   while($la_registros=$this->f_Arreglo($lr_tabla)){
     $la_respuesta[$x]['codigo']=$la_registros['id_tablon'];
     $la_respuesta[$x]['nombre_completo']=$la_registros['codigo_tablon'];
     $x++;
   }
   $this->f_Cierra($lr_tabla);
   $this->f_Des();
   return $la_respuesta;
 }
 private function f_BuscarTablonesPorLote(){
   $x=0;
   $la_respuesta=array();
   $ls_Sql="SELECT * FROM agronomia.vtablon  WHERE id_lote = ".$this->aa_Atributos['id_lote'];
   $this->f_Con();
   $lr_tabla=$this->f_Filtro($ls_Sql);
   while($la_registros=$this->f_Arreglo($lr_tabla)){
     $la_respuesta[$x]['codigo']=$la_registros['id_tablon'];
     $la_respuesta[$x]['id_tablon']=$la_registros['id_tablon'];
     $la_respuesta[$x]['codigo_tablon']=$la_registros['codigo_tablon'];
     $la_respuesta[$x]['id_lote']=$la_registros['id_lote'];
     $la_respuesta[$x]['codigo_lote']=$la_registros['codigo_lote'];
     $la_respuesta[$x]['nombre_lote']=$la_registros['nombre_lote'];
     $la_respuesta[$x]['codigo_tipo_corte']=$la_registros['codigo_tipo_corte'];
     $la_respuesta[$x]['tipo_corte']=$la_registros['nombre_tipo_corte'];
     $la_respuesta[$x]['codigo_clase']=$la_registros['codigo_clase'];
     $la_respuesta[$x]['nombre_clase']=$la_registros['nombre_clase'];
     $la_respuesta[$x]['codigo_variedad']=$la_registros['codigo_variedad'];
     $la_respuesta[$x]['nombre_variedad']=$la_registros['nombre_variedad'];
     $la_respuesta[$x]['codigo_indicador_cana_diferida']=$la_registros['codigo_indicador_cana_diferida'];
     $la_respuesta[$x]['indicador_cana_diferida']=$la_registros['nombre_indicador_cana_diferida'];
     $la_respuesta[$x]['area_cana']=$la_registros['area_cana'];
     $la_respuesta[$x]['area_semilla']=$la_registros['area_semilla'];
     $la_respuesta[$x]['fecha_siembra_corte']=$la_registros['fecha_siembra_corte'];
     $la_respuesta[$x]['fecha_ultimo_arrime']=$la_registros['fecha_ultimo_arrime'];
     $la_respuesta[$x]['toneladas_estimadas_hectarea']=$la_registros['toneladas_estimadas_hectarea'];
     $la_respuesta[$x]['toneladas_real']=$la_registros['toneladas_real'];
     $la_respuesta[$x]['toneladas_azucar']=$la_registros['toneladas_azucar'];
     $x++;
   }
   $this->f_Cierra($lr_tabla);
   $this->f_Des();
   return $la_respuesta;
}
private function f_Buscar(){
  $lb_Enc = false;
  $la_respuesta=array();
  $ls_Sql="SELECT * FROM agronomia.vfinca where id_finca = '".$this->aa_Atributos['codigo']."'";
  $this->f_Con();
  $lr_tabla=$this->f_Filtro($ls_Sql);
  if($la_registros=$this->f_Arreglo($lr_tabla)){
     $la_respuesta['codigo']=$la_registros['id_tablon'];
     $la_respuesta['nombre']=$la_registros['codigo_tablon'];
     $la_respuesta['id_tablon']=$la_registros['id_tablon'];
     $la_respuesta['codigo_tablon']=$la_registros['codigo_tablon'];
     $la_respuesta['id_lote']=$la_registros['id_lote'];
     $la_respuesta['codigo_lote']=$la_registros['codigo_lote'];
     $la_respuesta['nombre_lote']=$la_registros['nombre_lote'];
     $la_respuesta['codigo_tipo_corte']=$la_registros['codigo_tipo_corte'];
     $la_respuesta['tipo_corte']=$la_registros['nombre_tipo_corte'];
     $la_respuesta['codigo_clase']=$la_registros['codigo_clase'];
     $la_respuesta['nombre_clase']=$la_registros['nombre_clase'];
     $la_respuesta['codigo_variedad']=$la_registros['codigo_variedad'];
     $la_respuesta['nombre_variedad']=$la_registros['nombre_variedad'];
     $la_respuesta['codigo_indicador_cana_diferida']=$la_registros['codigo_indicador_cana_diferida'];
     $la_respuesta['indicador_cana_diferida']=$la_registros['nombre_indicador_cana_diferida'];
     $la_respuesta['area_cana']=$la_registros['area_cana'];
     $la_respuesta['area_semilla']=$la_registros['area_semilla'];
     $la_respuesta['fecha_siembra_corte']=$la_registros['fecha_siembra_corte'];
     $la_respuesta['fecha_ultimo_arrime']=$la_registros['fecha_ultimo_arrime'];
     $la_respuesta['toneladas_estimadas_hectarea']=$la_registros['toneladas_estimadas_hectarea'];
     $la_respuesta['toneladas_real']=$la_registros['toneladas_real'];
     $la_respuesta['toneladas_azucar']=$la_registros['toneladas_azucar'];
    $lb_Enc = true;
  }
  $this->f_Cierra($lr_tabla);
  $this->f_Des();
  if($lb_Enc){
     $this->aa_Atributos['registro'] = $la_respuesta;
  }
  return $lb_Enc;
}
 private function f_Guardar(){
    $lb_Hecho=false;
    if($this->aa_Atributos['fecha_ultimo_arrime']=='null'){
      $this->aa_Atributos['fecha_ultimo_arrime'] = date('d/m/Y');
    }
    if($this->aa_Atributos['fecha_siembra_corte']=='null'){
      $this->aa_Atributos['fecha_siembra_corte'] = date('d/m/Y');
    }
    $ls_Sql="INSERT INTO agronomia.vtablon
        (codigo_tablon,id_lote,codigo_clase,codigo_variedad,codigo_tipo_corte
       ,codigo_indicador_cana_diferida,area_cana,area_semilla,fecha_siembra_corte,fecha_ultimo_arrime,
       toneladas_estimadas_hectarea,toneladas_real,toneladas_azucar) values
       ('".$this->aa_Atributos['codigo_tablon']."','".$this->aa_Atributos['id_lote']."',
       '".$this->aa_Atributos['codigo_clase']."','".$this->aa_Atributos['codigo_variedad']."',
       '".$this->aa_Atributos['codigo_tipo_corte']."','".$this->aa_Atributos['codigo_indicador_cana_diferida']."',
       '".$this->aa_Atributos['area_cana']."','".$this->aa_Atributos['area_semilla']."',
       '".$this->aa_Atributos['fecha_siembra_corte']."','".$this->aa_Atributos['fecha_ultimo_arrime']."',
       ".$this->aa_Atributos['toneladas_estimadas_hectarea'].",".$this->aa_Atributos['toneladas_real'].",
       ".$this->aa_Atributos['toneladas_azucar'].")";
    $this->f_Con();
    $lb_Hecho=$this->f_Ejecutar($ls_Sql);
    $this->f_Des();
    return $lb_Hecho;
 }
 private function f_Modificar(){
   $lb_Hecho=false;
   $contCampos = 0;
   $ls_Sql="UPDATE agronomia.vtablon SET ";

   //arma la cadena sql en base a los campos pasados en la peticion
   $ls_Sql.=$this->armarCamposUpdate($this->aa_Campos,$this->aa_Atributos);

   $ls_Sql.="WHERE id_tablon ='".$this->aa_Atributos['id_tablon']."'";
   $this->f_Con();
   $lb_Hecho=$this->f_Ejecutar($ls_Sql);
   $this->f_Des();


   if($lb_Hecho){
     $this->aa_Atributos['codigo'] = $this->aa_Atributos['id_tablon'];
     $this->f_Buscar();
     $respuesta['registro'] = $this->aa_Atributos['registro'];
     $respuesta['success'] = 1;
   }
   return $respuesta;
 }
}
?>
