<?php
//-------------------------------------------------------//
// Incluir la clase que hace permite conexión a Oracle   //
//-------------------------------------------------------//
include_once "../../lib/adodb/adodb.inc.php";
class cls_ConexionOra{

  protected  $db_host = '192.168.88.20';		//Nombre del Host local   "192.168.88.10" 192.168.88.20";
  private    $db_usuario = "sqlfigo";			//Nombre del Usuario "sqlfigo"
  private    $db_password = "aaosa";			//Password de la BD. "aaosa"
  protected  $db_nombre= 'CONTING';				//Nombre de la Base de Datos. "SOCAP" o "CONTING"
  public     $mensaje = 'Hecho';				//Mensaje de Hecho
  private    $db_port="1521";                   //1521
  public     $dboracle;		


  protected function propiedades($pcHost, $pcUsuario, $pcPassword, $db_nombre){
    $this->db_host=$pcHost;
    $this->db_usuario=$pcUsuario;
    $this->db_password=$pcPassword;
    $this->db_nombre=$db_nombre;
  }

  //----------------------------------------------------//
  // Funcion conectar (Conecta con la base de datos)    //
  //----------------------------------------------------//
  function f_Con_ora($ID_empresa = null,$ID_usuario = null){
      $this->dboracle = NewADOConnection("oci8");
      $this->dboracle->NLS_DATE_FORMAT = 'DD/MM/YYYY';
  		global $cstr;
      $cstr = "  (DESCRIPTION =
      	(ADDRESS = (PROTOCOL = TCP)(HOST = ".$this->db_host.")(PORT = ".$this->db_port."))
      	(CONNECT_DATA =
      	(SERVER = DEDICATED)
      	(SID = ".$this->db_nombre.")
     		 )
  		  )";
      //$dboracle->debug = true;
      $this->dboracle->Connect( $cstr, $this->db_usuario , $this->db_password) OR die('No existe conexion con la base de datos del sistema.');
      $this->f_setear_Contexto($ID_empresa,$ID_usuario);
  }

  //----------------------------------------------------//
  // 			Ejecuta las sentencias Sql    			          //
  //----------------------------------------------------//
  function f_Filtro_ora($sql){
	global $dboracle;
	$result= $this->dboracle->Execute($sql) OR die ('Ejecucion Invalida : '.$sql);
	$this->dboracle->Close();
	return $result;
  }

  //----------------------------------------------------//
  //  envia los datos para conectar con la empresa 	  	//
  //----------------------------------------------------//
  function f_setear_Contexto($ID_empresa,$ID_usuario){
    if(($ID_empresa!=null)||($ID_usuario!=null)){
      $this->dboracle->Execute("ALTER SESSION SET NLS_LANGUAGE = 'AMERICAN'");
      $stmt = $this->dboracle->PrepareSP(" begin
              pr_setear_contexto(".$ID_empresa.",".$ID_usuario.");
              end;");
      $this->dboracle->Execute($stmt);
    }
  }

  //-----------------------------------------------------//
  //        Funcion Arma los campos de paginacion        //
  //-----------------------------------------------------//
 	protected function f_ArmarPaginacion($ls_SqlBase,$orden,$nr,$gruop = ''){
      	//varibles paginacion
      	if(isset($this->aa_Atributos['registrosporpagina'])){
	        $registrosPorPagina = $this->aa_Atributos['registrosporpagina'];
	        $paginaActual = $this->aa_Atributos['pagina'] - 1;
	        $paginas = $nr / $registrosPorPagina;
	        $paginas = ceil($paginas);
	        $min = $paginaActual * $registrosPorPagina;
	        $max = ($paginaActual +1) * $registrosPorPagina;
         	$ls_Sql= 'SELECT * FROM
                    (
                      SELECT AUX.*, ROWNUM MINIMUN FROM
                        (
                          '.$ls_SqlBase.' '.$group.' '.$orden.' 
                        ) AUX
                      WHERE ROWNUM <= '.$max.'
                    )
                  WHERE MINIMUN >'.$min;
         	$this->aa_Atributos['paginas'] = $paginas;
      	}else{
        	$ls_Sql= $ls_SqlBase." ".$gruop." ".$orden;
      	}
     	return $ls_Sql;
   	}

  function formateoFecha($date){
  	$newDate = date("d/m/Y", strtotime($date));
  	return $newDate;
  }

  function CommitTrans($Qry){
  	$listo = $this->dboracle->CommitTrans($Qry);

  }

  function BeginTrans(){
  	$listo = $this->dboracle->BeginTrans();

  }
}
?>
