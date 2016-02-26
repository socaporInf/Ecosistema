<?php
if(isset($_POST['Operacion'])){
	$la_Form=$_POST;
} else {
	$la_Form=$_GET;
}

if($la_Form['Operacion']=='buscar'){
	switch ($la_Form['Entidad']) {
		case 'empresa':
			include_once('../clases/cls_Empresa.php');
			$lobj_Entidad = new cls_Empresa;
			$registros=$lobj_Entidad->f_Listar();
			if(count($registros)!=0){
				$respuesta['registros']=$registros;
				$respuesta['success']=1;
			}else{
				$respuesta=array(
					'mensaje'=>'No se encotro ningun registro',
					'success'=>0
					);
			}
			
			break;
		
		default:
			$respuesta=array(
				'mensaje'=>'Error Interno del Servidor(#1)',
				'success'=>0
				);
			break;
	}
	header('Content-type: application/json; charset=utf-8');
   	echo json_encode($respuesta);
    exit();
}
?>