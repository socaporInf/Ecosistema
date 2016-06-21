<?php
include_once('cls_Conexion.php');
class cls_Permisos extends cls_Conexion{

	private $aa_Atributos = array();

	public function setPeticion($pa_Peticion){
		$this->aa_Atributos=$pa_Peticion;
		$this->setDatosConexion($_SESSION['Con']['Nombre'],$_SESSION['Con']['Pass']);
	}

	public function getForm(){
		return $this->aa_Atributos;
	}

	public function f_ObtenerPrivilegios(){
		$x=0;
		$la_Privilegios=array();
		$ls_Sql="SELECT * from seguridad.varbol_privilegio
				WHERE codigo_usuario='".$this->aa_Atributos['Nombre']."' AND empresa='".$this->aa_Atributos['Empresa']."'";
		$this->f_Con();
		$lr_tabla=$this->f_Filtro($ls_Sql);
		while($la_registro=$this->f_Arreglo($lr_tabla)){
			$la_Privilegios[$x]['titulo']=$la_registro['titulo'];
			$la_Privilegios[$x]['URL']=$la_registro['url'];
			$la_Privilegios[$x]['codigo']=$la_registro['componente'];
			$la_Privilegios[$x]['padre']=$la_registro['padre'];
			$la_Privilegios[$x]['tit_padre']=$la_registro['titulo_padre'];
			$la_Privilegios[$x]['llave_acceso']=$la_registro['llave_acceso'];
			$x++;
		}
		$this->f_Cierra($lr_tabla);
		$this->f_Des();
		return $la_Privilegios;
	}

	public function f_ObtenerLlavesAcceso($arreglo){
		$llaves = array();
		for($x = 0; $x < count($arreglo); $x++){
			$existe = false;
			for($y = 0; $y < count($llaves); $y++){
				if($llaves[$y] == $arreglo[$x]['llave_acceso']){
					$existe = true;
				}
			}
			if(!$existe){
				$llaves[count($llaves)] = $arreglo[$x]['llave_acceso'];
			}
		}
		return $llaves;
	}
}
?>
