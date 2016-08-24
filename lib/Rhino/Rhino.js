var Arquitecto = function(){

	this.elementos = [];

	this.estado = 'sinInicializar';

	this.configure = function(objetoInicializar){
		var contenedorGeneral = document.querySelector('div[contenedor]');
		objetoInicializar = objetoInicializar || {};
		this.elementos = {
			 menu : new Menu(),
			 cabecera : new Cabecera(),
			 URL: new URL(),
			 maestro : 'noPosee',
			 botonera : 'noPosee',
			 constructores: this.elementos.constructores
		};
		if(objetoInicializar.maestro){
			objetoInicializar.maestro.contenedor = contenedorGeneral;
			this.elementos.maestro = new Maestro(objetoInicializar.maestro);
		}

		if(objetoInicializar.botonera){
			objetoInicializar.botonera.contenedor = contenedorGeneral;
			this.elementos.botonera = new Botonera(objetoInicializar.botonera);
		}

		this.estado='inicializado';
	};
	this.clonarObjeto = function(objeto){
		return JSON.parse(JSON.stringify(objeto));
	};
	this.juntarObjetos = function merge_options(obj1,obj2){
    var obj3 = {};
    for (var attrname1 in obj1) { obj3[attrname1] = obj1[attrname1]; }
    for (var attrname2 in obj2) { obj3[attrname2] = obj2[attrname2]; }
    return obj3;
	};
//------------------------- Manejo de ventanas Modales ----------------------------
	this.crearVentanaModal = function(data){
		//creo la venta modal
		if(!this.elementos.modalWindow){
			this.elementos.modalWindow = new modalWindow();
		}
		var capaContenido=this.elementos.modalWindow.arranque(data);
		return capaContenido;
	};

	this.crearMensaje = function(mensaje){
		var capa = this.crearVentanaModal({cuerpo: 'mesaje'});
		capa.convertirEnMensaje(mensaje);
	};
//------------------------- Manejo Cuadros de carga -------------------------------
	this.agregarCuadroCarga = function(cuadroCarga){
		if(!this.elementos.cuadroCarga){
			this.elementos.cuadroCarga = [];
		}
		this.elementos.cuadroCarga.push(cuadroCarga);
	};
	this.removerCuadroCarga = function(nombre){
		var cuadroCarga = this.buscarCuadroCarga(nombre);
		this.elementos.cuadroCarga.splice(this.elementos.cuadroCarga.indexOf(cuadroCarga),1);
	};
	this.buscarCuadroCarga = function(nombre){
		if(this.elementos.cuadroCarga){
			for (var i = 0; i < this.elementos.cuadroCarga.length; i++){
				if(this.elementos.cuadroCarga[i].nombre === nombre){
					return this.elementos.cuadroCarga[i];
				}
			}
			console.log('cuadroCarga '+nombre+' no existe');
			return false;
		}
	};
 	//funcion se utiliza cuando no se necesita pasar parametros al callback al culminar la carga
	this.iniciarCarga = function(info,callback){
		cuadroCarga = new CuadroCarga(info,callback);
		this.agregarCuadroCarga(cuadroCarga);
		cuadroCarga.manejarCarga(info.nombre);
		return cuadroCarga.nodo;
	};
	//funcion se utiliza cuando se necesita pasar parametros al callback al culminar la carga
	this.crearCuadroDeCarga = function(info,contenedor){
		info.contenedor = contenedor;
		cuadroCarga = new CuadroCarga(info,null);
		this.agregarCuadroCarga(cuadroCarga);
		return cuadroCarga.nodo;
	};
//------------------------- Manejo de ventanas ------------------------------------
	this.agregarVentana = function(ventana,contenedor){
		if(!this.elementos.ventanas){
			this.elementos.ventanas = [];
		}
		var newVentana = new Ventana(ventana);
		this.elementos.ventanas.push(newVentana);
		contenedor.appendChild(newVentana.nodo);
		return newVentana;
	};

	this.agregarLista = function(lista,contenedor){
		if(!this.elementos.ventanas){
			this.elementos.ventanas = [];
		}
		var nuevaLista = new Lista(lista);
		contenedor.appendChild(nuevaLista.nodo);
		this.elementos.ventanas.push(nuevaLista);
		return nuevaLista;
	};

	this.buscarVentana = function(nombre){
		var ventanas =this.elementos.ventanas;
		for(var x = 0; x < ventanas.length; x++){
			if(ventanas[x].atributos.nombre===nombre){
				return ventanas[x];
			}
		}
		return false;
	};

	this.quitarVentana = function(nombre){
		var ventana = this.buscarVentana(nombre);
		if(ventana){
			ventana.destruirNodo();
			this.elementos.ventanas.splice(this.elementos.ventanas.indexOf(ventana),1);
		}
	};
	//------------------------- Manejo de toast ----------------------------
	//agrega mensaje pequeño
	this.agregarToasts = function(atributos){
		if(!this.elementos.toasts){
			this.elementos.toasts = [
				{cont:1}
			];
		}else{
			this.elementos.toasts[0].cont++;
		}
		var tiempo= 5000 * (this.elementos.toasts[0].cont - 1);
		setTimeout(function(){
			var toast = new Toasts(atributos);
			UI.elementos.toasts.push(toast);
			setTimeout(function(){
				removerToasts(toast);
			},5000);
		},tiempo);
	};
	function removerToasts(toast){
		UI.elementos.toasts.splice(UI.elementos.toasts.indexOf(toast),1);
		UI.elementos.toasts[0].cont--;
	}
	//------------------------- Manejo de Constructores ----------------------------
	//agrega constructores para formularios
	this.agregarConstructor  = function(objetoConstructor){
		if(!this.elementos.constructores){
			this.elementos.constructores = [];
		}
		this.elementos.constructores.push(objetoConstructor);
	};
	this.buscarConstructor = function(nombre){
		if(this.elementos.constructores){
			for (var i = 0; i < this.elementos.constructores.length; i++) {
				if(this.elementos.constructores[i].nombre == nombre){
					return this.elementos.constructores[i];
				}
			}
			console.log('no se encontro el constructor '+nombre);
		}else{
			console.log('no existe ningun constructor en la lista');
		}
	};
	//------------------------- Manejo Iconos ----------------------------
	this.crearIcono = function(atributos){
		var icono = document.createElement('i');
		icono.classList.add('material-icons');
		icono.textContent = atributos.nombre;
		if(atributos.tamano){
			switch(atributos.tamano){
				case 24:
					icono.classList.add('md-24');
					break;

				case 36:
					icono.classList.add('md-36');
					break;

				case 48:
					icono.classList.add('md-48');
					break;
			}
		}
		if(atributos.color){
			icono.classList.add(atributos.color);
		}
		if(atributos.tono){
			if(atributos.tono.toLowerCase()==='claro'){
				icono.classList.add('md-light');
			}else if(atributos.tono.toLowerCase()==='oscuro'){
				icono.classList.add('md-dark');
			}
		}
		if(atributos.inactivo){
			icono.classList.add('md-inactive');
		}
		return icono;
	};
	this.manejoDeClases = function(contenedor){
		this.eliminarClasesRepetidas(contenedor);
		for (var i = 0; i < contenedor.clases.length; i++) {
			contenedor.nodo.classList.add(contenedor.clases[i]);
		}
	};
	this.eliminarClasesRepetidas = function(contenedor){
		var clasesValidadas = [];
		var existe;
		for (var i = 0; i < contenedor.clases.length; i++) {
			existe = false;
			for (var x = 0; x < clasesValidadas.length; x++) {
				if(clasesValidadas[x]==contenedor.clases[i]){
					existe = true;
				}
			}
			if(!existe){
				clasesValidadas.push(contenedor.clases[i]);
			}
		}
		contenedor.clases = clasesValidadas;
	};
};

//-------------------- Toasts ------------------------------------------------------------
var Toasts = function(atributos){
	this.atributos = atributos;
	this.nodo = null;
	this.atributos.efecto = atributos.efecto || 'mostrar';
	this.atributos.tipo = atributos.tipo || 'mobile';
	this.construirNodo = function(){
		var nodo = document.createElement('div');
		nodo.setAttribute('toasts-'+this.atributos.tipo,'');
		nodo.textContent = this.atributos.texto;
		var contenedor = this.atributos.contenedor || document.body;
		contenedor.appendChild(nodo);

		var toasts = this;
		setTimeout(function aparecerToasts(){
			toasts.nodo.classList.toggle(toasts.atributos.efecto);
		},10);

		setTimeout(function desaparecerToasts(){
			toasts.nodo.classList.toggle(toasts.atributos.efecto);
			setTimeout(function eliminarToast(){
				toasts.nodo.parentNode.removeChild(toasts.nodo);
			},500);
		},5000);
		this.nodo = nodo;
	};
	this.construirNodo();
};
//---------------------------Ink Event------------------------
agregarRippleEvent= function(parent,evento){
	var html;
	var ink;
	//se crea el elemento si no existe
	if(parent.getElementsByTagName('div')[0]===undefined){
		ink=document.createElement('div');
		ink.classList.toggle('ink');
		parent.insertBefore(ink,parent.firstChild);
	}
	ink=parent.getElementsByTagName('div')[0];

	//en caso de doble click rapido remuevo la clase
	ink.classList.remove('animated');

	//guardo todo el estilo del elemento
	var style = window.getComputedStyle(ink);

	//se guardan los valores de akto y ancho
	if(parseInt(style.height.substring(0,style.height.length-2))===0 && parseInt(style.width.substring(0,style.width.length-2))===0){
		//se usa el alto y el ancho del padre, del de mayor tamaño para q el efecto ocupe todo el elemento
		d = Math.max(parent.offsetHeight, parent.offsetWidth);
		ink.style.height=d+'px';
		ink.style.width=d+'px';
	}
	//declaro el offset del parent
	var rect =parent.getBoundingClientRect();

	parent.offset={
	  top: rect.top + document.body.scrollTop,
	  left: rect.left + document.body.scrollLeft
	};
	//re evaluo los valores de alto y ancho del ink
	style = window.getComputedStyle(ink);

	//ubico el lugar donde se dispara el click
	var x=evento.pageX - parent.offset.left - parseInt(style.width.substring(0,style.width.length-2))/2;
	var y=evento.pageY - parent.offset.top - parseInt(style.height.substring(0,style.height.length-2))/2;
	//cambio los valores de ink para iniciar la animacion
	ink.style.top=y+'px';
	ink.style.left=x+'px';
	setTimeout(function(){
		ink.classList.toggle('animate');
	},10);
	setTimeout(function(){
		ink.classList.toggle('animate');
	},660);
};
//---------------------------Ink Event------------------------
var URL = function(){
	this.estado = 'construido';
	this.captarParametroPorNombre = function(nombre) {
    nombre = nombre.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + nombre + "=([^&#]*)"),
    results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	};
};
/*----------------------------------------------------------------------------------------------------*/
/*------------------------------------------------Objeto Cabecera ------------------------------------*/
/*----------------------------------------------------------------------------------------------------*/
var Cabecera = function(){

	this.estado = 'porConstriur';

	this.construir = function(){
		var contenedor = obtenerContenedor();
		var elemento = document.createElement('div');
		elemento.setAttribute('cabecera','');
		elemento.innerHTML = "<button type='button' menuBtn id='menuBtn'><i class='material-icons md-36 white'>menu</i></button><div titulo>SOCA-PORTUGUESA</div>";
		contenedor.insertBefore(elemento,contenedor.firstChild);
		//funcionamiento boton
		var botonMenu=document.getElementById('menuBtn');
		botonMenu.onclick=function(){
			var menu = document.getElementById('menu');
			if(menu.getAttribute('estado')=='visible'){
				menu.setAttribute('estado','oculto');
			}else if(menu.getAttribute('estado')=='oculto'){
				menu.setAttribute('estado','visible');
			}
		};
		this.estado='enUso';
	};
	this.construir();
};
/*----------------------------------------------------------------------------------------------------*/
/*------------------------------------------------Objeto Menu ----------------------------------------*/
/*----------------------------------------------------------------------------------------------------*/
var Menu = function(){
	/*-------------------------Objeto SubCapa ---------------------------------*/
	var SubCapa = function(yo,padre){
		/*-------------------------Objeto elemento ----------------------------*/
		var Elemento = function(data){
			this.codigo = data.codigo;
			this.estado = 'porConstriur';
			this.contenido = data.nombre;
			this.nodo = null;
			this.enlace = data.enlace || '#';

			this.construirNodo = function(){
				var nodo = document.createElement('section');
				nodo.innerHTML = this.contenido;
				var finalEnlace =this.enlace.split('/')[this.enlace.split('/').length-1];
				var seleccionado = location.href.substring((location.href.length - finalEnlace.length),location.href.length);
				if(seleccionado == finalEnlace){
					this.estado = 'seleccionado';
				}
				nodo.setAttribute('enlace',this.enlace);
				if(this.enlace.substring(0,1)=='>'){
					nodo.onclick=function(e){
						UI.elementos.menu.avanzar(this);
					};
				}else{
					nodo.onclick=function(e){
						location.href=this.getAttribute('enlace');
					};
				}
				this.nodo = nodo;
			};
			this.construirNodo();
		};

		/*---------------------Fin Objeto elemento ----------------------------*/
		this.estado='porConstruir';
		this.nodo = null;
		this.elementos=[];
		this.codigo = yo.codigo;

		//funcionamiento arbol
		this.padre = padre;
		this.yo = yo;
		this.hijos = [];

		this.construir= function(){
			var nodo = document.createElement('div');
			nodo.setAttribute('subCapaMenu',this.yo.codigo);
			this.nodo=nodo;

			//estilos
			this.nodo.classList.add('siguiente');

			//creacion de hijos
			var hijos=this.yo.hijos;
			UI.elementos.menu.nodo.appendChild(this.nodo);

			//se arma la primera capa
			var capaNueva;
			for(var x=0;x<hijos.length;x++){
				//verifico el url del nodo u hoja
				hijos[x].URL = hijos[x].URL || '>'+hijos[x].codigo;
				//agrego los elementos
				var data={
					codigo:hijos[x].codigo,
					nombre:hijos[x].titulo,
					enlace:hijos[x].URL
				};

				var elementoNuevo = this.agregarElemento(data);
				if(elementoNuevo.estado==='seleccionado'){
					UI.elementos.menu.seleccionado = this;
					elementoNuevo.nodo.setAttribute('seleccionado','');
				}
				//creo las capas de aquellas que su URL sea continuar
				if(hijos[x].URL.substring(0,1)==='>'){
					capaNueva = new SubCapa(hijos[x],this);
					//agrego las capas al padre
					this.hijos.push(capaNueva);
				}
			}

		};
		this.agregarElemento = function(contenido,enlace){
			var elementoNuevo = new Elemento(contenido,enlace);
			this.nodo.appendChild(elementoNuevo.nodo);
			this.elementos.push(elementoNuevo);
			return elementoNuevo;
		};
		this.buscarElemento=function(codigo){
			for(var x=0;x<this.elementos.length;x++){
				if(this.elementos[x].enlace.substring(1,this.elementos[x].enlace.length)==codigo){
					return this.elementos[x];
				}
			}
			return false;
		};
		this.construir();

	};
	/*---------------------Fin Objeto SubCapa ---------------------------------*/
	this.estado = 'porConstriur';
	this.capaActiva = null;
	this.partes = [];
	this.nodo = null;
	this.seleccionado = false;

	this.intervaloCarga=null;

	this.construir = function(){
		var contenedor = obtenerContenedor();
		var nodo = document.createElement('div');
		nodo.setAttribute('capaMenu','');
		nodo.setAttribute('estado','oculto');
		nodo.id = 'menu';
		contenedor.insertBefore(nodo,contenedor.firstChild);
		this.nodo = nodo;
		this.estado='enUso';

		//creo la titulo
		var titulo=document.createElement('section');
		titulo.textContent='Menu';
		titulo.setAttribute('titulo','');
		this.partes.titulo = titulo;
		this.nodo.appendChild(titulo);

		//creo el pie
		var pie = document.createElement('section');
		var html ='';
		pie.setAttribute('pie','');
		this.partes.pie = pie;
		this.nodo.appendChild(pie);

		//si la sesion no esta creada dejo el centro vacio
		if(typeof(sesion)!=='undefined'){
			//creo el intervalo y guarda el id
			this.intervaloCarga = setInterval(function(){
				if(sesion.arbol!==null){
					//cierro el intervalo
					clearInterval(UI.elementos.menu.intervaloCarga);
					this.intervaloCarga=null;
					//agrego capas
					var capaNueva;

					capaNueva = new SubCapa(sesion.arbol,null);
					UI.elementos.menu.activarCapa(capaNueva);
					if(UI.elementos.menu.seleccionado){
						UI.elementos.menu.activarSeleccionado(capaNueva);
					}
				}
			},30);
			html+='<article off onclick="sesion.cerrarSesion()"><i></i></article>';

		}
		html+='<article contact><i></i></article>';
		html+='<article seguridad  onclick="location.href=\'vis_Cuenta.html\'"><i></i></article>';
		html+='<article books><i></i></article>';
		pie.innerHTML=html;
	};
	this.getEstado = function(){
		return this.estado;
	};
	this.abrirMenu = function(){
		var btnMenu = document.getElementById('menuBtn');
		btnMenu.click();
	};
	this.activarCapa = function(capa){
		if(this.capaActiva===undefined){
			capa.nodo.classList.remove('siguiente');
		}
		this.capaActiva = capa;
		this.capaActiva.nodo.classList.add('capaActiva');

		//reviso si tiene las clases siguiente o anterior y se las remuevo
		if(this.capaActiva.nodo.classList.contains('siguiente')){
			this.capaActiva.nodo.classList.remove('siguiente');
		}
		if(this.capaActiva.nodo.classList.contains('anterior')){
			this.capaActiva.nodo.classList.remove('anterior');
		}

	};
	this.avanzar = function(nodo){
		var codigo = nodo.getAttribute('enlace').substring(1,nodo.getAttribute('enlace').length);
		var lista = this.capaActiva.hijos;
		this.capaActiva.nodo.classList.remove('capaActiva');
		this.capaActiva.nodo.classList.add('anterior');
		for(var x = 0; x < lista.length; x++){
			if(lista[x].codigo==codigo){
				this.activarCapa(lista[x]);
				this.cambiarTitulo(lista[x].yo.titulo);
			}
		}
	};
	this.regresar = function(){
		this.capaActiva.nodo.classList.remove('capaActiva');
		this.capaActiva.nodo.classList.add('siguiente');
		this.activarCapa(this.capaActiva.padre);
		var titulo = (this.capaActiva.padre!==null)?this.capaActiva.yo.titulo:'Menu';
		this.cambiarTitulo(titulo);
	};
	this.activarSeleccionado = function(capa){
		var ruta =  [];
		do{
			ruta = ruta.concat(this.buscarRuta(capa));
		}while(this.seleccionado!=capa);
		ruta = ruta.reverse();
		for(var x = 0; x < ruta.length; x++){
			ruta[x].nodo.click();
		}
	};
	this.buscarRuta = function(capa) {
		seleccionado = this.seleccionado;
		var ruta = [];
		if(capa.codigo!==0){
			var elemento =  capa.buscarElemento(seleccionado.codigo);
			if(elemento){
				this.seleccionado = capa;
				ruta.push(elemento);
				return ruta;
			}
			for(var x = 0;x < capa.hijos.length; x++){
				var semiRuta = this.buscarRuta(capa.hijos[x]);
				if(semiRuta){
					ruta = ruta.concat(semiRuta);
					return ruta;
				}
			}
		}
		return false;
	};
	this.cambiarTitulo = function(texto){
		var titulo = this.partes.titulo;
		titulo.classList.remove('retroceso');
		titulo.onclick = function(){};
		if(texto!=='Menu'){
			titulo.classList.add('retroceso');
			titulo.onclick = function(){
				UI.elementos.menu.regresar();
			};
		}
		titulo.textContent = texto;
	};
	this.construir();
};
/*----------------------------------------------------------------------------------------------------*/
/*------------------------------------------------Objeto Botonera ------------------------------------*/
/*----------------------------------------------------------------------------------------------------*/
var Botonera = function(atributos){

	var Boton = function(atributos){
		this.atributos = atributos;
		this.tipo = atributos.tipo.toLowerCase();
		this.nodo =  null;
		this.estado = 'porConstruir';

		this.construirNodo = function(){
			var nodo = document.createElement('button');
			nodo.setAttribute('type','button');
			switch(this.atributos.tipo){
				case 'abrir':
					nodo.setAttribute('btnAbrir','');
					nodo.setAttribute('estado','oculto');
				break;
				case 'nuevo':
					nodo.setAttribute('btnNuevo','');
				break;
				case 'buscar':
					nodo.setAttribute('btnBuscar','');
				break;
				case 'modificar':
					nodo.setAttribute('btnModificar','');
				break;
				case 'eliminar':
					nodo.setAttribute('btnEliminar','');
				break;
				case 'detalle':
					nodo.setAttribute('btnDetalle','');
				break;
				case 'redactar':
					nodo.setAttribute('btnRedactar','');
				break;
				case 'cancelar':
					nodo.setAttribute('btnCancelar','');
				break;
				case 'guardar':
					nodo.setAttribute('btnGuardar','');
				break;
			}
			this.nodo = nodo;
			this.estado = 'enUso';
			var yo = this;
			if(this.atributos.click){
				this.nodo.onclick = function(){
					yo.atributos.click(yo);
				};
			}

		};
		this.construirNodo();
	};
	//-------------------------------------------- fin objeto boton ----------------------
	this.estructura = atributos.botones;
	this.estado = 'porConstruir';
	this.nodo = null;

	this.botones = [];

	this.construir = function(){
		var contenedor = atributos.contenedor;
		var nodo = document.createElement('div');
		nodo.setAttribute('botonera','');
		contenedor.parentNode.insertBefore(nodo,contenedor.nextSibling);
		this.nodo = nodo;
		this.inicializarBotones();
		//boton nuevo
		if(UI.elementos.maestro!=='noPosee'){
			this.buscarBoton('nuevo').nodo.onclick=function(){
				console.log('presiono Nuevo');
				var data = {
					tipo:'nuevo'
				};
				var maestro = UI.elementos.maestro;
				maestro.agregarFormulario(data);
			};
			//boton buscar
			this.buscarBoton('buscar').nodo.onclick=function(){
				UI.elementos.maestro.ventanaList.abrirCampoBusqueda();
			};
		}
	};
	this.inicializarBotones = function(){
		var botones = this.estructura;
		for(var x = 0; x < botones.length; x++){
			this.agregarBoton(botones[x]);
		}
		this.agregarEfectos();
	};
	this.agregarBoton = function(constructorBoton){
		var botonera = this.nodo;
		var existe = false;
		if(typeof constructorBoton == 'string'){
			constructorBoton = {tipo:constructorBoton};
		}
		for(var x=0;x<this.botones.length;x++){
			if(this.botones[x].tipo==constructorBoton.tipo.toLowerCase()){
				existe=true;
				console.log('el boton '+constructorBoton.tipo+' ya existe');
			}
		}
		if(!existe){

			boton = new Boton(constructorBoton);
			botonera.appendChild(boton.nodo);
			//esta parte es solo para cuando se agrega un boton en un momento posterior a la inicializacion
			if(this.buscarBoton('abrir')!=-1){
				if(this.buscarBoton('abrir').nodo.getAttribute('estado')=='visible'){
					setTimeout(function(){
						var top=(UI.elementos.botonera.botones.length-1)*45;
						boton.nodo.style.top='-'+top+'px';
					},10);
				}
			}
			this.botones.push(boton);
		}
		return boton;
	};
	this.agregarBotones = function(botones){
		var tiempo = 20;
		for(var x = 0; x < botones.length; x++){
			espera(x,tiempo,botones,'agregar');
			tiempo+=20;
		}
	};
	function espera(x,tiempo,botones,operacion){
		setTimeout(function(){
			if(operacion === 'quitar'){
				UI.elementos.botonera.quitarBoton(botones[x]);
			}else{
				UI.elementos.botonera.agregarBoton(botones[x]);
			}
		},tiempo);
	}
	this.quitarBotones = function(botones){
		var tiempo = 20;
		for(var x = 0; x < botones.length; x++){
			espera(x,tiempo,botones,'quitar');
			tiempo+=20;
		}
	};
	this.gestionarBotones = function(botones){
		var tiempo = 20;
		for(var x = 0; x < botones.quitar.length; x++){
			espera(x,tiempo,botones.quitar,'quitar');
			tiempo+=20;
		}
		for(var i = 0; i < botones.agregar.length; i++){
			espera(i,tiempo,botones.agregar,'agregar');
			tiempo+=20;
		}
	};
	this.agregarEfectos = function(){
		var botones = this.botones;
		if(botones.length>1){
			if(!this.buscarBoton('abrir')){
				console.log('no se encuentra el boton de apertura');
			}else{
				this.buscarBoton('abrir').nodo.onclick = function(){
					if(this.getAttribute('estado')=='oculto'){
						var top = 0;
						this.classList.toggle('apertura');
						this.setAttribute('estado','visible');
						for(var x = 0; x < botones.length; x++){
							if(botones[x].tipo!='abrir'){
								top+=45;
								botones[x].nodo.style.top = '-'+top+'px';
							}
						}
					}else{
						this.classList.toggle('apertura');
						this.setAttribute('estado','oculto');
						for(var i = 0; i < botones.length; i++){
							if(botones[i].tipo!='abrir'){
								botones[i].nodo.style.top = 0+'px';
							}
						}
					}
				};
			}
		}
	};
	this.buscarBoton = function(tipo){
		var botones = this.botones;
		for(var x = 0; x < botones.length; x++){
			if(botones[x].tipo==tipo){
				return botones[x];
			}
		}
		return -1;
	};
	this.listarBotones = function(){
		var lista = this.botones;
		var resultado = 'estos son los botones agregados:\n';
		for( var x = 0; x < lista.length; x++){
			resultado += '\t'+lista[x].tipo+'\n';
		}
		console.log(resultado);
	};
	this.getEstado = function(){
		console.log(this.estado);
	};
	this.quitarBoton = function(constructorBoton){
		if(typeof constructorBoton == 'string'){
			constructorBoton = {tipo:constructorBoton};
		}
		var eliminar=this.buscarBoton(constructorBoton.tipo);
		if(eliminar!=-1){
			eliminar.nodo.style.top='0px';
			setTimeout(function(){
				eliminar.nodo.parentNode.removeChild(eliminar.nodo);
			},510);
			this.botones.splice(this.botones.indexOf(eliminar),1);
		}
	};
	this.construir();
};
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
/*----------------------------------------------------------------------------------------------------*/
/*--------------------------------------------Objeto Ventana -----------------------------------------*/
/*----------------------------------------------------------------------------------------------------*/
var Ventana = function(atributos){
	//-----------------Titulo---------------------------
	var Titulo = function(atributos){

		this.nodo = null;
		this.atributos = atributos;
		//valores por defecto
		atributos.tipo = atributos.tipo || 'basico';

		this.construirNodo = function(){

			var nodo = document.createElement('section');
			nodo.setAttribute('titulo','');

			nodo.innerHTML = atributos.texto || atributos.html;
			nodo.classList.add(atributos.tipo);

			this.nodo = nodo;
		};
		this.construirNodo();
	};
	//--------------------Sector----------------------------
	var Sector = function(atributos){
		this.nodo = null;
		this.atributos = atributos;
		this.atributos.tipo = atributos.tipo || 'sector';
		this.campos = [];
		this.clases = atributos.clases || [];

		this.construirNodo = function(){

			var nodo = document.createElement('section');
			nodo.setAttribute(this.atributos.tipo,'');

			if(atributos.html){
				nodo.innerHTML = atributos.html;
			}

			this.nodo = nodo;
			if(atributos.formulario){
				this.agregarFormulario({
					plano: atributos.formulario,
					tipo:atributos.tipo,
					registroAct: atributos.registro
				});
				atributos.alto = atributos.formulario.altura;
			}

			if(atributos.alto){
				nodo.style.height=atributos.alto+'px';
			}

			if(atributos.tipo){
				this.nodo.setAttribute(atributos.tipo,'');
			}
			if(this.atributos.clases){
				UI.manejoDeClases(this);
			}
		};
		this.agregarFormulario = function(objForm){
			objForm.contenedor = this.nodo;
			this.formulario = new Formulario(objForm);
		};
		this.desvanecerNodo = function(){
			this.nodo.classList.add('desaparecer');
			var s = this;
			setTimeout(function () {
				s.nodo.parentNode.removeChild(s.nodo);
			}, 710);
		};
		this.destruirNodo = function(){
			this.nodo.parentNode.removeChild(this.nodo);
		};
		this.construirNodo();
	};
	//--------------------fin Objeto Sector--------------------
	this.atributos = atributos;
	this.estado = 'porConstruir';
	this.sectores = [];
	this.nodo = null;
	this.clases = atributos.clases || [];

	this.construirNodo = function(){
		var nodo = document.createElement('div');
		nodo.setAttribute('mat-window','');
		nodo.classList.add(this.atributos.tipo);
		this.nodo = nodo;

		if(atributos.titulo){
			this.agregarTitulo(this.atributos.titulo);
		}

		if(atributos.sectores){
			for(var x = 0; x < atributos.sectores.length; x++){
				this.agregarSector(atributos.sectores[x]);
			}
		}

		if(atributos.alto){
			this.nodo.style.height = atributos.alto+'px';
		}
		if(this.atributos.clases){
			UI.manejoDeClases(this);
		}
	};
	this.agregarSector = function(atributos){
		var sector = new Sector(atributos);
		this.sectores.push(sector);
		this.nodo.appendChild(sector.nodo);
		return sector;
	};
	this.buscarSector = function(nombre){
		for(var x = 0; x < this.sectores.length; x++){
			if(this.sectores[x].atributos.nombre){
				if(this.sectores[x].atributos.nombre===nombre){
					return this.sectores[x];
				}
			}
		}
		return false;
	};

	this.quitarSector = function(nombre){
		var sector = this.buscarSector(nombre);
		sector.destruirNodo();
		this.sectores.splice(this.sectores.indexOf(sector),1);
	};
	this.desvanecerSector = function(nombre) {
		var sector = this.buscarSector(nombre);
		sector.desvanecerNodo();
		this.sectores.splice(this.sectores.indexOf(sector),1);
	};

	this.agregarTitulo = function(atributos){
		var titulo = new Titulo(atributos);
		this.nodo.insertBefore(titulo.nodo,this.nodo.firstChild);
		this.titulo = titulo;
	};

	this.destruirNodo = function(){
		this.nodo.style.height='0px';
		var v = this;
		setTimeout(function(){
			v.nodo.parentNode.removeChild(v.nodo);
		},510);
	};
	this.construirNodo();
};
/*----------------------------------------------------------------------------------------------------*/
/*--------------------------------------------Objeto Ventana Modal -----------------------------------*/
/*----------------------------------------------------------------------------------------------------*/
var modalWindow = function(){
	/*--------------------------------------------Objeto CapaContenido--------------------------------*/
	var capaContenido = function(){

		//------------------- Partes-------------------------------------
		var Cabecera = function(contenido){

			this.estado = 'sinConstruir';
			this.nodo = null;

			this.construirNodo = function(){
				var nodo=document.createElement('section');
				nodo.setAttribute('cabecera','');
				this.nodo = nodo;
				this.manejoDeContenido(contenido);
			};
			this.manejoDeContenido = function(contenido){
				var porConstruir;
				if(typeof contenido == 'string'){
						porConstruir = {html: contenido};
				}else{
					porConstruir = contenido;
				}
				if(porConstruir.html){
					this.nodo.innerHTML = porConstruir.html;
				}
			};
			this.agregarTipo = function(tipo){
				this.revisarTipos();
				this.nodo.classList.add(tipo);
				var icono;
				switch(tipo){
					case 'error':
						icono = UI.crearIcono({
							nombre:'error',
							tamano: 48,
							color: 'red500',
							inactivo: false
						});
						this.nodo.appendChild(icono);
						break;

					case 'advertencia':
						icono = UI.crearIcono({
							nombre:'warning',
							tamano: 48,
							color: 'amber500',
							inactivo: false
						});
						this.nodo.appendChild(icono);
						break;

					case 'informacion':
						icono = UI.crearIcono({
							nombre:'info_outline',
							tamano: 48,
							color: 'indigo500',
							inactivo: false
						});
						this.nodo.appendChild(icono);
						break;

					default:
						console.log('no existe icono para'+tipo);
						break;
				}
			};
			this.revisarTipos = function(){
				var tipos = ['informacion','error','advertencia'];
				var nodo = this.nodo;
				tipos.forEach(function(tipo){
					if(nodo.classList.contains(tipo)){
						nodo.classList.remove(tipo);
					}
				});
				var icono = nodo.querySelector('i');
				if(icono){
					icono.parentNode.removeChild(icono);
				}
			};
			this.construirNodo();
		};

		var Cuerpo = function(contenido){
			this.estado='sinConstruir';
			this.nodo = null;
			this.campos = [];

			this.construirNodo = function(){
				var nodo=document.createElement('section');
				nodo.setAttribute('cuerpo','');
				this.nodo=nodo;
				this.manejoDeContenido(contenido);
			};
			//esta funcion revisa el contenido y construye la interfaz que le
			//fue pasada y la construye
			this.manejoDeContenido = function(contenido){
				var porConstruir;
				if(typeof contenido == 'string'){
						porConstruir = {html: contenido};
				}else{
					porConstruir = contenido;
				}
				if(porConstruir.formulario){
					this.formulario = new Formulario({
						contenedor: this.nodo,
						plano: porConstruir.formulario,
						tipo: porConstruir.tipo,
						registroAct: porConstruir.registro
					});
					porConstruir.alto = porConstruir.formulario.altura;
				}
				if(porConstruir.html){
					this.nodo.innerHTML = porConstruir.html;
				}
				if(porConstruir.alto){
					this.nodo.style.height = porConstruir.alto + 'px';
				}
				if(porConstruir.clases){
					this.clases = porConstruir.clases;
					UI.manejoDeClases(this);
				}
			};

			this.agregarCampos = function(campos){
				for(var x = 0;x < campos.length; x++){
					this.agregarCampo(campos[x]);
				}
			};

			this.agregarCampo = function(campo){
				var contenedor = this.nodo;
				var campoNuevo = UI.agregarCampo(campo,contenedor);
				this.campos.push(campoNuevo);
			};

			this.construirNodo();
		};

		var Pie = function(contenido){
			this.estado = 'sinConstruir';
			this.nodo = null;
			//funcion para agregar funcionamiento a los elementos hijos
			this.funcionamiento = null;
			this.construirNodo = function(){
				var nodo=document.createElement('section');
				nodo.setAttribute('pie','');
				this.nodo=nodo;
				this.manejoDeContenido(contenido);
			};
			this.manejoDeContenido = function(contenido){
				var porConstruir;
				if(typeof contenido == 'string'){
						porConstruir = {html: contenido};
				}else{
					porConstruir = contenido;
				}
				if(porConstruir.html){
					this.nodo.innerHTML = porConstruir.html;
				}
			};
			this.desaparecer = function(){
				this.nodo.style.height = '0px';
				this.nodo.innerHTML='';
			};
			this.construirNodo();
		};
		//------------------- Partes-------------------------------------
		this.estado = 'sinConstruir';
		this.partes = {};
		this.nodo = null;
		this.tipo = 'contenido';

		this.construirNodo = function(){
			var nodo=document.createElement('div');
			var predecesor = UI.elementos.modalWindow.obtenerUltimaCapa();
			nodo.setAttribute('capa','contenido');
			predecesor.nodo.parentNode.insertBefore(nodo,predecesor.nodo.nextSibling);
			this.nodo=nodo;
			this.estado='enUso';
			setTimeout(function(){
				nodo.classList.add('aparecer');
			},300);
		};

		this.agregarParte = function(parte,contenido){
			switch(parte){
				case 'cabecera':
					this.partes.cabecera=new Cabecera(contenido);
					this.nodo.insertBefore(this.partes.cabecera.nodo,this.nodo.firstChild);
				break;
				case 'cuerpo':
					this.partes.cuerpo=new Cuerpo(contenido);
					this.nodo.appendChild(this.partes.cuerpo.nodo);
				break;
				case 'pie':
					this.partes.pie=new Pie(contenido);
					this.nodo.appendChild(this.partes.pie.nodo);
				break;
			}
		};

		this.removerParte = function(parte){
				switch (parte) {
					case 'cabecera':
						if(this.partes.cabecera){
							this.partes.cabecera.nodo.parentNode.removeChild(this.partes.cabecera.nodo);
							this.partes.cabecera = null;
						}
						break;
					case 'cuerpo':
						if(this.partes.cuerpo){
							this.partes.cuerpo.nodo.parentNode.removeChild(this.partes.cuerpo.nodo);
							this.partes.cuerpo = null;
						}
						break;
					case 'pie':
						if(this.partes.pie){
							this.partes.pie.nodo.parentNode.removeChild(this.partes.pie.nodo);
							this.partes.pie = null;
						}
						break;
					default:
						console.log(parte+'no existe');
				}
		};

		this.dibujarUI = function(data){
			data.tipo=data.tipo || 'contenedor';
			data.contenido = data.contenido || 'normal';
			if(data.cabecera!==undefined){
				this.agregarParte('cabecera',data.cabecera);
				this.partes.cabecera.agregarTipo(data.tipo.toLowerCase());
			}
			if(data.cuerpo!==undefined){
				this.agregarParte('cuerpo',data.cuerpo);
			}
			if(data.pie!==undefined){
				this.agregarParte('pie',data.pie);
				this.partes.pie.nodo.classList.toggle(data.tipo.toLowerCase());
			}
			if(data.contenido.toLowerCase() === 'ancho' ){
				this.nodo.classList.add('ancho');
			}
		};
		this.convertirEnFormulario = function(formulario){
			//Cambios Generales
			if(!this.nodo.classList.contains('ancho')){
				this.nodo.classList.add('ancho');
			}
			//cambio cabecera
			if(formulario.cabecera){
				if(this.partes.cabecera){
					this.removerParte('cabecera');
				}
				this.agregarParte('cabecera',formulario.cabecera);
			}
			//cuerpo
			if(formulario.cuerpo){
				if(this.partes.cuerpo){
					this.removerParte('cuerpo');
				}
				this.agregarParte('cuerpo',formulario.cuerpo);
			}
			//pie
			if(formulario.pie){
				if(this.partes.pie){
					this.removerParte('pie');
				}
				this.agregarParte('pie',formulario.pie);
			}
			return this.partes.cuerpo.formulario;
		};
		this.convertirEnMensaje = function(mensaje){
			//cambios Generales
			if(this.nodo.classList.contains('ancho')){
				this.nodo.classList.remove('ancho');
			}
			//cambio la cabecera
			if(mensaje.titulo){
				if(!this.partes.cabecera){
					this.agregarParte('cabecera','titulo');
				}
				this.partes.cabecera.nodo.class = '';
				this.partes.cabecera.nodo.textContent = mensaje.titulo;
				this.partes.cabecera.agregarTipo(mensaje.nombre_tipo.toLowerCase());
			}

			//cambio el cuerpo
			this.partes.cuerpo.nodo.innerHTML='<div textomodal>'+mensaje.cuerpo+'</div>';
			this.partes.cuerpo.nodo.style.height = '50px';

			//cambio pie
			if(this.partes.pie){
				this.partes.pie.desaparecer();
			}
		};
		this.construirNodo();
	};
	//-------------------Fin CapaContenido-------------------------------------

	var capaExterior = function(bloqueo){

		this.estado='sinConstruir';
		this.nodo = null;
		this.tipo='exterior';
		this.bloqueo=bloqueo || false;

		this.construirNodo = function(){
			var nodo = document.createElement('div');
			nodo.setAttribute('capa','exterior');
			document.body.appendChild(nodo);
			this.nodo=nodo;
			this.estado='enUso';
			setTimeout(function(){
				nodo.style.opacity='0.8';
			},10);

		};
		this.construirNodo();
	};
	//-------------------Fin CapaExterior-------------------------------------

	this.estado='sinConstruir';
	this.capas = [];

	this.arranque = function(data){
		this.agregarCapa('exterior',data.bloqueo);
		var contenido=this.agregarCapa('contenido');
		contenido.dibujarUI(data);
		this.manejoDeCapas();
		return contenido;
	};
	this.agregarCapa = function(tipo,bloqueo){
		var capaNueva=false;
		var zIndex;
		if(tipo=='exterior'){
			if(this.existeExterior()){
				zIndex = window.getComputedStyle(this.buscarUltimaCapaContenido().nodo,null).getPropertyValue("z-index");
				capaNueva=new capaExterior(bloqueo);
				this.capas.push(capaNueva);
				capaNueva.nodo.style.zIndex=parseInt(zIndex)+1;
			}else{
				capaNueva=new capaExterior(bloqueo);
				this.capas.push(capaNueva);
			}
		}else if(tipo=='contenido'){
			if(this.existeExterior()){
				zIndex = window.getComputedStyle(this.obtenerUltimaCapa().nodo,null).getPropertyValue("z-index");
				capaNueva = new capaContenido();
				this.capas.push(capaNueva);
				capaNueva.nodo.style.zIndex=parseInt(zIndex)+1;
			}
		}else if(tipo=='opciones'){
			//TODO: capa opciones
		}
		return capaNueva;
	};
	this.removerCapa = function(){
		var capaExterior=UI.elementos.modalWindow.buscarCapa(this);
		var capaContenido = null;
		if(capaExterior){
			if(capaExterior==UI.elementos.modalWindow.capas[0]){
				capaContenido= UI.elementos.modalWindow.buscarCapa(capaExterior.nodo.nextSibling);
				//los saco de vista con la trancision
				//capa contenido
				capaContenido.nodo.classList.remove('aparecer');
				setTimeout(function(){
					capaExterior.nodo.style.opacity='0';
				},300);
				setTimeout(function(){

					capaContenido.nodo.parentNode.removeChild(capaContenido.nodo);
					capaExterior.nodo.parentNode.removeChild(capaExterior.nodo);

					var indice = UI.elementos.modalWindow.capas.indexOf(capaContenido);
					UI.elementos.modalWindow.capas.splice(indice,1);
					indice = UI.elementos.modalWindow.capas.indexOf(capaExterior);
					UI.elementos.modalWindow.capas.splice(indice,1);

					obtenerContenedor().style.position='inherit';
					document.body.scrollTop = UI.elementos.modalWindow.scrollTop + 40;
				},810);
			}else{
				capaContenido= UI.elementos.modalWindow.buscarCapa(capaExterior.nodo.nextSibling);
				//los saco de vista con la transcision
				//capa contenido
				capaContenido.nodo.style.top='200%';
				capaContenido.nodo.style.opacity='0';
				setTimeout(function(){
					capaExterior.nodo.style.opacity='0';
				},300);
				setTimeout(function(){

					capaContenido.nodo.parentNode.removeChild(capaContenido.nodo);
					capaExterior.nodo.parentNode.removeChild(capaExterior.nodo);

					var indice = UI.elementos.modalWindow.capas.indexOf(capaContenido);
					UI.elementos.modalWindow.capas.splice(indice,1);
					indice = UI.elementos.modalWindow.capas.indexOf(capaExterior);
					UI.elementos.modalWindow.capas.splice(indice,1);

				},810);
			}
		}
	};
	this.buscarCapa = function(nodo){
		var capa=false;
		for(var x=0;x<this.capas.length;x++){
			if(this.capas[x].nodo==nodo){
				capa=this.capas[x];
				break;
			}
		}
		return capa;
	};
	this.buscarUltimaCapaContenido = function(){
		if(this.capas.length){
			var capa=this.obtenerUltimaCapa();
			var cont=0;
			while((capa.tipo!='contenido')||(cont==6)){
				capa=capa.previousSibling;
			}
			return capa;
		}else{
			return false;
		}
	};
	this.existeExterior = function(){
		var capas=this.capas;
		var existe = false;
		for(var x=0;x<capas.length;x++){
			if(capas[x].tipo=='exterior'){
				existe=true;
				break;
			}
		}
		return existe;
	};
	this.obtenerUltimaCapa = function(){
		var ultimaCapa = this.capas[this.capas.length-1];
		return ultimaCapa;
	};
	this.manejoDeCapas = function(){
		this.scrollTop = document.body.scrollTop;
		var contenedor=obtenerContenedor();
		if(this.existeExterior()){
			contenedor.style.position='fixed';
			for(var x=0;x<this.capas.length;x++){
				if(this.capas[x].nodo.getAttribute('capa')=='exterior'){
					if(!this.capas[x].bloqueo){
						this.capas[x].nodo.onclick=this.removerCapa;
					}
				}
			}
		}else{
			contenedor.style.position='inherit';
		}
	};
	this.eliminarUltimaCapa = function(){
		for(var x=this.capas.length-1;x>=0;x--){
			if(this.capas[x].tipo=='exterior'){
				this.capas[x].nodo.onclick=this.removerCapa;
				this.capas[x].nodo.click();
				break;
			}
		}
	};
};

/*---------------Utilidades---------------------------------------------*/
function obtenerContenedor(){
	var contenedor = document.body.firstChild;
	while(contenedor.nodeName=='#text'){
		contenedor=contenedor.nextSibling;
	}
	return contenedor;
}
function normalizarNodo(nodo){
	var hijo=null;
	var eliminar;
	while(hijo!=nodo.lastChild){
		if(hijo===null){
			hijo=nodo.firstChild;
		}
		if(hijo.nodeName=='#text'){
			eliminar=hijo;
			hijo=hijo.nextSibling;
			eliminar.parentNode.removeChild(eliminar);
		}else{
			hijo=hijo.nextSibling;
		}
	}
}
/*----------------------------------------------------------------------------------------------------*/
/*--------------------------------------------Objeto Formulario --------------------------------------*/
/*----------------------------------------------------------------------------------------------------*/
var Formulario = function(atributos){
	this.campos = [];
	this.plano = atributos.plano;
	this.tipo = atributos.tipo;
	this.nodo = null;
	this.registroId = null;
	this.registroAct= atributos.registroAct || null;

  this.construirNodo = function(){
		this.nodo = document.createElement('form');
		atributos.contenedor.appendChild(this.nodo);
		atributos.contenedor.setAttribute('formulario','');
		this.agregarCampos(this.plano.campos);
		if(this.tipo.toLowerCase() === 'modificar'){
			if(this.registroAct !== null){
				this.registroId = this.registroAct.codigo || null;
				this.asignarValores(this.registroAct);
				this.deshabilitar();
			}
		}
  };

  this.agregarCampos = function(campos){
    for (var i = 0; i < campos.length; i++) {
    	var campo = this.agregarCampo(campos[i]);
    	if(!(campo instanceof SaltoDeLinea)){
			this.campos.push(campo);
    	}
    }
  };
  this.agregarCampo = function(campo){
    var campoNuevo;
		switch(campo.tipo.toLowerCase()){
			case 'campodetexto':
				campoNuevo = new CampoDeTexto(campo.parametros);
				break;
			case 'combobox':
				campoNuevo = new ComboBox(campo.parametros);
				break;
			case 'radio':
				campoNuevo = new Radio(campo.parametros);
				break;
			case 'saltodelinea':
				campoNuevo = new SaltoDeLinea();
				break;
			case 'checkbox':
				campoNuevo = new CheckBox(campo.parametros);
				break;
			case 'campobusqueda':
				if(typeof CampoBusqueda !== 'undefined'){
					campoNuevo = new CampoBusqueda(campo.parametros);
				}else{
						console.log('dependencia O_CampoBusqueda.js no existe');
				}
				break;
			case 'campoidentificacion':
				if(typeof CampoIdentificacion !== 'undefined'){
					campoNuevo = new CampoIdentificacion(campo.parametros);
				}else{
						console.log('dependencia O_CampoIdentificacion.js no existe');
				}
				break;
		}
		this.nodo.appendChild(campoNuevo.nodo);
		return campoNuevo;
  };
	this.buscarCampo = function(nombre){
		var campos = this.campos;
		for (var i = 0; i < campos.length; i++) {
			if(campos[i].captarNombre() === nombre.toLowerCase()){
				return campos[i];
			}
		}
		return -1;
	};
	this.asignarValores = function(registro){
		var campos = this.campos;
		for (var campo in registro) {
			if (registro.hasOwnProperty(campo)) {
				for(var y = 0; y < campos.length; y++){
					if(campos[y].captarNombre() == campo){
						campos[y].asignarValor(registro[campo]);
					}
				}
			}
		}
	};
	this.habilitar = function(){
		for (var i = this.campos.length -1; i > -1 ; i--) {
			this.campos[i].habilitar();
		}
	};
	this.deshabilitar = function(){
		for (var i = 0; i < this.campos.length; i++) {
			this.campos[i].deshabilitar();
		}
	};
	this.captarValores = function(){
		var registro = {};
		for (var i = 0; i < this.campos.length; i++) {
			registro[this.campos[i].captarNombre()] = this.campos[i].captarValor();
		}
		return registro;
	};
	this.validar = function(){
		var campos = this.campos;
		for (var i = 0; i < campos.length; i++) {
	    //valido el campo
	    if((campos[i].captarRequerido())&&(!campos[i].captarValor())){
	      return false;
	    }
	  }
	  return true;
	};
	this.limpiar =  function(){
		var campos = this.campos;
		for (var i = 0; i < campos.length; i++) {
				campos[i].limpiar();
		}
	};
  this.construirNodo();
};

/*----------------------------------------------------------------------------------------------------*/
/*--------------------------------------------Objeto Listas ------------------------------------------*/
/*----------------------------------------------------------------------------------------------------*/
var Lista = function(data){
	/*------------------------------Objeto BarraPaginacion-------------------*/
	var BarraPaginacion = function(atributos){
		/*------------------------------Objeto Pagina-------------------*/
		var Pagina = function(atributos){
			this.atributos = atributos;
			this.nodo = null;
			this.construirNodo = function(){
				var nodo = document.createElement('article');
				nodo.setAttribute('pagina','');
				nodo.textContent = this.atributos.numero;
				if(this.atributos.clase){
					nodo.classList.add(this.atributos.clase);
				}
				this.nodo = nodo;
			};
			this.construirNodo();
		};
		this.atributos = atributos;
		this.nodo = null;
		this.paginas = [];
		this.construirNodo = function(){
			var nodo = document.createElement('section');
			nodo.setAttribute('slot','');
			nodo.classList.add('barra-paginacion');
			this.nodo = nodo;
			this.agregarPaginas();
		};
		this.agregarPaginas = function(){
			if(this.paginas.length){
				this.limpiarPaginas();
			}
			var paginacion = this.atributos;
			if(paginacion.paginaActual > 3){
				this.agregarPagina(1,'primera');
			}
			this.agregarPagina(paginacion.paginaActual-2);
			this.agregarPagina(paginacion.paginaActual-1);
			this.agregarPagina(paginacion.paginaActual,'actual');
			this.agregarPagina(paginacion.paginaActual+1);
			this.agregarPagina(paginacion.paginaActual+2);
			if(paginacion.paginaActual < paginacion.paginas-3){
				this.agregarPagina(paginacion.paginas,'ultima');
			}
		};
		this.agregarPagina = function(numero,clase){
			if((numero > 0)&&(numero <= this.atributos.paginas)){
				var pagina = new Pagina({'numero':numero,'clase':clase});
				this.nodo.appendChild(pagina.nodo);
				this.paginas.push(pagina);
			}
		};
		this.buscarPagina = function(numero){
			for (var i = 0; i < this.paginas.length; i++) {
				if(this.paginas[i].atributos.numero === numero){
					return this.paginas[i];
				}
			}
			return false;
		};
		this.quitarPagina = function quitar(pag){
			var pagina = this.buscarPagina(pag);
			this.nodo.removeChild(pagina.nodo);
			this.paginas.splice(this.paginas.indexOf(pagina),1);
		};
		this.limpiarPaginas = function(){
			var barra = this;
			var longitud = this.paginas.length;
			for(var x = 0; x < longitud; x++){
				this.quitarPagina(this.paginas[0].atributos.numero);
			}
		};
		this.construirNodo();
	};
  /*------------------------------Objeto Slot-------------------*/
  var Slot = function(registro){
		/*------------------------------Objeto celda-------------------*/
		var Celda = function(atributos){
			this.atributos = atributos;
			this.nodo = null;
			this.clases = ['dos','tres','cuatro','cinco','seis','siete','ocho'];

			this.construirNodo = function(){
				var nodo = document.createElement('div');
				if(this.atributos.tipo){
					nodo.setAttribute('cabeceraCelda','');
				}else{
					nodo.setAttribute('celda',atributos.nombre);
				}
				nodo.textContent = atributos.valor;
				nodo.classList.add(this.clases[this.atributos.columnas - 2]);
				this.nodo = nodo;

			};
			this.construirNodo();
		};
		/*------------------------------Objeto Selector-------------------*/
		var Selector = function(atributos){
			this.atributos = atributos;
			this.nodo = null;
			this.check = null;
			this.construirNodo = function(){
				var nodo = document.createElement('div');
				nodo.setAttribute('selector',this.atributos.codigo);
				this.nodo = nodo;
				this.check = new CheckBox({
						nombre: "selector"+this.atributos.nombre,
						valor: this.atributos.codigo,
						requerido: false,
						habilitado: true,
						animacion: 'girar',
						eslabon: 'area',
						sinTitulo: true,
						marcado: false,
						tipo: 'opciones'
				});
				this.nodo.appendChild(this.check.nodo);
			};
			this.activar = function(){
				this.check.nodo.click();
			};
			this.construirNodo();
		};
    this.atributos = registro;
    this.estado = 'sinInicializar';
    this.rol = 'lista';
    this.nodo = null;
		this.columnas = [];

    this.construirNodo = function(nombre){
      var nodo = document.createElement('section');
      nodo.setAttribute('slot','');
      nodo.id=this.atributos.codigo;
			this.nodo = nodo;
			if(registro.columnas!=1){
				//la celda con el checkbox como selector del registro o fila
				if(this.atributos.selector){
					if(this.atributos.selector.toLowerCase()!=='apagado'){
							this.agregarSelector(registro);
					}
				}else{
					this.agregarSelector(registro);
				}
				var x = 0;
				for (var variable in registro) {
					if(x < registro.columnas){
						if (registro.hasOwnProperty(variable)) {
							var dataCelda ={
								nombre: variable,
								valor: registro[variable],
								numero: x,
								columnas: registro.columnas,
								tipo: registro.tipo
							};
							this.agregarCelda(dataCelda);
							x++;
						}
					}else{
						break;
					}
				}
				var yo = this;
				if(this.selector){
					this.selector.check.asignarClick(function(){
						if(yo.selector.check.marcado === true){
							yo.nodo.classList.add("seleccionado");
							yo.estado = "seleccionado";
						}else{
							yo.nodo.classList.remove("seleccionado");
							yo.estado = "sinAsignar";
						}
					});
				}
			}else{
				var html ="";
				var titulo;
				var nombreAMostrar;
				if(data.campo_nombre){
					nombreAMostrar = data.campo_nombre;
				}else {
					nombreAMostrar = 'nombre';
				}
				if(this.atributos[nombreAMostrar].length>28){
					titulo=this.atributos[nombreAMostrar].substr(0,28)+'...';
				}else{
					titulo=this.atributos[nombreAMostrar];
				}
				html+="<article  title>"+titulo+"</article>";
				nodo.innerHTML=html;
				this.estado='enUso';
				this.funcionamiento();
			}
    };
    this.funcionamiento = function(){
      var nodo = this.nodo;
      var article =nodo.getElementsByTagName('article')[0];
      article.onclick=function(e){
        agregarRippleEvent(this.parentNode,e);
      };
    };

    this.reconstruirNodo = function(){
      var nodo=this.nodo;
      var slot=this;
      var titulo;
      var nombre;
      if(data.campo_nombre){
        nombre = data.campo_nombre;
      }else {
        nombre = 'nombre';
      }
      if(this.atributos[nombre].length>28){
        titulo=this.atributos[nombre].substr(0,28)+'...';
      }else{
        titulo=this.atributos[nombre];
      }
      var html="<article  title>"+titulo+"</article>";
      setTimeout(function(){
        nodo.innerHTML=html;
        slot.funcionamiento();
      },510);
    };

    this.destruirNodo = function(){
      var nodo = this.nodo;
      var slot = this;
      nodo.classList.add('desaparecer');
      setTimeout(function(){
        nodo.classList.add('desaparecerPorCompleto');
      },510);
      setTimeout(function(){
        nodo.parentNode.removeChild(nodo);
      },1110);
    };
    this.activar = function(){
      this.nodo.getElementsByTagName('article')[0].click();
    };
		this.agregarCelda = function(dataCelda){
			var newCelda = new Celda(dataCelda);
			this.nodo.appendChild(newCelda.nodo);
			this.columnas.push(newCelda);
			return newCelda;
		};
		this.agregarSelector = function(registro){
			this.selector = new Selector(registro);
			this.nodo.appendChild(this.selector.nodo);
		};
    this.construirNodo();
  };
  /*--------------------------Fin Objeto Slot-------------------*/

  this.Slots = [];
  this.atributos = data;
	this.atributos.nombre = data.nombre || data.titulo;
  this.atributos.onclickSlot = this.atributos.onclickSlot || null;
	this.clases = data.clases || [];
  this.columnas = data.columnas || 1;
	//paginacion
	this.paginaActual = 1;
	this.paginas = 1;
	this.valorBusqueda = '';
	this.registrosPorPagina = this.atributos.registrosPorPagina || 10;
	//UI
  this.nodo = null;

  this.construir = function(){
    var contenedor = data.contenedor || 'noPosee';
    var nodo = document.createElement('div');
    nodo.setAttribute('lista','');
    nodo.setAttribute('mat-window','');

    //contruir sector busqueda
    var html='';
		var alto = (this.registrosPorPagina==='libre')?'auto':parseInt((this.registrosPorPagina*40)+70)+'px';
		this.registrosPorPagina =(this.registrosPorPagina==='libre')?10:this.registrosPorPagina;
		html+="<section cont-slots style='height:"+alto+"'>";
    html+="<section busqueda>";
    html+=	"<div titulo>"+this.atributos.titulo+"</div>";
    html+=	"<div listBuscar>";
    html+=		"<input type='text' placeHolder='Buscar...'campBusq>";
    html+=		"<button type='button' cerrarBusq></button>";
    html+=	"</div>";
    html+=	"<button type='button' btnBusq class='invisible'></button>";
		html+="</section>";
    html+="</section>";
    nodo.innerHTML = html;
    this.nodo = nodo;

    var botonBusqueda = nodo.getElementsByTagName('button')[1];
    var botonCerrarBusq = nodo.getElementsByTagName('button')[0];
		var lista = this;
    botonBusqueda.onclick = function(){
			lista.abrirCampoBusqueda();
		};
    botonCerrarBusq.onclick = function(){
			lista.cerrarCampoBusqueda();
		};

    //agrego la lista al contenedor
    if(contenedor !== 'noPosee'){
      contenedor.appendChild(this.nodo);
    }

    //carga de elementos ya sea por busqueda a la BD o que sean suministrados en la
    //construccion
    setTimeout(function(){
      lista.manejarCarga();
    },10);
    if(this.atributos.clases){
			UI.manejoDeClases(this);
		}
  };

  this.manejarPaginacion = function(){
		if(this.Slots.length === this.registrosPorPagina){
			if(!this.barraPaginacion){
				this.barraPaginacion = new BarraPaginacion({
					paginas : this.paginas,
					paginaActual: this.paginaActual
				});
				this.nodo.appendChild(this.barraPaginacion.nodo);
			}else{
				this.barraPaginacion.atributos.paginaActual = parseInt(this.paginaActual);
				this.barraPaginacion.agregarPaginas();
			}
			var lista = this;
			this.barraPaginacion.paginas.forEach(function(each){
				each.nodo.onclick = function(e){
					agregarRippleEvent(this,e);
					lista.paginaActual = this.textContent;
					lista.recargarLista();
				};
			});
		}
  };
	this.recargarLista = function(){
		this.limpiarSlots();
		this.manejarCarga();
	};
  this.manejarCarga = function(){
    var carga = this.atributos.carga;
    //si no posee la info del cuadro de carga toma los valore por defecto
    if(carga){
      var contenedor = this.crearContenedorCarga();
      if(!carga.espera){
        carga.espera = {
          contenedor: contenedor,
          cuadro:{
            nombre: this.atributos.titulo,
            mensaje: 'Buscando',
            clases: ['lista']
          }
        };
      }else{
        carga.espera.contenedor = contenedor;
      }
      if(!carga.peticion){
        console.log('no se puede realizar una carga de elementos sin una peticion');
      }else{
        var lista = this;
				//manejo paginacion
				carga.peticion.pagina = this.paginaActual;
				if(!carga.peticion.valor){
					carga.peticion.valor = this.valorBusqueda;
				}
				carga.peticion.registrosPorPagina = this.registrosPorPagina;

        torque.manejarOperacion(carga.peticion,carga.espera,function cargaAutomaticaLista(respuesta){
          lista.removerContenedorCarga();
          if(respuesta.success){
            lista.cargarElementos(respuesta.registros);
						lista.paginas = respuesta.paginas;
				    lista.manejarPaginacion();
          }else{
            lista.noExistenRegistros();
          }
          if(lista.atributos.carga.respuesta){
            lista.atributos.carga.respuesta(lista);
          }
      	});
    	}
    }else if(this.atributos.elementos){
      //si lo elementos de la lista fueron suministrados en la creacion
      this.cargarElementos(this.atributos.elementos);
    }else{
      console.log('la lista se encuentra vacia');
    }
  };
	this.limpiarSlots = function(){
		var longitud =this.Slots.length;
		for (var i = 0; i < longitud; i++) {
			this.quitarSlot(this.Slots[0].atributos);
		}
	};
  this.crearContenedorCarga = function(){
    var contenedor = document.createElement('section');
    contenedor.setAttribute('contenedorCarga','');
    this.nodo.querySelector('section[cont-slots]').appendChild(contenedor);
    return contenedor;
  };
  this.removerContenedorCarga = function(){
    var contenedor = this.nodo.querySelector('section[contenedorCarga]');
    this.nodo.querySelector('section[cont-slots]').removeChild(contenedor);
  };
  this.noExistenRegistros = function(){
    var ayuda = document.createElement('section');
    ayuda.classList.add('vacio');
    ayuda.textContent = 'No existen Registros';
    this.nodo.querySelector('section[cont-slots]').appendChild(ayuda);
  };
  this.abrirCampoBusqueda = function(){
	var botonBusqueda = this.nodo.querySelector('button[btnbusq]');
    botonBusqueda.parentNode.classList.add('buscar');
		var lista = this;
    setTimeout(function(){
      botonBusqueda.onclick=lista.buscarElementos;
    },10);
  };

	this.cerrarCampoBusqueda = function(){
		var botonBusqueda = this.nodo.querySelector('button[btnbusq]');
	  botonBusqueda.parentNode.classList.remove('buscar');
    botonBusqueda.click();
    this.controlLista();
		var lista = this;
     setTimeout(function(){
       botonBusqueda.onclick=function(){lista.abrirCampoBusqueda();};
     },20);
	};

  this.buscarElementos = function(){
    /*TODO: buqueda en listas(cliente -> servidor)*/
  };

  this.listarSlots = function(){
    console.log('Slots:');
    for(var x=0;x<this.Slots.length;x++){
      console.log('nombre: '+this.Slots[x].atributos.nombre+'\testado: '+this.Slots[x].estado);
    }
  };
  this.agregarSlot = function(data){
		if( this.nodo.querySelector('section.vacio')){
			var vacio = this.nodo.querySelector('section.vacio');
			vacio.parentNode.removeChild(vacio);
		}
		data.columnas = this.columnas;
    var slot = new Slot(data);
    this.Slots.push(slot);
    this.nodo.querySelector('section[cont-slots]').appendChild(slot.nodo);
    var lista = this;
    if(this.atributos.onclickSlot!==null){
      slot.nodo.onclick = function(){
        lista.controlLista(this);
        lista.atributos.onclickSlot(slot);
      };
    }
		//this.verificarBoton();
    return slot.nodo;
  };
	this.quitarSlot = function(objeto){
		var slot = this.buscarSlot(objeto);
		slot.destruirNodo();
		this.Slots.splice(this.Slots.indexOf(slot),1);
		if(!this.Slots.length){
			this.noExistenRegistros();
		}
		//this.verificarBoton();
	};
	this.verificarBoton = function(){
		if(this.Slots.length<10){
			this.nodo.querySelector('button[btnBusq]').classList.add('invisible');
		}else{
			this.nodo.querySelector('button[btnBusq]').classList.remove('invisible');
		}
	};
  this.cargarElementos = function(registros){
		if(this.columnas !== 1){
			if(!this.atributos.sinCabecera){
				this.agregarCabecera(registros);
			}
		}
    for(var x=0; x<registros.length;x++){
			registros[x].selector = this.atributos.selector;
      this.agregarSlot(registros[x]);
    }
  };
	this.agregarCabecera = function(registros){
		var cabeceras = {};
		var x = 0;
		if(!this.cabecera){
			for (var variable in registros[0]) {
				if(x < this.columnas){
					if (registros[0].hasOwnProperty(variable)){
						cabeceras[variable]=variable;
						x++;
					}
				}else{
					break;
				}
			}
			cabeceras.tipo = 'cabecera';
			cabeceras.selector = this.atributos.selector;
			this.agregarSlot(cabeceras);
			var newSlot = this.Slots[0];
			this.cabecera = newSlot;
			var lista = this;
			if(newSlot.selector){
				newSlot.selector.check.asignarClick(function(){
					var marcado = newSlot.selector.check.marcado;
					lista.Slots.forEach(function(slot){
						if(slot.selector.check.marcado !== marcado){
							slot.selector.activar();
						}
					});
				});
			}
			this.Slots.splice(this.Slots.indexOf(newSlot),1);
		}
	};
  this.controlLista = function(nodo){
    var obj=false;
    for(var x=0;x<this.Slots.length;x++){
      if(this.Slots[x].nodo==nodo){
        this.Slots[x].estado='seleccionado';
        this.Slots[x].nodo.classList.add('seleccionado');
        obj=this.Slots[x];
      }else{
        this.Slots[x].estado='enUso';
        this.Slots[x].nodo.classList.remove('seleccionado');
      }
    }
  };

  this.buscarSlot = function(objeto){
    for(x=0;x<this.Slots.length;x++){
      if(this.Slots[x].atributos.codigo==objeto.codigo){
        return this.Slots[x];
      }
    }
    console.log('el slot no existe');
    return false;
  };

  this.buscarSlotPorNombre = function(objeto){
    for(x=0;x<this.Slots.length;x++){
      if(this.Slots[x].atributos.nombre==objeto.nombre){
        return this.Slots[x];
      }
    }
    console.log('el slot no existe');
    return false;
  };

  this.cambiarTextoSlots = function(cambio){
    if(cambio=='mediaQuery'){
      for(var x=0;x<this.Slots.length;x++){
        var nodo=this.Slots[x].nodo;
        var slot=this.Slots[x];
        var titulo;
        if(slot.atributos.nombre.length>28){
          titulo=slot.atributos.nombre.substr(0,28)+'...';
        }else{
          titulo=slot.atributos.nombre;
        }
        var html="<article  title>"+titulo+"</article>]";
        nodo.innerHTML=html;
        slot.funcionamiento();
      }
    }else{
      for(var i=0;i<this.Slots.length;i++){
        var contenido = "<article  title>"+this.Slots[i].atributos.nombre+"</article>";
        this.Slots[i].nodo.innerHTML = contenido;
        this.Slots[i].funcionamiento();
      }
    }
  };

  this.actualizarLista = function(cambios){
    if(cambios instanceof Array){

    }else{
      this.actualizarSlot(cambios);
    }
  };

  this.actualizarSlot = function(objeto){
    var slot=this.buscarSlot(objeto);
    var yo = this;
    if(slot){
      slot.atributos=objeto;
      slot.reconstruirNodo();
      setTimeout(function() {
        yo.controlLista(slot.nodo);
      }, 510);
    }
  };

  this.obtenerSeleccionado = function(){
    var seleccionado=false;
    for(var x=0;x<this.Slots.length;x++){
      if(this.Slots[x].estado=='seleccionado'){
        seleccionado=this.Slots[x];
      }
    }
    return seleccionado;
  };
  this.destruirNodo = function(){
		this.nodo.style.height='0px';
		var l = this;
		setTimeout(function(){
			l.nodo.parentNode.removeChild(l.nodo);
		},510);
	};
  this.construir();
};
/*----------------------------------------------------------------------------------------------------*/
/*--------------------------------------------Objeto Campos ------------------------------------------*/
/*----------------------------------------------------------------------------------------------------*/
//-----------------------------Objeto CheckBox-------------------------
var CheckBox = function(info){
	//marcado,habilitado,valor,nombre,requerido,usaTitulo,eslabon
	var Campo = function(animacion){
		this.nodo = null;
		this.check =null;
		this.box = null;

		this.construirNodo = function(){
			var nodo = document.createElement('div');
			nodo.setAttribute('checkbox','');
			this.nodo = nodo;

			var check = document.createElement('div');
			check.setAttribute('check','');
			nodo.appendChild(check);

			var box = document.createElement('div');
			box.setAttribute('box','');
			nodo.appendChild(box);

			box.classList.add(animacion);
			check.classList.add(animacion);

			this.check = check;
			this.box = box;
		};
		this.construirNodo();
	};
	var Titulo = function(nombre){
		this.nodo = null;

		this.construirNodo = function(){
			var nodo = document.createElement('div');
			nodo.setAttribute('titulo','');
			this.nodo = nodo;

			nodo.textContent = nombre;
		};
		this.construirNodo();
	};
	//partes
	this.nodo = null;
	this.campo = null;
	this.texto = null;
	// valores
	this.habilitado = 'habilitado';
	this.marcado = false;
	this.valor = info.valor;
	this.nombre = info.nombre;
	this.requerido = info.requerido || false;

	this.construirNodo = function(){
		var nodo = document.createElement('div');
		nodo.setAttribute('o-checkbox','');
		this.nodo = nodo;

		animacion = info.animacion || 'girar';
		this.campo = new Campo(animacion);
		this.nodo.appendChild(this.campo.nodo);

		tipo = info.tipo || 'campo';
		this.nodo.classList.add(tipo);
		info.sinTitulo = info.sinTitulo || false;
		if(info.usaTitulo){
			this.titulo = new Titulo(info.nombre);
			this.nodo.appendChild(this.titulo.nodo);
		}
		if(info.eslabon === 'area'){
			this.nodo.setAttribute('area','');
		}
		if(!info.habilitado){
			this.deshabilitar();
		}else {
			this.habilitar();
		}
		if(info.marcado){
			this.marcar();
		}else{
			this.desmarcar();
		}
	};
	this.cambiarEstado = function(){
		if(this.marcado){
			this.desmarcar();
		}else{
			this.marcar();
		}
	};
	this.marcar = function(){
		this.campo.nodo.classList.add('marcado');
		this.marcado = true;
	};
	this.desmarcar = function(){
		this.campo.nodo.classList.remove('marcado');
		this.marcado = false;
	};
	this.deshabilitar = function(){
		var yo = this;
		this.nodo.onclick = function(){};
		this.estado = 'deshabilitado';
	};
	this.habilitar = function(){
		var yo = this;
		this.nodo.onclick = function(){
			yo.cambiarEstado();
			if(yo.onclick){
				yo.onclick();
			}
		};
		this.estado = 'habilitado';
	};
	this.captarNombre = function(){
		return this.nombre;
	};
	this.captarValor = function(){
		if(this.marcado){
			return this.valor;
		}else{
			return false;
		}
	};
	this.captarRequerido = function(){
		return this.requerido;
	};
	this.limpiar = function(){
		this.desmarcar();
	};
	this.asignarClick = function(clickFunction){
		var yo = this;
		this.onclick = clickFunction;
		if(this.estado === "habilitado"){
			this.deshabilitar();
			this.habilitar();
		}
	};
	this.construirNodo();
};
//-----------------------------Objeto Radio----------------------------
var Radio = function(info){
	//nombre,opciones,seleccionado
	this.data = info;
	this.estado = 'porConstriur';
	this.nodo = null;
	this.opciones = [];

	this.construirNodo = function(){
		var nodo = document.createElement('div');
		nodo.setAttribute('formElements','');
		this.nodo = nodo;
		this.agregarOpciones();
	};
	this.agregarOpcion = function(opcion){
		var nodoOpcion = document.createElement('label');
		nodoOpcion.classList.toggle('radio');
		var html = '';
		html+='<input type="radio" name="'+this.data.nombre+'" value="'+opcion.valor+'"><span class="outer"><span class="inner"></span></span>'+opcion.nombre;
		nodoOpcion.innerHTML=html;
		this.opciones.push(nodoOpcion);
		this.nodo.appendChild(nodoOpcion);
	};
	this.agregarOpciones = function(){
		for(var x=0; x<this.data.opciones.length;x++){
			this.agregarOpcion(this.data.opciones[x]);
		}
	};

	this.captarValor = function(){
		var valor = (this.nodo.querySelector('input[type="radio"]').value==='')?null:this.nodo.querySelector('radio').value;
		return valor;
	};
	this.captarNombre = function(){
		return this.nodo.querySelector('input[type="radio"]').name;
	};
	this.captarRequerido = function(){
		return this.atributos.requerido;
	};
	this.asignarValor = function(valor){
		this.valor = valor;
		this.nodo.querySelector('input[type="radio"]').value = valor;
	};
	this.deshabilitar = function(){
		for (var i = 0; i < this.opciones.length; i++) {
			this.opciones[i].disabled = true;
		}
	};
	this.habilitar = function(){
		for (var i = 0; i < this.opciones.length; i++) {
			this.opciones[i].disabled = false;
		}
	};
	this.limpiar = function(){
		this.nodo.querySelector('input[type="radio"]').value = '';
	};
	this.construirNodo();
};

//--------------------------Combo Box -------------------------------------
var ComboBox = function(info){
	//nombre,opciones,seleccionado,eslabon
	this.data = info;
	this.estado = 'porConstriur';
	this.data.eslabon = info.eslabon||'simple';
	this.data.seleccionado = info.seleccionado||'-';
	this.data.sinTitulo = info.sinTitulo || false;
	this.nodo = null;
	this.select = null;

	this.construir = function(){
		var nodo=document.createElement('div');
		nodo.setAttribute(this.data.eslabon,'');
		nodo.setAttribute('formElements','');

		//se crea el article
		var article=document.createElement('article');
		article.setAttribute('capaSelect','');
		if(this.data.deshabilitado !== true ){
			article.onclick=function(){
				construirCapaSelect(this);
			};
		}
		nodo.appendChild(article);

		//se crea el select
		var select=document.createElement('select');
		select.name=this.data.nombre;
		if(this.data.id!==undefined){
			select.id=this.data.id;
		}
		this.select = select;
		nodo.appendChild(select);

		this.nodo=nodo;
		var opcion;
		if(!this.data.peticion){
			if(!this.data.sinTitulo){
				opcion = {
					codigo : '-',
					nombre : 'Elija un '+this.data.titulo
				};
				this.agregarOpcion(opcion);
			}
			arranqueOpciones(this);
		}else{
			opcion = {
				codigo : '-',
				nombre : 'Cargando Opciones ... '
			};
			this.agregarOpcion(opcion);
			this.estado = 'cargando';
			var yo = this;
			torque.Operacion(this.data.peticion,function(respuesta){
				yo.data.opciones = respuesta.registros;
				arranqueOpciones(yo);
			});
		}
	};
	function arranqueOpciones(combo){
		if(combo.data.titulo){
			combo.select.options[0].textContent='Elija un '+combo.data.titulo;
		}
		//genero y asigno el resto de las opciones
		combo.agregarOpciones(combo.data.opciones);
		combo.estado='enUso';
	}
	this.agregarOpciones = function(opciones){
		for(var x=0;x<opciones.length;x++){
			this.agregarOpcion(opciones[x]);
		}
	};
	this.agregarOpcion = function(opcion){
		var select=this.nodo.getElementsByTagName('select')[0];
		var nuevaOp=document.createElement('option');
		nuevaOp.textContent=opcion.nombre;
		nuevaOp.value=opcion.codigo;
		select.appendChild(nuevaOp);
	};
	this.seleccionarOpcion = function(opcion){
		var select=this.nodo.getElementsByTagName('select')[0];
		select.value = opcion.codigo;
		var opciones = select.options;
		for (var i = 0; i < opciones.length; i++) {
			if(opciones[i].value === opcion.codigo){
				select.selectedIndex = i;
				return true;
			}
		}
		return false;
	};
	this.captarValor = function(){
		var valor = (this.nodo.querySelector('select').value==='-')?null:this.nodo.querySelector('select').value;
		return valor;
	};
	this.captarNombre = function(){
		return this.nodo.querySelector('select').name;
	};
	this.captarRequerido = function(){
		return this.data.requerido;
	};
	this.asignarValor = function(valor){
		if(this.estado === 'cargando'){
				var yo = this;
				yo.valor = valor;
				this.idIntervalo = setInterval(function(){
					if(yo.estado !== 'cargando'){
						yo.seleccionarOpcion({codigo:yo.valor});
						yo.valor = null;
						clearInterval(yo.idIntervalo);
						yo.idIntervalo = null;
					}
				},10);
		}else{
				this.seleccionarOpcion({codigo:valor});
		}
	};
	this.deshabilitar = function(){
		this.select.classList.add('deshabilitado');
		var article = this.nodo.querySelector('article');
		article.onclick = function(){};
	};
	this.habilitar = function(){
		this.select.classList.remove('deshabilitado');
		var article = this.nodo.querySelector('article');
		article.onclick = function(){
			construirCapaSelect(this);
		};
	};
	this.limpiar = function(){
		this.select.selectedIndex = 0;
	};
	this.construir();
};

//-------------------- Salto de linea ---------------
var SaltoDeLinea = function(){
	this.nodo = null;
	this.construirNodo = function(){
		var nodo = document.createElement('div');
		nodo.setAttribute('clear','');
		this.nodo = nodo;
	};
	this.construirNodo();
};

//-------------------- Campo  de Texto ---------------------------
var CampoDeTexto = function(info){
	this.data = info;
	this.estado = 'porConstriur';
	this.data.eslabon = info.eslabon || 'simple';
	this.data.usaToolTip = info.usaToolTip ||  false;
	this.data.usaMinuscula = info.usaMinuscula || false;
	this.nodo = null;

	this.construir = function(){
		var CampoDeTexto = document.createElement('div');
		CampoDeTexto.classList.toggle('group');
		CampoDeTexto.setAttribute(this.data.eslabon,'');
		var html='';
		max=(info.max)?"maxlength="+info.max:'';
		if(this.data.tipo=='simple'){
			html+='<input type="text" name="'+this.data.nombre+'" value="" '+max+' required>';
		}else if(this.data.tipo=='password'){
			html+='<input type="password" name="'+this.data.nombre+'" '+max+' value="" required>';
		}else if(this.data.tipo=='area'){
			html+='<textarea name="'+this.data.nombre+'" required></textarea>';
		}else{
			console.log(this.data.tipo);
		}

		html+='<span class="highlight"></span>'+
		      '<span class="bar"></span>'+
		    	'<label>'+this.data.titulo+'</label>';
		CampoDeTexto.innerHTML=html;
		this.nodo=CampoDeTexto;
		if(this.data.usaToolTip!==false){
			this.nodo.onmouseover=UI.elementos.maestro.abrirtooltipInput;
			this.nodo.onmouseout=UI.elementos.maestro.cerrartooltipInput;
		}
		this.estado='enUso';
	};
	this.captarValor = function(){
		var tipo = this.captarTipo();
		var valor;
		if(this.nodo.querySelector(tipo).value===''){
			valor = null;
		}else{
			valor = this.nodo.querySelector(tipo).value;
			if(!this.data.usaMinuscula){
				valor = valor.toUpperCase();
			}
		}
		return valor;
	};
	this.captarNombre = function(){
		var tipo = this.captarTipo();
		return this.nodo.querySelector(tipo).name;
	};
	this.captarTipo = function(){
		var tipo;
		if(this.data.tipo==='area'){
			tipo = 'textarea';
		}else{
			tipo = 'input';
		}
		return tipo;
	};
	this.captarRequerido = function(){
		return this.data.requerido;
	};
	this.asignarValor = function(valor) {
		var tipo = this.captarTipo();
		this.nodo.querySelector(tipo).value = valor;
	};
	this.habilitar = function(){
		this.nodo.classList.remove('deshabilitado');
		this.nodo.querySelector(this.captarTipo()).disabled = false;
		this.nodo.querySelector(this.captarTipo()).focus();
	};
	this.deshabilitar = function(){
		this.nodo.classList.add('deshabilitado');
		this.nodo.querySelector(this.captarTipo()).disabled = true;
	};
	this.limpiar = function(){
		this.asignarValor("");
	};
	this.construir();
};
/*----------------------------------Funciones del Objeto Select-------------------------------*/
construirCapaSelect= function(capaSelect){
	capaSelect.onclick=function(){};
	var opciones =[];
	var opcion = null;
	var nodo = null;
	var select = capaSelect.nextSibling;
	while(select.nodeName=='#text'){
		select=select.nextSibling;
	}
	var margen;
	for(var x = 0; x < select.options.length;x++){
		opcion = {
			nombre:select.options[x].textContent,
			value:select.options[x].value,
			nodo:null
		};

		nodo=document.createElement('div');
		nodo.setAttribute('option','');
		nodo.textContent=opcion.nombre;
		if(select.options[x]==select.options[select.selectedIndex]){
			nodo.setAttribute('selecionado','');
			margen='-'+parseInt(opciones.length*41)+'px';
			capaSelect.style.marginTop=margen;
		}

		nodo.style.transition='all '+parseInt(opciones.length*0.2)+'s ease-in-out';
		nodo.style.marginTop=parseInt(opciones.length*41)+'px';

		nodo.setAttribute('valor',opcion.value);
		nodo.onclick = capaClick;
		opcion.nodo=nodo;
		opciones.push(opcion);
		capaSelect.appendChild(nodo);
	}

	//creo el contenedor de las opciones
	capaSelect.style.opacity='1';
	capaSelect.style.height=parseInt(opciones.length*41)+'px';
	capaSelect.style.width='60px';
};

//funcion extraida de un bucle
function capaClick(e){
	//agrego el efecto Ripple
	agregarRippleEvent(this,e);
	var select = this.parentNode.nextSibling;
	while(select.nodeName=='#text'){
		select=select.nextSibling;
	}
	select.value=this.getAttribute('valor');
	destruirCapaSelect(this.parentNode);
}

destruirCapaSelect = function(capaSelect){
	var lista = capaSelect.childNodes;
	var opcion;
	capaSelect.style.opacity='0';
	capaSelect.style.height='100%';
	capaSelect.style.width='100%';
	capaSelect.style.marginTop='0px';
	for(var x = 0;x < lista.length;x++){
		lista[x].style.transition='all 0.3s linear';
		lista[x].style.marginTop='0px';
	}
	setTimeout(function(){
		while(capaSelect.childNodes.length>0){
			capaSelect.removeChild(capaSelect.lastChild);
		}
		capaSelect.onclick=function(){
			construirCapaSelect(this);
		};
	},300);
};
	/*------------------------------Fin Funciones del Objeto Select-------------------------------*/
