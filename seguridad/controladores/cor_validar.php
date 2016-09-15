<?php
session_start();
if(isset($_POST['Operacion'])){
	$la_Form=$_POST;
} else {
	$la_Form=$_GET;
}
if($la_Form['Operacion']=='acceso'){

	include_once('../clases/cls_Acceso.php');
	$lobj_Acceso = new cls_Acceso;
	$lobj_Acceso->setPeticion($la_Form);
	$lb_Enc=$lobj_Acceso->f_Accesar();
	if($lb_Enc){
		$la_Form=$lobj_Acceso->getAtributos();
		$_SESSION['Usuario']['Nombre']=$la_Form['Nombre'];

		//armo datos para siguientes conexiones
		$_SESSION['Con']['Nombre'] = $la_Form['Nombre'];
		$_SESSION['Con']['Pass'] = $la_Form['Pass'];

		$respuesta=array(
			'mensaje'=>'Inicio de sesion exitoso',
			'usuario'=>$la_Form['Nombre'],
			'success'=>1
			);

		unset($la_Form);
	}else{
		$respuesta=array(
			'mensaje'=>'Usuario o clave incorrecto',
			'success'=>0
			);
	}

}else if(($la_Form['Operacion']=="iniciarSession")||($la_Form['Operacion']=="buscarEmpresasDisponibles")){

	include_once('../clases/cls_Permisos.php');
	$lobj_Permisos = new cls_Permisos;
	$lobj_Permisos->setPeticion($la_Form);
	if($la_Form['Operacion']=="iniciarSession"){
		$privilegios=$lobj_Permisos->f_ObtenerPrivilegios();
		$llaves = $lobj_Permisos->f_ObtenerLlavesAcceso($privilegios);
		if(count($privilegios)==0){
			$respuesta=array(
					'mensaje'=>'Este Usuario No Posee Privilegios Para Esta Empresa',
					'success'=>0
					);
		}else{
			$_SESSION['Usuario']['privilegios']=array($privilegios);
			$_SESSION['Usuario']['llaves_acceso']=$llaves;
			$_SESSION['Usuario']['Empresa'] = $lobj_Permisos->obtenerEmpresa();
			$respuesta=array(
					'mensaje'=>'Sesion Iniciada con exito',
					'privilegios'=>$_SESSION['Usuario']['privilegios'],
					'success'=>1
					);
		}
	}else if($la_Form['Operacion']=="buscarEmpresasDisponibles"){
		$empresas = $lobj_Permisos->f_EmpresasDisponibles();
		if(count($empresas)==0){
			$respuesta=array(
					'mensaje'=>array('cuerpo'=>'Ese Usuario no tiene Empresas Asignadas','nombre_tipo'=>'ADVERTENCIA','titulo'=>'Error de Acceso'),
					'success'=>0
					);
		}else{
			$respuesta=array(
					'mensaje'=>'Empresas disponibles',
					'registros'=>$empresas,
					'success'=>1
					);

		}
	}

}else if($la_Form['Operacion']=="CargarPrivilegios"){

	if(!isset($_SESSION['Usuario']['privilegios'])){
		$respuesta=array(
				'mensaje'=>'No ha Iniciado Sesion',
				'success'=>0
				);
	}else{
		$respuesta=array(
				'mensaje'=>'Carga Completada',
				'privilegios'=>$_SESSION['Usuario']['privilegios'],
				'success'=>1
				);
	}

}else if($la_Form['Operacion']=="cerrarSesion"){

	session_destroy();
	$respuesta=array(
			'mensaje'=>'sesion cerrada con exito',
			'success'=>1
			);

}else if($la_Form['Operacion']=='obtenerSesion'){

	if(isset($_SESSION['Usuario'])){
		$respuesta=array(
			'mensaje'=>'Datos de Sesion',
			'sesion'=>$_SESSION['Usuario'],
			'success'=>1
			);
	}else{
		$respuesta=array(
			'mensaje'=>'No existe Sesion abierta',
			'success'=>0
			);
	}
}else if($la_Form['Operacion']=='obtenerLlaves'){
	if(count($_SESSION['Usuario']['llaves_acceso'])==0){
		$respuesta = array(
			'mensaje'=>'No existe Sesion abierta',
			'success'=>0
		);
	}else{
		$respuesta=array(
			'mensaje'=>'llaves obtenidas con exito',
			'success'=>1,
			'llavesAcceso'=>$_SESSION['Usuario']['llaves_acceso']
			);
	}
}
header('Content-type: application/json; charset=utf-8');
echo json_encode($respuesta);
exit();
?>
