<?php 
include('cls_Conexion.php');
class cls_Acceso extends cls_Conexion{
	
	private $aa_Form = array();

	public function setForm($pa_Form){
		$this->aa_Form=$pa_Form;
	}

	public function getForm(){
		return $this->aa_Form;
	}

	public function f_Accesar(){
		$x=0;
		$lb_Enc=false;
		$ls_Sql="SELECT * FROM seguridad.usuario where nombre='".$this->aa_Form['Nombre']."'";
		$this->f_Con();
		$lr_tabla=$this->f_Filtro($ls_Sql);
		if($la_registro=$this->f_Arreglo($lr_tabla)){
			if($la_registro['clave']==$this->aa_Form['Pass']){
				$lb_Enc=true;
			}
		}
		unset($this->aa_Form['Pass']);
		return $lb_Enc;
	}
}
?>