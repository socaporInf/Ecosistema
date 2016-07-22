<?php
include_once('../../nucleo/clases/cls_Conexion.php');
include_once('../../nucleo/clases/cls_Mensaje_Sistema.php');
class cls_Rol extends cls_Conexion{

	private $aa_Atributos = array();

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
				}
				break;

			case 'buscarRegistro':
				$lb_Enc=$this->f_buscar();
				if($lb_Enc){
					$respuesta['registros'] = $this->aa_Atributos['registro'];
					$success=1;
				}
				break;

			case 'buscarDetalle':
				$registros=$this->f_Buscar_Detalle();
				if(count($registros)){
					$respuesta['registros'] = $registros;
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

			case 'guardarDetalle':
				$respuesta=$this->guardarDetalle();
				if($respuesta!=false){
					$respuesta['registro'] = $respuesta;
					$respuesta['mensaje'] = $lobj_Mensaje->buscarMensaje(16);
					$success=1;
				}else{
					$respuesta['mensaje'] = $lobj_Mensaje->buscarMensaje(17);
					$success = 0;
				}
			break;

			case 'eliminarDetalle':
				$lb_Hecho=$this->eliminarDetalle();
				if($lb_Hecho){
					$respuesta['mensaje'] = 'Eliminacion realizada con exito';
					$respuesta['codigo_empresa'] = $this->aa_Atributos['codigo_empresa'];
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

	private function f_Buscar(){
		$lb_Enc=false;
		//Busco El rol
		$ls_Sql="SELECT * FROM seguridad.vrol where codigo_rol='".$this->aa_Atributos['codigo']."'";
		$this->f_Con();
		$lr_tabla=$this->f_Filtro($ls_Sql);
		if($la_registros=$this->f_Arreglo($lr_tabla)){
			$la_respuesta['codigo']=$la_registros['codigo_rol'];
			$la_respuesta['nombre']=$la_registros['nombre'];
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

	private function f_BuscarUltimo(){
		$lb_Enc=false;
		//Busco El rol
		$ls_Sql="SELECT * from seguridad.vrol WHERE codigo_rol = (SELECT MAX(codigo_rol) from seguridad.vrol) ";
		$this->f_Con();
		$lr_tabla=$this->f_Filtro($ls_Sql);
		if($la_registros=$this->f_Arreglo($lr_tabla)){
			$la_respuesta['codigo']=$la_registros['codigo_rol'];
			$la_respuesta['nombre']=$la_registros['nombre'];
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

	private function f_Buscar_Detalle(){

		//Busco Detalle
		$ls_Sql="SELECT * from seguridad.vroles_por_empresa
				WHERE codigo_rol='".$this->aa_Atributos['codigo']."'";
		$this->f_Con();
		$lr_tabla=$this->f_Filtro($ls_Sql);
		$x=0;
		while($la_registros=$this->f_Arreglo($lr_tabla)){
			$la_respuesta[$x]['codigo']=$la_registros['codigo_empresa'];
			$la_respuesta[$x]['codigo_rol']=$la_registros['codigo_rol'];
			$la_respuesta[$x]['nombre']=$la_registros['nombre_empresa'];
			$la_respuesta[$x]['codigoRelacion']=$la_registros['codigo_relacion'];
			$x++;
		}
		$this->f_Cierra($lr_tabla);
		$this->f_Des();

		return $la_respuesta;
	}

	private function f_Listar(){
		$x=0;
		$la_respuesta=array();
		$ls_Sql="SELECT * FROM seguridad.vrol ";
		$this->f_Con();
		$lr_tabla=$this->f_Filtro($ls_Sql);
		while($la_registros=$this->f_Arreglo($lr_tabla)){
			$la_respuesta[$x]['codigo']=$la_registros['codigo_rol'];
			$la_respuesta[$x]['nombre']=$la_registros['nombre'];
			$la_respuesta[$x]['descripcion']=$la_registros['descripcion'];
			$x++;
		}
		$this->f_Cierra($lr_tabla);
		$this->f_Des();
		return $la_respuesta;
	}

	private function f_Guardar(){

		$lb_Hecho=false;
		$ls_Sql="INSERT INTO seguridad.vrol (nombre,descripcion) values
				('".$this->aa_Atributos['nombre']."','".$this->aa_Atributos['descripcion']."')";
		$this->f_Con();
		$lb_Hecho=$this->f_Ejecutar($ls_Sql);
		$this->f_Des();
		return $lb_Hecho;
	}

	private function guardarDetalle(){
		$lb_Hecho=false;
		$ls_Sql='INSERT INTO seguridad.vroles_por_empresa (codigo_rol,codigo_empresa) values ('.$this->aa_Atributos['codigo'].','.$this->aa_Atributos['codigo_empresa'].')';
		$this->f_Con();
		$lb_Hecho=$this->f_Ejecutar($ls_Sql);
		$this->f_Des();
		if($lb_Hecho){
			$la_detalle=$this->f_Buscar_Detalle();
			for($x = 0; $x < count($la_detalle); $x++){
				if(($la_detalle[$x]['codigo_rol']==$this->aa_Atributos['codigo'])&&($la_detalle[$x]['codigo']==$this->aa_Atributos['codigo_empresa'])){
					$la_respuesta = $la_detalle[$x];
				}
			}
			return $la_respuesta;
		}
		return $lb_Hecho;
	}

	private function eliminarDetalle(){
		$lb_Hecho=false;
		$ls_Sql='DELETE FROM seguridad.vroles_por_empresa WHERE codigo_rol='.$this->aa_Atributos['codigo'].' and codigo_empresa='.$this->aa_Atributos['codigo_empresa'].'';
		$this->f_Con();
		$lb_Hecho=$this->f_Ejecutar($ls_Sql);
		$this->f_Des();
		return $lb_Hecho;
	}
}
?>
