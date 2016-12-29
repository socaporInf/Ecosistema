<?php
include_once('../../nucleo/clases/cls_Conexion.php');
include_once('../../nucleo/clases/cls_Mensaje_Sistema.php');
include_once('cls_DiaZafra.php');
class cls_ValidarCorreo extends cls_Conexion{

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
         case 'buscarDia':
          $lb_Enc=$this->f_MostrarDias();
          if($lb_Enc){
            $success=1;
            $respuesta['registros']=$this->aa_Atributos['registros'];
          }else{
            $respuesta['success'] = 0;
            $respuesta['mensaje'] = $lobj_Mensaje->buscarMensaje(8);
          }
          break;
        case 'mostrarDatos':
          $lb_Enc=$this->f_MostrarDatos('todos');
          if($lb_Enc){
            $success=1;
            $respuesta['registros']=$this->aa_Atributos['registros'];
            $respuesta['paginas']=$this->aa_Atributos['paginas'];
          }else{
            $respuesta['success'] = 0;
            $respuesta['mensaje'] = $lobj_Mensaje->buscarMensaje(8);
          }
          break;

       case 'mostrarDatosDia':
        $lb_Enc=$this->f_MostrarDatos('dia');
        if($lb_Enc){
          $success=1;
          $respuesta['registros']=$this->aa_Atributos['registros'];
          $respuesta['paginas']=$this->aa_Atributos['paginas'];
        }else{
          $respuesta['success'] = 0;
          $respuesta['mensaje'] = $lobj_Mensaje->buscarMensaje(8);
        }
        break;

       case 'validarDatos':
         $lb_Hecho= false;
         $this->f_Con();
         $lb_Hecho = $this->procesarDatos();
         $lobj_DiaZafra = new cls_DiaZafra;
         if($lb_Hecho){
            $this->f_Commit();
            $success = 1;
            $valores = array('{FECHADIA}' => $this->fFechaBD($this->aa_Atributos['fechadia']));
            $respuesta['mensaje'] = $lobj_Mensaje->completarMensaje(25,$valores);
            //proceso dia "ARRIME VS CAMPO"
            //estado datos "IMPORTADOS"
            $pet = array(
               'operacion' => 'cambioAtributos',
               'codigo_proceso_dia' => 3,
               'codigo_estado_datos' => 36
            );
         }else{
            $this->f_RollBack();
            $valores = array('{FECHADIA}' => $this->fFechaBD($this->aa_Atributos['fechadia']));
            $respuesta['mensaje'] = $lobj_Mensaje->completarMensaje(26,$valores);
            //estado datos "ERROR EN IMPORTACION"
            $pet = array(
               'operacion' => 'cambioAtributos',
               'codigo_estado_datos' => 38
            );
         }
         $this->f_Des();
         $pet['fecha_dia'] = $this->aa_Atributos['fechadia'];
         $lobj_DiaZafra->setPeticion($pet);
         $lobj_DiaZafra->gestionar();
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
   private function procesarDatos(){
      $lb_Hecho= false;
      $lb_Hecho = $this->insertarValidacion('capca');
      if(!$lb_Hecho){
         return false;
      }
      $lb_Hecho = false;
      $lb_Hecho = $this->insertarvalidacion('soca');
      if(!$lb_Hecho){
         return false;
      }
      $lb_Hecho = false;
      $lb_Hecho = $this->cambiarEstado();
      return $lb_Hecho;
   }
   private function insertarValidacion($tipo){
      $lb_Hecho = false;
      $fechadia = $this->aa_Atributos['fechadia'];
      $UID = $this->aa_Atributos['uid'];
      $ls_Sql = "INSERT INTO agronomia.vvalidacion_$tipo
         (fechadia,
         ejercicio,
         codcanicultor,
         letrafinca,
         nombrefinca,
         codigotablon,
         codigonucleoalce,
         codigonucleocorte,
         codigonucleotrans,
         pesoneto,
         brix,
         pol,
         torta,
         rendimiento,
         azucarprobable,
         placacamion,
         pureza,
         dia,
         finca,
         distribucion,
         validarpeso,
         numeroremesa,
         boletoromana,
         boletolaboratorio)
         SELECT
             fechadia,
             ejercicio,
             codcanicultor,
             letrafinca,
             nombrefinca,
             codigotablon,
             codigonucleoalce,
             codigonucleocorte,
             codigonucleotrans,
             pesoneto,
             brix,
             pol,
             torta,
             rendimiento,
             azucarprobable,
             placacamion,
             pureza,
             dia,
             finca,
             distribucion,
             validarpeso,
             numeroremesa,
             boletoromana,
             boletolaboratorio
         FROM agronomia.vvalidacion_correo WHERE fechadia = '$fechadia' AND uid = $UID ";
      $lb_Hecho = $this->f_Ejecutar($ls_Sql);
      return $lb_Hecho;
   }
   private function cambiarEstado(){
      $lb_Hecho = false;
      $fechadia = $this->aa_Atributos['fechadia'];
      $UID = $this->aa_Atributos['uid'];
      $ls_Sql = "UPDATE agronomia.vvalidacion_correo SET estado ='V' WHERE fechadia = '$fechadia' AND uid = $UID ";
      $lb_Hecho = $this->f_Ejecutar($ls_Sql);
      return $lb_Hecho;
   }
   private function f_MostrarDias(){
      $cadenaBusqueda = $this->f_obtenerCadenaBusqueda('dia');

      $ls_SqlBase = "SELECT fechadia, uid,estado FROM agronomia.vvalidacion_correo $cadenaBusqueda";
      $orden = "order by fechadia desc";
      $group = ' Group by fechadia,uid,estado';
      $ls_Sql = $this->f_ArmarPaginacion($ls_SqlBase,$orden,$group);
      $x=0;
      $la_respuesta=array();
      $this->f_Con();
      $lr_tabla=$this->f_Filtro($ls_Sql);
      while($la_registros=$this->f_Arreglo($lr_tabla)){
         $la_respuesta[$x] = $this->f_RecolectarDias($la_registros);
         $x++;
      }
      $this->f_Cierra($lr_tabla);
      $this->f_Des();
      $this->aa_Atributos['registros'] = $la_respuesta;
      $lb_Enc=($x == 0)?false:true;
      return true;
   }
   private function f_MostrarDatos($tipo){
      $cadenaBusqueda = $this->f_obtenerCadenaBusqueda('datosDia');
      $ls_SqlBase = "SELECT * FROM agronomia.vvalidacion_correo $cadenaBusqueda";
      $orden = "order by fechadia,codcanicultor,letrafinca,codigotablon,uid";
      $ls_Sql = $this->f_ArmarPaginacion($ls_SqlBase,$orden);
      $x=0;
      $la_respuesta=array();
      $this->f_Con();
      $lr_tabla=$this->f_Filtro($ls_Sql);
      while($la_registros=$this->f_Arreglo($lr_tabla)){
         $la_respuesta[$x] = $this->f_RecolectarDatos($la_registros);
         $x++;
      }
      $this->f_Cierra($lr_tabla);
      $this->f_Des();
      $this->aa_Atributos['registros'] = $la_respuesta;
      $lb_Enc=($x == 0)?false:true;
      return true;
   }
   private function f_RecolectarDatos($la_registros){
      $la_respuesta['fechadia']=$this->fFechaBD($la_registros['fechadia']);
      $la_respuesta['canicultor']=$la_registros['codcanicultor'];
      $la_respuesta['letra']=$la_registros['letrafinca'];
      $la_respuesta['nombrefinca']=$la_registros['nombrefinca'];
      $la_respuesta['remesa']=$la_registros['numeroremesa'];
      $la_respuesta['boletoromana']=$la_registros['boletoromana'];
      $la_respuesta['alce']=$la_registros['codigonucleoalce'];
      $la_respuesta['corte']=$la_registros['codigonucleocorte'];
      $la_respuesta['trans']=$la_registros['codigonucleotrans'];
      $la_respuesta['tablon']=$la_registros['codigotablon'];
      $la_respuesta['pesoneto']=$la_registros['pesoneto'];
      $la_respuesta['boletolaboratorio']=$la_registros['boletolaboratorio'];
      $la_respuesta['brix']=$la_registros['brix'];
      $la_respuesta['pol']=$la_registros['pol'];
      $la_respuesta['torta']=$la_registros['torta'];
      $la_respuesta['rendimiento']=$la_registros['rendimiento'];
      $la_respuesta['azucar']=$la_registros['azucarprobable'];
      $la_respuesta['placacamion']=$la_registros['placacamion'];
      $la_respuesta['pureza']=$la_registros['pureza'];
      $la_respuesta['dia']=$la_registros['dia'];
      $la_respuesta['finca']=$la_registros['finca'];
      $la_respuesta['distribucion']=$la_registros['distribucion'];
      $la_respuesta['validarpeso']=$la_registros['validarpeso'];
      $la_respuesta['codigo']=$la_registros['boletoromana'];
      $la_respuesta['estado']=$la_registros['estado'];
      return $la_respuesta;
   }

   private function f_RecolectarDias($la_registros){
      //dia
         $la_respuesta['nombre']=$this->fFechaBD($la_registros['fechadia']);
      //UID
         $la_respuesta['UID']=$la_registros['uid'];
      //estado
         $la_respuesta['estado']=$la_registros['estado'];

         $la_respuesta['codigo']=$la_registros['fechadia'];
     return $la_respuesta;
   }

   private function f_obtenerCadenaBusqueda($tipo){
     $cadenaBusqueda = '';
     if($tipo != 'dia'){
        $cadenaBusqueda = "where fechadia = '".$this->aa_Atributos['fechadia']."' ";
        if($this->aa_Atributos['valor']!=''){
           $cadenaBusqueda .= " and finca like '%".$this->aa_Atributos['valor']."%'";
        }else{
           $cadenaBusqueda .= '';
        }
     }else{
        if($this->aa_Atributos['valor']!=''){
           $cadenaBusqueda .= "where fechadia::text like '%".$this->fFechaPHP($this->aa_Atributos['valor'])."%' and fechadia between (select fecha_inicio from agronomia.vzafra where estado = 'A') and (select fecha_final from agronomia.vzafra where estado = 'A')";
        }else{
           $cadenaBusqueda .= '';
        }
     }
     return $cadenaBusqueda;
   }
}
?>
