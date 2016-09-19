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
				include_once('cls_ManejadorCorreo.php');
				$lobj_MAC = new cls_ManejadorCorreo();
				$pet = array(
					'operacion'=>'buscarArchivoCorreo'
				);
				$lobj_MAC->setPeticion($pet);
				$archivo = $lobj_MAC->gestionar();

				//extraigo los datos del archivo
				include_once('cls_ManejadorListado.php');
				$lobj_MAL = new cls_ManejadorListado();
				$pet = array(
					'operacion'=>'extraerDatos',
					'archivo'=>$archivo
				);
				$lobj_MAL->setPeticion($pet);
				$data = $lobj_MAL->gestionar();

				//TODO: procesar los datos y guardarlos en la base de datos
				$datos['cabeceras'] = $this->obtenerCabeceras($data);
				$datos['registros'] = $this->obtenerRegistros($data);

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
	private function obtenerCabeceras($data){
		return $data[1];
	}
	private function obtenerRegistros($data){
		$datos = array();
		for ($i=2; $i < count($data) ; $i++) {
			$datos[$i-1] = $data[$i];
		}
		return $datos;
	}
}
?>
