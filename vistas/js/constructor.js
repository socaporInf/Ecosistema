/*---------------------MEDIA QUERY CHANGES-----------------------------------*/
var handleMediaChange = function (mediaQueryList) {
    if(constructor.estado=='inicializado'){
    	var formulario = constructor.elementos.formulario;
	    if (mediaQueryList.matches) {
	    	//cambio interfaz Ventana Form
	        formulario.ventanaForm.nodo.style.width=(formulario.ventanaForm)?'calc(85%)':null;
	        formulario.ventanaForm.nodo.style.marginLeft=(formulario.ventanaForm)?'50px':null;
	    }
	    else {
	    	//cambio interfaz Ventana Form
	        formulario.ventanaForm.nodo.style.width=(formulario.ventanaForm)?'600px':null;
	        formulario.ventanaForm.nodo.style.marginLeft=(formulario.ventanaForm)?'30px':null;
	    }
	}
}

var mql = window.matchMedia("(max-width: 1000px)");
mql.addListener(handleMediaChange);
handleMediaChange(mql);

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
			eliminar.nodo.parentNode.removeChild(eliminar.nodo);
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
/*------------------------------Objeto Formulario(lista)-----------------*/
var Formulario = function(){

	/*------------------------------Objeto VentanaForm------------*/
	var VentanaForm = function(){

		this.tipo = 'noPosee';

		this.nodo;

		this.estado = 'sinConstruir';

		this.construirNodo = function(data){
			var nodo = document.createElement('div');
			nodo.setAttribute('capaForm','');
			nodo.id='VentanaForm';
			var html='';
			this.tipo=data.tipo;
			if(this.tipo=='nuevo'){
				html+='\
				<section titulo>Nuevo Rol</section>\
					<section sector>\
						<div class="group">\
					      <input type="text" required>\
					      <span class="highlight"></span>\
					      <span class="bar"></span>\
					      <label>Nombre</label>\
					    </div>\
					    <div class="group">\
					      <input type="text" required>\
					      <span class="highlight"></span>\
					      <span class="bar"></span>\
					      <label>Descripcion</label>\
					    </div>\
					</section>\
				</section>';
				nodo.innerHTML=html;
				constructor.elementos.botonera.agregarBoton('redactar');
			}else if(this.tipo='modificar'){
				constructor.elementos.botonera.quitarBoton('redactar');
				html+='\
				<section titulo><span>'+data.nombre+'</span><article update></article></section>\
					<section sector>\
						<div><span>'+data.descripcion+'</span><article update></article></div>\
					</section>\
					<section sector>\
						<div>Privilegios</div>\
						<section contenedor id="contenedorPri">\
						</section>\
					</section>\
				</section>';
			nodo.innerHTML=html;
			console.log(nodo.childNodes[2]);
			normalizarNodo(nodo);
			console.log(nodo.childNodes[2]);
			var contenedor =nodo.childNodes[2];
			//arreglo temporal de privilegios
				var dataTemp=[
					{nombre:'ProbioAgro'},{nombre:'SocaServicios'}
				];
				this.agregarElementos(contenedor,dataTemp);
			}
			this.nodo=nodo;
		}
		this.agregarElementos=function(contenedor,elementos){
			var html="";
			console.log(elementos);
			for(var x=0;x<elementos.length;x++){
				html+="<article>"+elementos[x].nombre+"</article>";
			}
			html+='<article add></article>';
			contenedor.innerHTML=html;
		}
		this.reconstruirInterfaz=function(data){
			if(data.tipo=='nuevo'){
				constructor.elementos.formulario.controlLista();
				this.nodo.style.height='0px';		
				setTimeout(function(){
					var nodo=constructor.elementos.formulario.ventanaForm.nodo;
					nodo.style.height='250px';
					nodo.style.borderRadius='0px';
					var html='';
					html+='\
						<section titulo>Nuevo Rol</section>\
							<section sector>\
								<div class="group">\
							      <input type="text" required>\
							      <span class="highlight"></span>\
							      <span class="bar"></span>\
							      <label>Nombre</label>\
							    </div>\
							    <div class="group">\
							      <input type="text" required>\
							      <span class="highlight"></span>\
							      <span class="bar"></span>\
							      <label>Descripcion</label>\
							    </div>\
							</section>\
						</section>';
					nodo.innerHTML=html;
				},600);
				constructor.elementos.botonera.agregarBoton('redactar');
			}else if(data.tipo='modificar'){
				constructor.elementos.botonera.quitarBoton('redactar');
				this.nodo.style.height='0px';		
				setTimeout(function(){
					var nodo=constructor.elementos.formulario.ventanaForm.nodo;
					nodo.style.height='250px';
					nodo.style.borderRadius='0px';
					var html='';
					html+='\
				<section titulo><span>'+data.nombre+'</span><article update></article></section>\
					<section sector>\
						<div><span>'+data.descripcion+'</span><article update></article></div>\
					</section>\
					<section sector>\
						<div>Privilegios</div>\
						<section contenedor>\
							<article >ProbioAgro</article>\
							<article >SocaServicios</article>\
							<article add ></article>\
						</section>\
					</section>\
				</section>';
					nodo.innerHTML=html;
				},600);
			}
		}
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
			html+="<article  title>"+this.atributos.nombre+"</article>\
				<button type='button' btnEliminar></button>";
			nodo.innerHTML=html;
			this.nodo = nodo;
			this.estado='enUso';
			this.funcionamiento();
		}
		this.funcionamiento = function(){
			var nodo = this.nodo;
			var article =nodo.getElementsByTagName('article')[0];
			article.onclick=function(){
				var formulario = constructor.elementos.formulario;
				formulario.controlLista(this.parentNode);
				var newSelec = formulario.obtenerSeleccionado();
				var data = {
						tipo:'modificar',
						nombre:newSelec.atributos.nombre,
						descripcion:newSelec.atributos.descripcion
					}
				formulario.construirInterfaz(data);
			}
		}
		this.construirNodo();
	}
	/*--------------------------Fin Objeto Slot-------------------*/
	this.Slots = new Array();

	this.ventanaForm = new VentanaForm();

	this.estado = 'sinInicializar';

	this.nodo;

	this.listarSlots = function(){
		console.log('Slots:');
		for(var x=0;x<this.Slots.length;x++){
			console.log('nombre: '+this.Slots[x].atributos.nombre+'\testado: '+this.Slots[x].estado);
		}
	}
	this.obtenerSeleccionado = function(){
		var seleccionado=false;
		for(var x=0;x<this.Slots.length;x++){
			if(this.Slots[x].estado=='seleccionado'){
				seleccionado=this.Slots[x];
			}
		}
		return seleccionado;
	}
	this.construir = function(){
		var contenedor = obtenerContenedor();
		var elemento = document.createElement('div');
		elemento.setAttribute('capaList','');
		var html='';
		html+="<section busqueda>\
					<input type='text' placeHolder='Buscar...'campBusq>\
					<button type='button' btnBusq></button>\
				</section>"
		elemento.innerHTML = html;
		this.nodo=elemento;
		contenedor.insertBefore(elemento,document.getElementById('menu').nextSibling);
		this.estado='enUso';
	}
	this.agregarSlot = function(data){
		var slot = new Slot(data);
		this.Slots.push(slot);
		this.nodo.appendChild(slot.nodo);
	}
	this.cargarRegistros = function(registros){
		for(var x=0; x<registros.length;x++){
			this.agregarSlot(registros[x]);
		}
	}
	this.construirVentanaForm=function(tipo){
		this.ventanaForm.construirNodo(tipo);
	}
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
	}
	this.agregarVentanaForm = function(){
		this.ventanaForm.estado='agregado';
		this.nodo.parentNode.insertBefore(this.ventanaForm.nodo,this.nodo.nextSibling);
		setTimeout(function(){
			constructor.elementos.formulario.ventanaForm.nodo.style.height='250px';
		},10);
	}
	this.construirInterfaz = function(data){
		var existeVentana=(this.ventanaForm.estado=='agregado')?true:false;
		if(existeVentana){
			this.ventanaForm.reconstruirInterfaz(data)
		}else{
			this.construirVentanaForm(data);
			this.agregarVentanaForm();
		}
	}
	this.construir();
}
/*------------------------------Objeto Constructor-----------------------*/
var Constructor = function(){

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
	}
}