<?php
include_once('../../nucleo/clases/cls_Conexion.php');
include_once('../../nucleo/clases/cls_Mensaje_Sistema.php');
include_once('cls_DiaZafra.php');
include_once('cls_Zona.php');
class cls_Zafra extends cls_Conexion{

 protected $aa_Atributos = array();
 private $aa_Campos = array('codigo_zafra','nombre','estado','fecha_dia','fecha_inicio','fecha_final');
 private $aa_Reportes = array('toneladasPorZona','AzucarPorZona','TimeLineZafra','AreasPorZona','ToneladasEstimadasPorZona');

 public function setPeticion($pa_Peticion){
   $la_Peticion['fecha_dia']=$this->fFechaPHP($la_Peticion['fecha_dia']);
   $la_Peticion['fecha_inicio']=$this->fFechaPHP($la_Peticion['fecha_inicio']);
   $la_Peticion['fecha_final']=$this->fFechaPHP($la_Peticion['fecha_final']);
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

    case 'buscarActivo':
      $lb_Enc=$this->f_buscar('activo');
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

    case 'estadoDia':

      break;


    case 'aperturar':
      $lb_Enc = $this->f_AperturarZafra();
      if(!$lb_Enc){
          $respuesta['mensaje'] = $lobj_Mensaje->buscarMensaje($this->aa_Atributos['codigo_mensaje']);
          $success = 0;
      }else{
         $respuesta = $this->aa_Atributos['respuesta'];
         if($respuesta['success'] == 1){
            $valores = array(
               '{NOMBREZAFRA}' => strtoupper($this->aa_Atributos['nombre'])
            );
            $respuesta['mensaje'] = $lobj_Mensaje->completarMensaje(28,$valores);
         }
      }
      break;

    case 'buscarDiaActivo':
       $lb_Enc=$this->f_buscarDia('activo');
       if($lb_Enc){
        $respuesta['registro']=$this->aa_Atributos['registro'];
        $success=1;
       }
     break;

    case 'buscarActivoDash':
       $lb_Enc=$this->f_buscar('activo');
       $success = 0;
       if($lb_Enc){
       $success=1;
       $respuesta['registro']=$this->aa_Atributos['registro'];
       $this->aa_Atributos['codigo'] = $respuesta['registro']['codigo'];
       $lobj_Zona = new cls_Zona;
       $pet = array(
          'operacion' => 'buscar'
       );
       $lobj_Zona->setPeticion($pet);
       $respuesta['zonas'] =  $lobj_Zona->gestionar();
       //revisar arreglo de reportes disponibles al inicio de la clase
       for ($i=0; $i < count($this->aa_Reportes) ; $i++) {
         $datos = $this->buscarDatosReporte($this->aa_Reportes[$i]);
         if(count($datos)!=0){
           $respuesta['reportes']['success'] = 1;
           $respuesta['reportes'][$this->aa_Reportes[$i]]['datos'] = $datos;
         }else{
           $respuesta['reportes']['success'] = 0;
           $respuesta['reportes'][$this->aa_Reportes[$i]]['mensaje'] = 'Sin Datos';
         }
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
   $ls_Sql="SELECT * FROM agronomia.vzafra ";
   $this->f_Con();
   $lr_tabla=$this->f_Filtro($ls_Sql);
   while($la_registros=$this->f_Arreglo($lr_tabla)){
      $la_respuesta[$x]['nombre']=$la_registros['nombre'];
      if($la_registros['estado']=='A'){
         $la_respuesta[$x]['estado']='Activa';
      }else if($la_registros['estado']=='I'){
         $la_respuesta[$x]['estado']='Inactiva';
      }
      $la_respuesta[$x]['codigo_estado']=$la_registros['estado'];
      $la_respuesta[$x]['codigo']=$la_registros['codigo_zafra'];
      $x++;
   }
   $this->f_Cierra($lr_tabla);
   $this->f_Des();
   return $la_respuesta;
 }

 private function f_Buscar($tipo){
   $lb_Enc=false;
   //Busco
   if($tipo == 'ultimo'){
      $ls_Sql="SELECT * from agronomia.vzafra WHERE codigo_zafra = (SELECT MAX(codigo_zafra) from agronomia.vzafra) ";
   }else if($tipo == 'activo'){
      $ls_Sql="SELECT * from agronomia.vzafra WHERE codigo_zafra = (SELECT codigo_zafra from agronomia.vzafra WHERE estado = 'A') ";
   }else {
      $ls_Sql="SELECT * FROM agronomia.vzafra where codigo_zafra='".$this->aa_Atributos['codigo']."'";
   }
   $this->f_Con();
   $lr_tabla=$this->f_Filtro($ls_Sql);
   if($la_registros=$this->f_Arreglo($lr_tabla)){
     $la_respuesta['codigo']=$la_registros['codigo_zafra'];
     $la_respuesta['nombre']=$la_registros['nombre'];
     $la_respuesta['estado']=$la_registros['estado'];
     $la_respuesta['fecha_dia']=$this->fFechaBD($la_registros['fecha_dia']);
     $la_respuesta['fecha_inicio']=$this->fFechaBD($la_registros['fecha_inicio']);
     if($la_registros['fecha_final'] != null){
         $la_respuesta['fecha_final']=$this->fFechaBD($la_registros['fecha_final']);
     }else{
        $la_respuesta['fecha_final']=$la_registros['fecha_final'];
     }

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
   $ls_Sql="INSERT INTO agronomia.vzafra (nombre,estado,fecha_inicio,fecha_final) values
       ('".$this->aa_Atributos['nombre']."','".$this->aa_Atributos['estado']."',";
   $ls_Sql.="'".$this->aa_Atributos['fecha_inicio']."','".$this->aa_Atributos['fecha_final']."')";
   $this->f_Con();
   $lb_Hecho=$this->f_Ejecutar($ls_Sql);
   $this->f_Des();
   return $lb_Hecho;
 }

 private function f_Modificar(){
   $lb_Hecho=false;
   $contCampos = 0;
   if(isset($this->aa_Atributos['nombre'])){
     $this->aa_Atributos['nom'] = $this->aa_Atributos['nombre'];
   }
   $ls_Sql="UPDATE agronomia.vzafra SET ";

   //arma la cadena sql en base a los campos pasados en la peticion
   $ls_Sql.=$this->armarCamposUpdate($this->aa_Campos,$this->aa_Atributos);

   $ls_Sql.="WHERE codigo_zafra ='".$this->aa_Atributos['codigo']."'";
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
 private function f_AperturarZafra(){
   $lb_validado = false;
   //valido si existe otra activa
   $lb_validado = $this->f_Buscar('activo');
   if($lb_validado){
      $this->aa_Atributos['codigo_mensaje'] = 27;
      return false;
   }else{
      $respuesta = $this->f_Modificar();
      if($respuesta['success']==0){
         return false;
      }else{
         $lobj_DiaZafra = new cls_DiaZafra;
         $pet = array(
            'operacion' => 'guardar',
            'numero' => '1',
            'fechadia' => $this->aa_Atributos['fecha_inicio'],
            'zafra' => $this->aa_Atributos['codigo']
         );
         $lobj_DiaZafra->setPeticion($pet);
         $this->aa_Atributos['respuesta'] = $lobj_DiaZafra->gestionar();
         return true;
      }
   }
 }
 private function buscarDatosReporte($tipo){
  $zafra = $this->aa_Atributos['codigo'];
  if($tipo == 'toneladasPorZona'){
    $ls_Sql = "SELECT sum(pesoneto_ton) AS peso, vr.codigo_zona, z.nombre,z.color
                FROM agronomia.vvalidacion_soca_relacionado vr
                JOIN agronomia.vzona z ON vr.codigo_zona = z.codigo_zona
                WHERE fechadia between
                (SELECT fecha_inicio FROM agronomia.vzafra WHERE codigo_zafra=$zafra)
                AND
                (SELECT fecha_final FROM agronomia.vzafra WHERE codigo_zafra=$zafra)
                AND  z.codigo_zona IS NOT NULL
                GROUP BY vr.codigo_zona, z.nombre,z.color
                ORDER BY vr.codigo_zona";
  }else if($tipo == 'AzucarPorZona'){
     $ls_Sql = "SELECT coalesce(sum(azucarprobable),0) AS azucar, vr.codigo_zona, z.nombre,z.color
                FROM agronomia.vvalidacion_soca_relacionado vr
                JOIN agronomia.vzona z ON vr.codigo_zona = z.codigo_zona
                WHERE fechadia between
                (SELECT fecha_inicio FROM agronomia.vzafra WHERE codigo_zafra=$zafra)
                AND
                (SELECT fecha_final FROM agronomia.vzafra WHERE codigo_zafra=$zafra)
                AND  z.codigo_zona IS NOT NULL
                GROUP BY vr.codigo_zona, z.nombre,z.color
               ";
  }else if($tipo == 'TimeLineZafra'){
    $ls_Sql = "SELECT sum(pesoneto_ton) as peso, max(dz.numero) as numero, vr.fechadia, vr.codigo_zona,max(z.nombre) as nombre_zona,max(z.color) as color
              FROM agronomia.vvalidacion_soca_relacionado vr
              join agronomia.vdia_zafra dz on vr.fechadia = dz.fecha_dia
              join agronomia.vzona z on vr.codigo_zona = z.codigo_zona
              WHERE fechadia between
              (SELECT fecha_inicio FROM agronomia.vzafra WHERE codigo_zafra=$zafra)
              AND
              (SELECT fecha_final FROM agronomia.vzafra WHERE codigo_zafra=$zafra)
              group by vr.fechadia,vr.codigo_zona
              order by vr.codigo_zona,numero";
  }else if($tipo == 'AreasPorZona'){
    $ls_Sql = "SELECT * FROM agronomia.vareas_zonas";
  }else if($tipo == 'ToneladasEstimadasPorZona'){
    $ls_Sql = "SELECT * FROM agronomia.vtoneladas_estimada_zona";
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
      $datos['nombre_zona'] = $pa_registros['nombre_zona'];
      $datos['color'] = $pa_registros['color'];
      $datos['codigo_zona'] = $pa_registros['codigo_zona'];
    }else if($ps_tipo == 'AreasPorZona'){
        $datos['codigo_zona'] = $pa_registros['codigo_zona'];
        $datos['nombre'] = $pa_registros['nombre'];
        $datos['valor'] = $pa_registros['area'];
        $datos['color'] = $pa_registros['color'];
    }else if($ps_tipo == 'ToneladasEstimadasPorZona'){
      $datos['codigo_zona'] = $pa_registros['codigo_zona'];
      $datos['nombre'] = $pa_registros['nombre'];
      $datos['valor'] = $pa_registros['toneladas'];
      $datos['color'] = $pa_registros['color'];
    }
    return $datos;
  }
}
?>
