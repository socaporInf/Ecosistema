<?php
include_once('../../nucleo/clases/cls_Conexion.php');
include_once('../../nucleo/clases/cls_Mensaje_Sistema.php');
class cls_Inventario extends cls_Conexion{

 private $aa_Atributos = array();

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
     case 'mostrarInventario':
       $lb_Enc=$this->f_MostrarInventario();
       if($lb_Enc){
         $success=1;
         $respuesta['registros']=$this->aa_Atributos['registros'];
         $respuesta['paginas']=$this->aa_Atributos['paginas'];
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
 private function f_MostrarInventario(){
   $zona = "";
   $finca = "";
   if($this->aa_Atributos['zona'] != 'null'){
      $zona = ' where codigo_zona = '.$this->aa_Atributos['zona'];
   }
   if($this->aa_Atributos['finca'] != 'null'){
      $finca = ' and id_finca = '.$this->aa_Atributos['finca'];
   }
   $cadenaBusqueda = $zona.$finca;
   $x=0;
    //varibles paginacion
   $registrosPorPagina = $this->aa_Atributos['registrosporpagina'];
   $paginaActual = $this->aa_Atributos['pagina'] - 1;
   $numero_registros = $this->f_ObtenerNumeroRegistrosTablones($cadenaBusqueda);
   $paginas = $numero_registros / $registrosPorPagina;
   $paginas = ceil($paginas);
   $offset = $paginaActual * $registrosPorPagina;

   $la_respuesta=array();
   $ls_Sql="SELECT * FROM agronomia.vinventario_cultivo $cadenaBusqueda order by codigo_zona,codigo_productor,finca_letra,codigo_lote,codigo_tablon LIMIT $registrosPorPagina OFFSET $offset " ;
   $this->f_Con();
   $lr_tabla=$this->f_Filtro($ls_Sql);
   while($la_registros=$this->f_Arreglo($lr_tabla)){
      //organizacion
      $la_respuesta[$x]['Cañicultor']=$la_registros['nombre_productor'];
      //$la_respuesta[$x]['rif_organizacion']=$la_registros['rif_organizacion'];

      //productor
      //$la_respuesta[$x]['codigo_productor']=$la_registros['codigo_productor'];

      //finca
      $la_respuesta[$x]['Codigo']=$la_registros['finca_letra'];
      //$la_respuesta[$x]['Letra']=$la_registros['letra'];
      $la_respuesta[$x]['Finca']=$la_registros['nombre_finca'];

      //zona
      $la_respuesta[$x]['Codigo Zona']=$la_registros['codigo_zona'];
      $la_respuesta[$x]['Zona']=$la_registros['nombre_zona'];

      //lote
     //$la_respuesta[$x]['id_lote']=$la_registros['id_lote'];
     //$la_respuesta[$x]['codigo_lote']=$la_registros['codigo_lote'];
     $la_respuesta[$x]['Lote']=$la_registros['nombre_lote'];

     //indicador cana diferida
     //$la_respuesta[$x]['codigo_indicador_cana_diferida']=$la_registros['codigo_indicador_cana_diferida'];
     //$la_respuesta[$x]['indicador_cana_diferida']=$la_registros['nombre_indicador_cana_diferida'];

     //tablon
     //$la_respuesta[$x]['id_tablon']=$la_registros['id_tablon'];
     $la_respuesta[$x]['Tablon']=$la_registros['codigo_tablon'];
     $la_respuesta[$x]['Area Cana']=$la_registros['area_cana'];
     $la_respuesta[$x]['Area Semilla']=$la_registros['area_semilla'];
     //$la_respuesta[$x]['fecha_siembra_corte']=$la_registros['fecha_siembra_corte'];
     //$la_respuesta[$x]['fecha_ultimo_arrime']=$la_registros['fecha_ultimo_arrime'];
     $la_respuesta[$x]['Ton Est Hec']=$la_registros['toneladas_estimadas_hectarea'];
     $la_respuesta[$x]['Ton Real']=$la_registros['toneladas_real'];
     $la_respuesta[$x]['Ton Azucar']=$la_registros['toneladas_azucar'];

     //tipo corte
     //$la_respuesta[$x]['codigo_tipo_corte']=$la_registros['codigo_tipo_corte'];
     $la_respuesta[$x]['Tipo Corte']=$la_registros['nombre_tipo_corte'];

     //clase
     //$la_respuesta[$x]['codigo_clase']=$la_registros['codigo_clase'];
     $la_respuesta[$x]['Clase']=$la_registros['nombre_clase'];

     //variedad
     //$la_respuesta[$x]['codigo_variedad']=$la_registros['codigo_variedad'];
     $la_respuesta[$x]['Variedad']=$la_registros['nombre_variedad'];

     $x++;
   }
   $this->f_Cierra($lr_tabla);
   $this->f_Des();
   $this->aa_Atributos['paginas'] = $paginas;
   $this->aa_Atributos['registros'] = $la_respuesta;
   $lb_Enc=($x == 0)?false:true;
   return true;
}
private function f_ObtenerNumeroRegistrosTablones($cadenaBusqueda){
   $ls_Sql="SELECT * FROM agronomia.vinventario_cultivo  $cadenaBusqueda" ;
   $this->f_Con();
   $lr_tabla=$this->f_Filtro($ls_Sql);
   $registros = $this->f_Registro($lr_tabla);
   $this->f_Cierra($lr_tabla);
   $this->f_Des();
   return $registros;
}

}
?>
