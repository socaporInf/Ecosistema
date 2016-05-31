<?php
include_once('cls_Conexion.php');
class cls_Acceso extends cls_Conexion{
	
	private $aa_Atributos = array();

	public function setPeticion($pa_Peticion){
		$this->aa_Atributos=$pa_Peticion;
	}

	public function getAtributos(){
		return $this->aa_Atributos;
	}

	public function f_Accesar(){
		$lb_Enc = $this->f_VerificarAcceso($this->aa_Atributos['Nombre'],$this->aa_Atributos['Pass']);
		return $lb_Enc;
	}

	public function encriptarPass($pass){
		return hash('whirlpool',$pass);
	}

	public function f_VerificarAcceso($ps_Nombre,$ps_Pass){
		$this->aa_Atributos['PassBD'] = $this->encriptarPass($this->aa_Atributos['Pass']);
		$lb_Enc=false;
		$ls_Sql="SELECT * FROM seguridad.vusuario where nombre='".$this->aa_Atributos['Nombre']."'";
		$this->setDatosConexion($ps_Nombre,$ps_Pass);
		$this->f_Con();
		$lr_tabla=$this->f_Filtro($ls_Sql);
		if($la_registro=$this->f_Arreglo($lr_tabla)){
			if($la_registro['contrasena']==$this->aa_Atributos['PassBD']){
				$lb_Enc=true;
			}
		}
		$this->f_Cierra($lr_tabla);
		$this->f_Des();
		unset($this->aa_Atributos['PassBD']);
		return $lb_Enc;
	}
}
?>