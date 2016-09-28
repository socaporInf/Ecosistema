<?php
session_start();
if(isset($_POST['operacion'])){
	$la_Peticion=$_POST;
} else {
	$la_Peticion=$_GET;
}
$success=0;
switch ($la_Peticion['entidad']) {

	case 'rol':
		include_once('../clases/cls_Rol.php');
		$lobj_Entidad = new cls_Rol;
		$lobj_Entidad->setPeticion($la_Peticion);
		$respuesta = $lobj_Entidad->gestionar();
		break;

	case 'componente':
		include_once('../clases/cls_Componente.php');
		$lobj_Entidad = new cls_Componente;
		$lobj_Entidad->setPeticion($la_Peticion);
		$respuesta = $lobj_Entidad->gestionar();
		break;

	case 'operacion':
		include_once('../clases/cls_Operacion.php');
		$lobj_Entidad = new cls_Operacion;
		$lobj_Entidad->setPeticion($la_Peticion);
		$respuesta = $lobj_Entidad->gestionar();
		break;

	case 'parametroControl':
		include_once('../clases/cls_ParametroControl.php');
		$lobj_Entidad = new cls_ParametroControl();
		$lobj_Entidad->setPeticion($la_Peticion);
		$respuesta = $lobj_Entidad->gestionar();
		break;

	case 'privilegio':
		include_once('../clases/cls_Privilegio.php');
		$lobj_Entidad = new cls_Privilegio;
		$lobj_Entidad->setPeticion($la_Peticion);
		$respuesta = $lobj_Entidad->gestionar();
		break;

	case 'proceso':
		include_once('../clases/cls_Proceso.php');
		$lobj_Entidad = new cls_Proceso;
		$lobj_Entidad->setPeticion($la_Peticion);
		$respuesta = $lobj_Entidad->gestionar();
		break;

	case 'usuario':
		include_once('../clases/cls_Usuario.php');
		$lobj_Entidad = new cls_Usuario;
		$lobj_Entidad->setPeticion($la_Peticion);
		$respuesta = $lobj_Entidad->gestionar();
		break;

	case 'tablaVirtual':
		include_once('../clases/cls_Tabla_Virtual.php');
		$lobj_Entidad = new cls_Tabla_Virtual;
		$lobj_Entidad->setPeticion($la_Peticion);
		$respuesta = $lobj_Entidad->gestionar();
		break;

	case 'registroVirtual':
		include_once('../clases/cls_Registro_Virtual.php');
		$lobj_Entidad = new cls_Registro_Virtual;
		$lobj_Entidad->setPeticion($la_Peticion);
		$respuesta = $lobj_Entidad->gestionar();
		break;

	default:
		$respuesta['success'] = 0;
		$respuesta['mensaje']['nombre_tipo'] =  'error';
		$respuesta['mensaje']['titulo'] = 'Entidad No soportada';
		$respuesta['mensaje']['cuerpo'] = 'Entidad '.$la_Peticion['entidad'].' no se encuentra entre las disponibles para esta aplicacion';
		$respuesta['tipo'] = 'error';
		break;
}
header('Content-type: application/json; charset=utf-8');
echo json_encode($respuesta);
exit();

?>
