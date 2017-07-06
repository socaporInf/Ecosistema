<?php
include_once('../../nucleo/clases/cls_Conexion.php');
include_once('../../nucleo/clases/cls_Mensaje_Sistema.php');
class clsConsultaPostgre extends cls_Conexion{

 protected $aa_Atributos = array();
 protected $organizaciones = array();
 private $aa_Campos = array('codigo_zona','nombre','descripcion','color');

 public function setPeticionPost($pa_Peticion,$buscar_org){
   $this->aa_Atributos=$pa_Peticion;
   //print_r($pa_Peticion);
   $this->org=$buscar_org;
   //print_r($this->organizaciones);
   $this->setDatosConexion($_SESSION['Con']['Nombre'],$_SESSION['Con']['Pass']);
 }

 public function getAtributos(){
   return $this->aa_Atributos;
 }

 public function gestionarPost(){
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

     case 'buscar_organizaciones':
       $lb_Enc=$this->f_buscar();
       if($lb_Enc!=0){
         $respuesta['registros']=$lb_Enc;
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
   $ls_Sql="SELECT * FROM agronomia.vzona ";
   $this->f_Con();
   $lr_tabla=$this->f_Filtro($ls_Sql);
   while($la_registros=$this->f_Arreglo($lr_tabla)){
     $la_respuesta[$x]['codigo']=$la_registros['codigo_zona'];
     $la_respuesta[$x]['nombre']=$la_registros['nombre'];
     $la_respuesta[$x]['color']=$la_registros['color'];
     $x++;
   }
   $this->f_Cierra($lr_tabla);
   $this->f_Des();
   return $la_respuesta;
 }

 private function f_Buscar(){
   $lb_Enc=false;
   $res= array();
    for ($i=0; $i < count($this->org); $i++) { 
      $ls_Sql="SELECT 
                p.rif,
                p.nombre_completo,
                p.codigo_productor,
                round(sum(vs.peso_kg)/1000,2) as peso,
                (
                  select sum(toneladas_estimadas_hectarea*area_cana) from agronomia.vtablon_rep where codigo_productor = p.codigo_productor
                ) as 
                ton_est
              from agronomia.vvalidacion_soca vs
              inner join agronomia.vproductor p on(p.codigo_productor=vs.codcanicultor) 
              where vs.codcanicultor=(
                                      select codigo_productor 
                                      from agronomia.vproductor
                                      where vs.codcanicultor=codigo_productor and rif= '".$this->org[$i]['codigo']."'
                                      )
              group by p.rif,p.nombre_completo,p.codigo_productor";

      $this->f_Con();
      $lr_tabla=$this->f_Filtro($ls_Sql);
      if($la_registros=$this->f_Arreglo($lr_tabla)){
         $res[$i]['codigo_productor']=$la_registros['codigo_productor'];
         $res[$i]['codigo_rif']=$la_registros['rif'];
         $res[$i]['nombre']=$la_registros['nombre_completo'];
         $res[$i]['peso_agro']=$la_registros['peso'];
         $res[$i]['ton_est']=$la_registros['ton_est'];
      }
      $this->f_Cierra($lr_tabla);
      $this->f_Des();
    }

   return $res;
 }

}
/*
  SELECT 
        codigo_productor,
        rif,
        nombre_completo,
        (
          select 
            round(sum(peso_kg),2) as peso  
          from agronomia.vvalidacion_soca 
          where codcanicultor=codigo_productor 
        ) 
      FROM agronomia.vproductor where rif='".$this->org[$i]['codigo']."'";
 */
?>

