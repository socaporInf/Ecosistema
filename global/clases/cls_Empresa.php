 <?php
include_once('../../nucleo/clases/cls_Conexion.php');
include_once('../../nucleo/clases/cls_Mensaje_Sistema.php');
class cls_Empresa extends cls_Conexion{

	protected $aa_Atributos = array();
	private $aa_Campos = array('codigo_empresa','rif','nombre','nombre_abreviado','direccion_fiscal','telefono','correo');

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
			case 'buscar':
				$registros=$this->f_Listar();
				if(count($registros)!=0){
					$success=1;
					$respuesta['registros']=$registros;
				}else{
					$respuesta['success'] = 0;
					$respuesta['mensaje'] = $lobj_Mensaje->buscarMensaje(8);
				}
				break;

			case 'buscarRegistro':
				$lb_Enc=$this->f_buscar();
				if($lb_Enc){
					$respuesta['registros']=$this->aa_Atributos['registro'];
					$success=1;
				}
				break;

			case 'guardar':
				$lb_Hecho=$this->f_Guardar();
				if($lb_Hecho){
					$respuesta['mensaje'] = $lobj_Mensaje->buscarMensaje(9);
					$success=1;
				}else{
						$respuesta['mensaje'] = $lobj_Mensaje->buscarMensaje(10);
						$success = 0;
				}
				break;

			case 'modificar':
				$respuesta = $this->f_Modificar();
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
		$ls_Sql="SELECT * FROM global.vempresa ";
		$this->f_Con();
		$lr_tabla=$this->f_Filtro($ls_Sql);
		while($la_registros=$this->f_Arreglo($lr_tabla)){
			$la_respuesta[$x]['nombre']=$la_registros['nombre'];
			$la_respuesta[$x]['descripcion']=$la_registros['descripcion'];
			$la_respuesta[$x]['codigo']=$la_registros['codigo_empresa'];
			$x++;
		}
		$this->f_Cierra($lr_tabla);
		$this->f_Des();
		return $la_respuesta;
	}

	private function f_Buscar(){
		$lb_Enc=false;
		//Busco El rol
		$ls_Sql="SELECT * FROM global.vempresa where codigo_empresa='".$this->aa_Atributos['codigo']."'";
		$this->f_Con();
		$lr_tabla=$this->f_Filtro($ls_Sql);
		if($la_registros=$this->f_Arreglo($lr_tabla)){
			$la_respuesta['codigo']=$la_registros['codigo_empresa'];
			$la_respuesta['rif']=$la_registros['rif'];
			$la_respuesta['nombre']=$la_registros['nombre'];
			$la_respuesta['direccion_fiscal']=$la_registros['direccion_fiscal'];
			$la_respuesta['telefono']=$la_registros['telefono'];
			$la_respuesta['nombre_abreviado']=$la_registros['nombre_abreviado'];
			$la_respuesta['correo']=$la_registros['correo'];
			$lb_Enc=true;
		}
		$this->f_Cierra($lr_tabla);
		$this->f_Des();

		if($lb_Enc){
			//guardo en atributo de la clase
			$this->aa_Atributos['registro']=$la_respuesta;
		}

		return $lb_Enc;
	}

	private function f_Guardar(){
		$lb_Hecho=false;
		$ls_Sql="INSERT INTO global.vempresa (nombre,rif,direccion_fiscal,telefono,correo,nombre_abreviado) values
				('".$this->aa_Atributos['nombre']."','".$this->aa_Atributos['rif']."','".$this->aa_Atributos['direccion_fiscal']."',
				'".$this->aa_Atributos['telefono']."','".$this->aa_Atributos['correo']."','".$this->aa_Atributos['nombre_abreviado']."')";
		$this->f_Con();
		$lb_Hecho=$this->f_Ejecutar($ls_Sql);
		$this->f_Des();
		return $lb_Hecho;
	}

	private function f_Modificar(){
		$lb_Hecho=false;
		$contCampos = 0;
		$ls_Sql="UPDATE global.vempresa SET ";

		//arma la cadena sql en base a los campos pasados en la peticion
		$ls_Sql.=$this->armarCamposUpdate($this->aa_Campos,$this->aa_Atributos);

		$ls_Sql.="WHERE codigo_empresa ='".$this->aa_Atributos['codigo']."'";
		$this->f_Con();
		$lb_Hecho=$this->f_Ejecutar($ls_Sql);
		$this->f_Des();


		if($lb_Hecho){
			$this->f_Buscar();
			$respuesta['registro'] = $this->aa_Atributos['registro'];
			$respuesta['success'] = 1;
		}
		return $respuesta;
	}

}
?>
