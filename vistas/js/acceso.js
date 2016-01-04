var conexionAcc;
function accesar(){
	var campNom=document.getElementById('nomUsu');
	var campPass=document.getElementById('pass');
	conexionAcc=crearXMLHttpRequest();
	conexionAcc.onreadystatechange = procesarAcc;
	conexionAcc.open('POST','cor_validar.php', true);
	conexionAcc.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	var envio="Operacion="+encodeURIComponent("acceso");
	envio+="&Nombre="+encodeURIComponent(campNom.value)+"&Pass="+encodeURIComponent(campPass.value);
	console.log(envio);
	//conexionAcc.send(envio);
}
function procesarAcc(){
	if(conexionAcc.readyState == 4){
		
	}
}
