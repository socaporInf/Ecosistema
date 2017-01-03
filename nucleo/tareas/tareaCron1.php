<?php
$time = date("G:i:s");
$entry = "Información guardada a las $time.\n";
$file = "/var/www/html/Ecosistema/nucleo/logs/test.txt";
$open = fopen($file,"a");

if ( $open ) {
	fwrite($open,$entry);
	fclose($open);
}
 ?>
