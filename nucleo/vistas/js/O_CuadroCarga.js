/*----------------------------------------------------------------------------------------------------*/
/*--------------------------------------------Objeto Cuadro de Carga ---------------------------------*/
/*----------------------------------------------------------------------------------------------------*/
var CuadroCarga = function(info,callback){

	//manejo de interfaz
	this.contenedor=info.contenedor;
	this.tipo=info.tipo || 'carga';
	this.clases=info.clases || [];
	this.nodo = null;
	this.nombre = info.nombre || 'unico';

	//maenjo de carga
	this.intervalID = null;
	this.contEspera = 0;
	this.callback = callback || null;

	this.estado = 'sinIniciar';

	this.construirNodo = function(){

		var cuadro = document.createElement('div');
		cuadro.classList.toggle('ContenedorCarga');

		cuadro.innerHTML='<article style="color:#7b7b7b;text-align:center;width:inherit">'+info.mensaje+'</article>'+
		'<div class="showbox">'+
			'<div class="loader">'+
				'<svg class="circular" viewBox="25 25 50 50">'+
					'<circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/>'+
			    '</svg>'+
			  '</div>'+
			'</div>';
		this.contenedor.appendChild(cuadro);
		var circulo=document.querySelector('.path');

		//asigno color al circulo de carga
		if(this.tipo.toLowerCase()=='advertencia'){
			circulo.classList.toggle('pathAdvertencia');
		}else if(this.tipo.toLowerCase()=='carga'){
			circulo.classList.toggle('pathCarga');
		}
		this.estado = 'iniciado';
		this.nodo = cuadro;
		UI.manejoDeClases(this);
		this.tamanoTexto(info.mensaje);
	};
	this.tamanoTexto = function(texto){
			var tamano = texto.length;
			if(tamano < 40){
				this.nodo.style.width = (tamano * 12) +'px';
			}else{
					this.nodo.style.width = ((tamano/2) * 10) +'px';
			}
	};
	//esta funcion crea un intervalo de carga que permite manejar dicha carga colocandole un tiempo de espera 5 segundos
	this.manejarCarga = function(nombre){
		UI.buscarCuadroCarga(nombre).contEspera=0;
		this.intervalID=setInterval(function(){
			var callback = UI.buscarCuadroCarga(nombre).callback;
			UI.buscarCuadroCarga(nombre).contEspera++;
			if(callback!==null){
				callback();
			}
			if(!UI.buscarCuadroCarga(nombre)){

				if(UI.buscarCuadroCarga(nombre).contEspera>=500){
					//cuando el tiempo de espera es exedido muestro el mensaje
					console.log('tiempo de espera exedido');
					clearInterval(UI.buscarCuadroCarga(nombre).intervalID);
					var ventana = {
						tipo:'error',
						bloqueo:true,
						cabecera:'Error de Conexion',
						cuerpo:'Tiempo de espera Culminado por Favor Refresque la Pagina'
					};
					UI.crearVentanaModal(ventana);
					//funcionamiento de recarga
					var capaContenido=UI.elementos.modalWindow.buscarUltimaCapaContenido();
					capaContenido.partes.cuerpo.nodo.onclick=function(){
						location.reload();
					};
				}
			}
		},50);
	};
	//funcion en la cual se le pasa parametros al callback al culminar la carga
	// y muestra un mensaje al culminar la carga
	this.culminarCarga = function(respuesta,callback){
		callback = callback || null;
		this.estado = 'cargaCulminada';
		var titulo = this.nodo.firstChild;
		var circulo = this.nodo.getElementsByTagName('circle')[0];
		circulo.parentNode.removeChild(circulo);
		titulo.textContent = respuesta.mensaje.titulo;
		UI.removerCuadroCarga(this.nombre);
		if(callback!==null){
			callback(respuesta);
		}
	};
	//esta funcion mata el intervalo al ejecultarce el callback de dicha carga
	this.terminarCarga = function(){
		var cuadro = this;
		clearInterval(this.intervalID);
		this.estado = 'cargaCulminada';
		cuadro.nodo.parentNode.removeChild(cuadro.nodo);
		UI.removerCuadroCarga(cuadro.nombre);
	};
	this.construirNodo();
};
