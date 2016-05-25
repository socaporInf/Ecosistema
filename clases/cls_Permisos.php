<?php 
include_once('cls_Conexion.php');
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
				p.cod_comp AS componente,
				re.cod_emp AS empresa,
				re.cod_rol AS rol,
				c.tit as titulo,
				c.url,
				c.cod_comp_pad as padre,
				pa.tit as tit_padre
				FROM seguridad.rolemp_usu AS reu
				INNER JOIN seguridad.rol_emp AS re ON(reu.cod_rol_emp=re.cod_rol_emp)
				INNER JOIN seguridad.privilegio AS p ON(re.cod_rol_emp=p.cod_rol_emp) 
				INNER JOIN seguridad.componente AS c ON(p.cod_comp=c.cod_comp)
				LEFT JOIN seguridad.componente AS pa ON(pa.cod_comp=c.cod_comp_pad) 
				WHERE reu.cod_usu='".$this->aa_Form['Nombre']."' AND re.cod_emp='".$this->aa_Form['Empresa']."'";
		$this->f_Con();
		$lr_tabla=$this->f_Filtro($ls_Sql);
		while($la_registro=$this->f_Arreglo($lr_tabla)){
			$la_Pribilegios[$x]['titulo']=$la_registro['titulo'];
			$la_Pribilegios[$x]['URL']=$la_registro['url'];
			$la_Pribilegios[$x]['codigo']=$la_registro['componente'];
			$la_Pribilegios[$x]['padre']=$la_registro['padre'];
			$la_Pribilegios[$x]['tit_padre']=$la_registro['tit_padre'];
			$x++;
		}
		$this->f_Cierra($lr_tabla);
		$this->f_Des();
		return $la_Pribilegios;
	}
}
?>