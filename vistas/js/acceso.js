var conexionAcc;
function accesar(){
	var campNom=document.getElementById('nomUsu');
	var campPass=document.getElementById('pass');

	if((campNom.value=='')||(campPass.value=='')){
		return
	}
	conexionAcc=crearXMLHttpRequest();
	conexionAcc.onreadystatechange = procesarAcc;
	conexionAcc.open('POST','../controladores/cor_Validar.php', true);
	conexionAcc.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	var envio="Operacion="+encodeURIComponent("acceso");
	envio+="&Nombre="+encodeURIComponent(campNom.value)+"&Pass="+encodeURIComponent(campPass.value);
	campPass.value='';
	conexionAcc.send(envio);
}
function procesarAcc(){
	if(conexionAcc.readyState == 4){
		var respuesta=JSON.parse(conexionAcc.responseText);
		console.log(respuesta);

		var ventana={};

		if(respuesta.success==1){
			ventana.bloqueo=true;
			ventana.cabecera='Accesando';
			ventana.cuerpo='Cargando...';
			ventana.pie='<section modalButtons>\
								<button type="button" cancelar id="modalButtonCancelar"></button>\
							</section>';
			
			//construyo la ventana modal
			var capaContenido = UI.crearVentanaModal(ventana,true);				
			capaContenido.nodo.style.height='430px';

			//obtengo los botones
			var btnCancelar = document.getElementById("modalButtonCancelar");

			//le agrego funcionamiento
			btnCancelar.onclick = function(){
				UI.elementos.modalWindow.eliminarUltimaCapa();
			}
			torque.buscarRegistros('empresa',function(response){
				//recivo la informacion
				var respuesta=response;
				var html='';
				for(var x=0;x<respuesta.registros.length;x++){
					html+='<button inicio valor="'+respuesta.registros[x].codigo+'" onclick="iniciarSession(this) "';
					html+='>'+respuesta.registros[x].nombre+'</button>'
				}
				
				var capaContenido = UI.elementos.modalWindow.buscarUltimaCapaContenido();
				capaContenido.partes.cabecera.nodo.textContent='Elija Una Empresa';
				capaContenido.partes.cuerpo.nodo.innerHTML=html;
			});
		}else{
			ventana.tipo='advertencia';
			ventana.cabecera='Error de Acceso';
			ventana.cuerpo=respuesta.mensaje;
			UI.crearVentanaModal(ventana);
		}
	}
}
function iniciarSession(nodo){

	var campNom=document.getElementById('nomUsu');
	conexionAcc=crearXMLHttpRequest();
	conexionAcc.onreadystatechange = function(){
		if (conexionAcc.readyState == 4 && conexionAcc.status == 200){
	        var capaContenido = UI.elementos.modalWindow.buscarUltimaCapaContenido();
	        var respuesta = JSON.parse(conexionAcc.responseText);
	        var html='';
	        if(respuesta.success==1){	
	        	location.href='vis_Empresa.html';
	        }else{
	        	console.log(respuesta.mensaje);
	        	html+="<atricle>"+respuesta.mensaje+"</article>";
	        	capaContenido.partes.cuerpo.nodo.innerHTML=html;
	        }
	    }
	};
	conexionAcc.open('POST','../controladores/cor_Validar.php', true);
	conexionAcc.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	var envio="Operacion="+encodeURIComponent("iniciarSession");
	envio+="&Nombre="+encodeURIComponent(campNom.value)+"&Empresa="+encodeURIComponent(nodo.getAttribute('valor'));
	conexionAcc.send(envio);	
	var capaContenido = UI.elementos.modalWindow.buscarUltimaCapaContenido();
	var info={
		mensaje:'Iniciar Sesion'
	}
	capaContenido.partes.cuerpo.nodo.innerHTML='';
	var cuadroDeCarga=UI.crearCuadroDeCarga(info,capaContenido.partes.cuerpo.nodo);
	cuadroDeCarga.style.marginTop='80px';

}