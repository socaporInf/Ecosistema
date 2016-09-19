<?php
set_time_limit(10000);
include_once('../../lib/Eden-Php/eden.php');
include_once('../../nucleo/clases/cls_Conexion.php');
include_once('../../nucleo/clases/cls_Mensaje_Sistema.php');
class cls_ManejadorCorreo extends cls_Conexion{

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
			case 'buscarArchivoCorreo':
				//busco el correo en la nube
				$correo = $this->f_BuscarCorreo();
				//extraigo el archivo del correo;
				$archivoListado = $this->f_ExtraerListado($correo);
				return $archivoListado;
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
	private function f_BuscarCorreo(){
		//Armo la peticion
		$peticion = Array(
				'operacion'=>'buscarParametros',
				'nombre'=>'CARGA AUTOMATICA VALIDACION DIARIA'
			);
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

		$correos = $imap->getEmails(0, 3);

		//busco el correo con el listado correcto
		$correo = $this->f_BuscarListado($correos);
		$correo = $imap->getUniqueEmails($correo['uid'], true);
		$imap->disconnect();
		return $correo;
	}

	private function f_BuscarListado($correos){
		$total = count($correos);
		for($i = 0; $i < $total;$i++){
			$cadena_de_texto = $correos[$i]['subject'];
			$cadena_buscada = 'LISTADO DE VALIDACION';
			$pos = strpos($cadena_de_texto, $cadena_buscada);
			if($pos !== false){
				//extaigo la fecha
				$fecha = $this->fFechaPHP(explode(' ',$correos[$i]['subject'])[5]);
				//incluyo e instacio la calse zafra para obtener la fecha dia disponible
				include_once('cls_Zafra.php');
				$lobj_Zafra = new cls_Zafra();
				//busco la zafra activa
				$pet = array('operacion' => 'buscarActivo');
				$lobj_Zafra->setPeticion($pet);
				$zafra = $lobj_Zafra->gestionar()['registro'];
				if($zafra['fecha_dia'] == $fecha){
					return $correos[$i];
				}
			}
		}
	}

	private function f_ExtraerListado($correo){
		foreach ($correo['attachment'] as $key => $value) {
			$extension = explode('.',$key)[1];
			if($extension == 'xlsx'){
				return array($key,$value);
			}
		}
		return array();
	}
}
?>
