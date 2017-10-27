<?php
  session_start();
  header("Content-Type: application/vnd.ms-excel; charset=iso-8859-1");
  header("Content-Disposition: attachment; filename=reportesCosecha.xls");
  header("Pragma: no-cache");
  header("Expires: 0");

  // Request Handler*/
  if (count($_POST))
  {
      $json = isset($_POST['json']) ? $_POST['json'] : '';
      if (!empty($json))
      {
          $arreglo = json_decode($json,true );
      }
      else
      {
          echo "No se detecto ningun dato";
      }
  }
  $cabecera =  array('Cod','Nombre','Camion','Chuto','Batea','Remolque','Sin Identificar','Total','Toneladas');


  function armarCabeceras($cabecera){
    echo '
   <tr>';
      for ($i=0; $i < count($cabecera) ; $i++) {
        echo '
          <th align="center">'.$cabecera[$i].'</th>
        ';
      }
   echo '</tr>';
  }
  //print(count($arreglo['datos']));
  //print_r($arreglo);

 function armarFechaCorte($arreglo){
  $total_total=0;
   for ($i=0; $i < count($arreglo['dias']); $i++) {
     for ($x=0; $x < count($arreglo['dias'][$i]['hijos']); $x++) {
          $total= ($arreglo['dias'][$i]['hijos'][$x]['camion']+$arreglo['dias'][$i]['hijos'][$x]['chuto']+$arreglo['dias'][$i]['hijos'][$x]['batea']+$arreglo['dias'][$i]['hijos'][$x]['remolque']+$arreglo['dias'][$i]['hijos'][$x]['sin_identificar']);
          echo '
          <tr>
             <td  align="center">'.$arreglo['dias'][$i]['hijos'][$x]['codigo_nucleo'].'</td>
             <td  align="center">'.$arreglo['dias'][$i]['hijos'][$x]['nombre_completo'].'</td>
             <td  align="center">'.$arreglo['dias'][$i]['hijos'][$x]['camion'].'</td>
             <td  align="center">'.$arreglo['dias'][$i]['hijos'][$x]['chuto'].'</td>
             <td  align="center">'.$arreglo['dias'][$i]['hijos'][$x]['batea'].'</td>
             <td  align="center">'.$arreglo['dias'][$i]['hijos'][$x]['remolque'].'</td>
             <td  align="center">'.$arreglo['dias'][$i]['hijos'][$x]['sin_identificar'].'</td>
             <td  align="center">'.$total.'</td>
             <td  align="center">'.$arreglo['dias'][$i]['hijos'][$x]['toneladas'].'</td>
          </tr>';
          $total_total=$total_total+$total_total;
        }
        echo '
        <tr>
           <th  align="center"></th>
           <th  align="center">'.$arreglo['dias'][$i]['fechadia'].'</th>
           <th  align="center">'.$arreglo['dias'][$i]['camion'].'</th>
           <th  align="center">'.$arreglo['dias'][$i]['chuto'].'</th>
           <th  align="center">'.$arreglo['dias'][$i]['batea'].'</th>
           <th  align="center">'.$arreglo['dias'][$i]['remolque'].'</th>
           <th  align="center">'.$arreglo['dias'][$i]['sin_identificar'].'</th>
           <th  align="center">'.$total_total.'</th>
           <th  align="center">'.$arreglo['dias'][$i]['toneladas'].'</th>
        </tr>
        <tr></tr>';
    }
  }
?>
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title></title>
    <style media="screen">
      table tr{
        border: :1px solid silver;
        border-collapse: collapse;
      }

      table tr td{
        text-align: center;
        border: 1px solid silver;
      }

    </style>
  </head>
  <body>
    <h1>Vehiculos Diarios por Nucleo</h1>

    <table  cellspacing="0" cellpadding="0" >

     <?php
       armarCabeceras($cabecera);
       armarFechaCorte($arreglo);

     ?>
     </table>

  </body>
</html>
