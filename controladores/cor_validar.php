<?php

if(isset($_POST['Operacion'])){
	$la_Form=$_POST;
} else {
	$la_Form=$_GET;
}
print("<pre>");
print_r($la_Form);
print("</pre>");
?>