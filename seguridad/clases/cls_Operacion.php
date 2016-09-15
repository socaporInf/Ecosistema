<?php
include_once('../../nucleo/clases/cls_Conexion.php');
include_once('../../nucleo/clases/cls_Mensaje_Sistema.php');
class cls_Operacion extends cls_Conexion{

	protected $aa_Atributos = array();
	private $aa_Campos = array('codigo_operacion','nombre','descripcion');

	public function setPeticion($pa_Peticion){
		$this->aa_Atributos=$pa_Peticion;
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
					$this->f_BuscarUltimo();
					$respuesta['registros'] = $this->aa_Atributos['registro'];
					$respuesta['mensaje'] = $lobj_Mensaje->buscarMensaje(9);
					$success = 1;
				}else{
					$respuesta['mensaje'] = $lobj_Mensaje->buscarMensaje(10);
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
	private function f_Listar(){
		$x=0;
		$la_respuesta=array();
		$ls_Sql="SELECT * FROM seguridad.voperacion ";
		$this->f_Con();
		$lr_tabla=$this->f_Filtro($ls_Sql);
		while($la_registros=$this->f_Arreglo($lr_tabla)){
			$la_respuesta[$x]['codigo']=$la_registros['codigo_operacion'];
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
		$ls_Sql="SELECT * FROM seguridad.voperacion where codigo_operacion='".$this->aa_Atributos['codigo']."'";
		$this->f_Con();
		$lr_tabla=$this->f_Filtro($ls_Sql);
		if($la_registros=$this->f_Arreglo($lr_tabla)){
			$la_respuesta['codigo']=$la_registros['codigo_operacion'];
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
		$ls_Sql="SELECT *  from seguridad.voperacion where codigo_operacion = (SELECT max (codigo_operacion)
			      FROM seguridad.voperacion)  ";
		$this->f_Con();
		$lr_tabla=$this->f_Filtro($ls_Sql);
		if($la_registros=$this->f_Arreglo($lr_tabla)){
			$la_respuesta['codigo']=$la_registros['codigo_operacion'];
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
	private function f_Guardar(){
		$lb_Hecho=false;
		$ls_Sql="INSERT INTO seguridad.voperacion (nombre,descripcion) values
				('".$this->aa_Atributos['nombre']."','".$this->aa_Atributos['descripcion']."')";
		$this->f_Con();
		$lb_Hecho=$this->f_Ejecutar($ls_Sql);
		$this->f_Des();
		return $lb_Hecho;
	}

	private function f_Modificar(){
		$lb_Hecho=false;
		$contCampos = 0;
		if(isset($this->aa_Atributos['nombre'])){
			$this->aa_Atributos['nombre'] = $this->aa_Atributos['nombre'];
		}
		$ls_Sql="UPDATE seguridad.voperacion SET ";

		//arma la cadena sql en base a los campos pasados en la peticion
		$ls_Sql.=$this->armarCamposUpdate($this->aa_Campos,$this->aa_Atributos);

		$ls_Sql.="WHERE codigo_operacion ='".$this->aa_Atributos['codigo']."'";
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
