<?php 
include('cls_Conexion.php');
class cls_Permisos extends cls_Conexion{
	
	private $aa_Form = array();

	public function setForm($pa_Form){
		$this->aa_Form=$pa_Form;
	}

	public function getForm(){
		return $this->aa_Form;
	}

	public function f_ObtenerPrivilegios(){
		$x=0;
		$la_Privilegios=array();
		$ls_Sql="SELECT
				p.cod_submod AS submodulo,
				re.cod_emp AS empresa,
				re.cod_rol AS rol,
				s.nombre,
				s.enlace 
				FROM seguridad.rolemp_usu AS reu
				INNER JOIN seguridad.rol_emp AS re ON(reu.cod_rol_emp=re.codigo)
				INNER JOIN seguridad.privilegio AS p ON(re.codigo=p.cod_rolemp) 
				INNER JOIN seguridad.submodulo AS s ON(p.cod_submod=s.codigo)
				WHERE reu.cod_usu='".$this->aa_Form['Nombre']."' AND re.cod_emp='".$this->aa_Form['Empresa']."'";
		$this->f_Con();
		$lr_tabla=$this->f_Filtro($ls_Sql);
		while($la_registro=$this->f_Arreglo($lr_tabla)){
			$la_Pribilegios[$x]['Nombre']=$la_registro['nombre'];
			$la_Pribilegios[$x]['Enlace']=$la_registro['enlace'];
			$la_Pribilegios[$x]['Codigo']=$la_registro['submodulo'];
			$x++;
		}
		return $la_Pribilegios;

	}
}
?>