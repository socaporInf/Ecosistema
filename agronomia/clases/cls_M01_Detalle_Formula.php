<?php
include_once('../../nucleo/clases/cls_Conexion.php');
include_once('../../nucleo/clases/cls_Mensaje_Sistema.php');
class cls_M01_Detalle_Formula extends cls_Conexion{

	protected $aa_Atributos = array();
	private $aa_Campos = array('codigo_detalle_formula','tipo_operacion','secuencia','codigo_formula','codigo_componente');

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
			$ls_SqlBase="SELECT * FROM agronomia.vm01_detalle_formula WHERE codigo_formula='".$this->aa_Atributos['codigo']."' ";
		}
		$cadenaBusqueda = ($this->aa_Atributos['valor']=='')?'':"AND tipo_operacion like '%".$this->aa_Atributos['valor']."%'";
	  $ls_SqlBase.=$cadenaBusqueda;
	  $orden = " ORDER BY codigo_componente  ";
	  $ls_Sql = $this->f_ArmarPaginacion($ls_SqlBase,$orden);
		$this->f_Con();
		$lr_tabla=$this->f_Filtro($ls_Sql);
		while($la_registros=$this->f_Arreglo($lr_tabla)){
			$la_respuesta[$x]['codigo']=$la_registros['codigo_detalle_formula'];
			$la_respuesta[$x]['nombre']=$la_registros['tipo_operacion'];
			$la_respuesta[$x]['secuencia']=$la_registros['secuencia'];
			$la_respuesta[$x]['codigo_formula']=$la_registros['codigo_formula'];
			$la_respuesta[$x]['codigo_componente']=$la_registros['codigo_componente'];
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
		$ls_Sql="SELECT * FROM agronomia.vm01_detalle_formula where codigo_detalle_formula='".$this->aa_Atributos['codigo']."'";
		$this->f_Con();
		$lr_tabla=$this->f_Filtro($ls_Sql);
		if($la_registros=$this->f_Arreglo($lr_tabla)){
			$la_respuesta['codigo']=$la_registros['codigo_detalle_formula'];
			$la_respuesta['nombre']=$la_registros['tipo_operacion'];
			$la_respuesta['secuencia']=$la_registros['secuencia'];
			$la_respuesta['codigo_formula']=$la_registros['codigo_formula'];
			$la_respuesta['codigo_componente']=$la_registros['codigo_componente'];
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
		$ls_Sql="INSERT INTO agronomia.vm01_detalle_formula (tipo_operacion,secuencia,codigo_formula,codigo_componente) 
			values(
				'".$this->aa_Atributos['nombre']."',
				'".$this->aa_Atributos['secuencia']."',
				'".$this->aa_Atributos['codigo_formula']."',
				'".$this->aa_Atributos['codigo_componente']."'
				)";
		$this->f_Con();
		//print($ls_Sql);
		$lb_Hecho=$this->f_Ejecutar($ls_Sql);
		$this->f_Des();
		return $lb_Hecho;
	}

	private function f_Modificar(){
		$lb_Hecho=false;
		$ls_Sql="UPDATE agronomia.vm01_detalle_formula SET ";
		$ls_Sql.="tipo_operacion ='".$this->aa_Atributos['nombre']."', ";
		$ls_Sql.="secuencia ='".$this->aa_Atributos['secuencia']."', ";
		$ls_Sql.="codigo_componente ='".$this->aa_Atributos['codigo_componente']."' ";
		$ls_Sql.="WHERE codigo_detalle_formula ='".$this->aa_Atributos['codigo']."' ";
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
