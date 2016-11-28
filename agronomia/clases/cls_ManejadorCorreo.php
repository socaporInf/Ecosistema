<?php
set_time_limit(10000);
include_once('../../lib/Eden-Php/eden.php');
include_once('../../nucleo/clases/cls_Conexion.php');
include_once('../../nucleo/clases/cls_Mensaje_Sistema.php');
include_once('cls_DiaZafra.php');
include_once('../../seguridad/clases/cls_Proceso.php');
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
				if($correo != false){
					$this->aa_Atributos['UID'] = $correo['uid'];
					//extraigo el archivo del correo;
					$archivoListado = $this->f_ExtraerListado($correo);
					if($archivoListado == false){
						$this->aa_Atributos['mensaje'] = 'error en la carga del archivo excel del listado';
					}
					return $archivoListado;
				}else{
					$this->aa_Atributos['mensaje'] = 'Validacion de la fecha '.$this->aa_Atributos['fecha_dia'].' no ha sido enviado';
				}
				return false;
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
		$lobj_Proceso = new cls_Proceso();
		//seteo la peticion
		$lobj_Proceso->setPeticion($peticion);
		//gestiono y obtengo el resultado
		$parametros = $lobj_Proceso->gestionar();
		$imap = eden('mail')->imap($parametros['SERVIDOR DE CORREO'], $parametros['DIRECCION DE CORREO'], $parametros['CLAVE DE CORREO'], 993, true);
		$mailboxes = $imap->getMailboxes();
		$imap->setActiveMailbox('INBOX')->getActiveMailbox();

		$correos = $imap->getEmails(0, 20);
		//busco el correo con el listado correcto
		$correo = $this->f_BuscarListado($correos);
		if($correo != false){
			$correo = $imap->getUniqueEmails($correo['uid'], true);
		}
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
				$subject = explode(' ',$correos[$i]['subject']);
				if($subject[0] == 'RV:'){
					$fecha = $subject[6];
				}else {
					$fecha = $subject[5];
				}
				$fecha = $this->fFechaPHP($fecha);
				//incluyo e instacio la calse zafra para obtener la fecha dia disponible
				$lobj_Zafra = new cls_DiaZafra();
				//busco la zafra activa
				if(isset($this->aa_Atributos['dia'])){
					$lobj_Zafra->setPeticion(array(
						'operacion' => 'estadoDia',
						'codigo' => $this->aa_Atributos['dia']
					));
				}else{
					$lobj_Zafra->setPeticion(array('operacion' => 'buscarActivo'));
				}
				$zafra = $lobj_Zafra->gestionar()['registro'];
				$this->aa_Atributos['fecha_dia'] = $zafra['fecha_dia'];
				if($zafra['fecha_dia'] == $fecha){
					return $correos[$i];
				}
			}
		}
		return false;
	}

	private function f_ExtraerListado($correo){
		foreach ($correo['attachment'] as $key => $value) {
			$extension = explode('.',$key);
			if($extension[count($extension)-1] == 'xlsx'){
				return array($key,$value);
			}
		}
		return false;
	}
}
?>
