<?php
include_once('../../lib/Eden-Php/eden.php');
include_once('../../nucleo/clases/cls_Conexion.php');
include_once('../../nucleo/clases/cls_Mensaje_Sistema.php');
include_once('cls_DiaZafra.php');
include_once('../../global/clases/cls_Notificacion.php');
//include_once('cls_ManejadorCorreo.php');
//include_once('cls_ManejadorListado.php');
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
				$respuesta =$this->f_BuscarListadoDia();
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
		$data[0][count($data[1])] = 'uid';
		return $data[0];
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
	private function f_BuscarListadoDia(){
		print('llego');
		/*$lobj_MAC = new cls_ManejadorCorreo();
		$pet = array(
			'operacion'=>'buscarArchivoCorreo'
		);
		if(isset($this->aa_Atributos['dia'])){
			$pet['dia'] = $this->aa_Atributos['dia'];
		}
		$lobj_MAC->setPeticion($pet);
		$archivo = $lobj_MAC->gestionar();
		if($archivo!=false){

			$UID = $lobj_MAC->getAtributos()['UID'];

			//extraigo los datos del archivo
			/*$lobj_MAL = new cls_ManejadorListado();
			$pet = array(
				'operacion'=>'extraerDatos',
				'archivo'=>$archivo
			);
			$lobj_MAL->setPeticion($pet);
			$data = $lobj_MAL->gestionar();

			if(count($data) > 0){
				$cabeceras = $this->obtenerCabeceras($data);
				$datos = $this->obtenerRegistros($data,$UID,$cabeceras);

				//instancio los objetos de modo que puedan ser utilizados segun sea necesario
				//notificacion para disparar las notificaciones
				$lobj_Notificacion = new cls_Notificacion();
				//dia zafra para cambia el estado segun sea el caso
				$lobj_DiaZafra = new cls_DiaZafra();

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
							//dispario notificacion
							$petNot  = array(
								'operacion' => 'crearNotificacionPorPlantilla',
								'plantilla' => 'CARGA VALIDACION EXITOSA'
							);
							$petDZ  = array(
								'operacion' => 'cambioAtributos',
								'codigo_estado_datos' => 35,
								'codigo_proceso_dia' => 2,
							);
							$this->f_Commit();
						}else{
							//dispario notificacion
							$petNot  = array(
									'operacion' => 'crearNotificacionPorPlantilla',
									'plantilla' => 'ERROR INSERCION EN BASE DE DATOS'
								);
							$petDZ  = array(
								'operacion' => 'cambioAtributos',
								'codigo_estado_datos' => 37
							);
							$this->f_RollBack();
						}
					}else {
						//ya existe data de ese dia
						$lb_hecho = false;
						$lb_hecho = $this->eliminarListado($fechadia);
						if(!$lb_hecho){
							//dispario notificacion
							$petNot  = array(
								'operacion' => 'crearNotificacionPorPlantilla',
								'plantilla' => 'ERROR ELIMINACION ANTERIORES'
							);
							$petDZ  = array(
								'operacion' => 'cambioAtributos',
								'codigo_estado_datos' => 37
							);
							$this->f_RollBack();
						}else {
							$lb_hecho = false;
							$lb_hecho = $this->insertarListado($datos);
							if(!$lb_hecho){
								//dispario notificacion
								$petNot  = array(
										'operacion' => 'crearNotificacionPorPlantilla',
										'plantilla' => 'ERROR REEMPLAZO DATOS'
									);
									$petDZ  = array(
										'operacion' => 'cambioAtributos',
										'codigo_estado_datos' => 37
									);
								$this->f_RollBack();
							}else{
								//dispario notificacion
								$petNot  = array(
									'operacion' => 'crearNotificacionPorPlantilla',
									'plantilla' => 'REEMPLAZO VALIDACION DIA'
								);
								$petDZ  = array(
									'operacion' => 'cambioAtributos',
									'codigo_estado_datos' => 35,
									'codigo_proceso_dia' => 2,
								);
								$this->f_Commit();
							}
						}
					}
				}else{
					$success = 0;
					$respuesta['mensaje'] = "Correo $UID ya cargado";
				}
				$this->f_Des();
				if($petNot['operacion']!='extraerDatos'){
					$petNot['valores'] = array('fechadia'=>$this->fFechaBD($fechadia));
					//dia de zafra
					$petDZ['fecha_dia'] = $fechadia;
					if(isset($this->aa_Atributos['dia'])){
						$petDZ['codigo'] = $this->aa_Atributos['dia'];
					}
					$lobj_DiaZafra->setPeticion($petDZ);
					$diaZafra = $lobj_DiaZafra->gestionar();
					if($diaZafra['success']==1){
						$success = 1;
						$respuesta['mensaje'] = 'Proceso culminada de forma exitosa';
					}else{
						$success = 0;
						$respuesta['mensaje'] = 'error al actualizar datos dia zafra';
					}
					//notificacion
					$lobj_Notificacion->setPeticion($petNot);
					$notificacion = $lobj_Notificacion->gestionar();
					if($notificacion['success']==1){
						$success = 1;
						$respuesta['mensaje'] = 'Proceso culminada de forma exitosa';
					}else{
						$success = 0;
						$respuesta['mensaje'] = 'error al disparar notificacion';
					}
				}
			}
		}else{
			$respuesta['mensaje'] = $lobj_MAC->getAtributos()['mensaje'];
			$success = 0;
		}*/
		$respuesta['success'] = $success;
		return $respuesta;
	}
}
?>
