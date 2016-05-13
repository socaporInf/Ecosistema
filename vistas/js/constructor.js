/*---------------------MEDIA QUERY CHANGES-----------------------------------*/
var handleMediaChange = function (mediaQueryList) {
	if(UI.estado=='inicializado'){
		var formulario = UI.elementos.formulario;
		if(formulario.ventanaForm!==undefined){
			if(formulario.ventanaForm.nodo!==undefined){
				if (mediaQueryList.matches) {
			    	//cambio UI Ventana Form
			        formulario.ventanaForm.nodo.style.width=(formulario.ventanaForm)?'calc(85%)':null;
			        formulario.ventanaForm.nodo.style.marginLeft=(formulario.ventanaForm)?'50px':null;
			        formulario.ventanaList.cambiarTextoSlots('completa');
			    }
			    else {
			    	//cambio UI Ventana Form
			        formulario.ventanaForm.nodo.style.width=(formulario.ventanaForm)?'calc(100% - 450px)':null;
			        formulario.ventanaForm.nodo.style.marginLeft=(formulario.ventanaForm)?'30px':null;
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
/*--------------------------------------------Objeto Botonera ----------------------------------------*/
/*----------------------------------------------------------------------------------------------------*/
var Botonera = function(estructura){
	
	var Boton = function(tipo){
		this.tipo = tipo.toLowerCase();
		this.nodo =  null;
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
					nodo.onclick=UI.elementos.formulario.eliminar;
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
		//boton buscar
		this.buscarBoton('nuevo').nodo.onclick=function(){
			console.log('presiono Nuevo');
			var data = {
				tipo:'nuevo'
			};
			var formulario = UI.elementos.formulario;
			formulario.construirUI(data);
		};
		//boton nuevo
		this.buscarBoton('buscar').nodo.onclick=function(){
			UI.elementos.formulario.ventanaList.nodo.firstChild.getElementsByTagName('button')[1].click();
		};
	};
	this.inicializarBotones = function(){
		var botones = this.estructura;
		for(var x = 0; x < botones.length; x++){
			this.agregarBoton(botones[x]);
		}
		this.agregarEfectos();
	};
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
						var top=(UI.elementos.botonera.botones.length-1)*45;
						boton.nodo.style.top='-'+top+'px';
					},10);
				}
			}
			this.botones.push(boton);
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
						for(var x = 0; x < botones.length; x++){
							if(botones[x].tipo!='abrir'){
								botones[x].nodo.style.top = 0+'px';
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
	this.quitarBoton = function(tipo){
		var eliminar=this.buscarBoton(tipo);
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
				
				this.agregarElemento(data);
				//creo las capas 
				capaNueva = new SubCapa(hijos[x],this);
				//agrego las capas al padre
				this.hijos.push(capaNueva);
			}
				
		};
		this.agregarElemento = function(contenido,enlace,seleccionado){
			var elementoNuevo = new Elemento(contenido,enlace);
			if(seleccionado===true){
				elementoNuevo.nodo.setAttribute('seleccionado','');
			}
			this.nodo.appendChild(elementoNuevo.nodo);
			this.elementos.push(elementoNuevo);
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
	this.capaActiva;
	this.partes = [];
	this.nodo = null;

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
				}
			},30);		
			html+='<article off onclick="sesion.cerrarSesion()"></article>';	
			
		}
		html+='<article contac></article>';
		html+='<article seguridad></article>';
		html+='<article books></article>';
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
		elemento.innerHTML = "<button type='button' menuBtn id='menuBtn'></button><div titulo>SOCA-PORTUGUESA</div>"; 
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
var Formulario = function(entidad){

	//----------------------------------Objeto Ventana Formulario-------------------
	var VentanaForm = function(){

		this.tipo = 'noPosee';
		this.nodo = null;
		this.estado = 'sinConstruir';

		//este es el registro que se esta editando
		this.registroId='';
		//el registro despues de buscarlo
		this.registroAct; 

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
			this.reconstruirUI();
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
				nodo.onclick=UI.elementos.formulario.ventanaForm.finEdicion;
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
			campo.style.maxHeight='150px';

			var id=UI.elementos.formulario.ventanaForm.registroId;
			var nombreCampo=campoEdicion.name;
			var valorCampo=campoEdicion.value;

			console.log('se disparo una edicion con id:'+UI.elementos.formulario.ventanaForm.registroId+' en campo:'+campoEdicion.name);
			var registro=torque.editarCampo(id,nombreCampo,valorCampo);
			UI.elementos.formulario.ventanaList.actualizarLista(registro);

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
				nodo.onclick=UI.elementos.formulario.ventanaForm.edicion;
				campoEdicion.style.width=window.getComputedStyle(campoEdicion,null).getPropertyValue("width");
				campo.style.width=campoEdicion.style.width;
				campoEdicion.style.width='0px';
				campoEdicion.value='';
			},510);
		};
		//funcion para agregar de forma dinamica campos a la interfaz
		this.agregarCampo = function(campo){
			var campoNuevo;
			var contenedor = this.nodo.getElementsByTagName('form')[0];
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

			}
			contenedor.appendChild(campoNuevo.nodo);
		};
		//funcion con la cual puedo agregar mas de un campo de forma dinamica a la interfaz
		this.agregarCampos = function(campos){
			for(var x=0;x<campos.length;x++){
				this.agregarCampo(campos[x]);
			}
		};

		this.crearEstructuraBasicaNuevo = function(titulo,altura){
				this.nodo.style.height=altura+'px';
				var html='\
				<section titulo>Nuevo '+titulo+'</section>\
					<section sector>\
						<form name ="formNuevo">\
						</form>\
					</section>\
				</section>';
				this.nodo.innerHTML=html;
		};

		this.crearEstructuraBasicaModificar = function(titulo,altura){
				this.nodo.style.height=altura+'px';
				var html="<section titulo>\
								<textarea  name='"+titulo.nombre+"'></textarea>\
								<span>"+titulo.valor+"</span>\
								<article update='campo'></article>\
						</section>\
						<section sector>\
							<!-- Aqui va el contenido -->\
							<form name ='formModificar'>\
							</form>\
						</section>";
				this.nodo.innerHTML=html;
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
					var slot = UI.elementos.formulario.ventanaList.buscarSlot({id:this.parentNode.id})
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
			this.construirNodo();
		};
		/*--------------------------Fin Objeto Slot-------------------*/

		this.Slots = [];

		this.nodo;

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
					if(slot.atributos.nombre.length>28){
						titulo=slot.atributos.nombre.substr(0,28)+'...';
					}else{
						titulo=slot.atributos.nombre;
					}
					var html="<article  title>"+titulo+"</article>\
					<button type='button' btnEliminar></button>";
					nodo.innerHTML=html;
					slot.funcionamiento();
				}
			}else{
				for(var x=0;x<this.Slots.length;x++){
					var nodo=this.Slots[x].nodo;
					var slot=this.Slots[x];
					var html="<article  title>"+slot.atributos.nombre+"</article>\
					<button type='button' btnEliminar></button>";
					nodo.innerHTML=html;
					slot.funcionamiento();
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
				mensaje:'Buscando',
				contenedor:this.nodo,
			};
			var cuadroDeCarga=UI.iniciarCarga(infoCuadro,function(){
				if(torque.registrosEntAct!==null){
					UI.elementos.cuadroCarga.nodo.parentNode.removeChild(UI.elementos.cuadroCarga.nodo);
					UI.elementos.cuadroCarga.terminarCarga();
					ventanaForm.cargarRegistros(torque.registrosEntAct);
				}
			});
			cuadroDeCarga.style.marginTop='80px';
		};
		this.construir();
	};
	/*--------------------------Fin Objeto VentanaList-----------------------------------*/
	
	this.ventanaList = new VentanaList(entidad);
	this.ventanaForm = new VentanaForm();

	this.estado = 'sinInicializar';

	this.entidadActiva=entidad;

	this.interval=null;
	
	//metodo para hacer el objeto ventana form capaz de recibir funciones en forma de herencia
	this.ventanaForm.prototype = VentanaForm.prototype;
	this.ventanaForm.prototype.constructor = this.ventanaForm;
	//----------------------------------------------------------------------------------------

	this.construirVentanaForm=function(data){
		this.ventanaForm.registroId=data.codigo;
		this.ventanaForm.construirNodo(data);
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
			pie : '<section modalButtons>\
						<button type="button" cancelar id="modalButtonCancelar"></button>\
						<button type="button" aceptar registro="'+slot.atributos.codigo+'" id="modalButtonAceptar"></button>\
					</section>'
		};
		
		UI.crearVentanaModal(verificacion);
		
		var btnAceptar = document.getElementById('modalButtonAceptar');
		var btnCancelar = document.getElementById('modalButtonCancelar');

		btnCancelar.onclick=function(){
			UI.elementos.modalWindow.eliminarUltimaCapa();
		};
		btnAceptar.onclick=function(){

			var slot = UI.elementos.formulario.ventanaList.buscarSlot({id:this.getAttribute('registro')});
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
			this.ventanaForm.reconstruirUI();
		}else{
			this.construirVentanaForm(data);
			this.agregarVentanaForm();
		}
	};
};

/*----------------------------------------------------------------------------------------------------*/
/*--------------------------------------------Objeto Ventana Modal------------------------------------*/
/*----------------------------------------------------------------------------------------------------*/
var modalWindow = function(bloqueo){

	var capaContenido = function(){

		var Cabecera = function(){

			this.estado = 'sinConstruir';
			this.nodo = null;

			this.construirNodo = function(){
				var nodo=document.createElement('section');
				nodo.setAttribute('cabecera','');
				this.nodo = nodo;
			};
			this.construirNodo();
		};

		var Cuerpo = function(){
			this.estado='sinConstruir';
			this.nodo = null;

			this.construirNodo = function(){
				var nodo=document.createElement('section');
				nodo.setAttribute('cuerpo','');
				this.nodo=nodo;
			};
			this.construirNodo();
		};

		var Pie = function(){
			this.estado = 'sinConstruir';
			this.nodo = null;
			//funcion para agregar funcionamiento a los elementos hijos
			this.funcionamiento;
			this.construirNodo = function(){
				var nodo=document.createElement('section');
				nodo.setAttribute('pie','');
				this.nodo=nodo;
			};
			this.construirNodo();
		};

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
				nodo.style.top=' calc(50% - 250px)';
				nodo.style.opacity='1';
			},300);
		};

		this.agregarParte = function(parte){
			switch(parte){
				case 'cabecera':
					this.partes.cabecera=new Cabecera();
					this.nodo.appendChild(this.partes.cabecera.nodo);
				break;
				case 'cuerpo':
					this.partes.cuerpo=new Cuerpo();
					this.nodo.appendChild(this.partes.cuerpo.nodo);
				break;
				case 'pie':
					this.partes.pie=new Pie();
					this.nodo.appendChild(this.partes.pie.nodo);
				break;
			}
		};

		this.dibujarUI = function(data){
			data.tipo=data.tipo || 'contenedor';
			if(data.cabecera!==undefined){
				this.agregarParte('cabecera');
				this.partes.cabecera.nodo.innerHTML=data.cabecera;
			}
			if(data.cuerpo!==undefined){
				this.agregarParte('cuerpo');
				this.partes.cuerpo.nodo.innerHTML=data.cuerpo;
				switch(data.tipo.toLowerCase()){
					case 'advertencia':
						this.partes.cabecera.nodo.classList.toggle('advertencia');	
					break;
					case 'error':
						this.partes.cabecera.nodo.classList.toggle('error');
					break;
				}
			}
			if(data.pie!==undefined){
				this.agregarParte('pie');
				this.partes.pie.nodo.innerHTML=data.pie;
				switch(data.tipo.toLowerCase()){
					case 'advertencia':
						this.partes.pie.nodo.classList.toggle('advertencia');	
					break;
					case 'error':
						this.partes.pie.nodo.classList.toggle('error');
					break;
				}
			}	
		};
		this.construirNodo();
	};

	var capaExterior = function(bloqueo){

		this.estado='sinConstruir';
		this.nodo;
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
		if(tipo=='exterior'){
			if(this.existeExterior()){
				var zIndex=window.getComputedStyle(this.buscarUltimaCapaContenido().nodo,null).getPropertyValue("z-index");
				capaNueva=new capaExterior(bloqueo);
				this.capas.push(capaNueva);
				capaNueva.nodo.style.zIndex=parseInt(zIndex)+1;
			}else{
				capaNueva=new capaExterior(bloqueo);
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
	};
	this.removerCapa = function(){
		var capaExterior=UI.elementos.modalWindow.buscarCapa(this);
		if(capaExterior){
			if(capaExterior==UI.elementos.modalWindow.capas[0]){
				var capaContenido= UI.elementos.modalWindow.buscarCapa(capaExterior.nodo.nextSibling);
				//los saco de vista con la trancision
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

					obtenerContenedor().style.position='inherit';
				},810);
			}else{
				var capaContenido= UI.elementos.modalWindow.buscarCapa(capaExterior.nodo.nextSibling);
				//los saco de vista con la trancision
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
	this.nodo;

	//maenjo de carga
	this.intervalID;
	this.contEspera;
	this.callback = callback || null;

	this.estado = 'sinIniciar';

	this.construirNodo = function(){
		
		var cuadro = document.createElement('div');
		cuadro.classList.toggle('ContenedorCarga');

		cuadro.innerHTML='<article style="color:#7b7b7b;text-align:center">'+info.mensaje+'</article>\
			<div class="showbox">\
			  <div class="loader">\
			    <svg class="circular" viewBox="25 25 50 50">\
			      <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/>\
			    </svg>\
			  </div>\
			</div>';
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
	};
	//esta funcion crea un intervalo de carga que permite manejar dicha carga colocandole un tiempo de espera 5 segundos
	this.manejarCarga = function(){
		console.log('comienza manejo de carga');
		UI.elementos.cuadroCarga.contEspera=0;
		this.intervalID=setInterval(function(){
			var callback = UI.elementos.cuadroCarga.callback;
			UI.elementos.cuadroCarga.contEspera++;
			if(callback!==null){
				callback();
			}
			if(UI.elementos.cuadroCarga!==undefined){
				if(UI.elementos.cuadroCarga.contEspera>=500){
					console.log('tiempo de espera culminado');
					clearInterval(UI.elementos.cuadroCarga.intervalID);
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
		callback= callback || null;
		this.estado = 'cargaCulminada';
		var titulo = this.nodo.firstChild;
		var circulo = this.nodo.getElementsByTagName('circle')[0];
		circulo.parentNode.removeChild(circulo);
		titulo.textContent = respuesta.mensaje;
		if(callback!==null){
			callback(respuesta);
		}
	};
	//esta funcion mata el intervalo al ejecultarce el callback de dicha carga
	this.terminarCarga = function(){					
		clearInterval(this.intervalID);
		this.estado = 'cargaCulminada';
		UI.elementos.cuadroCarga=undefined;
	};
	this.construirNodo();
};
/*----------------------------------------------------------------------------------------------------*/
/*-----------------------------------------Objeto Constructor-----------------------------------------*/
/*----------------------------------------------------------------------------------------------------*/
var Arquitecto = function(){

	this.elementos = [];

	this.estado = 'sinInicializar';

	this.configure = function(){

		this.elementos = {
			 menu : new Menu(),
			 cabecera : new Cabecera(),
			 formulario : 'noPosee',
			 botonera : 'noPosee'
		};
		this.estado='inicializado';
		var mql = window.matchMedia("(max-width: 1000px)");
		mql.addListener(handleMediaChange);
		handleMediaChange(mql);
		document.body.onmousedown=this.activarEfecto;
	};

	this.crearVentanaModal= function(data,bloqueo){
		//creo la venta modal
		if(!this.elementos.modalWindow){
			this.elementos.modalWindow=new modalWindow(bloqueo);		
		}
		var capaContenido=this.elementos.modalWindow.arranque(data);
		return capaContenido;
	};
	//funcion se utiliza cuando se necesita pasar parametros al callback al culminar la carga
	this.crearCuadroDeCarga = function(info,contenedor){
		info.contenedor=contenedor;
		cuadroCarga=new CuadroCarga(info,null);
		this.elementos.cuadroCarga=cuadroCarga;
		return cuadroCarga.nodo;
	};
	//funcion se utiliza cuando no se necesita pasar parametros al callback al culminar la carga
	this.iniciarCarga = function(info,callback){
		console.log('inicio carga');
		cuadroCarga=new CuadroCarga(info,callback);
		this.elementos.cuadroCarga=cuadroCarga;
		this.elementos.cuadroCarga.manejarCarga();
		return cuadroCarga.nodo;
	};
};
/*---------------Objetos de interfaz---------------------------------------------*/
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
		for(var x=0; x<this.opciones.length;x++){
			this.agregarOpcion(this.opciones[x]);
		}
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
		article.onclick=function(){
			construirCapaSelect(this);
		};
		nodo.appendChild(article);

		//se crea el select
		var select=document.createElement('select');
		select.name=this.data.nombre;
		if(this.data.id!==undefined){
			select.id=this.data.id;
		}
		nodo.appendChild(select);
		this.nodo=nodo;

		//creo la primera opcion
		var opcion = {
			codigo : '-',
			nombre : 'Elija un '+this.data.nombre
		};
		this.agregarOpcion(opcion);

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
	this.data.usaTooltip = info.usaTooltip ||  false;
	this.nodo = null;

	this.construir = function(){
		var CampoDeTexto = document.createElement('div');
		CampoDeTexto.classList.toggle('group');
		CampoDeTexto.setAttribute(this.data.eslabon,'');
		var html='';
		if(this.data.tipo=='simple'){
			html+='<input type="text" name="'+this.data.nombre+'" required>';
		}else if(this.data.tipo=='area'){
			html+='<textarea name="Descripcion" required></textarea>';
		}else{
			console.log(this.data.tipo);
		}
		
		html+='<span class="highlight"></span>\
		      <span class="bar"></span>\
		      <label>'+this.data.titulo+'</label>';

		CampoDeTexto.innerHTML=html;
		this.nodo=CampoDeTexto;
		if(this.usaTooltip!==false){
			this.nodo.onmouseover=UI.elementos.formulario.abrirtooltipInput;
			this.nodo.onmouseout=UI.elementos.formulario.cerrartooltipInput;
		}
		this.estado='enUso';
	};
	this.construir();
};
//-------------------- Campo Edicion----------------------------------------------------------
var CampoEdicion = function(info){
	
	this.data =  info;
	this.nodo;
	this.tipo = info.tipo || 'simple';
	
	this.construirNodo = function(){
		var nodo =  document.createElement('div');
		var campo = '';
		var html = '';
		nodo.setAttribute('formUpdate','');
		if(this.tipo=='simple'){
			campo+="<input  type='text' name='"+this.data.nombre+"'>";
		}else if(this.tipo=='area'){
			campo+="<textarea name='"+this.data.nombre+"'></textarea>";
			nodo.setAttribute('area','');
		}
		html+="<label>"+this.data.titulo+"</label>";
		html+="<div clear></div>";
		html+="<article update='area'></article>";
		html+="<div >";
		html+=	campo;
		html+=	"<span >"+this.data.valor+"</span>";
		html+="</div>";
		nodo.innerHTML=html;
		this.nodo=nodo;
		this.darVida();
	};
	this.darVida = function(){
		//aqui quede
		var article = this.nodo.getElementsByTagName('article')[0];
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
				nodo.onclick= function(e){
					//agrego el efecto Ripple
					agregarRippleEvent(this,e);
					var select = this.parentNode.nextSibling;
					while(select.nodeName=='#text'){
						select=select.nextSibling;
					}
					select.value=this.getAttribute('valor');
					destruirCapaSelect(this.parentNode);
				};
				opcion.nodo=nodo;
				opciones.push(opcion);
				capaSelect.appendChild(nodo);
			}

			//creo el contenedor de las opciones
			capaSelect.style.opacity='1';
			capaSelect.style.height=parseInt(opciones.length*41)+'px';
			capaSelect.style.width='60px';
		};

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