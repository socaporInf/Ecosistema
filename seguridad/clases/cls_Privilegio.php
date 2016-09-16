 <?php
include_once('../../nucleo/clases/cls_Conexion.php');
include_once('../../nucleo/clases/cls_Mensaje_Sistema.php');
class cls_Privilegio extends cls_Conexion{

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

			case 'buscarRegistro':
				$la_respuesta=$this->f_Buscar();
				if(count($la_respuesta)!=0){
					$respuesta['registro'] = $la_respuesta;
					$success=1;
				}else{
					$respuesta['success'] = 0;
					$respuesta['mensaje'] = $lobj_Mensaje->buscarMensaje(8);
				}
				break;
			//------------------------ Operaciones ----------------------------------
			case 'buscarOperacionesDisponibles':
				$la_respuesta['disponibles']=$this->f_BuscarOperacionesDisponibles('privilegio');
				$la_respuesta['asignadas']=$this->f_BuscarOperacionesAsignadas();
				if(count($la_respuesta['disponibles'])!=0){
					$respuesta['registro'] = $la_respuesta;
					$success=1;
				}else{
					$respuesta['success'] = 0;
					$respuesta['mensaje'] = $lobj_Mensaje->buscarMensaje(22);
				}
				break;

			case 'buscarOperaciones':
				$la_respuesta['disponibles']=$this->f_BuscarOperaciones();
				$la_respuesta['asignadas']=$this->f_BuscarOperacionesDisponibles('componente');
				if(count($la_respuesta['disponibles'])!=0){
					$respuesta['registro'] = $la_respuesta;
					$success=1;
				}else{
					$respuesta['success'] = 0;
					$respuesta['mensaje'] = $lobj_Mensaje->buscarMensaje(21);
				}
				break;

			case 'guardarOperacionesDisponibles':
				$la_respuesta = $this->f_GuardarOperacionesDisponibles();
				if($la_respuesta){
					$respuesta['success'] = 1;
					$respuesta['mensaje'] = $lobj_Mensaje->buscarMensaje(14);
				}else{
						$respuesta['success'] = 0;
						$respuesta['mensaje'] = $lobj_Mensaje->buscarMensaje(15);
				}
			 	break;

			case 'asignarOperaciones':
				$la_respuesta = $this->f_GuardarOperaciones();
				if($la_respuesta){
					$respuesta['success'] = 1;
					$respuesta['mensaje'] = $lobj_Mensaje->buscarMensaje(14);
				}else{
						$respuesta['success'] = 0;
						$respuesta['mensaje'] = $lobj_Mensaje->buscarMensaje(15);
				}
			 	break;
			//------------------------ Arbol ----------------------------------
			case 'buscarArbol':
				$la_respuesta['hojasGenereal']=$this->f_BuscarArbol();
				$la_respuesta['hojasActuales']=$this->f_BuscarArbolPrivilegios();
				if(count($la_respuesta)!=0){
					$respuesta['hojasGenereal'] = $la_respuesta['hojasGenereal'];
					$respuesta['hojasActuales'] = $la_respuesta['hojasActuales'];
					$success=1;
				}else{
					$respuesta['mensaje'] = 'Arbol vacio';
					$respuesta['tipo'] = 'advertencia';
					$respuesta['titulo'] = 'advertencia';
				}
				break;

			case 'buscarArbolComponente':
				$la_respuesta['hojasGenereal']=$this->f_BuscarArbol();
				if(count($la_respuesta)!=0){
					$respuesta['hojasGenereal'] = $la_respuesta['hojasGenereal'];
					$success=1;
				}else{
					$respuesta['mensaje'] = 'Arbol vacio';
					$respuesta['tipo'] = 'advertencia';
					$respuesta['titulo'] = 'advertencia';
				}
				break;

			case 'guardarArbol':
			$la_respuesta=$this->f_GuardarArbol();
			if($la_respuesta){
				$respuesta['mensaje'] = 'cambios guardados de forma exitosa';
				$respuesta['tipo'] = 'info';
				$respuesta['titulo'] = 'Trasaccion exitosa';
				$success=1;
			}else{
				$respuesta['mensaje'] = 'No se pudo guardar los cambios';
				$respuesta['tipo'] = 'error';
				$respuesta['titulo'] = 'Error Interno Del Servidor';
			}
			break;
			//-------------------------------- Campos ------------------------
			case 'buscarCampos':
				$la_respuesta['disponibles']=$this->f_BuscarCamposDisponibles('componente');
				if(count($la_respuesta['disponibles'])!=0){
					$respuesta['registro'] = $la_respuesta;
					$success=1;
				}else{
					$respuesta['success'] = 0;
					$respuesta['mensaje'] = $lobj_Mensaje->buscarMensaje(20);
				}
				break;

			default:
				$valores = array();
				$valores['{OPERACION}'] = '<b>'.$this->aa_Atributos['operacion'].'</b>';
				$valores['{ENTIDAD}'] = '<b>'.$this->aa_Atributos['entidad'].'</b>';
				$respuesta['mensaje'] = $lobj_Mensaje->completarMensaje(11,$valores);
				$success = 0;
				break;
		}
		if(!isset($respuesta['success'])){
			$respuesta['success']=$success;
		}
		return $respuesta;
	}

	private function f_Buscar(){
		//Busco Detalle
		$ls_Sql="SELECT * from seguridad.vroles_por_empresa
				WHERE llave_acceso='".$this->aa_Atributos['codigo']."'";
		$this->f_Con();
		$lr_tabla=$this->f_Filtro($ls_Sql);
		if($la_registros=$this->f_Arreglo($lr_tabla)){
			$la_respuesta['codigoEmpresa']=$la_registros['codigo_empresa'];
			$la_respuesta['codigoRol']=$la_registros['codigo_rol'];
			$la_respuesta['empresa']=$la_registros['nombre_empresa'];
			$la_respuesta['rol']=$la_registros['nombre_rol'];
			$la_respuesta['codigoRelacion']=$la_registros['llave_acceso'];
		}
		$this->f_Cierra($lr_tabla);
		$this->f_Des();

		return $la_respuesta;
	}
	//------------------------------------------------------------------------- Arbol ------------------------------------------------------------------------------
	private function f_BuscarArbolPrivilegios(){
		$x=0;
		$la_Privilegios=array();
		$ls_Sql="SELECT titulo,componente,padre,titulo,padre,tipo,llave_acceso,titulo_padre,codigo from seguridad.varbol_privilegios where estado_privilegio='A' and llave_acceso='".$this->aa_Atributos['codigo']."'";
		$ls_Sql.=" group by titulo,componente,padre,titulo,padre,tipo,llave_acceso,titulo_padre,codigo";
		$ls_Sql.=" order by padre";
		$la_Privilegios[0];
		$this->f_Con();
		$lr_tabla=$this->f_Filtro($ls_Sql);
		while($la_registro=$this->f_Arreglo($lr_tabla)){
			$la_Privilegios[$x]['codigo']=$la_registro['componente'];
			$la_Privilegios[$x]['titulo']=$la_registro['titulo'];
			$la_Privilegios[$x]['privilegio']=$la_registro['codigo'];
			$la_Privilegios[$x]['padre']=$la_registro['padre'];
			$la_Privilegios[$x]['tit_padre']=$la_registro['titulo_padre'];
			$la_Privilegios[$x]['tipo']=$la_registro['tipo'];
			$la_Privilegios[$x]['llave_acceso']=$la_registro['llave_acceso'];
			$x++;
		}
		$auxiliar = $la_Privilegios[0];
		$la_Privilegios[0]=$la_Privilegios[count($la_Privilegios)-1];
		$la_Privilegios[count($la_Privilegios)-1] = $auxiliar;
		$this->f_Cierra($lr_tabla);
		$this->f_Des();
		return $la_Privilegios;
	}

	private function f_BuscarArbol(){
		include_once('cls_Componente.php');
		$lobj_Componente = new cls_Componente;
		return $lobj_Componente->f_BuscarArbol();
	}

	private function f_GuardarArbol(){
		$existentes = $this->f_BuscarArbolPrivilegios();
		$aGuardar = json_decode(stripslashes($this->aa_Atributos['data']),true);
		$llave_acceso = $this->aa_Atributos['codigo'];
		$valores = $this->validarGuardado($aGuardar,$existentes,'codigo');
		//solamente lo que no estan en los existentes
		$aGuardarValidado = $valores['aGuardarValidado'];
		//aquellos que estan en los existentes pero no en los nuevos
		$aDesabilitar = $valores['aDesabilitar'];
		unset($aGuardar);
		unset($existentes);
		//Operaciones en la base de datos
		$lb_Hecho = false;
		$this->f_Con();
		$this->f_Begin();
		$i = 0;
		//si se va a desabilitar alguno entra por este camino
		if(!empty($aDesabilitar[0])){
			do{
				$ls_Sql = "	UPDATE seguridad.varbol_privilegios SET estado_privilegio='I'
										WHERE llave_acceso='".$llave_acceso."' AND
										componente = '".$aDesabilitar[$i]['codigo']."'";
				$lb_Hecho = $this->f_Ejecutar($ls_Sql);
				$i++;
			}while(($i < count($aDesabilitar)) || ($lb_Hecho == false));
		}else{
			//en caso contrario coloco true debido que no desabilitare a nadie
			$lb_Hecho = true;
		}
		if(!$lb_Hecho){
			$this->f_RollBack();
		}else{
			for ($i=0; $i < count($aGuardarValidado) ; $i++) {
				$lb_Hecho = false;
				$ls_Sql="SELECT titulo,componente,padre,titulo,padre,tipo,llave_acceso,titulo_padre,estado_privilegio from seguridad.varbol_privilegios";
				$ls_Sql.=" where llave_acceso='".$this->aa_Atributos['codigo']."' and componente='".$aGuardarValidado[$i]['codigo']."'";
				$ls_Sql.=" group by titulo,componente,padre,titulo,padre,tipo,llave_acceso,titulo_padre,estado_privilegio";
				$lr_tabla=$this->f_Filtro($ls_Sql);
				if($la_registro=$this->f_Arreglo($lr_tabla)){
					$ls_Sql = "	UPDATE seguridad.varbol_privilegios SET estado_privilegio='A'
											WHERE llave_acceso='".$llave_acceso."'
											AND componente = '".$aGuardarValidado[$i]['codigo']."'";
				}else{
					$ls_Sql = "INSERT INTO seguridad.varbol_privilegios (llave_acceso,componente) values ('".$this->aa_Atributos['codigo']."','".$aGuardarValidado[$i]['codigo']."')";
				}
				$lb_Hecho = $this->f_Ejecutar($ls_Sql);
				$this->f_Cierra($lr_tabla);
				if(!$lb_Hecho){
					$this->f_RollBack();
					break;
				}
			}
			if($lb_Hecho){
				$this->f_Commit();
				$this->f_Des();
				return true;
			}else{
				$this->f_RollBack();
				$this->f_Des();
				return false;
			}
		}
	}
	//---------------------------------------------------------------------- Operaciones ----------------------------------------------------------------------------
	private function f_BuscarOperacionesDisponibles($tipo){
		//Busco Detalle
		if($tipo=='componente'){
			$cadena = $this->aa_Atributos['codigo'];
		}else if($tipo == 'privilegio' ){
			$cadena = '('."SELECT componente FROM seguridad.varbol_privilegios WHERE codigo =".$this->aa_Atributos['codigo'].')';
		}
		$ls_Sql="SELECT * from seguridad.vcomponente_operacion WHERE codigo_componente = ".$cadena." AND estado = 'A' ";
		$this->f_Con();
		$lr_tabla=$this->f_Filtro($ls_Sql);
		$i = 0;
		while($la_registros=$this->f_Arreglo($lr_tabla)){
			$la_respuesta[$i]['codigo']=$la_registros['codigo'];
			$la_respuesta[$i]['nombreOperacion']=$la_registros['nombre_operacion'];
			$la_respuesta[$i]['codigoOperacion']=$la_registros['codigo_operacion'];
			$i++;
		}
		$this->f_Cierra($lr_tabla);
		$this->f_Des();
		return $la_respuesta;
	}

	private function f_BuscarOperaciones(){
		//Busco Detalle
		$ls_Sql="SELECT * from seguridad.voperacion";
		$this->f_Con();
		$lr_tabla=$this->f_Filtro($ls_Sql);
		$i = 0;
		while($la_registros=$this->f_Arreglo($lr_tabla)){
			$la_respuesta[$i]['codigo']=$la_registros['codigo_operacion'];
			$la_respuesta[$i]['nombreOperacion']=$la_registros['nombre'];
			$i++;
		}
		$this->f_Cierra($lr_tabla);
		$this->f_Des();
		return $la_respuesta;
	}
	private function f_BuscarOperacionesAsignadas(){
		//Busco Detalle
		$ls_Sql="SELECT * from seguridad.voperacion_privilegio
				WHERE codigo_privilegio='".$this->aa_Atributos['codigo']."' AND estado = 'A'";
		$this->f_Con();
		$lr_tabla=$this->f_Filtro($ls_Sql);
		$i = 0;
		while($la_registros=$this->f_Arreglo($lr_tabla)){
			$la_respuesta[$i]['codigoPrivilegio']=$la_registros['codigo_privilegio'];
			$la_respuesta[$i]['estadoPrivilegio']=$la_registros['estado_privilegio'];
			$la_respuesta[$i]['codigoComponente']=$la_registros['codigo_componente'];
			$la_respuesta[$i]['tituloComponente']=$la_registros['titulo_componente'];
			$la_respuesta[$i]['tipoComponente']=$la_registros['tipo_componente'];
			$la_respuesta[$i]['codigoOperacion']=$la_registros['codigo_operacion'];
			$la_respuesta[$i]['codigo']=$la_registros['codigo_operacion_disponible'];
			$la_respuesta[$i]['nombreOperacion']=$la_registros['nombre_operacion'];
			$i++;
		}
		$this->f_Cierra($lr_tabla);
		$this->f_Des();
		return $la_respuesta;
	}

	private function f_GuardarOperaciones(){
		$existentes = $this->f_BuscarOperacionesAsignadas();
		$data = json_decode(stripslashes($this->aa_Atributos['data']),true);
		$aGuardar = array();
		foreach ($data as $llave => $valor) {
			$valor['codigoOperacion'] = $valor['valor'];
			$valor['nombreOperacion'] = $valor['nombre'];
			$aGuardar[$llave] = $valor;
		}
		$valores = $this->validarGuardado($aGuardar,$existentes,'nombreOperacion');
		$aDesabilitar = $valores['aDesabilitar'];
		$aGuardarValidado = $valores['aGuardarValidado'];
		$lb_Hecho = false;
		$this->f_Con();
		$this->f_Begin();
		$i = 0;
		if(count($aDesabilitar)!=0){
			do{
				$ls_Sql = "	UPDATE seguridad.voperacion_privilegio SET estado='I'
										WHERE codigo_operacion_disponible='".$aDesabilitar[$i]['codigo']."'";
				$lb_Hecho = $this->f_Ejecutar($ls_Sql);
				$i++;
			}while(($i < count($aDesabilitar)) || ($lb_Hecho == false));
		}else{
			//en caso contrario coloco true debido que no desabilitare a nadie
			$lb_Hecho = true;
		}
		if(!$lb_Hecho){
			$this->f_RollBack();
		}else{
			for ($i=0; $i < count($aGuardarValidado) ; $i++) {
				$lb_Hecho = false;
				$ls_Sql = "SELECT * from seguridad.voperacion_privilegio";
				$ls_Sql .=" WHERE codigo_operacion_disponible =".$aGuardarValidado[$i]['codigoOperacion']."";
				$lr_tabla=$this->f_Filtro($ls_Sql);
				if($la_registro=$this->f_Arreglo($lr_tabla)){
					$ls_Sql = "	UPDATE seguridad.voperacion_privilegio SET estado='A'
											WHERE codigo_operacion_disponible = '".$aGuardarValidado[$i]['codigoOperacion']."'";
				}else{
					$ls_Sql = "INSERT INTO seguridad.voperacion_privilegio (codigo_privilegio,codigo_operacion_disponible)
											values ('".$this->aa_Atributos['codigo']."','".$aGuardarValidado[$i]['codigoOperacion']."')";
				}
				$lb_Hecho = $this->f_Ejecutar($ls_Sql);
				$this->f_Cierra($lr_tabla);
				if(!$lb_Hecho){
					$this->f_RollBack();
					break;
				}
			}
			if($lb_Hecho){
				$this->f_Commit();
				$this->f_Des();
				return true;
			}else{
				$this->f_RollBack();
				$this->f_Des();
				return false;
			}
		}
	}
	private function f_GuardarOperacionesDisponibles(){
		$existentes = $this->f_BuscarOperacionesDisponibles('componente');
		$data = json_decode(stripslashes($this->aa_Atributos['data']),true);
		$aGuardar = array();
		foreach ($data as $llave => $valor) {
			$valor['codigoOperacion'] = $valor['valor'];
			$valor['nombreOperacion'] = $valor['nombre'];
			$aGuardar[$llave] = $valor;
		}
		$valores = $this->validarGuardado($aGuardar,$existentes,'nombreOperacion');
		$aDesabilitar = $valores['aDesabilitar'];
		$aGuardarValidado = $valores['aGuardarValidado'];
		$lb_Hecho = false;
		$this->f_Con();
		$this->f_Begin();
		$i = 0;
		if(count($aDesabilitar)!=0){
			do{
				$ls_Sql = "	UPDATE seguridad.vcomponente_operacion SET estado='I'
										WHERE codigo_operacion='".$aDesabilitar[$i]['codigoOperacion']."'
										AND codigo_componente='".$this->aa_Atributos['codigo']."'";
				$lb_Hecho = $this->f_Ejecutar($ls_Sql);
				$i++;
			}while(($i < count($aDesabilitar)) || ($lb_Hecho == false));
		}else{
			//en caso contrario coloco true debido que no desabilitare a nadie
			$lb_Hecho = true;
		}
		if(!$lb_Hecho){
			$this->f_RollBack();
		}else{
			for ($i=0; $i < count($aGuardarValidado) ; $i++) {
				$lb_Hecho = false;
				$ls_Sql = "SELECT * from seguridad.vcomponente_operacion";
				$ls_Sql .=" WHERE codigo_componente =".$this->aa_Atributos['codigo']."";
				$ls_Sql .=" AND codigo_operacion =".$aGuardarValidado[$i]['codigoOperacion']."";
				$lr_tabla=$this->f_Filtro($ls_Sql);
				if($la_registro=$this->f_Arreglo($lr_tabla)){
					$ls_Sql = "	UPDATE seguridad.vcomponente_operacion SET estado='A'
											WHERE codigo_componente='".$this->aa_Atributos['codigo']."'
											AND codigo_operacion = '".$aGuardarValidado[$i]['codigoOperacion']."'";
					$lb_Hecho = $this->f_Ejecutar($ls_Sql);
				}else{
					$ls_Sql = "INSERT INTO seguridad.vcomponente_operacion (codigo_componente,codigo_operacion)
											values ('".$this->aa_Atributos['codigo']."','".$aGuardarValidado[$i]['codigoOperacion']."')";
					$lb_Hecho = $this->f_Ejecutar($ls_Sql);
				}
				$this->f_Cierra($lr_tabla);
				if(!$lb_Hecho){
					$this->f_RollBack();
					break;
				}
			}
			if($lb_Hecho){
				$this->f_Commit();
				$this->f_Des();
				return true;
			}else{
				$this->f_RollBack();
				$this->f_Des();
				return false;
			}
		}
	}
	//------------------------------------------------------------------------- Campos ------------------------------------------------------------------------------
	private function f_BuscarCamposDisponibles($tipo){
		//Busco Detalle
		if($tipo=='componente'){
			$cadena = $this->aa_Atributos['codigo'];
		}else if($tipo == 'privilegio' ){
			$cadena = '('."SELECT componente FROM seguridad.varbol_privilegios WHERE codigo =".$this->aa_Atributos['codigo'].')';
		}
		$ls_Sql="SELECT * from seguridad.vcomponente_campo WHERE codigo_componente = ".$cadena." AND estado_campo = 'A' ";
		$this->f_Con();
		$lr_tabla=$this->f_Filtro($ls_Sql);
		$i = 0;
		while($la_registros=$this->f_Arreglo($lr_tabla)){
			$la_respuesta[$i]['codigoCampo']=$la_registros['codigo_campo'];
			$la_respuesta[$i]['nombreCampo']=$la_registros['nombre_campo'];
			$i++;
		}
		$this->f_Cierra($lr_tabla);
		$this->f_Des();
		return $la_respuesta;
	}
	//------------------------------------------------------------------------- General ------------------------------------------------------------------------------

	private function validarGuardado($aGuardar,$existentes,$campoAComparar){
		$aGuardarValidado = array();
		for($x = 0;$x < count($aGuardar); $x++){
			$validado = false;
			for($y = 0;$y < count($existentes); $y++){
				if($existentes[$y][$campoAComparar] == $aGuardar[$x][$campoAComparar]){
					$validado = true;
				}
			}
			if(!$validado){
					$aGuardarValidado[count($aGuardarValidado)] = $aGuardar[$x];
			}
		}
		//busco aquellos a desabilitar
		for($x = 0;$x < count($existentes); $x++){
			$validado = false;
			for($y = 0;$y < count($aGuardar); $y++){
				if($aGuardar[$y][$campoAComparar] == $existentes[$x][$campoAComparar]){
					$validado = true;
				}
			}
			if(!$validado){
				$aDesabilitar[count($aDesabilitar)] = $existentes[$x];
			}
		}
		$valores['aGuardarValidado'] = $aGuardarValidado;
		$valores['aDesabilitar'] = $aDesabilitar;

		return $valores;
	}
}
?>
