 <?php
include_once('../../nucleo/clases/cls_Conexion.php');
include_once('../../nucleo/clases/cls_Mensaje_Sistema.php');
class cls_Variedad extends cls_Conexion{

	private $aa_Atributos = array();
	private $aa_Campos = array('codigo_variedad','nombre','descripcion','codigo_variedad_capca','dias_punto_maduracion');

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
		$ls_Sql="SELECT * FROM agronomia.vvariedad ";
		$this->f_Con();
		$lr_tabla=$this->f_Filtro($ls_Sql);
		while($la_registros=$this->f_Arreglo($lr_tabla)){
			$la_respuesta[$x]['codigo']=$la_registros['codigo_variedad'];
			$la_respuesta[$x]['nombre']=$la_registros['nombre'];
			$x++;
		}
		$this->f_Cierra($lr_tabla);
		$this->f_Des();
		return $la_respuesta;
	}

	private function f_Buscar(){
		$lb_Enc=false;
		//Busco El rol
		$ls_Sql="SELECT * FROM agronomia.vvariedad where codigo_variedad='".$this->aa_Atributos['codigo']."'";
		$this->f_Con();
		$lr_tabla=$this->f_Filtro($ls_Sql);
		if($la_registros=$this->f_Arreglo($lr_tabla)){
			$la_respuesta['codigo']=$la_registros['codigo_variedad'];
			$la_respuesta['nombre']=$la_registros['nombre'];
			$la_respuesta['descripcion']=$la_registros['descripcion'];
			$la_respuesta['codigo_variedad_capca']=$la_registros['codigo_variedad_capca'];
			$la_respuesta['dias_punto_maduracion']=$la_registros['dias_punto_maduracion'];
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
		//encripto la contraseña
		include_once('cls_acceso.php');
		$lobj_Acceso = new cls_acceso;
		$this->aa_Atributos['clave'] = $lobj_Acceso->encriptarPass($this->aa_Atributos['clave']);

		$lb_Hecho=false;
		$ls_Sql="INSERT INTO agronomia.vvariedad (nombre,descripcion,codigo_variedad_capca,dias_punto_maduracion) values
				('".$this->aa_Atributos['nombre']."','".$this->aa_Atributos['descripcion']."',";
		$ls_Sql.="'".$this->aa_Atributos['codigo_variedad_capca']."','".$this->aa_Atributos['dias_punto_maduracion']."')";
		$this->f_Con();
		$lb_Hecho=$this->f_Ejecutar($ls_Sql);
		$this->f_Des();
		return $lb_Hecho;
	}

	private function f_BuscarUltimo(){
		$lb_Enc=false;
		//Busco El rol
		$ls_Sql="SELECT * from agronomia.vvariedad WHERE codigo_variedad = (SELECT MAX(codigo_variedad) from agronomia.vvariedad) ";
		$this->f_Con();
		$lr_tabla=$this->f_Filtro($ls_Sql);
		if($la_registros=$this->f_Arreglo($lr_tabla)){
			$la_respuesta['codigo']=$la_registros['codigo_variedad'];
			$la_respuesta['nombre']=$la_registros['nombre'];
			$la_respuesta['descripcion']=$la_registros['descripcion'];
			$la_respuesta['codigo_variedad_capca']=$la_registros['codigo_variedad_capca'];
			$la_respuesta['dias_punto_maduracion']=$la_registros['dias_punto_maduracion'];
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
		if(isset($this->aa_Atributos['nombre'])){
			$this->aa_Atributos['nom'] = $this->aa_Atributos['nombre'];
		}
		$ls_Sql="UPDATE agronomia.vvariedad SET ";

		//arma la cadena sql en base a los campos pasados en la peticion
		$ls_Sql.=$this->armarCamposUpdate($this->aa_Campos,$this->aa_Atributos);

		$ls_Sql.="WHERE codigo_variedad ='".$this->aa_Atributos['codigo']."'";
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
