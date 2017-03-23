<?php
session_start();
if(isset($_POST['operacion'])){
	$la_Peticion=$_POST;
} else {
	$la_Peticion=$_GET;
}
$success=0;
switch ($la_Peticion['entidad']) {

	case 'mensajeSistema':
		include_once('../clases/cls_Mensaje_Sistema.php');
		$lobj_Entidad = new cls_Mensaje_Sistema;
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
