 <?php
include_once('cls_Conexion.php');
class cls_Mensaje_Sistema extends cls_Conexion{
	
	private $aa_Atributos = array();
	private $aa_Campos = array('codigo','titulo','cuerpo','tipo','descripcion');

	public function setPeticion($pa_Peticion){
		$this->aa_Atributos=$pa_Peticion;
		$this->setDatosConexion($_SESSION['Con']['Nombre'],$_SESSION['Con']['Pass']);
	}

	public function getAtributos(){
		return $this->aa_Atributos;
	}

	public function gestionar(){
		switch ($this->aa_Atributos['operacion']) {
			case 'buscar':
				$registros=$this->f_Listar();
				if(count($registros)!=0){
					$success=1;
					$respuesta['registros']=$registros;
				}else{
					$respuesta['success'] = 0;
					$respuesta['mensaje'] = 'no hay registros';
					$respuesta['tipo'] = 'advertencia';
					$respuesta['titulo'] = 'advertencia';	
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
					$this->f_BuscarUltimo();
					$respuesta['registros'] = $this->aa_Atributos['registro'];
					$respuesta['mensaje'] = 'Insercion realizada con exito';
					$success = 1;
				}else{
					$respuesta['mensaje'] = 'Error al ejecutar la insercion';
					$success = 0;
				}
				break;

			case 'modificar':
				$respuesta = $this->f_Modificar();
				break;
				
			default:
				$respuesta['mensaje'] = 'Operacion "'.strtoupper($this->aa_Atributos['operacion']).'" no existe para esta entidad';
				$success = 0;
				break;
		}
		if(!isset($respuesta['success'])){
			$respuesta['success']=$success;
		}	
		return $respuesta;
	}
	public function buscarMensaje($codigo){
		$la_peticion = array('codigo' => $codigo );
		$this->setPeticion($la_peticion);
		$this->f_Buscar();
		return $this->aa_Atributos['registro'];
	}
	public function completarMensaje($codigo,$valores){
		$mensaje = $this->buscarMensaje($codigo);
		foreach ($valores as $aCambiar => $nuevo) {
			$mensaje['titulo'] = str_replace($aCambiar, $nuevo, $mensaje['titulo']);
			$mensaje['cuerpo'] = str_replace($aCambiar, $nuevo, $mensaje['cuerpo']);
		}
		return $mensaje;
	}
	private function f_Listar(){
		$x=0;
		$la_respuesta=array();
		$ls_Sql="SELECT * FROM global.vmensaje_sistema ";
		$this->f_Con();
		$lr_tabla=$this->f_Filtro($ls_Sql);
		while($la_registros=$this->f_Arreglo($lr_tabla)){
			$la_respuesta[$x]['codigo']=$la_registros['codigo'];
			$la_respuesta[$x]['titulo']=$la_registros['titulo'];
			$x++;
		}
		$this->f_Cierra($lr_tabla);
		$this->f_Des();
		return $la_respuesta;
	}

	private function f_Buscar(){
		$lb_Enc=false;
		//Busco El rol
		$ls_Sql="SELECT * FROM global.vmensaje_sistema where codigo='".$this->aa_Atributos['codigo']."'";
		$this->f_Con();
		$lr_tabla=$this->f_Filtro($ls_Sql);
		if($la_registros=$this->f_Arreglo($lr_tabla)){
			$la_respuesta['codigo']=$la_registros['codigo'];
			$la_respuesta['nombre']=$la_registros['titulo'];
			$la_respuesta['titulo']=$la_registros['titulo'];
			$la_respuesta['cuerpo']=$la_registros['cuerpo'];
			$la_respuesta['tipo']=$la_registros['tipo'];
			$la_respuesta['nombre_tipo']=$la_registros['nombre_tipo'];
			$la_respuesta['descripcion']=$la_registros['descripcion'];
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
		$ls_Sql="INSERT INTO global.vmensaje_sistema (titulo,descripcion,cuerpo,tipo) values 
				('".$this->aa_Atributos['titulo']."','".$this->aa_Atributos['descripcion']."', 
				'".$this->aa_Atributos['cuerpo']."','".$this->aa_Atributos['tipo']."') ";
		$this->f_Con();
		$lb_Hecho=$this->f_Ejecutar($ls_Sql);
		$this->f_Des();
		return $lb_Hecho;
	}

	private function f_BuscarUltimo(){
		$lb_Enc=false;
		//Busco El rol
		$ls_Sql="SELECT * from global.vmensaje_sistema WHERE codigo = (SELECT MAX(codigo) from global.vmensaje_sistema) ";
		$this->f_Con();
		$lr_tabla=$this->f_Filtro($ls_Sql);
		if($la_registros=$this->f_Arreglo($lr_tabla)){
			$la_respuesta['codigo']=$la_registros['codigo'];
			$la_respuesta['titulo']=$la_registros['titulo'];
			$la_respuesta['cuerpo']=$la_registros['cuerpo'];
			$la_respuesta['tipo']=$la_registros['tipo'];
			$la_respuesta['descripcion']=$la_registros['descripcion'];
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

	private function f_Modificar(){
		$lb_Hecho=false;
		$contCampos = 0;
		$ls_Sql="UPDATE global.vmensaje_sistema SET ";

		//arma la cadena sql en base a los campos pasados en la peticion
		$ls_Sql.=$this->armarCamposUpdate($this->aa_Campos,$this->aa_Atributos);

		$ls_Sql.="WHERE codigo ='".$this->aa_Atributos['codigo']."'";
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