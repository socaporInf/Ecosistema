<?php
  //header('Content-Type: text/html; charset=UTF-8');
  include_once('Class/cls_conexionOracle.php');
  $conexion = new clsDatosOracle();
  $zonas  = array( );
  $x=0;
  //$sql = 'SELECT ID_REGISTRO, ORG_ID_ORGANIZACION, CO_ORGANIZACION    from t00_empresa_organizacion';
  //$sql = 'select EMP_ID_EMPRESA, ID_REGISTRO , NU_PEDIDO from t05_pedido';
  $sql = ' select ID_REGISTRO, EMP_ID_EMPRESA, GRD_ID_GRUPO_DATO from s05_pedido_cliente_r';
  //print ($sql);
  $conexion->conectar('6232098','6236396');
  $cursor = $conexion->filtro($sql);
  while(!$cursor->EOF){
    $zonas [] = array($cursor->fields[0],$cursor->fields[1],$cursor->fields[2]);
    $cursor->MoveNext();
  };
?>
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>nucleos Oracle</title>
  </head>
  <body>
    <h2>Nucleo Oracle</h2>
    <table class="table table-striped">
             <tr class="info">
             <th>ID</th>
             <th>Valor</th>
             <th>REGION_ID</th>
             </tr>
    <?php
      for ($i=0; $i < count($zonas); $i++) {
        //echo $zonas[$i][0];
        //echo $zonas[$i][1];
        //echo $zonas[$i][2].'<br>';
        echo '<tr class="fgreen">
         <td class="text-left">'.$zonas[$i][0].'</td>
         <td class="text-left">'.$zonas[$i][1].'</td>
         <td class="text-left">'.$zonas[$i][2].'</td>
         <td class="text-left">';
      }
     ?>
    </table>
  </body>
</html>
