<?php
include_once('../../nucleo/clases/cls_Conexion.php');
include_once('../../nucleo/clases/cls_Mensaje_Sistema.php');
class clsConsultaPostgre extends cls_Conexion{

 protected $aa_Atributos = array();
 protected $organizaciones = array();

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

    case 'buscar_organizaciones':
     $lb_Enc=$this->f_buscar();
     $formula=$this->f_buscar_formula();
     //print_r($formula);
     if($lb_Enc!=0){
       $respuesta['registros']=$lb_Enc;
       $respuesta['formula']=$formula;
       $success=1;
     }
    break;

    case 'buscar_formula_asignada':
      $registros=$this->f_buscar_formula_asignada();
      if(count($registros)!=0){
       $success=1;
       $respuesta['registros']=$registros;
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

 private function f_buscar(){
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

   private function f_buscar_formula(){
   $lb_Enc=false;
   //Busco El rol
   $ls_Sql="SELECT tftg.codigo_tipo_garantia, f.*
            FROM 
              agronomia.vm01_tipo_formula_tipo_garantia AS tftg
            INNER JOIN 
              agronomia.vm01_formula as f ON(f.codigo_tipo_formula=tftg.codigo_tipo_formula)
            WHERE 
              tftg.codigo_tipo_garantia='".$this->aa_Atributos['id_bus']."'";
   $this->f_Con();
   $lr_tabla=$this->f_Filtro($ls_Sql);
   if($la_registros=$this->f_Arreglo($lr_tabla)){
     $la_respuesta['cod_for']=$la_registros['codigo_formula'];
     $la_respuesta['fec_ini']=$la_registros['fecha_inicio'];
     $la_respuesta['fec_fin']=$la_registros['fecha_final'];
     $la_respuesta['des_formula']=$la_registros['texto_formula'];
     $la_respuesta['formula']=$la_registros['texto_formula'];
     $la_respuesta['valor_formula']=$la_registros['valor_formula'];
     $lb_Enc=true;
   }
   $this->f_Cierra($lr_tabla);
   $this->f_Des();

   $quitar= array('*','/','+','-','(',')');//caracteres a quitar de la formula
   $componentes_formulas=str_replace($quitar, ',', $la_respuesta['des_formula']);//elimino los caracteres anteriores y separo con (,) lo que quede
   $for=explode(',',$componentes_formulas);//convierto la formula en arreglo y elimino los (,)
   $for=array_filter($for, "strlen");//elimino posiciones que queden en vacias
   $for=array_values($for);//reordeno el arreglo en forma ascendente

  //ordeno el arreglo descendente por la cantidad de letras
  //para que a la hora de sustituir los valores no me reemplase alguna palabra que contenga 
  //una mas pequeña dentro de una cadena
    for($i=1;$i<count($for);$i++)
    {
      for($j=0;$j<count($for)-$i;$j++)
      {
        if(strlen($for[$j])<strlen($for[$j+1]))
        {
          $k=$for[$j+1];
          $for[$j+1]=$for[$j];
          $for[$j]=$k;
        }
      }
    }
  //----------------------------------------------------

    for ($i=0; $i < count($for); $i++) { 
     $lb_Enc=false;
     //Busco El valor del componente
     $ls_Sql="SELECT com.nombre, val.valor FROM agronomia.vm01_componente as com
            JOIN agronomia.vm01_detalle_componente as val on(com.codigo_componente=val.codigo_componente)
            WHERE com.nombre='$for[$i]' AND '".$la_respuesta['fec_ini']."' BETWEEN val.fecha_inicio AND val.fecha_final";
             $this->f_Con();
             $lr_tabla=$this->f_Filtro($ls_Sql);
             if($la_registros=$this->f_Arreglo($lr_tabla)){
               $la_respuesta['des_formula'] = str_replace($for[$i],$la_registros['valor'],$la_respuesta['des_formula']); // reemplazo los componentes por los valores asociados a cada componente 
               $lb_Enc=true;
             }
             $this->f_Cierra($lr_tabla);
             $this->f_Des();
    }
   return $la_respuesta;
  }

  private function f_buscar_formula_asignada(){
   $x=0;
   $la_respuesta=array();
   $ls_Sql="SELECT tftg.*, tf.descripcion
            FROM 
              agronomia.vm01_tipo_formula_tipo_garantia AS tftg
            INNER JOIN 
              agronomia.vm01_tipo_formula AS tf ON(tf.codigo_tipo_formula=tftg.codigo_tipo_formula)";
   $this->f_Con();
   $lr_tabla=$this->f_Filtro($ls_Sql);
   while($la_registros=$this->f_Arreglo($lr_tabla)){
     $la_respuesta[$x]['codigo']=$la_registros['codigo_tipo_garantia'];
     $la_respuesta[$x]['nombre']=$la_registros['descripcion'];
     $x++;
   }
   $this->f_Cierra($lr_tabla);
   $this->f_Des();
   return $la_respuesta;
  }

}
?>