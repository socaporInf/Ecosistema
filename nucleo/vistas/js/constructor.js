/*---------------------MEDIA QUERY CHANGES-----------------------------------*/
var handleMediaChange = function (mediaQueryList) {
	if(UI.estado=='inicializado'){
		var formulario = UI.elementos.formulario;
		if(formulario.ventanaForm!==undefined){
			if(formulario.ventanaForm.nodo!==undefined){
				if (mediaQueryList.matches) {
			    	//cambio UI Ventana Form
			        formulario.ventanaList.cambiarTextoSlots('completa');
			    }
			    else {
			    	//cambio UI Ventana Form
			        formulario.ventanaList.cambiarTextoSlots('mediaQuery');
			    }
			}else{
				if (mediaQueryList.matches) {
					formulario.ventanaList.cambiarTextoSlots('completa');
				}else{
					formulario.ventanaList.cambiarTextoSlots('mediaQuery');
				}
			}
		}
	}
};

/*----------------------------------------------------------------------------------------------------*/
/*--------------------------------------------Objeto Botonera-----------------------------------------*/
/*----------------------------------------------------------------------------------------------------*/
var Botonera = function(estructura){

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
					nodo.onclick=UI.elementos.formulario.eliminar;
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
					//configuracion por defecto para cuando existe el formulario es decir que es un maestro
					if(UI.elementos.formulario!=='noPosee'){
						nodo.onclick=UI.elementos.formulario.ventanaForm.validar;
					}
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

	this.estructura = estructura;
	this.estado = 'porConstruir';
	this.nodo = null;

	this.botones = [];

	this.construir = function(){
		var contenedor = obtenerContenedor();
		var nodo = document.createElement('div');
		nodo.setAttribute('botonera','');
		contenedor.parentNode.insertBefore(nodo,contenedor.nextSibling);
		this.nodo = nodo;
		this.inicializarBotones();
		//boton nuevo
		if(UI.elementos.formulario!=='noPosee'){
			this.buscarBoton('nuevo').nodo.onclick=function(){
				console.log('presiono Nuevo');
				var data = {
					tipo:'nuevo'
				};
				var formulario = UI.elementos.formulario;
				formulario.construirUI(data);
			};
			//boton buscar
			this.buscarBoton('buscar').nodo.onclick=function(){
				UI.elementos.formulario.ventanaList.nodo.firstChild.getElementsByTagName('button')[1].click();
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
/*--------------------------------------------Objeto Cabecera ----------------------------------------*/
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
				menu.style.marginLeft='-350px';
				menu.setAttribute('estado','oculto');
			}else if(menu.getAttribute('estado')=='oculto'){
				menu.style.marginLeft='0px';
				menu.setAttribute('estado','visible');
			}
		};
		this.estado='enUso';
	};
	this.construir();
};

/*----------------------------------------------------------------------------------------------------*/
/*------------------------------Objeto Formulario(lista)----------------------------------------------*/
/*----------------------------------------------------------------------------------------------------*/
var Formulario = function(atributos){

	//----------------------------------Objeto Ventana Formulario-------------------
	var VentanaForm = function(atributos){

		this.atributos = atributos;
		this.tipo = 'noPosee';
		this.nodo = null;
		this.estado = 'sinConstruir';
		this.formNode = null;
		this.titulo = null;
		this.campos = [];
		//este es el registro que se esta editando
		this.registroId='';
		//el registro despues de buscarlo
		this.registroAct = null;

		this.construirNodo = function(data){
			var nodo = document.createElement('div');
			nodo.setAttribute('capaForm','');
			nodo.id='VentanaForm';
			this.tipo=data.tipo;
			this.nodo=nodo;
			if(data.tipo=='modificar'){
				this.registroId=data.codigo;
			}else if(data.tipo=='nuevo'){
				this.registroId='';
			}
			if(atributos.usoConstructor){
				this.iniciarConstructor();
			}else{
				this.reconstruirUI();
			}
		};
		this.destruirNodo = function(){
			if(this.registroId!==''){
				this.registroId='';
				UI.elementos.formulario.ventanaList.controlLista();
				UI.elementos.botonera.quitarBoton('eliminar');
			}else{
				UI.elementos.botonera.quitarBoton('guardar');
			}
			this.nodo.style.height='0px';
			setTimeout(function(){
				var vf=UI.elementos.formulario.ventanaForm;
				vf.nodo.parentNode.removeChild(vf.nodo);
				vf.estado='sinConstruir';
			},510);
		};

		this.edicion = function(){
			var formulario =  UI.elementos.formulario.ventanaForm;
			var lista = Array.prototype.slice.call(formulario.formNode.childNodes);
			lista.splice(lista.length,0,formulario.titulo);
			for(var x = 0; x < lista.length; x++){
				lista[x].classList.add('edicion');

				//contenedor
				var contenedorEdit = lista[x].querySelector('div[cont]');

				//campo donde se muestra el valor del campo pero de solo lectura
				var display = contenedorEdit.getElementsByTagName('div')[0];

				//campo donde se edita la informacion
				var campoEdit = null;

				if(lista[x].getAttribute('area')===null){
					campoEdit = contenedorEdit.querySelector('input');
				}else{
					campoEdit = contenedorEdit.querySelector('textarea');
				}
				campoEdit.value = display.textContent;
				campoEdit.focus();
			}
			var boton = UI.elementos.formulario.ventanaForm.titulo.getElementsByTagName('article')[0];
			boton.classList.add('edicion');
			boton.onclick = UI.elementos.formulario.ventanaForm.finEdicion;
		};

		this.finEdicion = function(){
			var formulario =  UI.elementos.formulario.ventanaForm;
			var newReg = {};
			var lista = Array.prototype.slice.call(formulario.formNode.childNodes);
			lista.splice(lista.length,0,formulario.titulo);
			for(var x = 0; x < lista.length; x++){
				lista[x].classList.remove('edicion');

				//contenedor
				var contenedorEdit = lista[x].querySelector('div[cont]');

				//campo donde se muestra el valor del campo pero de solo lectura
				var display = contenedorEdit.getElementsByTagName('div')[0];

				//campo donde se edita la informacion
				var campoEdit = null;

				if(lista[x].getAttribute('area')===null){
					campoEdit = contenedorEdit.querySelector('input');
				}else{
					campoEdit = contenedorEdit.querySelector('textarea');
				}
				display.textContent = campoEdit.value;

				//creo el nuevo registro para posteriormete verificar cambios
				var propiedad = campoEdit.name;
				newReg[propiedad] = campoEdit.value;
			}
			//verifico si hubo algun cambio y en que campo y armo la peticion
			var oldReg = UI.elementos.formulario.ventanaForm.registroAct;
			var peticion = { cambios:0, codigo:oldReg.codigo, operacion:'modificar', entidad:torque.entidadActiva};
			for (var oldPropiedad in oldReg){

				for(var newPropiedad in newReg){

					if(oldPropiedad.toLowerCase() == newPropiedad.toLowerCase()){

						if(oldReg[oldPropiedad] !== newReg[newPropiedad]){
							peticion[oldPropiedad] = newReg[newPropiedad];
							peticion.cambios++;
						}
					}
				}
			}
			//en caso de haber cambios envio a la base de datos y actualizo dicho cambio en el registro local
			if(peticion.cambios!==0){
				var contenedor = UI.elementos.formulario.ventanaForm.nodo;
				contenedor.innerHTML = '';
				//------------Cuadro Carga-------------------------------
				var infoCuadro = {
					nombre: 'guardarEdicion',
					mensaje:'Guardando cambios',
				};
				var cuadroDeCarga=UI.crearCuadroDeCarga(infoCuadro,contenedor);
				cuadroDeCarga.style.marginTop='80px';
				//------------Cuadro Carga-------------------------------

				torque.Operacion(peticion,function(respuesta){
					UI.buscarCuadroCarga('guardarEdicion').culminarCarga(respuesta,function(respuesta){
						if(respuesta.success===0){
							var ventana = {
								tipo : 'error',
								cabecera: 'Error interno del Servidor',
								cuerpo: respuesta.mensaje,
							};
							UI.crearVentanaModal(ventana);
							UI.elementos.formulario.ventanaForm.destruirNodo();
						}else{
							UI.elementos.formulario.ventanaList.actualizarSlot(respuesta.registro);
							UI.elementos.formulario.ventanaList.obtenerSeleccionado().activar();
						}
					});
				});
			}
			var boton = UI.elementos.formulario.ventanaForm.titulo.getElementsByTagName('article')[0];
			boton.classList.remove('edicion');
			boton.onclick = UI.elementos.formulario.ventanaForm.edicion;
		};

		//funcion para agregar de forma dinamica campos a la interfaz
		this.agregarCampo = function(campo){
		//para que no agregue el titulo dado que ya viene con la estructura basica de modificar
	      if((campo.tipo.toLowerCase() !== 'campoedicion')||((campo.tipo.toLowerCase() === 'campoedicion')&&(campo.parametros.tipo!=='titulo'))){
	        var contenedor = this.nodo.getElementsByTagName('form')[0];
	        var campoNuevo = UI.agregarCampo(campo,contenedor);
	        this.campos.push(campoNuevo);
	      }
		};
		//funcion con la cual puedo agregar mas de un campo de forma dinamica a la interfaz
		this.agregarCampos = function(campos){
			for(var x=0;x<campos.length;x++){
				this.agregarCampo(campos[x]);
			}
		};

		this.crearEstructuraBasicaNuevo = function(titulo,altura){
				this.nodo.style.height=altura+'px';
				var html='<section titulo>Nuevo '+titulo+'</section>'+
							'<section sector>'+
								'<form name ="formNuevo"></form>'+
							'</section>'+
						'</section>';
				this.nodo.innerHTML=html;
				//asigno el nodo formulario de html
				this.formNode = this.nodo.getElementsByTagName('form')[0];
				//asigo el titulo del formulario
				this.titulo = this.nodo.getElementsByTagName('section')[0];
		};

		this.crearEstructuraBasicaModificar = function(titulo,altura){
				this.nodo.style.height=altura+'px';
				var html="<section titulo area>"+
								"<div cont>"+
									"<textarea  name='"+titulo.nombre+"'></textarea>"+
									"<div display>"+titulo.valor+"</div>"+
								"</div>"+
								"<article update='campo'></article>"+
						"</section>"+
						"<section sector>"+
							"<!-- Aqui va el contenido -->"+
							"<form name ='formModificar'></form>"+
						"</section>";
				this.nodo.innerHTML=html;
				//asigno el nodo formulario de html
				this.formNode = this.nodo.getElementsByTagName('form')[0];
				//asigo el titulo del formulario
				this.titulo = this.nodo.querySelector('section[titulo]');
				//agrego funcionamiento del boton editar
				var article = this.titulo.querySelector('article[update]');
				article.onclick=function(){
					UI.elementos.formulario.ventanaForm.edicion();
				};
		};
		//esta funcion se usa solo si el valor usarConstructor es === true
		this.iniciarConstructor = function(){
			if(this.campos.length){
				this.campos = [];
			}
		  var constructor = UI.buscarConstructor(this.atributos.entidad);
		  var tiempo = (this.estado=='agregado')?600:0;
		  var html='';
		  if(this.tipo=='nuevo'){
		    this.registroId='';
		    UI.elementos.formulario.ventanaList.controlLista();
		    this.nodo.style.height='0px';
		    setTimeout(function(){
		      //guardo el objeto venana formulario para mejor entendimiento y acceso rapido
		      var capaForm=UI.elementos.formulario.ventanaForm;
		      //inicializo los datos del titulo del formulario y la altura del mismo
		      var titulo = constructor.nuevo.titulo;
		      var altura = constructor.nuevo.altura;
		      capaForm.crearEstructuraBasicaNuevo(titulo,altura);
		      //agrego los campos
		      UI.elementos.formulario.ventanaForm.agregarCampos(constructor.nuevo.campos);
		    },tiempo);

		    //funcionamiento botones
		    //quito
		    var gestionar = {quitar:['eliminar'],agregar:['guardar']};
	        if(constructor.modificar.botones){
	        	gestionar.quitar = gestionar.quitar.concat(constructor.modificar.botones);
	        }
		    //agrego
	        if(constructor.nuevo.botones){
	        	gestionar.agregar = gestionar.agregar.concat(constructor.nuevo.botones);
	        }
	        UI.elementos.botonera.gestionarBotones(gestionar);
		  }else if(this.tipo=='modificar'){

		    //funcinamiento botones
				var quitar = ['guardar','eliminar'];
	      if(constructor.nuevo.botones){
	      	quitar = quitar.concat(constructor.nuevo.botones);
	      }
				if(constructor.modificar.botones){
	      	quitar = quitar.concat(constructor.modificar.botones);
	      }
				UI.elementos.botonera.quitarBotones(quitar);

		    this.nodo.style.height = '0px';

		    setTimeout(function(){
		      var nodo=UI.elementos.formulario.ventanaForm.nodo;
		      nodo.style.height='300px';
		      nodo.style.borderRadius='0px';
		      //------------Cuadro Carga-------------------------------
		      var infoCuadro = {
		        mensaje:'Buscando'
		      };
		      nodo.innerHTML='';
		      var cuadroDeCarga = UI.crearCuadroDeCarga(infoCuadro,nodo);
		      cuadroDeCarga.style.marginTop = '80px';
		      //--------------------------------------------------------
		      var info={
		        codigo:UI.elementos.formulario.ventanaForm.registroId,
		        entidad:constructor.nombre,
		        operacion:'buscarRegistro',
		        modulo:constructor.modulo
		      };
		      torque.Busqueda(info,function(respuesta){
		        //guardo de forma local los datos para facil acceso
		        var data = respuesta.registros;
		        /*Actualizo en el objeto formulario la informacion recibida de manera que
		        si en un futuro cercano necesito consultar no debo salir del cliente para lo mismo*/
		        UI.elementos.formulario.ventanaForm.registroAct=data;
		        //guardo el objeto ventana formulario para mejor entendimiento y acceso rapido
		        var formulario = UI.elementos.formulario.ventanaForm;
		        var nombre;
		        if(constructor.campo_nombre){
		        	nombre = constructor.campo_nombre;
		        }else{
		        	nombre = 'nombre';
		        }
		        //inicializo los datos del titulo del formulario y la altura del mismo
		        var titulo = {
		          nombre: nombre,
		          valor:data.nombre
		        };
		        var altura = constructor.modificar.altura;
		        //monto la estructura basica sobre la cual se montan los campos a agregar
		        formulario.crearEstructuraBasicaModificar(titulo,altura);
		        //inicializo el arreglo con los campos a agregar
		        formulario.agregarCampos(constructor.modificar.campos);
		        UI.asignarValores(data,formulario);
		        //si se añadieron botones

						var agregar = ['eliminar'];
		        if(constructor.modificar.botones){
							agregar = agregar.concat(constructor.modificar.botones);
						}
						UI.elementos.botonera.agregarBotones(agregar);
		      });
		    },tiempo);
		  }
		};

		this.agregarSectorOperaciones = function(){
			var operaciones = document.createElement('section');
			operaciones.setAttribute('operaciones','');
			operaciones.innerHTML='<section contOp ></section>';
			this.nodo.appendChild(operaciones);
		};

		this.agregarSector = function(sector){
			var newSector = document.createElement('section');
			newSector.setAttribute('sector','');
			this.nodo.appendChild(newSector);
			//operaciones dependiendo de los datos
			if(sector.html){
				newSector.innerHTML = sector.html;
			}
			if(sector.division){
				newSector.classList.add('division');
			}
			return newSector;
		};

		this.validar = function(){
			funcionGuardar =(typeof(guardar)==='undefined')?UI.elementos.formulario.ventanaForm.guardarPorDefecto:guardar;
			var formulario = document.formNuevo;
			var data = [];
			var elemento;
			var validacion=false;
			for(var x=0;x<formulario.elements.length;x++){
				if((formulario.elements[x].type=='text')||(formulario.elements[x].type=='password')){
					if(formulario.elements[x].value===''){
						validacion=true;
					}
				}
				if(formulario.elements[x].type=='select-one'){
					if(formulario.elements[x].value=='-'){
						validacion=true;
					}
				}
				elemento = {nombre:formulario.elements[x].name,valor:formulario.elements[x].value};
				data.push(elemento);
			}
			if(!validacion){
				//guardo en base de datos
				funcionGuardar(data);
			}else{
				console.log('formulario no paso la validacion');
			}
		};

		this.guardarPorDefecto =  function(data){
			torque.guardar(torque.entidadActiva,data,function(respuesta){
				var nuevoSlot=UI.elementos.formulario.ventanaList.agregarSlot(respuesta.registros);

				//cambio al slot modificado
				nuevoSlot.firstChild.click();
			});
		};
	};

	/*------------------------------Objeto VentanaList-------------------------------------------------------------*/
	var VentanaList = function(entidadActiva){
		/*------------------------------Objeto Slot-------------------*/
		var Slot = function(data){
			this.atributos = data;
			this.estado = 'sinInicializar';
			this.rol = 'lista';
			this.nodo = null;

			this.construirNodo = function(nombre){
				var nodo = document.createElement('section');
				nodo.setAttribute('slot','');
				nodo.id=this.atributos.codigo;
				var html ="";
				var titulo;
				var campo_nombre;
				if(UI.buscarConstructor(entidadActiva)){
					campo_nombre = this.atributos[UI.buscarConstructor(entidadActiva).campo_nombre];
				}else{
					campo_nombre = this.atributos.nombre;
				}
				if(campo_nombre.length>28){
					titulo = campo_nombre.substr(0,28)+'...';
				}else{
					titulo = campo_nombre;
				}
				html+="<article  title>"+titulo+"</article>"+
					"<button type='button' btnEliminar></button>";
				nodo.innerHTML=html;
				this.nodo = nodo;
				this.estado='enUso';
				this.funcionamiento();
			};
			this.funcionamiento = function(){
				var nodo = this.nodo;
				var article =nodo.getElementsByTagName('article')[0];
				var btnEliminar = nodo.getElementsByTagName('button')[0];
				article.onclick=function(e){
					var formulario = UI.elementos.formulario;
					formulario.ventanaList.controlLista(this.parentNode);
					var newSelec = formulario.ventanaList.obtenerSeleccionado();
					var data = {
							tipo:'modificar',
							codigo:newSelec.atributos.codigo
						};
					formulario.construirUI(data);

					agregarRippleEvent(this.parentNode,e);
				};
				btnEliminar.onclick=function(){
					var slot = UI.elementos.formulario.ventanaList.buscarSlot({id:this.parentNode.id});
					if(slot.estado=='seleccionado'){
						var ventana = {
							tipo : 'error',
							cabecera : 'Error',
							cuerpo : 'No puede Eliminar un registro mientras este modificandolo'
						};
						UI.crearVentanaModal(ventana);
					}else{
						UI.elementos.formulario.eliminar(slot);
					}
				};
			};
			this.reconstruirNodo = function(){
				this.nodo.style.marginLeft="120%";
				var nodo=this.nodo;
				var slot=this;
				var titulo;
				if(UI.buscarConstructor(entidadActiva)){
					campo_nombre = this.atributos[UI.buscarConstructor(entidadActiva).campo_nombre];
				}else{
					campo_nombre = this.atributos.nombre;
				}
				if(campo_nombre.length>28){
					titulo = campo_nombre.substr(0,28)+'...';
				}else{
					titulo = campo_nombre;
				}
				var html="<article  title>"+titulo+"</article>"+
				"<button type='button' btnEliminar></button>";
				setTimeout(function(){
					nodo.innerHTML=html;
					slot.funcionamiento();
					UI.elementos.formulario.ventanaList.controlLista(nodo);
				},510);

			};
			this.destruirNodo = function(){
				var nodo = this.nodo;
				var slot = this;
				nodo.style.marginLeft="120%";
				nodo.style.marginBotton='0px';
				nodo.style.boxShadow='none';
				setTimeout(function(){
					nodo.style.height='0px';
					nodo.style.padding='0px';
				},510);
				setTimeout(function(){
					nodo.parentNode.removeChild(nodo);
					var indice = UI.elementos.formulario.ventanaList.Slots.indexOf(slot);
					UI.elementos.formulario.ventanaList.Slots.splice(indice,1);
				},1110);
			};
			this.activar = function(){
				this.nodo.getElementsByTagName('article')[0].click();
			};
			this.construirNodo();
		};
		/*--------------------------Fin Objeto Slot-------------------*/

		this.Slots = [];

		this.nodo = null;
		this.entidadActiva=entidadActiva;

		this.abrirCampoBusqueda = function(){
			var botonBusqueda = UI.elementos.formulario.ventanaList.nodo.getElementsByTagName('button')[1];
			var campoBusqueda=botonBusqueda.previousSibling;
			var titulo=campoBusqueda.previousSibling;

			titulo.style.padding='0px';
			titulo.style.width='0px';

			campoBusqueda.style.width='calc(100% - 70px)';
			campoBusqueda.style.height='40px';

			campoBusqueda.focus();
			setTimeout(function(){
				botonBusqueda.onclick=UI.elementos.formulario.ventanaList.buscarElementos;
			},10);
		};
		this.buscarElementos = function(){
			var formulario=UI.elementos.formulario;

			if(formulario.ventanaForm.estado!='sinConstruir'){
				formulario.ventanaForm.destruirNodo();
			}

			var botonBusqueda=formulario.ventanaList.nodo.getElementsByTagName('button')[1];
			var valorBusqueda=botonBusqueda.previousSibling.firstChild.value.toLowerCase();

			var registros=torque.registrosEntAct;
			var nuevosRegistros= [];
			var contRegEnc=0;
			for(var x=0; x<registros.length;x++){
				if(registros[x].nombre.toLowerCase().search(valorBusqueda)!=-1){
					contRegEnc++;
					formulario.ventanaList.buscarSlot(registros[x]).nodo.style.marginTop='0px';

					if(contRegEnc==1){
						formulario.ventanaList.buscarSlot(registros[x]).nodo.style.marginTop='51px';
					}

					formulario.ventanaList.buscarSlot(registros[x]).nodo.style.display='block';
				}else{
					formulario.ventanaList.buscarSlot(registros[x]).nodo.style.marginTop='0px';
					formulario.ventanaList.buscarSlot(registros[x]).nodo.style.display='none';
				}
			}
		};
		this.listarSlots = function(){
			console.log('Slots:');
			for(var x=0;x<this.Slots.length;x++){
				console.log('nombre: '+this.Slots[x].atributos.nombre+'\testado: '+this.Slots[x].estado);
			}
		};
		this.agregarSlot = function(data){
			var slot = new Slot(data);
			this.Slots.push(slot);
			this.nodo.appendChild(slot.nodo);
			return slot.nodo;
		};
		this.cargarRegistros = function(registros){
			for(var x=0; x<registros.length;x++){
				this.agregarSlot(registros[x]);
			}
		};
		this.controlLista = function(nodo){
			var obj=false;
			for(var x=0;x<this.Slots.length;x++){
				if(this.Slots[x].nodo==nodo){
					this.Slots[x].estado='seleccionado';
					this.Slots[x].nodo.style.marginLeft='20px';
					obj=this.Slots[x];
				}else{
					this.Slots[x].estado='enUso';
					this.Slots[x].nodo.style.marginLeft='0px';
				}
			}
		};
		this.buscarSlot = function(registro){
			for(x=0;x<this.Slots.length;x++){
				if(this.Slots[x].atributos.codigo==registro.codigo){
					return this.Slots[x];
				}
			}
			console.log('el slot no existe');
			return false;
		};
		this.buscarSlotPorNombre = function(registro){
			for(x=0;x<this.Slots.length;x++){
				if(this.Slots[x].atributos.nombre==registro.nombre){
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
					if(UI.buscarConstructor(entidadActiva)){
						campo_nombre = slot.atributos[UI.buscarConstructor(entidadActiva).campo_nombre];
					}else{
						campo_nombre = slot.atributos.nombre;
					}
					if(campo_nombre.length>28){
						titulo = campo_nombre.substr(0,28)+'...';
					}else{
						titulo = campo_nombre;
					}
					var html="<article  title>"+titulo+"</article>"+
					"<button type='button' btnEliminar></button>";
					nodo.innerHTML=html;
					slot.funcionamiento();
				}
			}else{
				for(var i=0;i<this.Slots.length;i++){
					var contenido="<article  title>"+this.Slots[i].atributos.nombre+"</article>";
					contenido+="<button type='button' btnEliminar></button>";
					this.Slots[i].nodo.innerHTML=contenido;
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
		this.actualizarSlot = function(registro){
			var slot=this.buscarSlot(registro);
			if(slot){
				slot.atributos=registro;
				slot.reconstruirNodo();
			}
		};this.obtenerSeleccionado = function(){
			var seleccionado=false;
			for(var x=0;x<this.Slots.length;x++){
				if(this.Slots[x].estado=='seleccionado'){
					seleccionado=this.Slots[x];
				}
			}
			return seleccionado;
		};
		this.construir = function(){
			var contenedor = obtenerContenedor();
			var elemento = document.createElement('div');
			elemento.setAttribute('capaList','');
			var html='';
			html+="<section busqueda>";
			html+=	"<div tituloForm>"+this.entidadActiva.toUpperCase()+"</div>";
			html+=	"<div listBuscar>";
			html+=		"<input type='text' placeHolder='Buscar...'campBusq>";
			html+=		"<button type='button' cerrarBusq></button>";
			html+=	"</div>";
			html+=	"<button type='button' btnBusq></button>";
			html+="</section>";
			elemento.innerHTML = html;
			this.nodo=elemento;

			var botonBusqueda=elemento.getElementsByTagName('button')[1];
			var botonCerrarBusq=elemento.getElementsByTagName('button')[0];

			botonBusqueda.onclick=this.abrirCampoBusqueda;

			botonCerrarBusq.onclick=function(){
				console.log('presiono Cerrar buscar');

				var botonBusqueda=UI.elementos.formulario.ventanaList.nodo.getElementsByTagName('button')[1];
				var campoBusqueda=this.parentNode;
				var titulo=campoBusqueda.previousSibling;

				titulo.style.padding='3px 3px 3px 30px';
				titulo.style.width='calc(100% - 103px)';

				campoBusqueda.style.width='0px';
				campoBusqueda.style.height='0px';
				campoBusqueda.firstChild.value='';

				botonBusqueda.click();
				UI.elementos.formulario.ventanaList.controlLista();

				setTimeout(function(){
					botonBusqueda.onclick=UI.elementos.formulario.ventanaList.abrirCampoBusqueda;
				},20);
			};
			contenedor.insertBefore(elemento,document.getElementById('menu').nextSibling);
			this.estado='enUso';
			//declaro la variable para usarla dentro del intervalo
			var ventanaForm=this;
			//------------Cuadro Carga-------------------------------
			var infoCuadro = {
				nombre: 'cargaVentanaList',
				mensaje:'Buscando',
				contenedor:this.nodo
			};
			var cuadroDeCarga=UI.iniciarCarga(infoCuadro,function(){
				if(torque.registrosEntAct!==null){
					UI.buscarCuadroCarga('cargaVentanaList').terminarCarga();
					ventanaForm.cargarRegistros(torque.registrosEntAct);
				}
			});
			cuadroDeCarga.style.marginTop='80px';
			//------------Cuadro Carga-------------------------------
		};
		this.construir();
	};
	/*--------------------------Fin Objeto VentanaList-----------------------------------*/
	this.entidadActiva = atributos.entidad;
	this.atributos = atributos;
	this.ventanaList = new VentanaList(this.entidadActiva);
	this.ventanaForm = new VentanaForm(atributos);

	this.estado = 'sinInicializar';

	this.interval=null;

	//metodo para hacer el objeto ventana form capaz de recibir funciones en forma de herencia
	this.ventanaForm.prototype = VentanaForm.prototype;
	this.ventanaForm.prototype.constructor = this.ventanaForm;
	//-----------------------------Metodos----------------------------------------------

	this.construirVentanaForm=function(data){
		this.ventanaForm.registroId=data.codigo;
		this.ventanaForm.construirNodo(data);
	};

	this.validarCombo = function(valoresNoPermitidos,lista){
		normalizarNodo(lista);
		for(var i=0;i<lista.length;i++){
			lista[i].style.display='block';
		}
		for(var x=0;x<lista.length;x++){
			for(var y=0;y<valoresNoPermitidos.length;y++){
				if(lista[x].value==valoresNoPermitidos[y]){
					lista.removeChild(lista[x]);
					x--;
				}
			}
		}
		if(lista.length==1){
			lista.options[0].textContent='No Posee Valores Disponibles';
			lista.options[0].value='cerrar';
		}
	};
	this.abrirtooltipInput = function(event){
		var parent = this;
		var input = parent.firstChild;
		while(input.nodeName=='#text'){
			input=input.nextSibling;
		}
		if(input.value!==''){
			this.interval=setTimeout(function(){
				parent.style.zIndex='4';
				var tooltip = document.createElement('div');
				tooltip.textContent=input.value;
				tooltip.setAttribute('tooltip','');
				parent.appendChild(tooltip);
				setTimeout(function(){
					tooltip.style.opacity=1;
					tooltip.style.top=40+'px';
					tooltip.style.transform='scale(1)';
				},10);
			},1000);
		}

	};
	this.cerrartooltipInput = function(event){
		var parent = this;
		var input = parent.firstChild;
		while(input.nodeName=='#text'){
			input=input.nextSibling;
		}
		if(this.interval!==null){
			clearInterval(this.interval);
			this.interval=null;
			if(parent.lastChild.nodeName.toLowerCase()=='div'){
				if(parent.lastChild.getAttribute('tooltip')!==null){
					var tooltip=parent.lastChild;
						tooltip.style.opacity=0;
						tooltip.style.top='-20px';
						tooltip.style.transform='scale(0)';
					setTimeout(function(){
						parent.style.zIndex=null;
						parent.removeChild(parent.lastChild);
					},310);
				}
			}
		}
	};
	//------------------------------------Funciones Operacionales de Formulario-----------------------------------
	this.eliminar = function(slot){
		if(slot instanceof MouseEvent){
			var registro =torque.buscarRegistro(UI.elementos.formulario.ventanaForm.registroId,torque.entidadActiva);
			slot = UI.elementos.formulario.ventanaList.buscarSlot(registro);
		}
		var verificacion = {
			tipo : 'advertencia',
			cabecera : 'Advertencia',
			cuerpo : '¿Desea eliminar '+slot.atributos.nombre+' ?',
			pie : '<section modalButtons>'+
						'<button type="button" cancelar id="modalButtonCancelar"></button>'+
						'<button type="button" aceptar registro="'+slot.atributos.codigo+'" id="modalButtonAceptar"></button>'+
					'</section>'
		};

		UI.crearVentanaModal(verificacion);

		var btnAceptar = document.getElementById('modalButtonAceptar');
		var btnCancelar = document.getElementById('modalButtonCancelar');

		btnCancelar.onclick=function(){
			UI.elementos.modalWindow.eliminarUltimaCapa();
		};
		btnAceptar.onclick=function(){

			var slot = UI.elementos.formulario.ventanaList.buscarSlot({codigo:this.getAttribute('registro')});
			var nodo = slot.nodo;

			UI.elementos.modalWindow.eliminarUltimaCapa();
			torque.eliminar(registro,torque.entidadActiva);

			slot.destruirNodo();
		};
	};
	//-------------------------------------Manejo de UI-----------------------------------------------------------
	this.agregarVentanaForm = function(){
		this.ventanaForm.estado='agregado';
		this.ventanaList.nodo.parentNode.insertBefore(this.ventanaForm.nodo,this.ventanaList.nodo.nextSibling);
	};
	this.construirUI = function(data){
		var existeVentana=(this.ventanaForm.estado=='agregado')?true:false;
		if(existeVentana){
			if(data.tipo=='modificar'){
				this.ventanaForm.tipo='modificar';
				this.ventanaForm.registroId=data.codigo;
			}else if(data.tipo=='nuevo'){
				this.ventanaForm.tipo='nuevo';
				this.ventanaForm.registroId='';
			}
			if(this.ventanaForm.atributos.usoConstructor){
				this.ventanaForm.iniciarConstructor();
			}else{
				this.ventanaForm.reconstruirUI();
			}
		}else{
			this.construirVentanaForm(data);
			this.agregarVentanaForm();
		}
	};
};

/*----------------------------------------------------------------------------------------------------*/
/*--------------------------------------------Objeto Ventana Modal------------------------------------*/
/*----------------------------------------------------------------------------------------------------*/
var modalWindow = function(){

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
				this.nodo.classList.add(tipo);
				var icono;
				switch(tipo){
					case 'error':
						icono = UI.crearIcono({
							nombre:'error',
							tamano: 48,
							color: 'white',
							inactivo: false
						});
						this.nodo.appendChild(icono);
						break;

					case 'advertencia':
						icono = UI.crearIcono({
							nombre:'warning',
							tamano: 48,
							color: 'white',
							inactivo: false
						});
						this.nodo.appendChild(icono);
						break;

					case 'informacion':
						icono = UI.crearIcono({
							nombre:'info_outline',
							tamano: 48,
							color: 'white',
							inactivo: false
						});
						this.nodo.appendChild(icono);
						break;

					default:
						console.log('no existe icono para'+tipo);
						break;
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
				if(porConstruir.campos){
					this.agregarCampos(porConstruir.campos);
				}
				if(porConstruir.html){
					this.nodo.innerHTML = porConstruir.html;
				}
				if(porConstruir.alto){
					this.nodo.style.height = porConstruir.alto + 'px';
				}
				if(porConstruir.clase){
					this.nodo.classList.add(porConstruir.clase);
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
					case 'cabecera':
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
				this.partes.cabecera.agregarTipo(mensaje.nombre_tipo.toLowerCase());

				//this.partes.cabecera.nodo.textContent = mensaje.titulo;
			}

			//cambio el cuerpo
			this.partes.cuerpo.nodo.innerHTML=mensaje.cuerpo;
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
		var capa=this.obtenerUltimaCapa();
		var cont=0;
		while((capa.tipo!='contenido')||(cont==6)){
			capa=capa.previousSibling;
		}
		return capa;
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
		this.manejoDeClases();
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
	this.manejoDeClases = function(){
		this.eliminarClasesRepetidas();
		for (var i = 0; i < this.clases.length; i++) {
			this.nodo.classList.add(this.clases[i]);
		}
	};
	this.eliminarClasesRepetidas = function(){
		var clasesValidadas = [];
		var existe;
		for (var i = 0; i < this.clases.length; i++) {
			existe = false;
			for (var x = 0; x < clasesValidadas.length; x++) {
				if(clasesValidadas[x]==this.clases[i]){
					existe = true;
				}
			}
			if(!existe){
				clasesValidadas.push(this.clases[i]);
			}
		}
		this.clases = clasesValidadas;
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
/*-----------------------------------------Objeto Constructor-----------------------------------------*/
/*----------------------------------------------------------------------------------------------------*/
var Arquitecto = function(){

	this.elementos = [];

	this.estado = 'sinInicializar';

	this.configure = function(objetoInicializar){
		objetoInicializar = objetoInicializar || {};
		this.elementos = {
			 menu : new Menu(),
			 cabecera : new Cabecera(),
			 URL: new URL(),
			 formulario : 'noPosee',
			 botonera : 'noPosee',
			 constructores: this.elementos.constructores
		};
		if(objetoInicializar.formulario){
			this.elementos.formulario = new Formulario(objetoInicializar.formulario);
		}

		if(objetoInicializar.botonera){
			this.elementos.botonera = new Botonera(objetoInicializar.botonera.botones);
		}


		this.estado='inicializado';
		var mql = window.matchMedia("(max-width: 1000px)");
		mql.addListener(handleMediaChange);
		handleMediaChange(mql);
		document.body.onmousedown=this.activarEfecto;
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
		nuevaLista.atributos.nombre = nuevaLista.atributos.titulo;
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
//------------------------- Manejo de Campos en interfaz ----------------------------
	//funcion para agregar de forma dinamica campos a la interfaz
	this.agregarCampo = function(campo,contenedor){
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
			case 'campoedicion':
				campoNuevo = new CampoEdicion(campo.parametros);
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
		contenedor.appendChild(campoNuevo.nodo);
		return campoNuevo;
	};
	//funcion con la cual puedo agregar mas de un campo de forma dinamica a la interfaz
	this.agregarCampos = function(campos,contenedor){
		for(var x=0;x<campos.length;x++){
			this.agregarCampo(campos[x],contenedor);
		}
	};
	//con esta funcion asigno los valores a los campos edicion que contenga un contenedor
	this.asignarValores = function(registro,contenedor){
		var campos = contenedor.campos;
		for (var campo in registro) {
			if (registro.hasOwnProperty(campo)) {
				for(var y = 0; y < campos.length; y++){
					if(campos[y].data.nombre == campo){
						campos[y].asignarValor(registro[campo]);
					}
				}
			}
		}
	};
	//funcion solo se utiliza para formularios de modificacion(update)
	this.modificar = function(contenedor){
		var Reg = [];
		var campos = contenedor.campos;
		for (var i = 0; i < campos.length; i++) {
			Reg.push({
				nombre:campos[i].captarNombre(),
				valor:campos[i].captarValor()
			});
			if(campos[i].estado === 'editando'){
				campos[i].finalizarEdicion();
			}else{
				campos[i].activarEdicion();
			}
		}
		return Reg;
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
};
/*---------------Objetos de interfaz---------------------------------------------*/
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

		this.construirNodo = function(){

			var nodo = document.createElement('section');
			nodo.setAttribute(this.atributos.tipo,'');

			if(atributos.html){
				nodo.innerHTML = atributos.html;
			}

			if(atributos.campos){
				nodo.style.paddingTop='30px';
				UI.agregarCampos(atributos.campos,nodo);
			}

			if(atributos.alto){
				nodo.style.height=atributos.alto+'px';
			}

			this.nodo = nodo;
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

	this.agregarTitulo = function(atributos){
		var titulo = new Titulo(atributos);
		this.nodo.appendChild(titulo.nodo);
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
		info.usaTitulo = info.usaTitulo || true;
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
	this.construirNodo();
};
//-----------------------------Objeto Radio----------------------------
var Radio = function(info){
	//nombre,opciones,seleccionado
	this.data = info;
	this.estado = 'porConstriur';
	this.nodo = null;

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
		this.nodo.appendChild(nodoOpcion);
	};
	this.agregarOpciones = function(){
		for(var x=0; x<this.data.opciones.length;x++){
			this.agregarOpcion(this.data.opciones[x]);
		}
	};

	this.captarValor = function(){
		var valor = (this.nodo.querySelector('radio').value==='')?null:this.nodo.querySelector('radio').value;
		return valor;
	};
	this.captarNombre = function(){
		return this.nodo.querySelector('radio').name;
	};
	this.captarRequerido = function(){
		return this.atributos.requerido;
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
	this.nodo = null;

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
		select.setAttribute('tabindex','-1');
		select.name=this.data.nombre;
		if(this.data.id!==undefined){
			select.id=this.data.id;
		}

		nodo.appendChild(select);

		this.nodo=nodo;
		if(this.data.titulo){
			//creo la primera opcion
			var opcion = {
				codigo : '-',
				nombre : 'Elija un '+this.data.titulo
			};
			this.agregarOpcion(opcion);
		}

		//genero y asigno el resto de las opciones
		this.agregarOpciones(this.data.opciones);
		this.estado='enUso';
	};
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
	this.deshabilitar = function(){
		var article = this.nodo.querySelector('article');
		article.onclick = function(){};
	};
	this.habilitar = function(){
		var article = this.nodo.querySelector('article');
		article.onclick = function(){
			construirCapaSelect(this);
		};
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
			this.nodo.onmouseover=UI.elementos.formulario.abrirtooltipInput;
			this.nodo.onmouseout=UI.elementos.formulario.cerrartooltipInput;
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
	this.construir();
};
//-------------------- Campo Edicion----------------------------------------------------------
var CampoEdicion = function(info){

	this.data =  info;
	this.nodo = null;
	this.tipo = info.tipo || 'simple';
	this.data.valor = info.valor || '';
	this.estado = 'mostrando';

	this.construirNodo = function(){
		var nodo =  null;
		var campo = '';
		var html = '';
		if(this.tipo.toLowerCase() === 'titulo'){
 			nodo = document.createElement('section');
 			nodo.setAttribute('titulo','');
 			nodo.setAttribute('area','');
 			html = "<div cont>"+
						"<textarea  name='"+this.data.nombre+"'></textarea>"+
						"<div display>"+this.data.valor+"</div>"+
					"</div>"+
					"<article update='campo'></article>";
		}else{
			nodo = document.createElement('div');
			nodo.setAttribute('formUpdate','');
			if(this.tipo=='simple'){
				campo+="<input  type='text' edit name='"+this.data.nombre+"'>";
			}else if(this.tipo=='area'){
				campo+="<textarea name='"+this.data.nombre+"'></textarea>";
				nodo.setAttribute('area','');
			}
			html+="<label>"+this.data.titulo+"</label>";
			html+="<div clear></div>";
			html+="<div cont>";
			html+=	campo;
			html+=	"<div display>"+this.data.valor+"</div>";
			html+="</div>";
		}
		nodo.innerHTML=html;
		this.nodo=nodo;
	};
	this.asignarValor = function(valor){
		this.data.valor = valor;
		this.nodo.querySelector('div[display]').textContent = valor;
	};
	this.activarEdicion = function(){
		this.nodo.classList.add('edicion');
		//contenedor
		var contenedorEdit = this.nodo.querySelector('div[cont]');
		//campo donde se muestra el valor del campo pero de solo lectura
		var display = contenedorEdit.querySelector('div[display]');
		//campo donde se edita la informacion
		var campoEdit = null;
		if(this.tipo === 'simple'){
			campoEdit = contenedorEdit.querySelector('input');
		}else{
			campoEdit = contenedorEdit.querySelector('textarea');
		}
		campoEdit.value = display.textContent;
		campoEdit.focus();
		this.estado = 'editando';
		if(this.tipo === 'titulo'){
			this.nodo.querySelector('article[update]').classList.add('edicion');
		}
	};
	this.finalizarEdicion = function(){
		this.nodo.classList.remove('edicion');
		//contenedor
		var contenedorEdit = this.nodo.querySelector('div[cont]');
		//campo donde se muestra el valor del campo pero de solo lectura
		var display = contenedorEdit.querySelector('div[display]');
		//campo donde se edita la informacion
		var campoEdit = null;
		if(this.tipo === 'simple'){
			campoEdit = contenedorEdit.querySelector('input');
		}else{
			campoEdit = contenedorEdit.querySelector('textarea');
		}
		display.textContent = campoEdit.value;
		this.estado = 'mostrando';
		if(this.tipo === 'titulo'){
			this.nodo.querySelector('article[update]').classList.remove('edicion');
		}
	};
	this.captarValor = function(){
		if(this.estado === 'mostrando'){
			return this.nodo.querySelector('div[display]').textContent;
		}else{
			if(this.tipo === 'simple'){
				return this.nodo.querySelector('input').value;
			}else{
				return this.nodo.querySelector('textarea').value;
			}
		}
	};
	this.captarNombre = function(){
		return this.data.nombre;
	};
	this.construirNodo();
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
