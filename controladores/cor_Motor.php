<?php
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
		$lobj_Entidad->setForm($la_Form);
		$respuesta = $lobj_Entidad->gestionar();
		break;	

	case 'rol':
		include_once('../clases/cls_Rol.php');
		$lobj_Entidad = new cls_Rol;
		$lobj_Entidad->setForm($la_Form);
		$respuesta = $lobj_Entidad->gestionar();
		break;
		
}
//header('Content-type: application/json; charset=utf-8');
//echo json_encode($respuesta);
exit();

?>