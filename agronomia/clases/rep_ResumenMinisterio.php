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
  $cabecera =  array('Municipio','Area Cosechada','Toneladas de Caña','Toneladas de Azucar','T.C.H','Rdto');
  $cabecerazona =  array('Zona','Area Cosechada','Toneladas de Caña','Toneladas de Azucar','T.C.H','Rdto');


  function armarCabeceras($arreglo,$cabecera){
    echo '<tr>
      <th align="center" colspan="2">Fecha	Zafra: '.$arreglo['zafra']['feczafra'].'</th>
      <th align="center" colspan="2">Fecha	Desde: '.$arreglo['zafra']['desde'].'</th>
      <th align="center" colspan="2">Fecha	Hasta: '.$arreglo['zafra']['hasta'].'</th>
    </tr>
    <tr></tr>';

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

 function armarFechaCorte($arreglo,$cabecerazona){
   for ($i=0; $i < count($arreglo['estados']); $i++) {
     for ($x=0; $x < count($arreglo['estados'][$i]['hijos']); $x++) {
          echo '
          <tr>
             <td  align="center">'.$arreglo['estados'][$i]['hijos'][$x]['nombre'].'</td>
             <td  align="center">'.$arreglo['estados'][$i]['hijos'][$x]['area'].'</td>
             <td  align="center">'.$arreglo['estados'][$i]['hijos'][$x]['peso'].'</td>
             <td  align="center">'.$arreglo['estados'][$i]['hijos'][$x]['azucar'].'</td>
             <td  align="center">'.$arreglo['estados'][$i]['hijos'][$x]['tch'].'</td>
             <td  align="center">'.$arreglo['estados'][$i]['hijos'][$x]['rdto'].'</td>
          </tr>';
        }
        echo '
        <tr>
           <th  align="center">Total '.$arreglo['estados'][$i]['nomestado'].'</th>
           <th  align="center">'.$arreglo['estados'][$i]['area'].'</th>
           <th  align="center">'.$arreglo['estados'][$i]['peso'].'</th>
           <th  align="center">'.$arreglo['estados'][$i]['azucar'].'</th>
           <th  align="center">'.$arreglo['estados'][$i]['tch'].'</th>
           <th  align="center">'.$arreglo['estados'][$i]['rdto'].'</th>
        </tr>';
    }

    echo '
    <tr></td>
   <tr>';
      for ($i=0; $i < count($cabecerazona) ; $i++) {
        echo '
          <th align="center">'.$cabecerazona[$i].'</th>
        ';
      }
   echo '</tr>';

    for ($z=0; $z < count($arreglo['zonas']); $z++) {
      echo '
      <tr>
         <td  align="center">'.$arreglo['zonas'][$z]['nombre'].'</td>
         <td  align="center">'.$arreglo['zonas'][$z]['area'].'</td>
         <td  align="center">'.$arreglo['zonas'][$z]['peso'].'</td>
         <td  align="center">'.$arreglo['zonas'][$z]['azucar'].'</td>
         <td  align="center">'.$arreglo['zonas'][$z]['tch'].'</td>
         <td  align="center">'.$arreglo['zonas'][$z]['rdto'].'</td>
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
    <h1>Caña Arrimada por Municipio</h1>

    <table  cellspacing="0" cellpadding="0" >

     <?php
       armarCabeceras($arreglo,$cabecera);
       armarFechaCorte($arreglo,$cabecerazona);

     ?>
     </table>

  </body>
</html>
