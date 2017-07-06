<?php
  header('Content-Type: text/html; charset=UTF-8');
  include_once('../../nucleo/clases/cls_conexionOracle.php');
  $conexion = new cls_ConexionOra();
  $arreglo  = array();
  $x=0;
  //$sql = 'SELECT ID_REGISTRO, ORG_ID_ORGANIZACION, CO_ORGANIZACION    from t00_empresa_organizacion';
  //$sql = 'select EMP_ID_EMPRESA, ID_REGISTRO , NU_PEDIDO from t05_pedido';
  //$sql = 'select ID_REGISTRO, EMP_ID_EMPRESA, GRD_ID_GRUPO_DATO from s05_pedido_cliente_r';
  $conexion->f_Con('6232098','6236396');
    $sql = 'SELECT * FROM
                    (
                      SELECT AUX.*, ROWNUM MINIMUN FROM
                        (
                          select ID_REGISTRO, EMP_ID_EMPRESA, GRD_ID_GRUPO_DATO from s05_pedido_cliente_r 
                        ) AUX
                      WHERE ROWNUM <= 30
                    )
                  WHERE MINIMUN > 0';
  $cursor = $conexion->f_Filtro($sql);

  $cantidad=$cursor->RecordCount();
  print($cantidad);
  while(!$cursor->EOF){
    $arreglo[] = array($cursor->fields[0],$cursor->fields[1],$cursor->fields[2]);
    $cursor->MoveNext();
  };
  
?>
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Coneccion Oracle sqlFIGO </title>
    <style>
      div{
        position: relative;
        height: 600px;
        overflow: auto;
        width: 650px;
      }
      table{
        margin-top: -5px;
      }
      table tr td, table tr th{
        padding-right: 20px;
        padding-left: 20px;
        text-align: center;
        border-right: 1px solid silver;
      }

      table tr:hover{
        background: #e3e3e3;
        cursor:pointer;
      }
      table tr:first-child{
        position: fixed;
        background: black;
        color: white;
      }
      table tr:nth-child(1){
        border: none;
      }
    </style>
  </head>
  <body>
    <h2>Prueba Conexcion Oracle</h2>
    <div>
      <table>
       <tr>
       <th>ID_REGISTRO</th>
       <th>EMP_ID_EMPRESA</th>
       <th>GRD_ID_GRUPO_DATO</th>
       </tr>
       <tr>
       <th>ID_REGISTRO</th>
       <th>EMP_ID_EMPRESA</th>
       <th>GRD_ID_GRUPO_DATO</th>
       </tr>
      <?php
        for ($i=0; $i < count($arreglo); $i++) {
          echo'
            <tr class="fgreen">
             <td class="text-left">'.$arreglo[$i][0].'</td>
             <td class="text-left">'.$arreglo[$i][1].'</td>
             <td class="text-left">'.$arreglo[$i][2].'</td>
            </tr>
          ';
        }
       ?>
      </table>
    </div>
  </body>
</html>
