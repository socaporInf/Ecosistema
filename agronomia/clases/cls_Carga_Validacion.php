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
				$UID = $lobj_MAC->getAtributos()['UID'];

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
				if(count($data) > 0){
					$cabeceras = $this->obtenerCabeceras($data);
					$datos = $this->obtenerRegistros($data,$UID,$cabeceras);

					$fechadia = $datos[1]['fechadia'];
					$this->validarDia($fechadia,$UID);
					$this->f_Con();
					$this->f_Begin();
					if(!$this->aa_Atributos['correoGuardado']){
						if(!$this->aa_Atributos['fechaRegistrada']){
							//primera vez
							$lb_hecho = false;
							$lb_hecho = $this->insertarListado($datos);
							if($lb_hecho){
								/*TODO: dispara notificacion de:
								*				Carga de validacion $fecha dia realizado de forma exitosa
								*/
								$this->f_Commit();
							}else{
								/*TODO: dispara notificacion de:
								*				Error en insercion de listado de validacion del dia $fechadia
								*/
								$this->f_RollBack();
							}
						}else {
							//ya existe data de ese dia
							$lb_hecho = false;
							$lb_hecho = $this->eliminarListado($fechadia);
							if(!$lb_hecho){
								/*TODO: dispara notificacion de:
								*				Error al eliminar registros anteriores del listado de validacion del dia $fechadia
								*/
								$this->f_RollBack();
							}else {
								$lb_hecho = false;
								$lb_hecho = $this->insertarListado($datos);
								if(!$lb_hecho){
									/*TODO: dispara notificacion de:
									*				Error al eliminar registros anteriores del listado de validacion del dia $fechadia
									*/
									$this->f_RollBack();
								}else{
									/*TODO: dispara notificacion de:
									*				Reemplazo de listado de validacion de fecha $fechadia  realizado de forma exitosa
									*/
									$this->f_Commit();
								}
							}
						}
					}
					$this->f_Des();
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
	private function validarDia($diaCorreo,$UIDCorreo){
		$this->aa_Atributos['fechaRegistrada'] = false;
		$this->aa_Atributos['correoGuardado'] = false;
		$ls_Sql = "SELECT * FROM agronomia.vvalidacion_correo WHERE fechadia = '".$diaCorreo."'";
		$this->f_Con();
		$lr_tabla=$this->f_Filtro($ls_Sql);
		if($la_registros=$this->f_Arreglo($lr_tabla)){
			$this->aa_Atributos['fechaRegistrada'] = true;
			if($la_registros['uid'] == $UIDCorreo){
					$this->aa_Atributos['correoGuardado'] = true;
			}
		}
		$this->f_Cierra($lr_tabla);
		$this->f_Des();
	}
	private function insertarListado($listado){
		$ls_SqlBase = 'INSERT INTO agronomia.vvalidacion_correo ';
		$x = 1;
		do {
			$lb_hecho = false;
			//armar Sql
			$ls_SqlCampos = ' (';
			$ls_Sqlvalores = ' values(';
			foreach ($listado[$x] as $key => $value) {
				//armado de SQLCAMPOS
				$ls_SqlCampos .= $key." , ";
				//armado de SQLVALORES
				if($value!=''){
					$ls_Sqlvalores .= "'".$value."' , ";
				}else{
					$ls_Sqlvalores .= "NULL , ";
				}
			}

			//elimino la coma sobrante al final de las cadenas
			$ls_SqlCampos = substr($ls_SqlCampos,0,strlen($ls_SqlCampos)-2).') ';
			$ls_Sqlvalores = substr($ls_Sqlvalores,0,strlen($ls_Sqlvalores)-2).');';
			//armo el sql completo con campos y valores
			$ls_Sql = $ls_SqlBase.$ls_SqlCampos.$ls_Sqlvalores;
			//empieza la insercion
			$lb_hecho = $this->f_Ejecutar($ls_Sql);
			$x++;
		} while (($x <= count($listado))&&($lb_hecho));

		return $lb_hecho;
	}
	private function eliminarListado($fechadia){
		$lb_hecho|
		$ls_Sql = "DELETE FROM agronomia.vvalidacion_correo WHERE fechadia = '".$fechadia."'";
		$lb_hecho = $this->f_Ejecutar($ls_Sql);
	}
	private function obtenerCabeceras($data){
		$data[1][count($data[1])] = 'uid';
		return $data[1];
	}
	private function obtenerRegistros($data,$UID,$cabeceras){
		$datos = array();
		for ($i=2; $i < count($data) ; $i++) {
			for ($x=0; $x < count($cabeceras); $x++) {
				$datos[$i-1][$cabeceras[$x]] = $data[$i][$x];
			}
			$datos[$i-1]['uid'] = $UID;
		}
		return $datos;
	}
}
?>
