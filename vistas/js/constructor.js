/*---------------------MEDIA QUERY CHANGES-----------------------------------*/
var handleMediaChange = function (mediaQueryList) {
	if(interfaz.estado=='inicializado'){
		var formulario = interfaz.elementos.formulario;
		if(formulario.ventanaForm!==undefined){
			if(formulario.ventanaForm.nodo!==undefined){
				if (mediaQueryList.matches) {
			    	//cambio interfaz Ventana Form
			        formulario.ventanaForm.nodo.style.width=(formulario.ventanaForm)?'calc(85%)':null;
			        formulario.ventanaForm.nodo.style.marginLeft=(formulario.ventanaForm)?'50px':null;
			        formulario.cambiarTextoSlots('completa');
			    }
			    else {
			    	//cambio interfaz Ventana Form
			        formulario.ventanaForm.nodo.style.width=(formulario.ventanaForm)?'600px':null;
			        formulario.ventanaForm.nodo.style.marginLeft=(formulario.ventanaForm)?'30px':null;
			        formulario.cambiarTextoSlots('mediaQuery');
			    }
			}else{
				if (mediaQueryList.matches) {
					formulario.cambiarTextoSlots('completa');
				}else{
					formulario.cambiarTextoSlots('mediaQuery');
				}
			}
		}
	}
}
/*-------------------------Objeto Botonera ----------------------------------------*/
var Botonera = function(estructura){
	
	var Boton = function(tipo){
		this.tipo = tipo.toLowerCase();
		this.nodo;
		this.estado = 'porConstruir';

		this.construirNodo = function(){
			var nodo = document.createElement('button');
			nodo.setAttribute('type','button');
			switch(this.tipo){
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
				case 'listar':
					nodo.setAttribute('btnListar','');
				break;
				case 'redactar':
					nodo.setAttribute('btnRedactar','');
				break;
				case 'guardar':
					nodo.setAttribute('btnGuardar','');
					nodo.onclick=guardar;
				break;
			}
			this.nodo = nodo;
			this.estado = 'enUso';
		}
		this.construirNodo();
	}

	this.estructura = estructura;
	this.estado = 'porConstruir';
	this.nodo;

	this.botones = new Array(); 
	this.construir = function(){
		var contenedor = obtenerContenedor();
		var nodo = document.createElement('div');
		nodo.setAttribute('botonera','');
		contenedor.parentNode.insertBefore(nodo,contenedor.nextSibling);
		this.nodo = nodo;
		this.inicializarBotones();
		//boton buscar
		this.buscarBoton('nuevo').nodo.onclick=function(){
			console.log('presiono Nuevo');
			var data = {
				tipo:'nuevo'
			}
			var formulario = interfaz.elementos.formulario;
			formulario.construirInterfaz(data);
		}
		//boton nuevo
		this.buscarBoton('buscar').nodo.onclick=function(){
			interfaz.elementos.formulario.nodo.firstChild.getElementsByTagName('button')[1].click();
		}
	}
	this.inicializarBotones = function(){
		var botones = this.estructura;
		for(var x = 0; x < botones.length; x++){
			this.agregarBoton(botones[x]);
		}
		this.agregarEfectos();
	}
	this.agregarBoton = function(tipo){
		var botonera = this.nodo;
		var existe = false;
		for(var x=0;x<this.botones.length;x++){
			if(this.botones[x].tipo==tipo.toLowerCase()){
				existe=true;
				console.log('el boton '+tipo+' ya existe');
			}
		}
		if(!existe){

			var boton = new Boton(tipo);
			botonera.appendChild(boton.nodo);
			//esta parte es solo para cuando se agrega un boton en un momento posterior a la inicializacion
			if(this.buscarBoton('abrir')!=-1){
				if(this.buscarBoton('abrir').nodo.getAttribute('estado')=='visible'){
					setTimeout(function(){
						var top=this.botones.length*45;
						boton.nodo.style.top='-'+top+'px';
					},10);
				}
			}
			this.botones.push(boton);
		}
	}
	this.agregarEfectos = function(){
		var botones = this.botones;
		if(botones.length>1){
			if(!this.buscarBoton('abrir')){
				console.log('no se encuentra el boton de apertura')
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
						for(var x = 0; x < botones.length; x++){
							if(botones[x].tipo!='abrir'){
								botones[x].nodo.style.top = 0+'px';
							}
						}
					}
				}
			}	
		}	
	}
	this.buscarBoton = function(tipo){
		var botones = this.botones;
		for(var x = 0; x < botones.length; x++){
			if(botones[x].tipo==tipo){
				return botones[x];
			}
		}
		return -1;
	}
	this.listarBotones = function(){
		var lista = this.botones;
		var resultado = 'estos son los botones agregados:\n';
		for( var x = 0; x < lista.length; x++){
			resultado += '\t'+lista[x].tipo+'\n';
		}
		console.log(resultado);
	}
	this.getEstado = function(){
		console.log(this.estado);
	}
	this.quitarBoton = function(tipo){
		var eliminar=this.buscarBoton(tipo);
		if(eliminar!=-1){
			eliminar.nodo.style.top='0px';
			setTimeout(function(){
				eliminar.nodo.parentNode.removeChild(eliminar.nodo);
			},510);
			this.botones.splice(this.botones.indexOf(eliminar),1);
		};
		
	}
	this.construir();
}
/*-------------------------Objeto Menu ----------------------------------------*/
var Menu = function(){

	var elemento = function(tipo,contenido,enlace){
		enlace = enlace || '#';
		this.id = '';
		this.estado = 'porConstriur';
		this.contenido = contenido;
		this.nodo;
		this.tipo = tipo;
		this.enlace = enlace;

		this.construirNodo = function(){
			var nodo = document.createElement('section');
			nodo.innerHTML = contenido;
			if(this.tipo=='titulo'){
				nodo.setAttribute('titulo','');
			}
			if(this.enlace!='#'){
				nodo.setAttribute('enlace',this.enlace);
				nodo.onclick=function(){
					location.href=this.getAttribute('enlace');
				}
			}
			this.nodo = nodo;
		}
		this.agregarId = function(id){
			this.nodo.setAttribute('elemId',id);
			this.id = id;
		}
		this.construirNodo();

	}
	this.estado = 'porConstriur';
	this.componentes = new Array();
	//nodo de DOM
	this.nodo;
	//contador de elementos agregados
	this.contE=0;

	this.construir = function(){
		var contenedor = obtenerContenedor();
		var nodo = document.createElement('div');
		nodo.setAttribute('capaMenu','');
		nodo.setAttribute('estado','oculto');
		nodo.id = 'menu';
		contenedor.insertBefore(nodo,contenedor.firstChild);
		this.nodo = nodo;
		this.estado='enUso';
	}
	this.buscarCompornentesPorTexto = function(texto){
		var lista = this.componentes;
		var resultado = new Array();
		for(var x = 0;x < lista.length; x++){
			if(lista[x].textContent==texto){
				resultado.push(lista[x]);
			}
		}
		return resultado;
	}
	this.buscarComponente = function(idNum){
		var lista = this.componentes;
		for(var x = 0;x < lista.length; x++){
			if(lista[x].id=='menuElem'+idNum){
				return lista[x];
			}
		}
		return -1;
	}
	this.agregarComponente = function(tipo,contenido,enlace){
		var menu = this.nodo;
		var nuevoComponente = new elemento(tipo,contenido,enlace);
		nuevoComponente.agregarId('menuElem'+this.contE);
		this.contE++;
		this.componentes.push(nuevoComponente);
		menu.appendChild(nuevoComponente.nodo);
	}
	this.removerComponente = function(idNum){
		var componente = this.buscarComponente(idNum);
		if(componente==-1){
			console.log('componente '+idNum+' no existe');
		}else{
			componente.nodo.parentNode.removeChild(componente.nodo);
			this.componentes.splice(this.componentes.indexOf(componente),1);
		}
	}
	this.listarComponentes = function(){
		var lista = this.componentes;
		var resultado = 'los elementos presentes son:\n';
		for(var x = 0;x < lista.length; x++){
			resultado += '\t'+lista[x].id+'\n';
		}
		console.log(resultado);
	}
	this.getEstado = function(){
		return this.estado;
	}
	this.abrirMenu = function(){
		var btnMenu = document.getElementById('menuBtn');
		btnMenu.click();
	}
	this.construir();
}
/*-------------------------Objeto Cabecera ----------------------------------------*/
var Cabecera = function(){

	this.estado = 'porConstriur';

	this.construir = function(){
		var contenedor = obtenerContenedor();
		var elemento = document.createElement('div');
		elemento.setAttribute('cabecera','');
		elemento.innerHTML = "<button type='button' menuBtn id='menuBtn'></button><div titulo>SOCA-PORTUGUESA</div>"; 
		contenedor.insertBefore(elemento,contenedor.firstChild);
		//funcionamiento boton
		var botonMenu=document.getElementById('menuBtn');
		botonMenu.onclick=function(){
			var menu = document.getElementById('menu');
			if(menu.getAttribute('estado')=='visible'){
				menu.style.marginLeft='-250px';
				menu.setAttribute('estado','oculto');
			}else if(menu.getAttribute('estado')=='oculto'){
				menu.style.marginLeft='0px';
				menu.setAttribute('estado','visible');
			}
		}
		this.estado='enUso';
	}
	this.construir();
}
/*------------------------------Objeto Formulario(lista)-----------------*/
var Formulario = function(entidad){

	//----------------------------------Objeto Ventana Formulario-------------------
	var VentanaForm = function(){

		this.tipo = 'noPosee';

		this.nodo;

		this.estado = 'sinConstruir';

		//este es usado cuando se va a editar un registro en especifico
		this.registroId='';

		this.construirNodo = function(data){
			var nodo = document.createElement('div');
			nodo.setAttribute('capaForm','');
			nodo.id='VentanaForm';
			this.tipo=data.tipo;
			this.nodo=nodo;
			if(data.tipo=='modificar'){
				this.registroId=data.id;
			}else if(data.tipo=='nuevo'){
				this.registroId='';
			}
			this.reconstruirInterfaz();
		};
		this.destruirNodo = function(){
			if(this.registroId!=''){
				this.registroId='';
				interfaz.elementos.formulario.controlLista();
			}
			this.nodo.style.height='0px';
			setTimeout(function(){
				var vf=interfaz.elementos.formulario.ventanaForm;
				vf.nodo.parentNode.removeChild(vf.nodo);
				vf.estado='sinConstruir';
			},510);
		};
		this.edicion=function(){
			var nodo=this;
			var campo=this.previousSibling;
			var campoEdicion=campo.previousSibling;
			var contenedor=nodo.parentNode;
			
			contenedor.style.maxHeight='1000px';

			campoEdicion.value=campo.textContent;
			campoEdicion.style.display='inline-block';

			campo.style.width=window.getComputedStyle(campo,null).getPropertyValue("width");
			campo.style.maxHeight=window.getComputedStyle(campo,null).getPropertyValue("height");
			nodo.classList.toggle('edicion');

			setTimeout(function(){
				campo.style.width='0px';
				campo.style.opacity='0';

				campoEdicion.style.width='calc(100% - 62px)';
				campoEdicion.style.opacity='1';
				if(nodo.getAttribute('update')=='campo'){
					campoEdicion.style.height="32px";
				}else if(nodo.getAttribute('update')=='area'){
					campoEdicion.style.height="40px";
					campoEdicion.style.padding='5px';
				}
			},10);
			setTimeout(function(){
				nodo.onclick=interfaz.elementos.formulario.ventanaForm.finEdicion;
				if(nodo.getAttribute('update')=='area'){
					campoEdicion.style.height="150px";
					campoEdicion.style.padding="15px";
				}
			},520);
			setTimeout(function(){
				campoEdicion.focus();
			},1010);

		};
		this.finEdicion = function(){
			var nodo=this;
			var campo=this.previousSibling;
			var campoEdicion=campo.previousSibling;
			var contenedor=nodo.parentNode;

			contenedor.style.maxHeight='150px';

			var id=interfaz.elementos.formulario.ventanaForm.registroId;
			var nombreCampo=campoEdicion.name;
			var valorCampo=campoEdicion.value;

			console.log('se disparo una edicion con id:'+interfaz.elementos.formulario.ventanaForm.registroId+' en campo:'+campoEdicion.name);
			var registro=torque.editarCampo(id,nombreCampo,valorCampo);
			interfaz.elementos.formulario.actualizarLista(registro);

			campo.textContent=campoEdicion.value;
			
			nodo.classList.toggle('edicion');
			campo.style.width='calc(100% - 62px)';
			campo.style.opacity='1';

			campoEdicion.style.width='0px';
			campoEdicion.style.opacity='0';
			campoEdicion.style.height='0px';
			setTimeout(function(){
				campoEdicion.style.width='auto';
				campoEdicion.style.display='none';
				nodo.onclick=interfaz.elementos.formulario.ventanaForm.edicion;
				campoEdicion.style.width=window.getComputedStyle(campoEdicion,null).getPropertyValue("width");
				campo.style.width=campoEdicion.style.width;
				campoEdicion.style.width='0px';
				campoEdicion.value='';
			},510)
		};
		/*----------------------------------Funciones del Objeto Select-------------------------------*/
		this.construirCapaSelect= function(capaSelect){
			capaSelect.onclick=function(){};
			var opciones= new Array();
			var opcion;
			var nodo;
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
				}

				nodo=document.createElement('div');
				nodo.setAttribute('option','');
				nodo.textContent=opcion.nombre;
				if(select.options[x]==select.options[select.selectedIndex]){
					nodo.setAttribute('selecionado','');
					margen='-'+parseInt(opciones.length*41)+'px';
					capaSelect.style.marginTop=margen;
					console.log(margen);
				}
				
				nodo.style.transition='all '+parseInt(opciones.length*0.2)+'s ease-in-out';
				nodo.style.marginTop=parseInt(opciones.length*41)+'px';
				
				nodo.setAttribute('valor',opcion.value);
				nodo.onclick= function(e){
					//agrego el efecto Ripple
					interfaz.elementos.formulario.agregarRippleEvent(this,e);
					var select = this.parentNode.nextSibling;
					while(select.nodeName=='#text'){
						select=select.nextSibling;
					}
					select.value=this.getAttribute('valor');
					interfaz.elementos.formulario.ventanaForm.destruirCapaSelect(this.parentNode);
				}
				opcion.nodo=nodo;
				opciones.push(opcion);
				capaSelect.appendChild(nodo);
			}

			//creo el contenedor de las opciones
			capaSelect.style.opacity='1';
			capaSelect.style.height=parseInt(opciones.length*41)+'px';
			capaSelect.style.width='60px'

		};
		this.destruirCapaSelect = function(capaSelect){
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
					interfaz.elementos.formulario.ventanaForm.construirCapaSelect(this);
				}
			},300)
			
		}
		/*----------------------------------Funciones del Objeto Select-------------------------------*/
	}
	/*------------------------------Objeto VentanaForm------------*/
	/*------------------------------Objeto Slot-------------------*/
	var Slot = function(data){

		this.atributos = data;

		this.estado = 'sinInicializar';

		this.rol = 'lista';

		this.nodo;

		this.construirNodo = function(nombre){
			var nodo = document.createElement('section');
			nodo.setAttribute('slot','');
			nodo.id=this.atributos.id;
			var html ="";
			var titulo;
			if(this.atributos.nombre.length>28){
				titulo=this.atributos.nombre.substr(0,28)+'...';
			}else{
				titulo=this.atributos.nombre;
			}
			html+="<article  title>"+titulo+"</article>\
				<button type='button' btnEliminar></button>";
			nodo.innerHTML=html;
			this.nodo = nodo;
			this.estado='enUso';
			this.funcionamiento();
		}
		this.funcionamiento = function(){
			var nodo = this.nodo;
			var article =nodo.getElementsByTagName('article')[0];
			article.onclick=function(e){
				var formulario = interfaz.elementos.formulario;
				formulario.controlLista(this.parentNode);
				var newSelec = formulario.obtenerSeleccionado();
				var data = {
						tipo:'modificar',
						id:newSelec.atributos.id
					}
				formulario.construirInterfaz(data);
				
				formulario.agregarRippleEvent(this.parentNode,e);
				
			}
		}
		this.reconstruirNodo = function(){
			this.nodo.style.marginLeft="120%";
			var nodo=this.nodo;
			var slot=this;
			var titulo;
			if(this.atributos.nombre.length>28){
				titulo=this.atributos.nombre.substr(0,28)+'...';
			}else{
				titulo=this.atributos.nombre;
			}
			var html="<article  title>"+titulo+"</article>\
			<button type='button' btnEliminar></button>";
			setTimeout(function(){
				nodo.innerHTML=html;
				slot.funcionamiento();
				console.log(slot.estado);
				interfaz.elementos.formulario.controlLista(nodo);
			},510);
			
		}
		this.construirNodo();
	}
	/*--------------------------Fin Objeto Slot-------------------*/
	this.Slots = new Array();

	this.ventanaForm = new VentanaForm();

	this.estado = 'sinInicializar';

	this.entidadActiva=entidad;

	this.nodo;
	
	//metodo para hacer el objeto ventana form capaz de recibir funciones en forma de herencia
	this.ventanaForm.prototype = VentanaForm.prototype;
	this.ventanaForm.prototype.constructor = this.ventanaForm;
	//----------------------------------------------------------------------------------------

	//---------------------------Ink Event------------------------
	this.agregarRippleEvent= function(parent,evento){
		var html;
		var ink;
		//se crea el elemento si no existe
		if(parent.getElementsByTagName('div')[0]===undefined){
			ink=document.createElement('div');
			ink.classList.toggle('ink')
			parent.insertBefore(ink,parent.firstChild);
		}
		ink=parent.getElementsByTagName('div')[0];

		//en caso de doble click rapido remuevo la clase 
		ink.classList.remove('animated');

		//guardo todo el estilo del elemento 
		var style = window.getComputedStyle(ink);

		//se guardan los valores de akto y ancho
		if(parseInt(style.height.substring(0,style.height.length-2))==0 && parseInt(style.width.substring(0,style.width.length-2))==0){
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
		}
		//re evaluo los valores de alto y ancho del ink
		style = window.getComputedStyle(ink);

		//ubico el lugar donde se dispara el click
		var x=evento.pageX - parent.offset.left - parseInt(style.width.substring(0,style.width.length-2))/2
		var y=evento.pageY - parent.offset.top - parseInt(style.height.substring(0,style.height.length-2))/2
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
	this.listarSlots = function(){
		console.log('Slots:');
		for(var x=0;x<this.Slots.length;x++){
			console.log('nombre: '+this.Slots[x].atributos.nombre+'\testado: '+this.Slots[x].estado);
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

		botonBusqueda.onclick=function(){
			console.log('presiono buscar');
			var campoBusqueda=this.previousSibling;
			var titulo=campoBusqueda.previousSibling;

			titulo.style.padding='0px';
			titulo.style.width='0px';

			campoBusqueda.style.width='calc(100% - 70px)';
			campoBusqueda.style.height='40px';

			campoBusqueda.focus();

		}
		botonCerrarBusq.onclick=function(){
			console.log('presiono Cerrar buscar');

			var campoBusqueda=this.parentNode;
			var titulo=campoBusqueda.previousSibling;

			titulo.style.padding='3px 3px 3px 30px';
			titulo.style.width='calc(100% - 103px)';

			campoBusqueda.style.width='0px';
			campoBusqueda.style.height='0px';

		}
		contenedor.insertBefore(elemento,document.getElementById('menu').nextSibling);
		this.estado='enUso';
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
	this.construirVentanaForm=function(tipo){
		this.ventanaForm.construirNodo(tipo);
	};
	this.controlLista = function(nodo){
		var obj=false;
		var oldSelecinado=this.obtenerSeleccionado();
		for(var x=0;x<this.Slots.length;x++){
			if(this.Slots[x].nodo==nodo){
				this.Slots[x].estado='seleccionado';
				this.Slots[x].nodo.style.marginLeft='20px';
				obj=this.Slots[x];
			}else{	
				this.Slots[x].estado='enUso'
				this.Slots[x].nodo.style.marginLeft='0px';	
			}
		}
	};
	this.agregarVentanaForm = function(){
		this.ventanaForm.estado='agregado';
		this.nodo.parentNode.insertBefore(this.ventanaForm.nodo,this.nodo.nextSibling);		
	};
	this.construirInterfaz = function(data){
		var existeVentana=(this.ventanaForm.estado=='agregado')?true:false;
		if(existeVentana){
			if(data.tipo=='modificar'){
				this.ventanaForm.tipo='modificar';
				this.ventanaForm.registroId=data.id;
			}else if(data.tipo=='nuevo'){
				this.ventanaForm.tipo='nuevo';
				this.ventanaForm.registroId='';
			}
			this.ventanaForm.reconstruirInterfaz();
		}else{
			this.construirVentanaForm(data);
			this.agregarVentanaForm();
		}
	};
	this.actualizarLista = function(cambios){
		if(cambios instanceof Array){

		}else{
			this.actualizarSlot(cambios);
		}
	};
	this.actualizarSlot = function(registro){
		this.buscarSlot(registro);
	};
	this.buscarSlot = function(registro){
		for(x=0;x<this.Slots.length;x++){
			if(this.Slots[x].atributos.id==registro.id){
				this.Slots[x].atributos=registro;
				this.Slots[x].reconstruirNodo();
			}
		}
	};
	this.validarCombo = function(valoresNoPermitidos,lista){
		normalizarNodo(lista);
		for(var x=0;x<lista.length;x++){
			lista[x].style.display='block';
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
				var html="<article  title>"+titulo+"</article>\
				<button type='button' btnEliminar></button>";
				nodo.innerHTML=html;
			}
		}else{
			for(var x=0;x<this.Slots.length;x++){
				var nodo=this.Slots[x].nodo;
				var slot=this.Slots[x];
				var html="<article  title>"+slot.atributos.nombre+"</article>\
				<button type='button' btnEliminar></button>";
				nodo.innerHTML=html;
			}
		}
	};
	this.construir();
}
/*------------------------------Objeto Ventana Modal-----------------------*/
var modalWindow = function(){

	var capaContenido = function(){

		var Cabecera = function(){

			this.estado='sinConstruir';
			this.nodo;

			this.construirNodo = function(){
				var nodo=document.createElement('section');
				nodo.setAttribute('cabecera','');
				this.nodo=nodo;
			}
			this.construirNodo()
		}

		var Cuerpo = function(){
			this.estado='sinConstruir';
			this.nodo;

			this.construirNodo = function(){
				var nodo=document.createElement('section');
				nodo.setAttribute('cuerpo','');
				this.nodo=nodo;
			}
			this.construirNodo()
		}

		var Pie = function(){
			this.estado='sinConstruir';
			this.nodo;
			//funcion para agregar funcionamiento a los elementos hijos
			this.funcionamiento;
			this.construirNodo = function(){
				var nodo=document.createElement('section');
				nodo.setAttribute('pie','');
				this.nodo=nodo;
			}
			this.construirNodo()
		}

		this.estado='sinConstruir';
		this.partes={};
		this.nodo;
		this.tipo='contenido';

		this.construirNodo = function(){
			var nodo=document.createElement('div');
			var predecesor = interfaz.elementos.modalWindow.obtenerUltimaCapa();
			nodo.setAttribute('capa','contenido');
			predecesor.nodo.parentNode.insertBefore(nodo,predecesor.nodo.nextSibling);
			this.nodo=nodo;
			this.estado='enUso';
			setTimeout(function(){
				nodo.style.top=' calc(50% - 250px)';
				nodo.style.opacity='1';
			},300);
		}

		this.agregarParte = function(parte){
			switch(parte){
				case 'cabecera':
					this.partes.cabecera=new Cabecera();
					this.nodo.appendChild(this.partes.cabecera.nodo);
				break
				case 'cuerpo':
					this.partes.cuerpo=new Cuerpo();
					this.nodo.appendChild(this.partes.cuerpo.nodo);
				break
				case 'pie':
					this.partes.pie=new Pie();
					this.nodo.appendChild(this.partes.pie.nodo);
				break
			}
		}

		this.dibujarInterfaz = function(data){
			if(data.cabecera!==undefined){
				this.agregarParte('cabecera');
				this.partes.cabecera.nodo.textContent=data.cabecera;
			}
			if(data.cuerpo!==undefined){
				this.agregarParte('cuerpo');
				this.partes.cuerpo.nodo.innerHTML=data.cuerpo;
			}
			if(data.pie!==undefined){
				this.agregarParte('pie');
				this.partes.pie.nodo.innerHTML=data.pie;
			}
				
		}
		this.construirNodo();
	}

	var capaExterior = function(){

		this.estado='sinConstruir';
		this.nodo;
		this.tipo='exterior';

		this.construirNodo = function(){
			var nodo = document.createElement('div');
			nodo.setAttribute('capa','exterior');
			document.body.appendChild(nodo);
			this.nodo=nodo;
			this.estado='enUso';
			setTimeout(function(){
				nodo.style.opacity='0.8';
			},10);
			
		}
		this.construirNodo();
	}

	this.estado='sinConstruir';
	this.capas=new Array();

	this.arranque = function(data){
		this.agregarCapa('exterior');
		var contenido=this.agregarCapa('contenido');
		contenido.dibujarInterfaz(data);
		this.manejoDeCapas();
	}
	this.agregarCapa = function(tipo){
		var capaNueva=false;;
		if(tipo=='exterior'){
			if(this.existeExterior()){
				var zIndex=window.getComputedStyle(this.buscarUltimaCapaContenido().nodo,null).getPropertyValue("z-index");
				capaNueva=new capaExterior();
				this.capas.push(capaNueva);
				capaNueva.nodo.style.zIndex=parseInt(zIndex)+1;
			}else{
				capaNueva=new capaExterior();
				this.capas.push(capaNueva);
			}
		}else if(tipo=='contenido'){
			if(this.existeExterior()){
				var zIndex=window.getComputedStyle(this.obtenerUltimaCapa().nodo,null).getPropertyValue("z-index");
				capaNueva=new capaContenido();
				this.capas.push(capaNueva);
				capaNueva.nodo.style.zIndex=parseInt(zIndex)+1;
			}
		}else if(tipo=='opciones'){

		}
		return capaNueva;
	}
	this.removerCapa = function(){
		var capaExterior=interfaz.elementos.modalWindow.buscarCapa(this);
		if(capaExterior){
			if(capaExterior==interfaz.elementos.modalWindow.capas[0]){
				var capaContenido= interfaz.elementos.modalWindow.buscarCapa(capaExterior.nodo.nextSibling);
				//los saco de vista con la tansicion
				//capa contenido
				capaContenido.nodo.style.top='200%';
				capaContenido.nodo.style.opacity='0';
				setTimeout(function(){
					capaExterior.nodo.style.opacity='0';
				},300);
				setTimeout(function(){
					capaContenido.nodo.parentNode.removeChild(capaContenido.nodo);
					capaExterior.nodo.parentNode.removeChild(capaExterior.nodo);
					obtenerContenedor().style.position='inherit';
				},810);
			}else{
				var capaContenido= interfaz.elementos.modalWindow.buscarCapa(capaExterior.nodo.nextSibling);
				//los saco de vista con la tansicion
				//capa contenido
				capaContenido.nodo.style.top='200%';
				capaContenido.nodo.style.opacity='0';
				setTimeout(function(){
					capaExterior.nodo.style.opacity='0';
				},300);
				setTimeout(function(){
					capaContenido.nodo.parentNode.removeChild(capaContenido.nodo);
					capaExterior.nodo.parentNode.removeChild(capaExterior.nodo);
				},810);
			}
		}
	}
	this.buscarCapa = function(nodo){
		var capa=false;
		for(var x=0;x<this.capas.length;x++){
			if(this.capas[x].nodo==nodo){
				capa=this.capas[x];
				break
			}
		}
		return capa;
	}
	this.buscarUltimaCapaContenido = function(){
		var capa=this.obtenerUltimaCapa();
		var cont=0;
		while((capa.tipo!='contenido')||(cont==6)){
			capa=capa.previousSibling;
		}
		return capa;
	}
	this.existeExterior = function(){
		var capas=this.capas;
		var existe = false;
		for(var x=0;x<capas.length;x++){
			if(capas[x].tipo=='exterior'){
				existe=true;
				break
			}
		}
		return existe;
	}
	this.obtenerUltimaCapa = function(){
		var ultimaCapa = this.capas[this.capas.length-1];
		return ultimaCapa;
	}
	this.manejoDeCapas = function(){
		var contenedor=obtenerContenedor();
		if(this.existeExterior()){
			contenedor.style.position='fixed';
			for(var x=0;x<this.capas.length;x++){
				if(this.capas[x].nodo.getAttribute('capa')=='exterior'){
					this.capas[x].nodo.onclick=this.removerCapa;
				}
			}
		}else{
			contenedor.style.position='inherit';	
		}
	}
	this.elimiarUltimaCapa = function(){
		var lista = document.getElementsByTagName('div');
		for(var x=lista.length-1;x>0;x--){
			if(lista[x].getAttribute('capa')=='exterior'){
				lista[x].click();
			}
		} 
	}
}
/*------------------------------Objeto Constructor-----------------------*/
var Arquitecto = function(){

	this.elementos = new Array();

	this.estado = 'sinInicializar';

	this.configure = function(){

		this.elementos = {

			 menu : new Menu(),
			 cabecera : new Cabecera(),
			 formulario : 'noPosee',
			 botonera : 'noPosee'
		}
		this.estado='inicializado';
		var mql = window.matchMedia("(max-width: 1000px)");
		mql.addListener(handleMediaChange);
		handleMediaChange(mql);
		document.body.onmousedown=this.activarEfecto;
	}
	
}
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
		if(hijo==null){
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