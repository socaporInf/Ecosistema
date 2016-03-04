<?php 
include('cls_Conexion.php');
class cls_Empresa extends cls_Conexion{
	
	private $aa_Form = array();

	public function setForm($pa_Form){
		$this->aa_Form=$pa_Form;
	}

	public function getForm(){
		return $this->aa_Form;
	}

	public function f_Listar(){
		$x=0;
		$la_respuesta=array();
		$ls_Sql="SELECT * FROM global.empresa ";
		$this->f_Con();
		$lr_tabla=$this->f_Filtro($ls_Sql);
		while($la_registros=$this->f_Arreglo($lr_tabla)){
			$la_respuesta[$x]['codigo']=$la_registros['codigo'];
			$la_respuesta[$x]['nombre']=$la_registros['nombre'];
			$la_respuesta[$x]['descripcion']=$la_registros['descripcion'];
			$x++;
		}
		$this->f_Cierra();
		$this->f_Des();
		return $la_respuesta;
	}

	public function f_Buscar(){
		$lb_Enc=false;
		//Busco El rol
		$ls_Sql="SELECT * FROM global.empresa where codigo='".$this->aa_Form['codigo']."'";
		$this->f_Con();
		$lr_tabla=$this->f_Filtro($ls_Sql);
		if($la_registros=$this->f_Arreglo($lr_tabla)){
			$la_respuesta['codigo']=$la_registros['codigo'];
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
			$this->aa_Form['registro']=$la_respuesta;
		}

		return $lb_Enc;
	}
}
?>