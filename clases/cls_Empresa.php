 <?php 
include('cls_Conexion.php');
class cls_Empresa extends cls_Conexion{
	
	private $aa_Atributos = array();

	public function setPeticion($pa_Peticion){
		$this->aa_Atributos=$pa_Peticion;
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
					$respuesta['mensaje'] = 'Insercion realizada con exito';
					$success=1;
				}
				break;
			default:
				$respuesta['mensaje'] = 'Operacion "'.strtoupper($this->aa_Atributos['operacion']).'" no existe para esta entidad';
				$success = 0;
				break;
		}	
		$respuesta['success']=$success;
		return $respuesta;
	}
	private function f_Listar(){
		$x=0;
		$la_respuesta=array();
		$ls_Sql="SELECT * FROM global.empresa ";
		$this->f_Con();
		$lr_tabla=$this->f_Filtro($ls_Sql);
		while($la_registros=$this->f_Arreglo($lr_tabla)){
			$la_respuesta[$x]['codigo']=$la_registros['cod_emp'];
			$la_respuesta[$x]['nombre']=$la_registros['nombre'];
			$la_respuesta[$x]['descripcion']=$la_registros['descripcion'];
			$x++;
		}
		$this->f_Cierra($lr_tabla);
		$this->f_Des();
		return $la_respuesta;
	}

	private function f_Buscar(){
		$lb_Enc=false;
		//Busco El rol
		$ls_Sql="SELECT * FROM global.empresa where cod_emp='".$this->aa_Atributos['codigo']."'";
		$this->f_Con();
		$lr_tabla=$this->f_Filtro($ls_Sql);
		if($la_registros=$this->f_Arreglo($lr_tabla)){
			$la_respuesta['codigo']=$la_registros['cod_emp'];
			$la_respuesta['rif']=$la_registros['rif'];
			$la_respuesta['nombre']=$la_registros['nombre'];
			$la_respuesta['dir_fis']=$la_registros['dir_fis'];
			$la_respuesta['telefono']=$la_registros['telefono'];
			$la_respuesta['nombre_abr']=$la_registros['nombre_abr'];
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
		$ls_Sql="INSERT INTO global.empresa (nombre,rif,dir_fis,telefono,correo,nombre_br) values 
				('".$this->aa_Atributos['nombre']."','".$this->aa_Atributos['rif']."','".$this->aa_Atributos['dir_fis']."',
				'".$this->aa_Atributos['telefono']."','".$this->aa_Atributos['correo']."','".$this->aa_Atributos['nombre_abr']."')";
		$this->f_Con();
		$lb_Hecho=$this->f_Ejecutar($ls_Sql);
		$this->f_Des();
		return $lb_Hecho;
	}
}
?>