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
		switch ($la_Form['operacion']) {
			case 'buscar':
				$registros=$lobj_Entidad->f_Listar();
				if(count($registros)!=0){
					$success=1;
					$respuesta['registros']=$registros;
				}
				break;

			case 'buscarRegistro':
				$lb_Enc=$lobj_Entidad->f_buscar();
				if($lb_Enc){
					$la_Form=$lobj_Entidad->getForm();
					$respuesta['registros']=$la_Form['registro'];
					$success=1;
				}
				break;
			
			default:
				
				break;
		}	
		$respuesta['success']=$success;
		break;

	case 'rol':
		include_once('../clases/cls_Rol.php');
		$lobj_Entidad = new cls_Rol;
		$lobj_Entidad->setForm($la_Form);
		switch ($la_Form['operacion']) {

			case 'buscar':
				$registros=$lobj_Entidad->f_Listar();
				if(count($registros)!=0){
					$success=1;
					$respuesta['registros']=$registros;
				}
				break;
			
			case 'buscarRegistro':
				$lb_Enc=$lobj_Entidad->f_buscar();
				if($lb_Enc){
					$la_Form=$lobj_Entidad->getForm();
					$respuesta['registros']=$la_Form['registro'];
					$success=1;
				}
				break;

			case 'guardarDetalle':
				$lb_Hecho=$lobj_Entidad->guardarDetalle();
				if($lb_Hecho){
					$success=1;
				}
			break;

			case 'eliminarDetalle':
				$lb_Hecho=$lobj_Entidad->eliminarDetalle();
				if($lb_Hecho){
					$respuesta['mensaje'] = 'Eliminacion realizada con exito';
					$respuesta['cod_emp'] = $la_Form['cod_emp'];
					$success=1;
				}
			break;

			default:
				# code...
				break;
		}
		$respuesta['success']=$success;
		break;
}
header('Content-type: application/json; charset=utf-8');
echo json_encode($respuesta);
exit();

?>