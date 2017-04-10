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
  $agrupacion = $_POST['agrupacion'];
  $cabecera =  array('Finca Letra','Nombre Finca','Sem','Caña','Total','Ton/Ha','Total Est','Cortada','Por Cortar','Por Cosechar','Total/Ton','Ton/Ha','Total','Ton/Ha','%','Corte','Total/Ton','Ton/Ha','Rdto');


  function armarCabeceras($cabecera){
    echo '<tr>
      <th align="left" colspan="2">Zafra: 20162017</th>
      <th align="left" colspan="4">Fecha	Inicio: 15-12-2016</th>
      <th align="left" colspan="4">Fecha	Final: 01-05-2017</th>
      <th align="left" colspan="5">Fecha	Dia	Zafra: 04-04-2017</th>
    </tr>
    <tr>
      <th colspan="2"></th>
      <th align="left" colspan="5">Resumen General Reg Agronomicos</th>
      <th colspan="3" align="center"></th>
      <th align="left" colspan="6">Total Caña Cosechada</th>
      <th align="left" colspan="3">Total Azucar</th>

    </tr>
    <tr>
      <th colspan="2" align="center"></th>
      <th colspan="3" align="center">Area</th>
      <th colspan="2" align="center">Toneladas</th>
      <th colspan="2" align="center">Total area</th>
      <th align="center">Caña estimada</th>
      <th colspan="2" align="center">Estimado</th>
      <th colspan="2" align="center">Real</th>
      <th align="center">Desv</th>
      <th align="center">Edad</th>
      <th colspan="3" align="center">Real</th>
    </tr>
   <tr>';
      for ($i=0; $i < count($cabecera) ; $i++) {
        echo '
          <th align="center">'.$cabecera[$i].'</th>
        ';
      }
   echo '</tr>';
  }
  function armarGeneral($arreglo){
    for ($i=0; $i < count($arreglo); $i++) {
      for ($x=0; $x < count($arreglo['zonas']['zonas']); $x++) {
        echo '
        <tr>
           <th  align="center">'.$arreglo['zonas']['zonas'][$x]['codzona'].'</th>
           <th  align="center">'.$arreglo['zonas']['zonas'][$x]['nomzona'].'</th>
           <th  align="center">'.$arreglo['zonas']['zonas'][$x]['tgzarea_sem'].'</th>
           <th  align="center">'.$arreglo['zonas']['zonas'][$x]['tgzareacana'].'</th>
           <th  align="center">'.round(floatval($arreglo['zonas']['zonas'][$x]['tgzarea_sem'])+floatval($arreglo['zonas']['zonas'][$x]['tgzareacana']), 2).'</th>
           <th  align="center">'.$arreglo['zonas']['zonas'][$x]['tgztonestha'].'</th>
           <th  align="center">'.$arreglo['zonas']['zonas'][$x]['tgztotalest'].'</th>
           <th  align="center">'.$arreglo['zonas']['zonas'][$x]['tacortada'].'</th>
           <th  align="center">'.$arreglo['zonas']['zonas'][$x]['taporcortar'].'</th>
           <th  align="center">'.$arreglo['zonas']['zonas'][$x]['ceporcosechar'].'</th>
           <th  align="center">'.$arreglo['zonas']['zonas'][$x]['tcanacosesttotaltn'].'</th>
           <th  align="center">'.$arreglo['zonas']['zonas'][$x]['tcanacosesttotaltnha'].'</th>
           <th  align="center">'.$arreglo['zonas']['zonas'][$x]['tcanacosrealtotaltn'].'</th>
           <th  align="center">'.$arreglo['zonas']['zonas'][$x]['tcanacosrealtotaltnha'].'</th>
           <th  align="center">'.round(($arreglo['zonas']['zonas'][$x]['tcanacosrealtotaltn']/$arreglo['zonas']['zonas'][$x]['tcanacosesttotaltn']*100)-100,2).'</th>
           <th  align="center"></th>
           <th  align="center">'.$arreglo['zonas']['zonas'][$x]['tartotalton'].'</th>
           <th  align="center">'.$arreglo['zonas']['zonas'][$x]['tartotaltonha'].'</th>
           <th  align="center">'.round($arreglo['zonas']['zonas'][$x]['tartotalton']/$arreglo['zonas']['zonas'][$x]['tcanacosrealtotaltn']*100,2).'</th>
        </tr>';
      }
      echo '
        <tr>
          <td  align="center">Totales</td>
          <td  align="center">General</td>
          <td  align="center">'.$arreglo['zonas']['tgzarea_sem'].'</td>
          <td  align="center">'.$arreglo['zonas']['tgzareacana'].'</td>
          <td  align="center">'.round(floatval($arreglo['zonas']['tgzarea_sem'])+floatval($arreglo['zonas']['tgzareacana']), 2).'</td>
          <td  align="center">'.$arreglo['zonas']['tgztonestha'].'</td>
          <td  align="center">'.$arreglo['zonas']['tgztotalest'].'</td>
          <td  align="center">'.$arreglo['zonas']['tacortada'].'</td>
          <td  align="center">'.$arreglo['zonas']['taporcortar'].'</td>
          <td  align="center">'.$arreglo['zonas']['ceporcosechar'].'</td>
          <td  align="center">'.$arreglo['zonas']['tcanacosesttotaltn'].'</td>
          <td  align="center">'.$arreglo['zonas']['tcanacosesttotaltnha'].'</td>
          <td  align="center">'.$arreglo['zonas']['tcanacosrealtotaltn'].'</td>
          <td  align="center">'.$arreglo['zonas']['tcanacosrealtotaltnha'].'</td>
          <td  align="center">'.round(($arreglo['zonas']['tcanacosrealtotaltn']/$arreglo['zonas']['tcanacosesttotaltn']*100)-100,2).'</td>
          <td  align="center"></td>
          <td  align="center">'.$arreglo['zonas']['tartotalton'].'</td>
          <td  align="center">'.$arreglo['zonas']['tartotaltonha'].'</td>
          <td  align="center">'.round($arreglo['zonas']['tartotalton']/$arreglo['zonas']['tcanacosrealtotaltn']*100,2).'</td>
        </tr>
      ';
    }
    echo '</table>';
  }
  function armarResumido($arreglo,$cabecera){
    for ($i=0; $i < count($arreglo); $i++) {
      for ($x=0; $x < count($arreglo['zonas']['zonas']); $x++) {
        echo '
          <tr>
            <td  align="center"><h3>'.$arreglo['zonas']['zonas'][$x]['codzona'].'</h3></td>
            <td  colspan="6"><h3>'.$arreglo['zonas']['zonas'][$x]['nomzona'].'</h3></td>
            <td align="center" colspan="12"></td>
          </tr>
        ';
          for ($h=0; $h < count($arreglo['zonas']['zonas'][$x]['hijos']); $h++) {
            echo '
            <tr>
              <td  align="center">'.$arreglo['zonas']['zonas'][$x]['hijos'][$h]['fincalet'].'</td>
              <td  align="center">'.$arreglo['zonas']['zonas'][$x]['hijos'][$h]['nomfinca'].'</td>
              <td  align="center">'.$arreglo['zonas']['zonas'][$x]['hijos'][$h]['tgzarea_sem'].'</td>
              <td  align="center">'.$arreglo['zonas']['zonas'][$x]['hijos'][$h]['tgzareacana'].'</td>
              <td  align="center">'.$arreglo['zonas']['zonas'][$x]['hijos'][$h]['tgzarea'].'</td>
              <td  align="center">'.$arreglo['zonas']['zonas'][$x]['hijos'][$h]['tgztonestha'].'</td>
              <td  align="center">'.$arreglo['zonas']['zonas'][$x]['hijos'][$h]['tgztotalest'].'</td>
              <td  align="center">'.$arreglo['zonas']['zonas'][$x]['hijos'][$h]['tacortada'].'</td>
              <td  align="center">'.$arreglo['zonas']['zonas'][$x]['hijos'][$h]['taporcortar'].'</td>
              <td  align="center">'.$arreglo['zonas']['zonas'][$x]['hijos'][$h]['ceporcosechar'].'</td>
              <td  align="center">'.$arreglo['zonas']['zonas'][$x]['hijos'][$h]['tcanacosesttotaltn'].'</td>
              <td  align="center">'.$arreglo['zonas']['zonas'][$x]['hijos'][$h]['tcanacosesttotaltnha'].'</td>
              <td  align="center">'.$arreglo['zonas']['zonas'][$x]['hijos'][$h]['tcanacosrealtotaltn'].'</td>
              <td  align="center">'.$arreglo['zonas']['zonas'][$x]['hijos'][$h]['tcanacosrealtotaltnha'].'</td>
              <td  align="center">'.$arreglo['zonas']['zonas'][$x]['hijos'][$h]['porcentajedesv'].'</td>
              <td  align="center">'.$arreglo['zonas']['zonas'][$x]['hijos'][$h]['edadcorte'].'</td>
              <td  align="center">'.$arreglo['zonas']['zonas'][$x]['hijos'][$h]['tartotalton'].'</td>
              <td  align="center">'.$arreglo['zonas']['zonas'][$x]['hijos'][$h]['tartotaltonha'].'</td>
              <td  align="center">'.$arreglo['zonas']['zonas'][$x]['hijos'][$h]['rdto'].'</td>
            </tr>
            ';
          }
        echo '
        <tr>
          <th  align="center"></th>
          <th  align="center">Totales</th>
          <th  align="center">'.$arreglo['zonas']['zonas'][$x]['tgzarea_sem'].'</th>
          <th  align="center">'.$arreglo['zonas']['zonas'][$x]['tgzareacana'].'</th>
          <th  align="center">'.round(floatval($arreglo['zonas']['zonas'][$x]['tgzarea_sem'])+floatval($arreglo['zonas']['zonas'][$x]['tgzareacana']), 2).'</th>
          <th  align="center">'.$arreglo['zonas']['zonas'][$x]['tgztonestha'].'</th>
          <th  align="center">'.$arreglo['zonas']['zonas'][$x]['tgztotalest'].'</th>
          <th  align="center">'.$arreglo['zonas']['zonas'][$x]['tacortada'].'</th>
          <th  align="center">'.$arreglo['zonas']['zonas'][$x]['taporcortar'].'</th>
          <th  align="center">'.$arreglo['zonas']['zonas'][$x]['ceporcosechar'].'</th>
          <th  align="center">'.$arreglo['zonas']['zonas'][$x]['tcanacosesttotaltn'].'</th>
          <th  align="center">'.$arreglo['zonas']['zonas'][$x]['tcanacosesttotaltnha'].'</th>
          <th  align="center">'.$arreglo['zonas']['zonas'][$x]['tcanacosrealtotaltn'].'</th>
          <th  align="center">'.$arreglo['zonas']['zonas'][$x]['tcanacosrealtotaltnha'].'</th>
          <th  align="center">'.round(($arreglo['zonas']['zonas'][$x]['tcanacosrealtotaltn']/$arreglo['zonas']['zonas'][$x]['tcanacosesttotaltn']*100)-100,2).'</th>
          <th  align="center"></th>
          <th  align="center">'.$arreglo['zonas']['zonas'][$x]['tartotalton'].'</th>
          <th  align="center">'.$arreglo['zonas']['zonas'][$x]['tartotaltonha'].'</th>
          <th  align="center">'.round($arreglo['zonas']['zonas'][$x]['tartotalton']/$arreglo['zonas']['zonas'][$x]['tcanacosrealtotaltn']*100,2).'</th>
        </tr>
        <tr><td> </td></tr>
        <tr>';
           for ($i=0; $i < count($cabecera) ; $i++) {
             echo '
               <th align="center">'.$cabecera[$i].'</th>
             ';
           }
        echo'</tr>
        ';
      }
      echo '
        <tr>
          <td  align="center">Totales</td>
          <td  align="center">General</td>
          <td  align="center">'.$arreglo['zonas']['tgzarea_sem'].'</td>
          <td  align="center">'.$arreglo['zonas']['tgzareacana'].'</td>
          <td  align="center">'.round(floatval($arreglo['zonas']['tgzarea_sem'])+floatval($arreglo['zonas']['tgzareacana']), 2).'</td>
          <td  align="center">'.$arreglo['zonas']['tgztonestha'].'</td>
          <td  align="center">'.$arreglo['zonas']['tgztotalest'].'</td>
          <td  align="center">'.$arreglo['zonas']['tacortada'].'</td>
          <td  align="center">'.$arreglo['zonas']['taporcortar'].'</td>
          <td  align="center">'.$arreglo['zonas']['ceporcosechar'].'</td>
          <td  align="center">'.$arreglo['zonas']['tcanacosesttotaltn'].'</td>
          <td  align="center">'.$arreglo['zonas']['tcanacosesttotaltnha'].'</td>
          <td  align="center">'.$arreglo['zonas']['tcanacosrealtotaltn'].'</td>
          <td  align="center">'.$arreglo['zonas']['tcanacosrealtotaltnha'].'</td>
          <td  align="center">'.round(($arreglo['zonas']['tcanacosrealtotaltn']/$arreglo['zonas']['tcanacosesttotaltn']*100)-100,2).'</td>
          <td  align="center"></td>
          <td  align="center">'.$arreglo['zonas']['tartotalton'].'</td>
          <td  align="center">'.$arreglo['zonas']['tartotaltonha'].'</td>
          <td  align="center">'.round($arreglo['zonas']['tartotalton']/$arreglo['zonas']['tcanacosrealtotaltn']*100,2).'</td>
        </tr>
      ';
    }
    echo '</table>';
  }
  function armarDetalle($arreglo,$cabecera){
    for ($i=0; $i < count($arreglo); $i++) {
      for ($x=0; $x < count($arreglo['zonas']['zonas']); $x++) {
        echo '
          <tr>
            <td  align="center"><h3>'.$arreglo['zonas']['zonas'][$x]['codzona'].'</h3></td>
            <td  colspan="6"><h3>'.$arreglo['zonas']['zonas'][$x]['nomzona'].'</h3></td>
            <td align="center" colspan="12"></td>
          </tr>
        ';
          for ($h=0; $h < count($arreglo['zonas']['zonas'][$x]['hijos']); $h++) {
            echo '
              <tr>
                <td></td>
                <td  align="center"><h4>'.$arreglo['zonas']['zonas'][$x]['hijos'][$h]['fincalet'].'</h4></td>
                <td  colspan="6"><h4>'.$arreglo['zonas']['zonas'][$x]['hijos'][$h]['nomfinca'].'</h4></td>
                <td align="center" colspan="12"></td>
              </tr>
            ';
            for ($t=0; $t < count($arreglo['zonas']['zonas'][$x]['hijos'][$h]['hijos']); $t++) {
            echo '
            <tr>
              <td  colspan = "2" align="center">'.$arreglo['zonas']['zonas'][$x]['hijos'][$h]['hijos'][$t]['codtablon'].'</td>
              <td  align="center">'.$arreglo['zonas']['zonas'][$x]['hijos'][$h]['hijos'][$t]['tgzarea_sem'].'</td>
              <td  align="center">'.$arreglo['zonas']['zonas'][$x]['hijos'][$h]['hijos'][$t]['tgzareacana'].'</td>
              <td  align="center">'.$arreglo['zonas']['zonas'][$x]['hijos'][$h]['hijos'][$t]['tgzarea'].'</td>
              <td  align="center">'..round(floatval($arreglo['zonas']['zonas'][$x]['hijos'][$h]['hijos'][$t]['tgztotalest'])+floatval($arreglo['zonas']['zonas'][$x]['hijos'][$h]['hijos'][$t]['tgzarea']), 2)'</td>
              <td  align="center">'.$arreglo['zonas']['zonas'][$x]['hijos'][$h]['hijos'][$t]['tgztotalest'].'</td>
              <td  align="center">'.$arreglo['zonas']['zonas'][$x]['hijos'][$h]['hijos'][$t]['tacortada'].'</td>
              <td  align="center">'.$arreglo['zonas']['zonas'][$x]['hijos'][$h]['hijos'][$t]['taporcortar'].'</td>
              <td  align="center">'.$arreglo['zonas']['zonas'][$x]['hijos'][$h]['hijos'][$t]['ceporcosechar'].'</td>
              <td  align="center">'.$arreglo['zonas']['zonas'][$x]['hijos'][$h]['hijos'][$t]['tcanacosesttotaltn'].'</td>
              <td  align="center">'.$arreglo['zonas']['zonas'][$x]['hijos'][$h]['hijos'][$t]['tcanacosesttotaltnha'].'</td>
              <td  align="center">'.$arreglo['zonas']['zonas'][$x]['hijos'][$h]['hijos'][$t]['tcanacosrealtotaltn'].'</td>
              <td  align="center">'.$arreglo['zonas']['zonas'][$x]['hijos'][$h]['hijos'][$t]['tcanacosrealtotaltnha'].'</td>
              <td  align="center">'.$arreglo['zonas']['zonas'][$x]['hijos'][$h]['hijos'][$t]['porcentajedesv'].'</td>
              <td  align="center">'.$arreglo['zonas']['zonas'][$x]['hijos'][$h]['hijos'][$t]['edadcorte'].'</td>
              <td  align="center">'.$arreglo['zonas']['zonas'][$x]['hijos'][$h]['hijos'][$t]['tartotalton'].'</td>
              <td  align="center">'.$arreglo['zonas']['zonas'][$x]['hijos'][$h]['hijos'][$t]['tartotaltonha'].'</td>
              <td  align="center">'.$arreglo['zonas']['zonas'][$x]['hijos'][$h]['hijos'][$t]['rdto'].'</td>
            </tr>
            ';
          }
        }
        echo '
        <tr>
          <th  align="center"></th>
          <th  align="center">Totales</th>
          <th  align="center">'.$arreglo['zonas']['zonas'][$x]['tgzarea_sem'].'</th>
          <th  align="center">'.$arreglo['zonas']['zonas'][$x]['tgzareacana'].'</th>
          <th  align="center">'.round(floatval($arreglo['zonas']['zonas'][$x]['tgzarea_sem'])+floatval($arreglo['zonas']['zonas'][$x]['tgzareacana']), 2).'</th>
          <th  align="center">'.$arreglo['zonas']['zonas'][$x]['tgztonestha'].'</th>
          <th  align="center">'.$arreglo['zonas']['zonas'][$x]['tgztotalest'].'</th>
          <th  align="center">'.$arreglo['zonas']['zonas'][$x]['tacortada'].'</th>
          <th  align="center">'.$arreglo['zonas']['zonas'][$x]['taporcortar'].'</th>
          <th  align="center">'.$arreglo['zonas']['zonas'][$x]['ceporcosechar'].'</th>
          <th  align="center">'.$arreglo['zonas']['zonas'][$x]['tcanacosesttotaltn'].'</th>
          <th  align="center">'.$arreglo['zonas']['zonas'][$x]['tcanacosesttotaltnha'].'</th>
          <th  align="center">'.$arreglo['zonas']['zonas'][$x]['tcanacosrealtotaltn'].'</th>
          <th  align="center">'.$arreglo['zonas']['zonas'][$x]['tcanacosrealtotaltnha'].'</th>
          <th  align="center">'.round(($arreglo['zonas']['zonas'][$x]['tcanacosrealtotaltn']/$arreglo['zonas']['zonas'][$x]['tcanacosesttotaltn']*100)-100,2).'</th>
          <th  align="center"></th>
          <th  align="center">'.$arreglo['zonas']['zonas'][$x]['tartotalton'].'</th>
          <th  align="center">'.$arreglo['zonas']['zonas'][$x]['tartotaltonha'].'</th>
          <th  align="center">'.round($arreglo['zonas']['zonas'][$x]['tartotalton']/$arreglo['zonas']['zonas'][$x]['tcanacosrealtotaltn']*100,2).'</th>
        </tr>
        <tr><td> </td></tr>
        <tr>';
           for ($i=0; $i < count($cabecera) ; $i++) {
             echo '
               <th align="center">'.$cabecera[$i].'</th>
             ';
           }
        echo'</tr>
        ';
      }
      echo '
        <tr>
          <td  align="center">Totales</td>
          <td  align="center">General</td>
          <td  align="center">'.$arreglo['zonas']['tgzarea_sem'].'</td>
          <td  align="center">'.$arreglo['zonas']['tgzareacana'].'</td>
          <td  align="center">'.round(floatval($arreglo['zonas']['tgzarea_sem'])+floatval($arreglo['zonas']['tgzareacana']), 2).'</td>
          <td  align="center">'.$arreglo['zonas']['tgztonestha'].'</td>
          <td  align="center">'.$arreglo['zonas']['tgztotalest'].'</td>
          <td  align="center">'.$arreglo['zonas']['tacortada'].'</td>
          <td  align="center">'.$arreglo['zonas']['taporcortar'].'</td>
          <td  align="center">'.$arreglo['zonas']['ceporcosechar'].'</td>
          <td  align="center">'.$arreglo['zonas']['tcanacosesttotaltn'].'</td>
          <td  align="center">'.$arreglo['zonas']['tcanacosesttotaltnha'].'</td>
          <td  align="center">'.$arreglo['zonas']['tcanacosrealtotaltn'].'</td>
          <td  align="center">'.$arreglo['zonas']['tcanacosrealtotaltnha'].'</td>
          <td  align="center">'.round(($arreglo['zonas']['tcanacosrealtotaltn']/$arreglo['zonas']['tcanacosesttotaltn']*100)-100,2).'</td>
          <td  align="center"></td>
          <td  align="center">'.$arreglo['zonas']['tartotalton'].'</td>
          <td  align="center">'.$arreglo['zonas']['tartotaltonha'].'</td>
          <td  align="center">'.round($arreglo['zonas']['tartotalton']/$arreglo['zonas']['tcanacosrealtotaltn']*100,2).'</td>
        </tr>
      ';
    }
    echo '</table>';
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
    <h1>Resumen	de	Produccion	por	finca	Estimado	Vs	Real</h1>

    <table  cellspacing="0" cellpadding="0" >

     <?php
     if($agrupacion == '"T"'){
       armarCabeceras($cabecera);
       armarGeneral($arreglo);
     }
     else if($agrupacion == '"R"'){
       armarCabeceras($cabecera);
       armarResumido($arreglo,$cabecera);
     }else if($agrupacion == '"D"'){
       armarCabeceras($cabecera);
       armarDetalle($arreglo,$cabecera);
     }
     ?>
  </body>
</html>
