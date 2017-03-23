<?php
include_once('../../nucleo/clases/cls_Conexion.php');
include_once('../../nucleo/clases/cls_Mensaje_Sistema.php');
class cls_Registro_Virtual extends cls_Conexion{

	protected $aa_Atributos = array();
	private $aa_Campos = array('codigo','nombre','funcion','campo_relacion');

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
			case 'buscarRegistro':
				$lb_Enc=$this->f_buscar();
				if($lb_Enc){
					$respuesta['registros']=$this->aa_Atributos['registro'];
					$success=1;
				}
				break;

			case 'listar':
				$lb_Enc=$this->f_Listar();
				if($lb_Enc){
					$success=1;
					$respuesta['registros']=$this->aa_Atributos['registros'];
					$respuesta['paginas']=$this->aa_Atributos['paginas'];
				}else{
					$respuesta['success'] = 1;
					$respuesta['mensaje'] = $lobj_Mensaje->buscarMensaje(8);
				}
				break;

			case 'buscarRegistroPorNombreTabla':
				$lb_Enc=$this->f_Listar();
				if($lb_Enc){
					$success=1;
					$respuesta['registros']=$this->aa_Atributos['registros'];
					$respuesta['paginas']=$this->aa_Atributos['paginas'];
				}else{
					$respuesta['success'] = 1;
					$respuesta['mensaje'] = $lobj_Mensaje->buscarMensaje(8);
				}
				break;

			case 'guardar':
				$lb_Hecho = $this->f_Guardar();
				if($lb_Hecho){
					$respuesta['registros'] = $this->aa_Atributos['registro'];
					$respuesta['mensaje'] = $lobj_Mensaje->buscarMensaje(9);
					$success = 1;
				}else{
					$respuesta['mensaje'] = $lobj_Mensaje->buscarMensaje(10);
					$success = 0;
				}
				break;

			case 'modificar':
				$lb_Hecho = $this->f_Modificar();
				if($lb_Hecho){
					$respuesta['success'] = 1;
				}else{
					$respuesta['success'] = 0;
					$respuesta['mensaje']['mensaje'] = 'Fallo al insertar registro virtual';
					$respuesta['mensaje']['tipo'] = 'Error';
					$respuesta['mensaje']['titulo'] = 'Error interno del servidor';
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
	private function f_Listar(){
		$x=0;
		$la_respuesta=array();
		if(isset($this->aa_Atributos['nombre_tabla'])){
			$ls_SqlBase="SELECT * FROM global.vregistro_virtual WHERE nombre_tabla='".$this->aa_Atributos['nombre_tabla']."' ";
		}else{
			$ls_SqlBase="SELECT * FROM global.vregistro_virtual WHERE codigo_tabla='".$this->aa_Atributos['codigo']."' ";
		}
		$cadenaBusqueda = ($this->aa_Atributos['valor']=='')?'':"AND nombre_registro like '%".$this->aa_Atributos['valor']."%'";
	  $ls_SqlBase.=$cadenaBusqueda;
	  $orden = " ORDER BY codigo_registro  ";
	  $ls_Sql = $this->f_ArmarPaginacion($ls_SqlBase,$orden);
		$this->f_Con();
		$lr_tabla=$this->f_Filtro($ls_Sql);
		while($la_registros=$this->f_Arreglo($lr_tabla)){
			$la_respuesta[$x]['codigo']=$la_registros['codigo_registro'];
			$la_respuesta[$x]['nombre']=$la_registros['nombre_registro'];
			$la_respuesta[$x]['descripcion']=$la_registros['descripcion_registro'];
			$x++;
		}
		$this->f_Cierra($lr_tabla);
		$this->f_Des();
		$this->aa_Atributos['registros'] = $la_respuesta;
	  $lb_Enc=($x == 0)?false:true;
	  return $lb_Enc;
	}

	private function f_Buscar(){
		$lb_Enc=false;
		//Busco El rol
		$ls_Sql="SELECT * FROM global.vregistro_virtual where codigo_registro='".$this->aa_Atributos['codigo']."'";
		$this->f_Con();
		$lr_tabla=$this->f_Filtro($ls_Sql);
		if($la_registros=$this->f_Arreglo($lr_tabla)){
			$la_respuesta['codigo']=$la_registros['codigo_registro'];
			$la_respuesta['nombre']=$la_registros['nombre_registro'];
			$la_respuesta['descripcion']=$la_registros['descripcion_registro'];
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
		$ls_Sql="INSERT INTO global.vregistro_virtual (nombre_registro,descripcion_registro,codigo_tabla) values
				('".$this->aa_Atributos['nombre']."','".$this->aa_Atributos['descripcion']."','".$this->aa_Atributos['codigo_tabla']."')";
		$this->f_Con();
		$lb_Hecho=$this->f_Ejecutar($ls_Sql);
		$this->f_Des();
		return $lb_Hecho;
	}

	private function f_Modificar(){
		$lb_Hecho=false;
		$ls_Sql="UPDATE global.vregistro_virtual SET ";
		$ls_Sql.="nombre_registro ='".$this->aa_Atributos['nombre']."', ";
		$ls_Sql.="descripcion_registro ='".$this->aa_Atributos['descripcion']."' ";
		$ls_Sql.="WHERE codigo_registro ='".$this->aa_Atributos['codigo']."' ";
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
