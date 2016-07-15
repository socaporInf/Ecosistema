<?php
session_start();
if(isset($_POST['operacion'])){
	$la_Peticion=$_POST;
} else {
	$la_Peticion=$_GET;
}
$success=0;
switch ($la_Peticion['entidad']) {
	case 'empresa':
		include_once('../clases/cls_Empresa.php');
		$lobj_Entidad = new cls_Empresa;
		$lobj_Entidad->setPeticion($la_Peticion);
		$respuesta = $lobj_Entidad->gestionar();
		break;

	case 'noticia':
		include_once('../clases/cls_Noticia.php');
		$lobj_Entidad = new cls_Noticia;
		$lobj_Entidad->setPeticion($la_Peticion);
		$respuesta = $lobj_Entidad->gestionar();
		break;

	case 'tipoNoticia':
		include_once('../clases/cls_TipoNoticia.php');
		$lobj_Entidad = new cls_TipoNoticia;
		$lobj_Entidad->setPeticion($la_Peticion);
		$respuesta = $lobj_Entidad->gestionar();
		break;

	case 'notificacion':
		include_once('../clases/cls_Notificacion.php');
		$lobj_Entidad = new cls_Notificacion;
		$lobj_Entidad->setPeticion($la_Peticion);
		$respuesta = $lobj_Entidad->gestionar();
		break;

	case 'tablaVirtual':
		include_once('../clases/cls_Tabla_Virtual.php');
		$lobj_Entidad = new cls_Tabla_Virtual;
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
