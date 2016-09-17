<?php
include_once('../../lib/Eden-Php/eden.php');
include_once('../../nucleo/clases/cls_Conexion.php');
include_once('../../nucleo/clases/cls_Mensaje_Sistema.php');
class cls_Carga_Validacion extends cls_Conexion{

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
			case 'buscarListaCorreo':
				//busco todos los correos a la nube
        $correos = $this->f_BuscarCorreos();
				//busco el correo con el listado correcto
				$correo = $this->f_BuscarListado($correos);
				//TODO: Extraccion del xlsx del correo seleccionado
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

  private function f_BuscarCorreos(){
		//Armo la peticion
		$peticion = Array('operacion'=>'buscarParametros','nombre'=>'CARGA AUTOMATICA VALIDACION DIARIA');
		//incluyo e instancio
		include_once('../../seguridad/clases/cls_Proceso.php');
		$lobj_Proceso = new cls_Proceso();
		//seteo la peticion
		$lobj_Proceso->setPeticion($peticion);
		//gestiono y obtengo el resultado
		$parametros = $lobj_Proceso->gestionar();
    $imap = eden('mail')->imap($parametros['SERVIDOR DE CORREO'], $parametros['DIRECCION DE CORREO'], $parametros['CLAVE DE CORREO'], 993, true);
    $mailboxes = $imap->getMailboxes();
    $imap->setActiveMailbox('INBOX')->getActiveMailbox();

    $emails = $imap->getEmails(0, 3);

    $imap->disconnect();
    return $emails;
  }
	private function f_BuscarListado($correos){
		$total = count($correos);
		for($i = 0; $i < $total;$i++){
			//print($correos[$i]['subject']);
			$cadena_de_texto = $correos[$i]['subject'];
			$cadena_buscada = 'listado de validacion';
			$pos = strpos($cadena_de_texto, $cadena_buscada);
			if($pos === false){
				//extaigo la fecha
				$fecha = explode(' ',$correos[$i]['subject'])[5];
				//TODO: Validaciones seleccion de correo (fecha zafra vs la variable fecha)

			}
		}
	}
}
?>
