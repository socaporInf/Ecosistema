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

       case 'mostrarFincas':
        $lb_Enc=$this->f_MostrarFincas();
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
      $cadenaBusqueda = $this->f_obtenerCadenaBusqueda('inventario');
      $ls_SqlBase = "SELECT * FROM agronomia.vinventario_cultivo $cadenaBusqueda";
      $orden = "order by codigo_zona,codigo_productor,finca_letra,codigo_lote,codigo_tablon";
      $ls_Sql = $this->f_ArmarPaginacion($ls_SqlBase,$orden);

      $x=0;
      $la_respuesta=array();
      $this->f_Con();
      $lr_tabla=$this->f_Filtro($ls_Sql);
      while($la_registros=$this->f_Arreglo($lr_tabla)){
         $la_respuesta[$x] = $this->f_RecolectarInventario($la_registros);
         $x++;
      }
      $this->f_Cierra($lr_tabla);
      $this->f_Des();
      $this->aa_Atributos['registros'] = $la_respuesta;
      $lb_Enc=($x == 0)?false:true;
      return true;
   }
   private function f_RecolectarInventario($la_registros){
      //organizacion
         $la_respuesta['Cañicultor']=$la_registros['nombre_productor'];
      //finca
         $la_respuesta['Codigo']=$la_registros['finca_letra'];
         $la_respuesta['Finca']=$la_registros['nombre_finca'];
      //zona
         $la_respuesta['Codigo Zona']=$la_registros['codigo_zona'];
         $la_respuesta['Zona']=$la_registros['nombre_zona'];
      //lote
        $la_respuesta['Lote']=$la_registros['nombre_lote'];
     //tablon
        $la_respuesta['Tablon']=$la_registros['codigo_tablon'];
        $la_respuesta['Area Cana']=$la_registros['area_cana'];
        $la_respuesta['Area Semilla']=$la_registros['area_semilla'];
        $la_respuesta['Ton Est Hec']=$la_registros['toneladas_estimadas_hectarea'];
        $la_respuesta['Ton Real']=$la_registros['toneladas_real'];
        $la_respuesta['Ton Azucar']=$la_registros['toneladas_azucar'];
     //tipo corte
        $la_respuesta['Tipo Corte']=$la_registros['nombre_tipo_corte'];
     //clase
        $la_respuesta['Clase']=$la_registros['nombre_clase'];
     //variedad
        $la_respuesta['Variedad']=$la_registros['nombre_variedad'];
     return $la_respuesta;
   }
   private function f_MostrarFincas(){
      $cadenaBusqueda = $this->f_obtenerCadenaBusqueda('fincas');
      $ls_SqlBase = "SELECT * FROM agronomia.vinventario_fincas $cadenaBusqueda";
      $orden = "order by codigo_zona,id_finca";
      $ls_Sql = $this->f_ArmarPaginacion($ls_SqlBase,$orden);

      $x=0;
      $la_respuesta=array();
      $this->f_Con();
      $lr_tabla=$this->f_Filtro($ls_Sql);
      while($la_registros=$this->f_Arreglo($lr_tabla)){
         $la_respuesta[$x] = $this->f_RecolectarFincas($la_registros);
         $x++;
      }
      $this->f_Cierra($lr_tabla);
      $this->f_Des();
      $this->aa_Atributos['registros'] = $la_respuesta;
      $lb_Enc=($x == 0)?false:true;
      return true;
   }
   private function f_RecolectarFincas($la_registros){
      //organizacion
         $la_respuesta['Cañicultor']=$la_registros['nombre_productor'];
      //finca
         $la_respuesta['Codigo']=$la_registros['finca_letra'];
         $la_respuesta['Finca']=$la_registros['nombre_finca'];
      //zona
         $la_respuesta['Codigo Zona']=$la_registros['codigo_zona'];
         $la_respuesta['Zona']=$la_registros['nombre_zona'];
      //Tablon
         $la_respuesta['Area Cana']=$la_registros['area_cana'];
         $la_respuesta['Area Semilla']=$la_registros['area_semilla'];
         $la_respuesta['Ton Est Hec']=$la_registros['toneladas_estimadas_hectarea'];
      return $la_respuesta;
   }

   private function f_ArmarPaginacion($ls_SqlBase,$orden){
      //varibles paginacion
     $registrosPorPagina = $this->aa_Atributos['registrosporpagina'];
     $paginaActual = $this->aa_Atributos['pagina'] - 1;
     $numero_registros = $this->f_ObtenerNumeroRegistros($ls_SqlBase);
     $paginas = $numero_registros / $registrosPorPagina;
     $paginas = ceil($paginas);
     $offset = $paginaActual * $registrosPorPagina;

     $ls_Sql= $ls_SqlBase.$orden." LIMIT $registrosPorPagina OFFSET $offset " ;

     $this->aa_Atributos['paginas'] = $paginas;

     return $ls_Sql;
   }
   private function f_ObtenerNumeroRegistros($ls_Sql){
     $this->f_Con();
     $lr_tabla=$this->f_Filtro($ls_Sql);
     $registros = $this->f_Registro($lr_tabla);
     $this->f_Cierra($lr_tabla);
     $this->f_Des();
     return $registros;
   }
   private function f_obtenerCadenaBusqueda($tipo){
     $cadenaBusqueda = '';
     if($this->aa_Atributos['valor']!=''){
        $cadenaBusqueda.="where finca_letra like '%".$this->aa_Atributos['valor']."%'";
     }
     $zona = "";
     $finca = "";
     if($this->aa_Atributos['zona'] != 'null'){
        if(count($cadenaBusqueda) != 1){
           $zona = 'and';
        }
        $zona .= ' codigo_zona = '.$this->aa_Atributos['zona'];
     }
     if($this->aa_Atributos['finca'] != 'null'){
        $finca = ' and id_finca = '.$this->aa_Atributos['finca'];
     }
     return $cadenaBusqueda.$zona.$finca;
   }
}
?>
