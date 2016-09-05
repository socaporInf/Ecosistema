var conexionAcc;
function accesar(){
	var campNom=document.getElementById('nomUsu');
	var campPass=document.getElementById('pass');

	if((campNom.value==='')||(campPass.value==='')){
		UI.agregarToasts({
			texto:'Debe llenar ambos campos antes de poder continuar',
			tipo: 'web-arriba-derecha-alto'
		});
		return;
	}
	conexionAcc=crearXMLHttpRequest();
	conexionAcc.onreadystatechange = procesarAcc;
	conexionAcc.open('POST','seguridad/controladores/cor_validar.php', true);
	conexionAcc.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	var envio="Operacion="+encodeURIComponent("acceso");
	envio+="&Nombre="+encodeURIComponent(campNom.value.toUpperCase())+"&Pass="+encodeURIComponent(campPass.value.toUpperCase());
	campPass.value='';
	conexionAcc.send(envio);
}
function procesarAcc(){
	if(conexionAcc.readyState == 4){
		var respuesta=JSON.parse(conexionAcc.responseText);

		var ventana={};

		if(respuesta.success==1){
			ventana.bloqueo=true;
			ventana.cabecera='Accesando';
			ventana.cuerpo='Cargando...';
			ventana.pie='<section modalButtons>'+
										'<button type="button" cancelar id="modalButtonCancelar"><i class="material-icons md-24 red500">clear</i></button>'+
									'</section>';

			//construyo la ventana modal
			var capaContenido = UI.crearVentanaModal(ventana,true);
			capaContenido.nodo.style.height='300px';

			//obtengo los botones
			var btnCancelar = document.getElementById("modalButtonCancelar");

			//le agrego funcionamiento
			btnCancelar.onclick = function(){
				UI.elementos.modalWindow.eliminarUltimaCapa();
			};

			buscarEmpresas(function(response){
				//recivo la informacion
				var respuesta=response;
				var html='';
				for(var x=0;x<respuesta.registros.length;x++){
					html+='<button inicio valor="'+respuesta.registros[x].codigo+'" onclick="iniciarSession(this) "';
					html+='>'+respuesta.registros[x].nombre+'</button>';
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
buscarEmpresas = function(callback){
	var campNom=document.getElementById('nomUsu');
	var conexionBuscar=crearXMLHttpRequest();
	conexionBuscar.onreadystatechange = function(){
		if (conexionBuscar.readyState == 4){
			var respuesta = JSON.parse(conexionBuscar.responseText);
			if(respuesta.success){
				callback(respuesta);
			}else{
				console.log(respuesta.mensaje);
				UI.elementos.modalWindow.buscarUltimaCapaContenido().convertirEnMensaje(respuesta.mensaje);
			}
		}
	};
	conexionBuscar.open('POST','seguridad/controladores/cor_validar.php', true);
	conexionBuscar.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	var envio="Operacion="+encodeURIComponent("buscarEmpresasDisponibles")+'&Nombre='+encodeURIComponent(campNom.value.toUpperCase());
	conexionBuscar.send(envio);
};
function iniciarSession(nodo){

	var campNom=document.getElementById('nomUsu');
	conexionAcc=crearXMLHttpRequest();
	conexionAcc.onreadystatechange = function(){
		if (conexionAcc.readyState == 4 && conexionAcc.status == 200){
	        var capaContenido = UI.elementos.modalWindow.buscarUltimaCapaContenido();
	        var respuesta = JSON.parse(conexionAcc.responseText);
	        var html='';
	        if(respuesta.success==1){
	        	location.href='global/vistas/vis_Landing.html';
	        }else{
	        	html+="<atricle>"+respuesta.mensaje+"</article>";
	        	capaContenido.partes.cuerpo.nodo.innerHTML=html;
	        }
	    }
	};
	conexionAcc.open('POST','seguridad/controladores/cor_validar.php', true);
	conexionAcc.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
	var envio="Operacion="+encodeURIComponent("iniciarSession");
	envio+="&Nombre="+encodeURIComponent(campNom.value.toUpperCase())+"&Empresa="+encodeURIComponent(nodo.getAttribute('valor'));
	conexionAcc.send(envio);
	var capaContenido = UI.elementos.modalWindow.buscarUltimaCapaContenido();
	var info={
		nombre: 'iniciarSession',
		mensaje:'Iniciar Sesion'
	};
	capaContenido.partes.cuerpo.nodo.innerHTML='';
	var cuadroDeCarga=UI.crearCuadroDeCarga(info,capaContenido.partes.cuerpo.nodo);
	cuadroDeCarga.style.marginTop='80px';
}
