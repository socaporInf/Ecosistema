<?php
session_start();
if(isset($_POST['operacion'])){
	$la_Form=$_POST;
} else {
	$la_Form=$_GET;
}
$success=0;
switch ($la_Form['entidad']) {
	case 'empresa':
		include_once('../clases/cls_Empresa.php');
		$lobj_Entidad = new cls_Empresa;
		$lobj_Entidad->setPeticion($la_Form);
		$respuesta = $lobj_Entidad->gestionar();
		break;	

	case 'rol':
		include_once('../clases/cls_Rol.php');
		$lobj_Entidad = new cls_Rol;
		$lobj_Entidad->setPeticion($la_Form);
		$respuesta = $lobj_Entidad->gestionar();
		break;
	
	case 'usuario':
		include_once('../clases/cls_Usuario.php');
		$lobj_Entidad = new cls_Usuario;
		$lobj_Entidad->setPeticion($la_Form);
		$respuesta = $lobj_Entidad->gestionar();
		break;

	case 'tipoUsuario':
		include_once('../clases/cls_TipoUsuario.php');
		$lobj_Entidad = new cls_TipoUsuario;
		$lobj_Entidad->setPeticion($la_Form);
		$respuesta = $lobj_Entidad->gestionar();
		break;

	case 'variedad':
		include_once('../clases/cls_Variedad.php');
		$lobj_Entidad = new cls_Variedad;
		$lobj_Entidad->setPeticion($la_Form);
		$respuesta = $lobj_Entidad->gestionar();
		break;

	default:
		$respuesta['success'] = 0;
		$respuesta['mensaje'] = 'Entidad '.$la_Form['entidad'].' no se encuentra soportada por esta aplicacion';
		break;
}
header('Content-type: application/json; charset=utf-8');
echo json_encode($respuesta);
exit();

?>