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
				var respuesta=JSON.parse(conexionAcc.responseText);
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
	        console.log(respuesta);
	        capaContenido.partes.cuerpo.nodo.firstChild.style.opacity='0';
	        if(respuesta.success==1){	
	        	html+='<article texto>'+respuesta.mensaje+'</article>'
	        }
	        setTimeout(function(){
	        	capaContenido.partes.cuerpo.nodo.innerHTML=html;
	        },300);
	    }
	};
	conexionAcc.open('POST','../controladores/cor_Validar.php', true);
	conexionAcc.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	var envio="Operacion="+encodeURIComponent("iniciarSession");
	envio+="&Nombre="+encodeURIComponent(campNom.value)+"&Empresa="+encodeURIComponent(nodo.getAttribute('valor'));
	
	var capaContenido = UI.elementos.modalWindow.buscarUltimaCapaContenido();
	
	capaContenido.partes.cuerpo.nodo.innerHTML='<div class="showbox">\
			  <div class="loader">\
			    <svg class="circular" viewBox="25 25 50 50">\
			      <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/>\
			    </svg>\
			  </div>\
			</div>';
	conexionAcc.send(envio);

	

}