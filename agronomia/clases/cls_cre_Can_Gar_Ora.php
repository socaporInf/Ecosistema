<?php
include_once('../../nucleo/clases/cls_conexionOracle.php');
include_once('../../nucleo/clases/cls_Mensaje_Sistema.php');

class clsConsultaOracle extends cls_ConexionOra{

  protected $aa_Atributos = array();

  public function setPeticionOra($pa_Peticion){
    $this->aa_Atributos=$pa_Peticion;
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
    $la_respuesta=array();
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
    $ls_SqlBase="SELECT ORG.ID_REGISTRO AS ID_ORGANIZACION, ORG.CO_RIF, ORG.NB_ORGANIZACION, LIMCRE.CA_PESO_BASE, LIMCRE.MN_VALOR_PESO_BASE, LIMCRE.PET_ID_ETAPA_PRODUCTIVA AS ID_LIM_CRE
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
      $la_respuesta[$i]['id_lim_cre']=$lr_tabla[$i]['ID_LIM_CRE'];
      $la_respuesta[$i]['id_organizacion']=$lr_tabla[$i]['ID_ORGANIZACION'];
    }

    $this->aa_Atributos['registros'] = $la_respuesta;
    $lb_Enc=($i == 0)?false:true;
    return $lb_Enc;
  }
}
?>
