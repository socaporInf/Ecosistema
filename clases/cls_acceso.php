<?php
include_once('cls_Conexion.php');
class cls_Acceso extends cls_Conexion{
	
	private $aa_Form = array();

	public function setForm($pa_Form){
		$this->aa_Form=$pa_Form;
	}

	public function getForm(){
		return $this->aa_Form;
	}

	public function f_Accesar(){
		$lb_Enc = $this->f_VerificarAcceso();
		return $lb_Enc;
	}

	public function encriptarPass($pass){
		return hash('whirlpool',$pass);
	}

	public function f_VerificarAcceso($pa_Clave){
		$this->aa_Form['Pass'] = $this->encriptarPass($this->aa_Form['Pass']);
		$lb_Enc=false;
		$ls_Sql="SELECT * FROM seguridad.usuario where nombre='".$this->aa_Form['Nombre']."'";
		$this->f_Con();
		$lr_tabla=$this->f_Filtro($ls_Sql);
		if($la_registro=$this->f_Arreglo($lr_tabla)){
			if($la_registro['clave']==$this->aa_Form['Pass']){
				$lb_Enc=true;
			}
		}
		$this->f_Cierra($lr_tabla);
		$this->f_Des();
		unset($this->aa_Form['Pass']);
		return $lb_Enc;
	}
}
?>