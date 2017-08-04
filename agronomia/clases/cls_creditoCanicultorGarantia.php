<?php
include_once('cls_cre_Can_Gar_Ora.php');
include_once('cls_cre_Can_Gar_Post.php');
include_once('../../nucleo/clases/cls_Mensaje_Sistema.php');

class cls_creditoCanicultorGarantia {

 protected $aa_Atributos = array();
 protected $consOra;
 protected $consPost;
 
 //private $aa_Campos = array('rif','nombre','descripcion');
  function __construct() {
    $this->consOra = new clsConsultaOracle;
    $this->consPost = new clsConsultaPostgre;
 
  }
  public function setPeticion($pa_Peticion){
    $this->aa_Atributos=$pa_Peticion;
    $this->consOra->setPeticionOra($pa_Peticion);
  }

  public function getAtributos(){
    return $this->aa_Atributos;
  }

  public function gestionar(){
    $lobj_Mensaje = new cls_Mensaje_Sistema;
    switch ($this->aa_Atributos['operacion']) {
      case 'buscar':
        $lb_Enc=$this->consOra->gestionarOra();
        if($lb_Enc){
          $success=1;
          //print($lb_Enc);
          $respuesta['registros']=$lb_Enc['registros'];
          $respuesta['paginas']=$lb_Enc['paginas'];
        }else{
          $respuesta['success'] = 0;
          $respuesta['mensaje'] = $lobj_Mensaje->buscarMensaje(8);
        }
      break;

      case 'buscarRegistro':
        $lb_Enc=$this->consOra->gestionarOra();
        if($lb_Enc){
          $success=1;
          //print($lb_Enc);
          $respuesta['registros']=$lb_Enc['registros'];
          $respuesta['paginas']=$lb_Enc['paginas'];
        }else{
          $respuesta['success'] = 0;
          $respuesta['mensaje'] = $lobj_Mensaje->buscarMensaje(8);
        }
      break;

      case 'buscar_organizaciones':
        $lb_Enc=$this->f_Juntar();
        if($lb_Enc!=0){
          //print($lb_Enc);
          $success=1;
          $respuesta['registros']=$lb_Enc;
          $respuesta['paginas']=$lb_Enc['paginas'];
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

  private function f_Juntar(){
    $encontrados=array();
    $noencontrados=array();
    $res_Ora=$this->consOra->gestionarOra();
    $this->consPost->setPeticionPost($this->aa_Atributos,$res_Ora['registros']);
    
    $res_Post=$this->consPost->gestionarPost();

    //echo "<br>\nElementos que existen en figo y agronomia<br>\n"; 
    $x=0;
    foreach ($res_Ora['registros'] as $reg_ora) {
        foreach ($res_Post['registros'] as $value2) {
            if ($reg_ora['codigo'] == $value2['codigo_rif']){
              $encontrados[$x]['id_organizacion']=$reg_ora['id_organizacion'];
              $encontrados[$x]['rif']=$reg_ora['codigo'];
              $encontrados[$x]['nombre']=$reg_ora['nombre'];
              $encontrados[$x]['factor_figo']=$reg_ora['factor_figo'];
              $encontrados[$x]['peso_figo']=$reg_ora['peso_figo'];
              $encontrados[$x]['peso_figo']=$reg_ora['peso_figo'];
              $encontrados[$x]['id_lim_cre']=$reg_ora['id_lim_cre'];
              $encontrados[$x]['peso_agro']=$value2['peso_agro'];
              $encontrados[$x]['ton_est']=$value2['ton_est'];
              $encontrados[$x]['numero']=($x+1);
              $x++;
            }
        }
    }

    return $encontrados;

    // echo "<br>\nElementos que sólo existen en figo<br>\n";
    // foreach ($res_Ora['registros'] as $value1) {
    //     $encontrado=false;
    //     foreach ($res_Post['registros'] as $value2) {
    //         if ($value1['codigo'] == $value2['codigo_rif']){
    //             $encontrado=true;
    //             $break;
    //         }
    //     }
    //     if ($encontrado == false){
    //            echo "--->".$value1['codigo']."<br>\n";
    //     }
    // }

    // echo "<br>\nElementos que sólo existen agronomia<br>\n";
    // foreach ($res_Post['registros'] as $value2) {
    //     $encontrado=false;
    //     foreach ($res_Ora['registros'] as $value1) {
    //         if ($value1['codigo'] == $value2['codigo_rif']){
    //             $encontrado=true;
    //             $break;
    //         }
    //     }
    //     if ($encontrado == false){
    //            echo "--->".$value2['codigo_rif']."<br>\n";
    //     }
    // }
  }
}
?>
