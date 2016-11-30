<?php
include_once('../../nucleo/clases/cls_Conexion.php');
include_once('../../nucleo/clases/cls_Mensaje_Sistema.php');
include_once('cls_Carga_Validacion.php');
include_once('../../seguridad/clases/cls_Proceso.php');
class cls_DiaZafra extends cls_Conexion{

 protected $aa_Atributos = array();
 private $aa_Campos = array('numero','estado_dia_zafra','fecha_dia','codigo_tipo_carga','codigo_proceso_dia','codigo_estado_datos');
 private $aa_Reportes = array('toneladasPorZona','AzucarPorZona','TimeLineZafra');
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

    case 'estadoDia':
       $lb_Enc=$this->f_buscar();
       if($lb_Enc){
         $respuesta['registro']=$this->aa_Atributos['registro'];
         $success=1;
      }else{
         $success = 0;
      }
      break;

    case 'buscarActivo':
      $lb_Enc=$this->f_buscar('activo');
      if($lb_Enc){
        $respuesta['registro']=$this->aa_Atributos['registro'];
        $success=1;
      }
      break;

    case 'buscarUltimoConDatos':
      $lb_Enc=$this->f_buscar('ultimoConDatos');
      if($lb_Enc){
        $respuesta['registro']=$this->aa_Atributos['registro'];
        $success=1;
      }
      break;

    case 'guardar':
       $lb_Hecho=$this->f_Guardar();
       if($lb_Hecho){
         $this->f_Buscar('ultimo');
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

    case 'cambioAtributos':
      if(isset($this->aa_Atributos['codigo'])){
         $respuesta = $this->f_CambioAtributo();
      }else if(isset($this->aa_Atributos['fecha_dia'])){
         $respuesta = $this->f_CambioAtributo('porFecha');
      }else {
         $respuesta = $this->f_CambioAtributo('activo');
      }
      break;

    case 'abrirDia':
      $this->aa_Atributos['estado_dia_zafra'] = 'A';
      $respuesta = $this->f_CambioAtributo();
      break;

   case 'cerrarDia':
     $lb_Enc = $this->f_Buscar('activo');
     if($lb_Enc){
       $lb_Enc = $this->f_Buscar('siguiente');
       if(!$lb_Enc){
          $lb_Hecho = $this->CrearDiaSigueinte();
          if($lb_Hecho){
            $this->aa_Atributos['estado_dia_zafra'] = 'C';
            $respuesta = $this->f_CambioAtributo();
         }else{
            $respuesta['success'] = 0;
            $respuesta['mensaje'] = $lobj_Mensaje->buscarMensaje(29);
         }
       }else{
          //si lo consigue no lo crea
          $this->aa_Atributos['estado_dia_zafra'] = 'C';
          $respuesta = $this->f_CambioAtributo();
       }
     }else{
        $respuesta['success'] = 0;
     }
     break;

    case 'buscarDiasZafraActiva':
       $registros=$this->f_buscarDiasZafraActiva();
       if(count($registros)!=0){
         $success=1;
         $respuesta['registros']=$registros;
       }else{
         $respuesta['success'] = 0;
         //$respuesta['mensaje'] = $lobj_Mensaje->buscarMensaje(8);
       }
     break;

     case 'buscarListadoCorreo':
      $lobj_Carga = new cls_Carga_Validacion;
      $lobj_Carga->setPeticion(array(
          'operacion' => 'buscarListaCorreo',
          'dia' => $this->aa_Atributos['codigo']
      ));
      $respuesta = $lobj_Carga->gestionar();
      $lb_Enc=$this->f_buscar();
      if($lb_Enc){
         $success = 1;
         $respuesta['registro']=$this->aa_Atributos['registro'];
      }
      break;

    case 'buscarDatosReporte':
      if($this->aa_Atributos['tipo'] == 'todos'){
        //revisar arreglo de reportes disponibles al inicio de la clase
        for ($i=0; $i < count($this->aa_Reportes) ; $i++) {
          $datos = $this->buscarDatosReporte($this->aa_Reportes[$i]);
          if(count($datos)!=0){
            $respuesta['success'] = 1;
            $respuesta['reportes'][$this->aa_Reportes[$i]]['success'] = 1;
            $respuesta['reportes'][$this->aa_Reportes[$i]]['datos'] = $datos;
          }else{
            $respuesta['success'] = 0;
            $respuesta['reportes'][$this->aa_Reportes[$i]]['success'] = 0;
            $respuesta['reportes'][$this->aa_Reportes[$i]]['mensaje'] = 'Sin Datos';
          }
        }
      }else{
        $datos = $this->buscarDatosReporte($this->aa_Atributos['tipo']);
        if(count($datos)!=0){
          $respuesta['success'] = 1;
          $respuesta['datos'] = $datos;
        }else{
          $respuesta['success'] = 0;
          $respuesta['mensaje'] = 'Sin Datos';
        }
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
   $la_respuesta=array();
   $ls_Sql="SELECT * FROM agronomia.vdia_zafra where codigo_zafra =".$this->aa_Atributos['codigo'];
   $this->f_Con();
   $lr_tabla=$this->f_Filtro($ls_Sql);
   while($la_registros=$this->f_Arreglo($lr_tabla)){
     $la_respuesta[$x]['codigo']=$la_registros['codigo_dia_zafra'];
     $la_respuesta[$x]['numero']=$la_registros['numero'];
     $la_respuesta[$x]['estado']=$la_registros['estado_dia_zafra'];
     $la_respuesta[$x]['fecha_dia']=$la_registros['fecha_dia'];
     $la_respuesta[$x]['codigo_zafra']=$la_registros['codigo_zafra'];
     $la_respuesta[$x]['nombre_zafra']=$la_registros['nombre_zafra'];
     $la_respuesta[$x]['estado_zafra']=$la_registros['estado_zafra'];
     $la_respuesta[$x]['codigo_proceso_dia']=$la_registros['codigo_proceso_dia'];
     $la_respuesta[$x]['nombre_proceso_dia']=$la_registros['nombre_proceso_dia'];
     $la_respuesta[$x]['color_proceso_dia']=$la_registros['color_proceso_dia'];
     $la_respuesta[$x]['secuencia_proceso_dia']=$la_registros['secuencia_proceso_dia'];
     $la_respuesta[$x]['avance_dia']=$la_registros['avance_dia'];
     $la_respuesta[$x]['codigo_tipo_carga']=$la_registros['codigo_tipo_carga'];
     $la_respuesta[$x]['nombre_tipo_carga']=$la_registros['nombre_tipo_carga'];
     $la_respuesta[$x]['codigo_estado_datos']=$la_registros['codigo_estado_datos'];
     $la_respuesta[$x]['nombre_estado_datos']=$la_registros['nombre_estado_datos'];
     $la_respuesta[$x]['fechadia']=$this->fFechaBD($la_registros['fecha_dia']);
     $x++;
   }
   $this->f_Cierra($lr_tabla);
   $this->f_Des();
   return $la_respuesta;
 }
 private function f_buscarDiasZafraActiva(){
   $x=0;
   $la_respuesta=array();
   $ls_Sql="SELECT * FROM agronomia.vdia_zafra where codigo_zafra =(SELECT codigo_zafra FROM agronomia.vzafra where estado = 'A') order by fecha_dia desc";
   $this->f_Con();
   $lr_tabla=$this->f_Filtro($ls_Sql);
   while($la_registros=$this->f_Arreglo($lr_tabla)){
     $la_respuesta[$x]['codigo']=$la_registros['codigo_dia_zafra'];
     $la_respuesta[$x]['numero']=$la_registros['numero'];
     $la_respuesta[$x]['estado']=$la_registros['estado_dia_zafra'];
     $la_respuesta[$x]['fecha_dia']=$la_registros['fecha_dia'];
     $la_respuesta[$x]['fechadia']=$this->fFechaBD($la_registros['fecha_dia']);
     $la_respuesta[$x]['codigo_zafra']=$la_registros['codigo_zafra'];
     $la_respuesta[$x]['nombre_zafra']=$la_registros['nombre_zafra'];
     $la_respuesta[$x]['estado_zafra']=$la_registros['estado_zafra'];
     $la_respuesta[$x]['codigo_proceso_dia']=$la_registros['codigo_proceso_dia'];
     $la_respuesta[$x]['nombre_proceso_dia']=$la_registros['nombre_proceso_dia'];
     $la_respuesta[$x]['color_proceso_dia']=$la_registros['color_proceso_dia'];
     $la_respuesta[$x]['secuencia_proceso_dia']=$la_registros['secuencia_proceso_dia'];
     $la_respuesta[$x]['avance_dia']=$la_registros['avance_dia'];
     $la_respuesta[$x]['codigo_tipo_carga']=$la_registros['codigo_tipo_carga'];
     $la_respuesta[$x]['nombre_tipo_carga']=$la_registros['nombre_tipo_carga'];
     $la_respuesta[$x]['codigo_estado_datos']=$la_registros['codigo_estado_datos'];
     $la_respuesta[$x]['nombre_estado_datos']=$la_registros['nombre_estado_datos'];
     $x++;
   }
   $this->f_Cierra($lr_tabla);
   $this->f_Des();
   for ($i=0; $i < count($la_respuesta) ; $i++) {
      $la_respuesta[$i] = $this->f_RevisarDiferencias($la_respuesta[$i]);
   }
   $this->f_RevisarDiferencias($la_respuesta);
   return $la_respuesta;
 }
 private function f_RevisarDiferencias($dia){
    $fecha_dia = $dia['fecha_dia'];
    //proceso_dia_zafra => secuencia > 3, nombre > arrime vs campo
    if($dia['secuencia_proceso_dia'] == 3){
      $ls_Sql="SELECT
                (SELECT sum(pesoneto) peso  from agronomia.vvalidacion_soca where fechadia = '$fecha_dia') -
                (SELECT sum(pesoneto) peso  from agronomia.vvalidacion_soca_relacionado where fechadia = '$fecha_dia')
                as diferencia;";
      $this->f_Con();
      $lr_tabla=$this->f_Filtro($ls_Sql);
      if($la_registros=$this->f_Arreglo($lr_tabla)){
        $dia['diferencia']=$la_registros['diferencia'];
        $lb_Enc=true;
      }
      $this->f_Cierra($lr_tabla);
      $this->f_Des();
    }
    return $dia;
}
 private function f_Buscar($tipo){
   $lb_Enc=false;
   //Busco
   if($tipo == 'ultimoConDatos'){
      //ARRIME VS CAMPO = 3
      $ls_Sql="SELECT * from agronomia.vdia_zafra WHERE codigo_dia_zafra = (
                SELECT codigo_dia_zafra from agronomia.vdia_zafra where numero = (
                  SELECT MAX(numero) from agronomia.vdia_zafra where
                  secuencia_proceso_dia = 3 and
                  codigo_zafra = (
                    SELECT codigo_zafra from agronomia.vzafra WHERE estado_zafra = 'A'
                  )
                )
              )";
   }else if($tipo == 'activo'){
      $ls_Sql="SELECT * from agronomia.vdia_zafra WHERE codigo_dia_zafra = (SELECT codigo_dia_zafra from agronomia.vdia_zafra WHERE estado_dia_zafra = 'A') ";
   }else if($tipo == 'siguiente'){
      $ls_Sql="SELECT * FROM agronomia.vdia_zafra
                  where numero=(SELECT numero + 1 from agronomia.vdia_zafra WHERE estado_dia_zafra = 'A')
                  and codigo_zafra =(
                    SELECT codigo_zafra from agronomia.vdia_zafra WHERE estado_dia_zafra = 'A'
                    and codigo_zafra =(SELECT codigo_zafra from agronomia.vzafra WHERE estado_zafra = 'A'))";
   }else if($tipo == 'ultimo'){
      $ls_Sql="SELECT * from agronomia.vdia_zafra WHERE codigo_dia_zafra = (SELECT max(codigo_dia_zafra) from agronomia.vdia_zafra) ";
   }else if($tipo === 'porFecha'){
      $fecha_dia = $this->aa_Atributos['fecha_dia'];
      $ls_Sql="SELECT * FROM agronomia.vdia_zafra where fecha_dia = '$fecha_dia'
               and codigo_zafra =(SELECT codigo_zafra from agronomia.vzafra WHERE estado_zafra = 'A')";
   }else {
      $ls_Sql="SELECT * FROM agronomia.vdia_zafra where codigo_dia_zafra='".$this->aa_Atributos['codigo']."'";
   }
   $this->f_Con();
   $lr_tabla=$this->f_Filtro($ls_Sql);
   if($la_registros=$this->f_Arreglo($lr_tabla)){
     $la_respuesta['codigo']=$la_registros['codigo_dia_zafra'];
     $la_respuesta['numero']=$la_registros['numero'];
     $la_respuesta['estado']=$la_registros['estado_dia_zafra'];
     $la_respuesta['fecha_dia']=$la_registros['fecha_dia'];
     $la_respuesta['codigo_zafra']=$la_registros['codigo_zafra'];
     $la_respuesta['nombre_zafra']=$la_registros['nombre_zafra'];
     $la_respuesta['estado_zafra']=$la_registros['estado_zafra'];
     $la_respuesta['codigo_proceso_dia']=$la_registros['codigo_proceso_dia'];
     $la_respuesta['nombre_proceso_dia']=$la_registros['nombre_proceso_dia'];
     $la_respuesta['color_proceso_dia']=$la_registros['color_proceso_dia'];
     $la_respuesta['secuencia_proceso_dia']=$la_registros['secuencia_proceso_dia'];
     $la_respuesta['avance_dia']=$la_registros['avance_dia'];
     $la_respuesta['codigo_tipo_carga']=$la_registros['codigo_tipo_carga'];
     $la_respuesta['nombre_tipo_carga']=$la_registros['nombre_tipo_carga'];
     $la_respuesta['codigo_estado_datos']=$la_registros['codigo_estado_datos'];
     $la_respuesta['nombre_estado_datos']=$la_registros['nombre_estado_datos'];
     $la_respuesta['fechadia']=$this->fFechaBD($la_registros['fecha_dia']);
     $lb_Enc=true;
   }
   $this->f_Cierra($lr_tabla);
   $this->f_Des();

   if($lb_Enc){
     //guardo en atributo de la clase
     $this->aa_Atributos['registro']=$this->f_RevisarDiferencias($la_respuesta);
   }
   return $lb_Enc;
 }

 private function f_Guardar(){
   $lb_Hecho=false;
   //valores por defecto en la base de datos
   //Armo la peticion
   $peticion = Array(
         'operacion'=>'buscarParametros',
         'nombre'=>'CREACION DIA ZAFRA'
      );
   //incluyo e instancio
   $lobj_Proceso = new cls_Proceso();
   //seteo la peticion
   $lobj_Proceso->setPeticion($peticion);
   //gestiono y obtengo el resultado
   $parametros = $lobj_Proceso->gestionar();
   //Uso los parametro
   $tipo_carga = "("."SELECT codigo_registro FROM global.vregistro_virtual WHERE codigo_registro = ".$parametros['TIPO CARGA'].")";
   $proceso_dia = "("."SELECT codigo_registro FROM global.vregistro_virtual WHERE codigo_registro = ".$parametros['PROCESO DIA ZAFRA'].")";
   $estado_datos = "("."SELECT codigo_registro FROM global.vregistro_virtual WHERE codigo_registro = ".$parametros['ESTADO DATOS'].")";
   $ls_Sql="INSERT INTO agronomia.vdia_zafra (codigo_zafra,numero,fecha_dia,codigo_tipo_carga,codigo_proceso_dia,codigo_estado_datos)
            values
            ('".$this->aa_Atributos['zafra']."','".$this->aa_Atributos['numero']."','".$this->aa_Atributos['fechadia']."',
            ".$tipo_carga.",".$proceso_dia.",".$estado_datos.")";
   $this->f_Con();
   $lb_Hecho=$this->f_Ejecutar($ls_Sql);
   $this->f_Des();
   return $lb_Hecho;
 }
 private function CrearDiaSigueinte(){
    $fecha = date($this->aa_Atributos['registro']['fecha_dia']);
    $nuevafecha = strtotime ( '+1 day' , strtotime ( $fecha ) ) ;
    $nuevafecha = date ( 'Y-m-d' , $nuevafecha );
    $this->aa_Atributos['fechadia'] = $nuevafecha;
    $this->aa_Atributos['numero'] = $this->aa_Atributos['registro']['numero'] + 1;
    $this->aa_Atributos['zafra'] = $this->aa_Atributos['registro']['codigo_zafra'];
    $lb_Hecho = $this->f_Guardar();
    return $lb_Hecho;
 }

 private function f_CambioAtributo($tipo){
   $lb_Enc = $this->f_Buscar($tipo);
   if($lb_Enc){
      //preparo los valore s a cambiar
      if(!isset($this->aa_Atributos['codigo_estado_datos'])){
         $this->aa_Atributos['codigo_estado_datos'] =$this->aa_Atributos['registro']['codigo_estado_datos'];
      }
      if(!isset($this->aa_Atributos['codigo_proceso_dia'])){
         $this->aa_Atributos['codigo_proceso_dia'] =$this->aa_Atributos['registro']['codigo_proceso_dia'];
      }
      if(!isset($this->aa_Atributos['codigo_tipo_carga'])){
         $this->aa_Atributos['codigo_tipo_carga'] =$this->aa_Atributos['registro']['codigo_tipo_carga'];
      }
      if(!isset($this->aa_Atributos['estado_dia_zafra'])){
         $this->aa_Atributos['estado_dia_zafra'] =$this->aa_Atributos['registro']['estado'];
      }
      $this->aa_Atributos = array(
         'codigo' => $this->aa_Atributos['registro']['codigo'],
         'codigo_estado_datos' => $this->aa_Atributos['codigo_estado_datos'],
         'codigo_proceso_dia' => $this->aa_Atributos['codigo_proceso_dia'],
         'codigo_tipo_carga' => $this->aa_Atributos['codigo_tipo_carga'],
         'estado_dia_zafra' => $this->aa_Atributos['estado_dia_zafra'],
         'fecha_dia' => $this->aa_Atributos['registro']['fecha_dia'],
         'numero' => $this->aa_Atributos['registro']['numero'],
      );
      $respuesta = $this->f_Modificar();
      $respuesta['mensaje'] = 'atributos cambiados de forma exitosa';
   }
   return $respuesta;
 }

 private function f_Modificar(){
   $lb_Hecho=false;
   $contCampos = 0;
   if(isset($this->aa_Atributos['nombre'])){
     $this->aa_Atributos['nom'] = $this->aa_Atributos['nombre'];
   }
   $ls_Sql="UPDATE agronomia.vdia_zafra SET ";

   //arma la cadena sql en base a los campos pasados en la peticion
   $ls_Sql.=$this->armarCamposUpdate($this->aa_Campos,$this->aa_Atributos);

   $ls_Sql.="WHERE codigo_dia_zafra ='".$this->aa_Atributos['codigo']."'";
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
 private function f_VerificarDia(){
   $lb_Enc = false;
   $ls_Sql = "SELECT fecha_dia FROM agronomia.vdia_zafra WHERE codigo_zafra = ".$this->aa_atributos['zafra']." AND estado_dia_zafra ='A'";
   $this->f_Con();
   $lr_tabla=$this->f_Filtro($ls_Sql);
   if($la_registros=$this->f_Arreglo($lr_tabla)){
     if($this->aa_atributos['fechadia']==$la_registros['fecha_dia']){
       $lb_Enc=true;
     }
   }
   $this->f_Cierra($lr_tabla);
   $this->f_Des();

   return $lb_Enc;
 }
 private function buscarDatosReporte($tipo){
  $dia = $this->aa_Atributos['codigo'];
  if($tipo == 'toneladasPorZona'){
    $ls_Sql = "SELECT sum(pesoneto) AS peso, vr.codigo_zona, z.nombre,z.color
                FROM agronomia.vvalidacion_soca_relacionado vr
                JOIN agronomia.vzona z ON vr.codigo_zona = z.codigo_zona
                WHERE fechadia = (SELECT fecha_dia FROM agronomia.vdia_zafra WHERE codigo_dia_zafra=$dia) AND  z.codigo_zona IS NOT NULL
                GROUP BY vr.codigo_zona, z.nombre,z.color
                ORDER BY vr.codigo_zona ";
  }else if($tipo == 'AzucarPorZona'){
     $ls_Sql = "SELECT coalesce(sum(azucarprobable),0) AS azucar, vr.codigo_zona, z.nombre,z.color
                FROM agronomia.vvalidacion_soca_relacionado vr
                JOIN agronomia.vzona z ON vr.codigo_zona = z.codigo_zona
                WHERE fechadia = (SELECT fecha_dia FROM agronomia.vdia_zafra WHERE codigo_dia_zafra=$dia) AND z.codigo_zona IS NOT NULL
                GROUP BY vr.codigo_zona, z.nombre,z.color
               ";
  }else if($tipo == 'TimeLineZafra'){
    $ls_Sql = "SELECT sum(pesoneto) as peso, max(dz.numero) as numero, vr.fechadia
              FROM agronomia.vvalidacion_soca_relacionado vr
              join agronomia.vdia_zafra dz on vr.fechadia = dz.fecha_dia
              where vr.fechadia <= (SELECT fecha_dia FROM agronomia.vdia_zafra WHERE codigo_dia_zafra=$dia)
              group by vr.fechadia
              order by numero";
  }
  $x = 0;
  $this->f_Con();
  $lr_tabla=$this->f_Filtro($ls_Sql);
  while($la_registros=$this->f_Arreglo($lr_tabla)){
    $datos[$x] = $this->recogerDatos($tipo,$la_registros);
    $x++;
  }
  $this->f_Cierra($lr_tabla);
  $this->f_Des();
  return $datos;
 }
  private function recogerDatos($ps_tipo,$pa_registros){
    if($ps_tipo == 'toneladasPorZona'){
      $datos['nombre'] = $pa_registros['nombre'];
      $datos['codigo_zona'] = $pa_registros['codigo_zona'];
      $datos['color'] = $pa_registros['color'];
      $datos['valor'] = $pa_registros['peso'];
    }else if($ps_tipo == 'AzucarPorZona'){
      $datos['nombre'] = $pa_registros['nombre'];
      $datos['codigo_zona'] = $pa_registros['codigo_zona'];
      $datos['color'] = $pa_registros['color'];
      $datos['valor'] = $pa_registros['azucar'];
    }else if($ps_tipo == 'TimeLineZafra'){
      $datos['numero'] = $pa_registros['numero'];
      $datos['valor'] = $pa_registros['peso'];
      $datos['dia'] = $pa_registros['fechadia'];
    }
    return $datos;
  }
}
?>
