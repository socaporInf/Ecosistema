<?php
//Incluir la clase que hace permite conexión a Oracle
include_once "adodb/adodb.inc.php";
class clsDatosOracle{

  protected  $db_host = '192.168.88.20';				//Nombre del Host local   "192.168.88.20";
  private    $db_usuario = "sqlfigo";						//Nombre del Usuario "sqlfigo"
  private    $db_password = "aaosa";						//Password de la BD. "aaosa"
  protected  $db_nombre= 'CONTING';								//Nombre de la Base de Datos. "SOCAP" o "CONTING"
  public     $mensaje = 'Hecho';								//Mensaje de Hecho
  private    $db_port="1521";                   //1521
  public     $dboracle;

  /*-----------------------------------
  * Funcion conectar (Conecta con la base de datos)
  *-----------------------------------*/
  protected function propiedades($pcHost, $pcUsuario, $pcPassword, $db_nombre){
    $this->db_host=$pcHost;
    $this->db_usuario=$pcUsuario;
    $this->db_password=$pcPassword;
    $this->db_nombre=$db_nombre;
  }
  function conectar($ID_empresa = null,$ID_usuario = null){
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
      $this->setearContexto($ID_empresa,$ID_usuario);
  }
  function filtro($sql){
    		global $dboracle;
    		$result= $this->dboracle->Execute($sql) OR die ('Ejecucion Invalida : '.$sql);
    		$this->dboracle->Close();
    		return $result;
  }
  function setearContexto($ID_empresa,$ID_usuario){
    if(($ID_empresa!=null)||($ID_usuario!=null)){
      $this->dboracle->Execute("ALTER SESSION SET NLS_LANGUAGE = 'AMERICAN'");
      $stmt = $this->dboracle->PrepareSP(" begin
               pr_setear_contexto(".$ID_empresa.",".$ID_usuario.");
              end;");
      $this->dboracle->Execute($stmt);
    }
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
