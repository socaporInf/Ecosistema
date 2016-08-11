<?php
session_start();
if(isset($_POST['operacion'])){
	$la_Peticion=$_POST;
} else {
	$la_Peticion=$_GET;
}
$success=0;
switch ($la_Peticion['entidad']) {
	case 'clase':
		include_once('../clases/cls_Clase.php');
		$lobj_Entidad = new cls_Clase;
		$lobj_Entidad->setPeticion($la_Peticion);
		$respuesta = $lobj_Entidad->gestionar();
		break;

	case 'finca':
		include_once('../clases/cls_Finca.php');
		$lobj_Entidad = new cls_Finca;
		$lobj_Entidad->setPeticion($la_Peticion);
		$respuesta = $lobj_Entidad->gestionar();
		break;
	case 'productor':
		include_once('../clases/cls_Productor.php');
		$lobj_Entidad = new cls_Productor;
		$lobj_Entidad->setPeticion($la_Peticion);
		$respuesta = $lobj_Entidad->gestionar();
		break;

	case 'variedad':
		include_once('../clases/cls_Variedad.php');
		$lobj_Entidad = new cls_Variedad;
		$lobj_Entidad->setPeticion($la_Peticion);
		$respuesta = $lobj_Entidad->gestionar();
		break;

	case 'zona':
		include_once('../clases/cls_Zona.php');
		$lobj_Entidad = new cls_Zona;
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
