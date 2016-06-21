 <?php
include_once('cls_Conexion.php');
class cls_Privilegio extends cls_Conexion{

	private $aa_Atributos = array();
	private $aa_Campos = array('codigo_clase','nombre','descripcion');

	public function setPeticion($pa_Peticion){
		$this->aa_Atributos=$pa_Peticion;
		$this->setDatosConexion($_SESSION['Con']['Nombre'],$_SESSION['Con']['Pass']);
	}

	public function getAtributos(){
		return $this->aa_Atributos;
	}

	public function gestionar(){
		switch ($this->aa_Atributos['operacion']) {

			case 'buscarRegistro':
				$la_respuesta=$this->f_Buscar();
				if(count($la_respuesta)!=0){
					$respuesta['registro'] = $la_respuesta;
					$success=1;
				}else{
					$respuesta['mensaje'] = 'Relacion no existe';
					$respuesta['tipo'] = 'advertencia';
					$respuesta['titulo'] = 'advertencia';
				}
				break;

			case 'buscarArbol':
				$la_respuesta['hojasGenereal']=$this->f_BuscarArbol();
				$la_respuesta['hojasActuales']=$this->f_BuscarArbolPrivilegios();
				if(count($la_respuesta)!=0){
					$respuesta['hojasGenereal'] = $la_respuesta['hojasGenereal'];
					$respuesta['hojasActuales'] = $la_respuesta['hojasActuales'];
					$success=1;
				}else{
					$respuesta['mensaje'] = 'Arbol vacio';
					$respuesta['tipo'] = 'advertencia';
					$respuesta['titulo'] = 'advertencia';
				}
				break;

			case 'guardarArbol':
			$la_respuesta=$this->f_GuardarArbol();
			if(count($la_respuesta)!=0){
				$respuesta['hojasGenereal'] = $la_respuesta['hojasGenereal'];
				$respuesta['hojasActuales'] = $la_respuesta['hojasActuales'];
				$success=1;
			}else{
				$respuesta['mensaje'] = 'No se pudo guardar los cambios';
				$respuesta['tipo'] = 'error';
				$respuesta['titulo'] = 'Error Interno Del Servidor';
			}
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

	private function f_Buscar(){
		//Busco Detalle
		$ls_Sql="SELECT * from seguridad.vroles_por_empresa
				WHERE codigo_relacion='".$this->aa_Atributos['codigo']."'";
		$this->f_Con();
		$lr_tabla=$this->f_Filtro($ls_Sql);
		if($la_registros=$this->f_Arreglo($lr_tabla)){
			$la_respuesta['codigoEmpresa']=$la_registros['codigo_empresa'];
			$la_respuesta['codigoRol']=$la_registros['codigo_rol'];
			$la_respuesta['empresa']=$la_registros['nombre_empresa'];
			$la_respuesta['rol']=$la_registros['nombre_rol'];
			$la_respuesta['codigoRelacion']=$la_registros['codigo_relacion'];
		}
		$this->f_Cierra($lr_tabla);
		$this->f_Des();

		return $la_respuesta;
	}

	private function f_BuscarArbolPrivilegios(){
		$x=0;
		$la_Privilegios=array();
		$ls_Sql="SELECT * from seguridad.varbol_privilegio_usuario where estado_privilegio='A' and llave_acceso='".$this->aa_Atributos['codigo']."'";
		$this->f_Con();
		$lr_tabla=$this->f_Filtro($ls_Sql);
		while($la_registro=$this->f_Arreglo($lr_tabla)){
			$la_Privilegios[$x]['titulo']=$la_registro['titulo'];
			$la_Privilegios[$x]['codigo']=$la_registro['componente'];
			$la_Privilegios[$x]['padre']=$la_registro['padre'];
			$la_Privilegios[$x]['tit_padre']=$la_registro['titulo_padre'];
			$la_Privilegios[$x]['tipo']=$la_registro['tipo'];
			$la_Privilegios[$x]['llave_acceso']=$la_registro['llave_acceso'];
			$x++;
		}
		$y = 0;
		$this->f_Cierra($lr_tabla);
		$this->f_Des();
		return $la_Privilegios;
	}

	private function f_BuscarArbol(){
		$x=0;
		$la_Privilegios=array();
		$ls_Sql="SELECT * from seguridad.varbol_componente ";
		$this->f_Con();
		$lr_tabla=$this->f_Filtro($ls_Sql);
		while($la_registro=$this->f_Arreglo($lr_tabla)){
			$la_Privilegios[$x]['titulo']=$la_registro['titulo'];
			$la_Privilegios[$x]['codigo']=$la_registro['codigo'];
			$la_Privilegios[$x]['padre']=$la_registro['padre'];
			$la_Privilegios[$x]['tit_padre']=$la_registro['titulo_padre'];
			$la_Privilegios[$x]['tipo']=$la_registro['tipo'];
			$x++;
		}
		$this->f_Cierra($lr_tabla);
		$this->f_Des();
		return $la_Privilegios;
	}

	private function f_GuardarArbol(){
		$permisosActual = $this->f_BuscarArbolPrivilegios();
		print_r($permisosActual);
		$data = json_decode(stripslashes($this->aa_Atributos['data']));
		foreach($data as $d){
	     //echo $d->codigo;
	  };
	}
}
?>
