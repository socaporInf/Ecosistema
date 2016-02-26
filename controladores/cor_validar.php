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
	$lobj_Acceso->setForm($la_Form);
	$lb_Enc=$lobj_Acceso->f_Accesar();
	if($lb_Enc){
		$la_Form=$lobj_Acceso->getForm();
		$_SESSION['Usuario']['Nombre']=$la_Form['Nombre'];
		$respuesta=array(
			'mensaje'=>'Inicio de sesion exitoso',
			'usuario'=>$la_Form['Nombre'],
			'success'=>1
			);
	}else{
		$respuesta=array(
			'mensaje'=>'Usuario o clave incorrecto',
			'success'=>0
			);
	}

}else if($la_Form['Operacion']=="iniciarSession"){

	include_once('../clases/cls_Permisos.php');
	$lobj_Permisos = new cls_Permisos;
	$lobj_Permisos->setForm($la_Form);
	$privilegios=$lobj_Permisos->f_ObtenerPrivilegios();
	if(count($privilegios)==0){
		$respuesta=array(
				'mensaje'=>'Este Usuario No Posee Privilegios Para Esta Empresa',
				'success'=>0
				);
	}else{
		$_SESSION['Usuario']['privilegios']=array($privilegios);
		$respuesta=array(
				'mensaje'=>'Sesion Iniciada con exito',
				'privilegios'=>$_SESSION['Usuario']['privilegios'],
				'success'=>1
				);
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
}
header('Content-type: application/json; charset=utf-8');
echo json_encode($respuesta);
exit();
?>