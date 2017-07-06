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
  $cabecera =  array('Finca','Nombre Finca','Nombre Zona','Tablon','Fecha Minima','Fecha Maxima');


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
   for ($x=0; $x < count($arreglo['datos']); $x++) {
        echo '
        <tr>
           <th  align="center">'.$arreglo['datos'][$x]['finca_codigo'].'</th>
           <th  align="center">'.$arreglo['datos'][$x]['nombre_finca'].'</th>
           <th  align="center">'.$arreglo['datos'][$x]['nombre_zona'].'</th>
           <th  align="center">'.$arreglo['datos'][$x]['tablon_codigo'].'</th>
           <th  align="center">'.$arreglo['datos'][$x]['min'].'</th>
           <th  align="center">'.$arreglo['datos'][$x]['max'].'</th>
        </tr>';
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
    <h1>Fecha de Corte</h1>

    <table  cellspacing="0" cellpadding="0" >

     <?php
       armarCabeceras($cabecera);
       armarFechaCorte($arreglo);

     ?>
     </table>

  </body>
</html>
