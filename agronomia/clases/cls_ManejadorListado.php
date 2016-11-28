<?php
include_once('../../lib/Eden-Php/eden.php');
include_once('../../nucleo/clases/cls_Conexion.php');
include_once('../../nucleo/clases/cls_Mensaje_Sistema.php');
/** Include path **/
set_include_path(get_include_path() . PATH_SEPARATOR . '..'.PATH_SEPARATOR.'..'.PATH_SEPARATOR.'lib'.PATH_SEPARATOR.'PHPExcel');

/** PHPExcel_IOFactory */
include 'PHPExcel/IOFactory.php';

class cls_ManejadorListado extends cls_Conexion{

	protected $aa_Atributos = array();

	public function setPeticion($pa_Peticion){
		$this->aa_Atributos=$pa_Peticion;
		$this->setDatosConexion($_SESSION['Con']['Nombre'],$_SESSION['Con']['Pass']);
	}

	public function getAtributos(){
		return $this->aa_Atributos;
	}

	public function gestionar(){
		$lobj_Mensaje = new cls_Mensaje_Sistema;
		switch ($this->aa_Atributos['operacion']) {
			case 'extraerDatos':
				//extraigo los datos del archivo pasado como parametro
        $datos = $this->f_ExtraerDatos();
				return $datos;
        break;

			default:
				$valores = array('{OPERACION}' => strtoupper($this->aa_Atributos['operacion']), '{ENTIDAD}' => strtoupper($this->aa_Atributos['entidad']));
				$respuesta['mensaje'] = $lobj_Mensaje->completarMensaje(11,$valores);
				$success = 0;
				break;
		}
		if(!isset($respuesta['success'])){
			$respuesta['success']=$success;
		}
		return $respuesta;
	}
	private function f_ExtraerDatos(){
		$objPHPExcel = $this->f_CrearArchivoTemp($this->aa_Atributos['archivo']);

		if($objPHPExcel){

        //Get worksheet dimensions
        $sheet = $objPHPExcel->getSheet(0);
        $highestRow = $sheet->getHighestRow();
        $highestColumn = $sheet->getHighestColumn();

				$indice = 0;
        //Loop through each row of the worksheet in turn
        for ($row = 1; $row <= $highestRow; $row++){
            //  Read a row of data into an array
            $rowData[$indice] = $sheet->rangeToArray('A' . $row . ':' . $highestColumn . $row, NULL, TRUE, FALSE)[0];
						//valido las filas vacias
						if($rowData[$indice][0]!=''){
							if($indice > 0){
								$cell = $sheet->getCell('B' . $row);
								$InvDate = $cell->getValue();
								if(PHPExcel_Shared_Date::isDateTime($cell)) {
										 $rowData[$indice][1] = date("Y-m-d", PHPExcel_Shared_Date::ExcelToPHP($InvDate));
								}
							}
							$indice++;
						}
						//cambio el formato de las celdas de fecha para que se puedan visualizar

        }
  	}else{
			print('vacio');
		}
		return $rowData;
	}
	private function f_CrearArchivoTemp($archivo){
		//Codigo de StackOverflow por Dieter Gribnitz
	    $file = tempnam(sys_get_temp_dir(), 'excel_');
	    $handle = fopen($file, "w");
	    fwrite($handle, $archivo[1]['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']);
	    $return = \PHPExcel_IOFactory::load($file);
	    fclose($handle);
	    unlink($file);
	    return $return;
	}
}
?>
