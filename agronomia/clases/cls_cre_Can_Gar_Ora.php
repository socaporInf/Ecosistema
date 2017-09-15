<?php
include_once('../../nucleo/clases/cls_conexionOracle.php');
include_once('../../nucleo/clases/cls_Mensaje_Sistema.php');

class clsConsultaOracle extends cls_ConexionOra{

  protected $aa_Atributos = array();
  protected $aa_res_post = array();

  public function setPeticionOra($pa_Peticion,$res_post){
    $this->aa_Atributos=$pa_Peticion;
    $this->aa_res_post=$res_post;
  }

  public function getAtributosOra(){
    return $this->aa_Atributos;
  }

  public function gestionarOra(){
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
        $lb_Enc=$this->f_Buscar();
        if($lb_Enc){
          $success=1;
          $respuesta['registros']=$this->aa_Atributos['registros'];
          $respuesta['paginas']=$this->aa_Atributos['paginas'];
        }else{
          $respuesta['success'] = 0;
          $respuesta['mensaje'] = $lobj_Mensaje->buscarMensaje(8);
        }
      break;

      case 'optener_fechas'://este es para m01_tipo_formula
        $lb_Enc=$this->f_optener_fechas();
        if($lb_Enc){
          $success=1;
          $respuesta['registros']=$this->aa_Atributos['registros'];
          $respuesta['paginas']=$this->aa_Atributos['paginas'];
        }else{
          $respuesta['success'] = 0;
          $respuesta['mensaje'] = $lobj_Mensaje->buscarMensaje(8);
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

      case 'buscar_organizaciones':
        $lb_Enc=$this->f_Buscar_Org();
        if($lb_Enc){
          $success=1;
          $respuesta['registros']=$this->aa_Atributos['registros'];
          $respuesta['paginas']=$this->aa_Atributos['paginas'];
        }else{
          $respuesta['success'] = 0;
          $respuesta['mensaje'] = $lobj_Mensaje->buscarMensaje(8);
        }
      break;

      case 'insertar_registros_figo':
      
        $lb_Hecho=$this->f_Modificar();
        if($lb_Hecho){
          //$respuesta['registros'] = $this->aa_Atributos['registro'];
          //$respuesta['mensaje'] = $lobj_Mensaje->buscarMensaje(9);
          //$success = 1;
        }else{
          //$respuesta['mensaje'] = $lobj_Mensaje->buscarMensaje(10);
         // $success = 0;
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
    $cadenaBusqueda= ($this->aa_Atributos['valor']=='')?"
      where 
        TVR_NB_TABLA='TIPO_GARANTIA' 
        AND EMP_ID_EMPRESA='6909119' 
        AND DE_OCURRENCIA NOT LIKE '%NO UTILIZAR%'"
      :
      "where 
        TVR_NB_TABLA='TIPO_GARANTIA'
        AND EMP_ID_EMPRESA='6909119'
        AND DE_OCURRENCIA NOT LIKE '%NO UTILIZAR%' 
        AND DE_OCURRENCIA like '%".$this->aa_Atributos['valor']."%'";
    $ls_SqlBase="SELECT ID_REGISTRO, CO_OCURRENCIA, DE_OCURRENCIA from T00_CONTENIDO_TABLA_VIRTUAL $cadenaBusqueda";
    $orden = '';

    $this->f_Con_ora('6232098','6236396'); //conecto a la base de datos
    $nre=$this->f_Filtro_ora("select ID_REGISTRO from T00_CONTENIDO_TABLA_VIRTUAL where TVR_NB_TABLA='TIPO_GARANTIA' AND EMP_ID_EMPRESA='6909119' AND DE_OCURRENCIA NOT LIKE '%NO UTILIZAR%'"); //seleccionamos todos los registros
    $nr=count($nre->_array); // contamos todos los registros y optenemos el numero de registros

    $ls_Sql = $this->f_ArmarPaginacion($ls_SqlBase,$orden,$nr); //armo la paginacion

    $this->f_Con_ora('6232098','6236396'); //conecto a la base de datos
    $lr_tabla=$this->f_Filtro_ora($ls_Sql);
    $lr_tabla=$lr_tabla->_array;

    for ($i=0; $i < count($lr_tabla); $i++) { 
      $la_respuesta[$i]['codigo']=$lr_tabla[$i]['ID_REGISTRO'];
      $la_respuesta[$i]['nombre']=$lr_tabla[$i]['CO_OCURRENCIA']." - ".$lr_tabla[$i]['DE_OCURRENCIA'];
    }

    $this->aa_Atributos['registros'] = $la_respuesta;
    $lb_Enc=($i == 0)?false:true;
    return $lb_Enc;
  }

  private function f_Buscar(){
   $x=0;
    $cadenaBusqueda= ($this->aa_Atributos['valor']=='')?"
      where 
        TVR_NB_TABLA='TIPO_GARANTIA' 
        AND EMP_ID_EMPRESA='6909119' 
        AND DE_OCURRENCIA NOT LIKE '%NO UTILIZAR%'
        AND ID_REGISTRO = '".$this->aa_Atributos['codigo']."'
        "
      :
      "where 
        TVR_NB_TABLA='TIPO_GARANTIA'
        AND EMP_ID_EMPRESA='6909119'
        AND DE_OCURRENCIA NOT LIKE '%NO UTILIZAR%' 
        AND DE_OCURRENCIA like '%".$this->aa_Atributos['valor']."%'";
    $la_respuesta=array();
    $ls_SqlBase="SELECT ID_REGISTRO, CO_OCURRENCIA, DE_OCURRENCIA from T00_CONTENIDO_TABLA_VIRTUAL $cadenaBusqueda";
    $orden = '';

    $this->f_Con_ora('6232098','6236396'); //conecto a la base de datos
    $nre=$this->f_Filtro_ora(""); //seleccionamos todos los registros
    $nr=count($nre->_array); // contamos todos los registros y optenemos el numero de registros

    $ls_Sql = $this->f_ArmarPaginacion($ls_SqlBase,$orden,$nr); //armo la paginacion

    $this->f_Con_ora('6232098','6236396'); //conecto a la base de datos
    $lr_tabla=$this->f_Filtro_ora($ls_Sql);
    $lr_tabla=$lr_tabla->_array;

    for ($i=0; $i < count($lr_tabla); $i++) { 
      $la_respuesta['codigo']=$lr_tabla[$i]['ID_REGISTRO'];
      $la_respuesta['nombre']=$lr_tabla[$i]['CO_OCURRENCIA']." - ".$lr_tabla[$i]['DE_OCURRENCIA'];
    }

    $this->aa_Atributos['registros'] = $la_respuesta;
    $lb_Enc=($i == 0)?false:true;
    return $lb_Enc;
 }

 private function f_buscar_formula_asignada(){
    $la_respuesta=array();
   for ($x=0; $x < count($this->aa_res_post['registros']); $x++) { 
    $cadenaBusqueda= ($this->aa_Atributos['valor']=='')?"
      where 
        TVR_NB_TABLA='TIPO_GARANTIA' 
        AND EMP_ID_EMPRESA='6909119' 
        AND DE_OCURRENCIA NOT LIKE '%NO UTILIZAR%'
        AND ID_REGISTRO = '".$this->aa_res_post['registros'][$x]['codigo']."'
        "
      :
      "where 
        ";
    $ls_SqlBase="SELECT ID_REGISTRO, CO_OCURRENCIA, DE_OCURRENCIA from T00_CONTENIDO_TABLA_VIRTUAL $cadenaBusqueda";
    $orden = '';

    $this->f_Con_ora('6232098','6236396'); //conecto a la base de datos
    $nre=$this->f_Filtro_ora(""); //seleccionamos todos los registros
    $nr=count($nre->_array); // contamos todos los registros y optenemos el numero de registros

    $ls_Sql = $this->f_ArmarPaginacion($ls_SqlBase,$orden,$nr); //armo la paginacion

    $this->f_Con_ora('6232098','6236396'); //conecto a la base de datos
    $lr_tabla=$this->f_Filtro_ora($ls_Sql);
    $lr_tabla=$lr_tabla->_array;

    for ($i=0; $i < count($lr_tabla); $i++) { 
      $la_respuesta[$x]['codigo']=$lr_tabla[$i]['ID_REGISTRO'];
      $la_respuesta[$x]['nombre']=$lr_tabla[$i]['DE_OCURRENCIA'];
    }
  }
    $this->aa_Atributos['registros'] = $la_respuesta;
    $lb_Enc=($i == 0)?false:true;
    return $la_respuesta;
 }

 private function f_optener_fechas(){
   $x=0;
    $cadenaBusqueda= ($this->aa_Atributos['id_busqueda']=='')?"
      "
      :
      "WHERE CTV.TVR_NB_TABLA='TIPO_GARANTIA' 
        AND CTV.EMP_ID_EMPRESA='6909119' 
        AND CTV.DE_OCURRENCIA NOT LIKE '%NO UTILIZAR%'
        AND CTV.ID_REGISTRO='".$this->aa_Atributos['id_busqueda']."'
      ";
    $la_respuesta=array();
    $ls_SqlBase="SELECT CTV.ID_REGISTRO, CTV.CO_OCURRENCIA, CTV.DE_OCURRENCIA, 
    PERTIE.FH_INICIO_PERIODO, PERTIE.FH_FIN_PERIODO 
    FROM T00_CONTENIDO_TABLA_VIRTUAL CTV INNER JOIN T00_PERIODO_TIEMPO PERTIE 
    ON(PERTIE.ID_REFERENCIA=CTV.ID_REGISTRO) $cadenaBusqueda";
    $orden = '';
    $this->f_Con_ora('6232098','6236396'); //conecto a la base de datos
    $nre=$this->f_Filtro_ora(""); //seleccionamos todos los registros
    $nr=count($nre->_array); // contamos todos los registros y optenemos el numero de registros

    $ls_Sql = $this->f_ArmarPaginacion($ls_SqlBase,$orden,$nr); //armo la paginacion

    $this->f_Con_ora('6232098','6236396'); //conecto a la base de datos
    $lr_tabla=$this->f_Filtro_ora($ls_Sql);
    $lr_tabla=$lr_tabla->_array;

    for ($i=0; $i < count($lr_tabla); $i++) { 
      $la_respuesta['codigo']=$lr_tabla[$i]['ID_REGISTRO'];
      $la_respuesta['nombre']=$lr_tabla[$i]['CO_OCURRENCIA']." - ".$lr_tabla[$i]['DE_OCURRENCIA'];
      $la_respuesta['fec_ini_per']=$lr_tabla[$i]['FH_INICIO_PERIODO'];
      $la_respuesta['fec_fin_per']=$lr_tabla[$i]['FH_FIN_PERIODO'];
    }

    $this->aa_Atributos['registros'] = $la_respuesta;
    $lb_Enc=($i == 0)?false:true;
    return $lb_Enc;
 }



  private function f_Buscar_Org(){
    $x=0;
    $cadenaBusqueda= ($this->aa_Atributos['valor']=='')?"
        WHERE  
        TIPGAR.TVR_NB_TABLA='TIPO_GARANTIA' 
        AND TIPGAR.EMP_ID_EMPRESA='6909119' 
        AND TIPGAR.DE_OCURRENCIA NOT LIKE '%NO UTILIZAR%' 
        AND PERTIE.ID_REFERENCIA='".$this->aa_Atributos['id_bus']."' "
      :"WHERE PERTIE.ID_REFERENCIA='".$this->aa_Atributos['id_bus']."' and TVR_NB_TABLA='TIPO_GARANTIA' AND TIPGAR.EMP_ID_EMPRESA='6909119' AND TIPGAR.DE_OCURRENCIA NOT LIKE '%NO UTILIZAR%' AND DE_OCURRENCIA like '%".$this->aa_Atributos['valor']."%'";
    $la_respuesta=array();
    $ls_SqlBase="SELECT ORG.ID_REGISTRO AS ID_ORGANIZACION, ORG.CO_RIF, ORG.NB_ORGANIZACION, 
      LIMCRE.CA_PESO_BASE, LIMCRE.MN_VALOR_PESO_BASE, LIMCRE.PET_ID_ETAPA_PRODUCTIVA, LIMCRE.MN_DEDUCIBLE, LIMCRE.ID_REGISTRO AS ID_LIMITE_CREDITO,
      PERTIE.FH_INICIO_PERIODO, 
      PERTIE.FH_FIN_PERIODO
                  FROM T00_CONTENIDO_TABLA_VIRTUAL TIPGAR 
                  INNER JOIN T00_PERIODO_TIEMPO PERTIE ON(PERTIE.ID_REFERENCIA=TIPGAR.ID_REGISTRO) 
                  INNER JOIN T20_LIMITE_CREDITO LIMCRE ON(LIMCRE.PET_ID_ETAPA_PRODUCTIVA=PERTIE.ID_REGISTRO) 
                  INNER JOIN T00_ORGANIZACION ORG ON(ORG.ID_REGISTRO=LIMCRE.ORG_ID_ORGANIZACION)    
                  $cadenaBusqueda";
    $orden = '';

    $this->f_Con_ora('6232098','6236396'); //conecto a la base de datos
    $nre=$this->f_Filtro_ora(""); //seleccionamos todos los registros
    $nr=count($nre->_array); // contamos todos los registros y optenemos el numero de registros

    $ls_Sql = $this->f_ArmarPaginacion($ls_SqlBase,$orden,$nr); //armo la paginacion

    $this->f_Con_ora('6232098','6236396'); //conecto a la base de datos
    $lr_tabla=$this->f_Filtro_ora($ls_Sql);
    $lr_tabla=$lr_tabla->_array;

    for ($i=0; $i < count($lr_tabla); $i++) { 
      $la_respuesta[$i]['codigo']=$lr_tabla[$i]['CO_RIF'];
      $la_respuesta[$i]['nombre']=$lr_tabla[$i]['NB_ORGANIZACION'];
      $la_respuesta[$i]['peso_figo']=$lr_tabla[$i]['CA_PESO_BASE'];
      $la_respuesta[$i]['factor_figo']=$lr_tabla[$i]['MN_VALOR_PESO_BASE'];
      $la_respuesta[$i]['pet_id_etapa_productiva']=$lr_tabla[$i]['PET_ID_ETAPA_PRODUCTIVA'];
      $la_respuesta[$i]['id_organizacion']=$lr_tabla[$i]['ID_ORGANIZACION'];
      $la_respuesta[$i]['fec_ini_periodo']=$lr_tabla[$i]['FH_INICIO_PERIODO'];
      $la_respuesta[$i]['fec_fin_periodo']=$lr_tabla[$i]['FH_FIN_PERIODO'];
      $la_respuesta[$i]['monto_deducible']=$lr_tabla[$i]['MN_DEDUCIBLE'];
      $la_respuesta[$i]['id_limite_credito']=$lr_tabla[$i]['ID_LIMITE_CREDITO'];
    }

    $this->aa_Atributos['registros'] = $la_respuesta;
    $lb_Enc=($i == 0)?false:true;
    return $lb_Enc;
  }

  private function f_Modificar(){ // aqui ejecuto para actualizar registros en sqlFIGO
    $lb_Hecho=false;

      $data = json_decode($this->aa_Atributos['datos_campos'], true);
      //print_r($data);

    for ($i=0; $i < count($data); $i++) { 
      $ls_Sql="UPDATE T20_LIMITE_CREDITO SET MN_LIMITE_CREDITO='".$data[$i]['monto_limite']."', CA_PESO_BASE='".$data[$i]['peso_agro']."', MN_VALOR_PESO_BASE='".$data[$i]['factor_agronomia']."' WHERE ID_REGISTRO='".$data[$i]['id_limite_credito']."'";
      $this->f_Con_ora('6232098','6236396'); //conecto a la base de datos
      $lb_Hecho=$this->f_Filtro_ora($ls_Sql);
    }

    
    return $lb_Hecho;
  }
}
?>
