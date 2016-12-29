<?php
include_once('../../nucleo/clases/cls_Conexion.php');
include_once('../../nucleo/clases/cls_Mensaje_Sistema.php');
class cls_Permisos extends cls_Conexion{

	protected $aa_Atributos = array();

	public function setPeticion($pa_Peticion){
		$this->aa_Atributos=$pa_Peticion;
		$this->setDatosConexion($_SESSION['Con']['Nombre'],$_SESSION['Con']['Pass']);
	}

	public function getForm(){
		return $this->aa_Atributos;
	}
	public function f_EmpresasDisponibles(){
		$x=0;
		$la_Privilegios=array();
		$ls_Sql="SELECT empresa,nombre_empresa from seguridad.varbol_privilegio_usuario
				WHERE estado_privilegio='A' AND codigo_usuario='".$this->aa_Atributos['Nombre']."' group by empresa,nombre_empresa";
		$this->f_Con();
		$lr_tabla=$this->f_Filtro($ls_Sql);
		while($la_registro=$this->f_Arreglo($lr_tabla)){
			$la_Empresas[$x]['codigo']=$la_registro['empresa'];
			$la_Empresas[$x]['nombre']=$la_registro['nombre_empresa'];
			$x++;
		}
		$this->f_Cierra($lr_tabla);
		$this->f_Des();
		return $la_Empresas;
	}
	public function f_ObtenerPrivilegios(){
		$x=0;
		$la_Privilegios=array();
		$ls_Sql="SELECT * from seguridad.varbol_privilegio_usuario
				WHERE estado_privilegio='A' AND codigo_usuario='".$this->aa_Atributos['Nombre']."' AND empresa='".$this->aa_Atributos['Empresa']."'
				order by padre, titulo";
		$this->f_Con();
		$lr_tabla=$this->f_Filtro($ls_Sql);
		while($la_registro=$this->f_Arreglo($lr_tabla)){
			$la_Privilegios[$x]['titulo']=$la_registro['titulo'];
			$la_Privilegios[$x]['URL']=$la_registro['url'];
			$la_Privilegios[$x]['URLSecundario']=$la_registro['url_secundario'];
			$la_Privilegios[$x]['codigo']=$la_registro['componente'];
			$la_Privilegios[$x]['padre']=$la_registro['padre'];
			$la_Privilegios[$x]['tit_padre']=$la_registro['titulo_padre'];
			$la_Privilegios[$x]['operacion']=$this->f_ObtenerOperaciones($la_registro['codigo']);
			$la_Privilegios[$x]['llave_acceso']=$la_registro['llave_acceso'];
			$x++;
		}
		$this->f_Cierra($lr_tabla);
		$this->f_Des();
		return $la_Privilegios;
	}
	public function obtenerEmpresa(){
		$la_Privilegios=array();
		$ls_Sql="SELECT * from global.vempresa
				WHERE codigo_empresa='".$this->aa_Atributos['Empresa']."'";
		$this->f_Con();
		$lr_tabla=$this->f_Filtro($ls_Sql);
		if($la_registro=$this->f_Arreglo($lr_tabla)){
			$la_Empresa['codigo']=$la_registro['codigo_empresa'];
			$la_Empresa['nombre']=$la_registro['nombre'];
		}
		$this->f_Cierra($lr_tabla);
		$this->f_Des();
		return $la_Empresa;
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
	public function f_ObtenerOperaciones($codigo_privilegio){
		$x=0;
		$la_Operaciones=array();
		$ls_Sql="SELECT * from seguridad.voperacion_privilegio
				WHERE codigo_privilegio = $codigo_privilegio AND estado = 'A'";
		$lr_tabla=$this->f_Filtro($ls_Sql);
		while($la_registro=$this->f_Arreglo($lr_tabla)){
			$la_Operaciones[$x]['codigo_operacion']=$la_registro['codigo_operacion'];
			$la_Operaciones[$x]['nombre_operacion']=$la_registro['nombre_operacion'];
			$la_Operaciones[$x]['codigo']=$la_registro['codigo'];
			$x++;
		}
		$this->f_Cierra($lr_tabla);
		return $la_Operaciones;
	}
}
?>
