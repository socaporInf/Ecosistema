function construirUI(){
	let secEnlaces = document.querySelector('div[enlaces]');
	let secNotCum = document.querySelector('div[not-cum]');
	let secNot = document.querySelector('div[notificaciones]');

	//noticias-Cumpleañeros del mes
	let noticias =  UI.agregarVentana({
		tipo: 'noticias',
		nombre: 'noticias',
		titulo:{
			html: 'Noticias',
			tipo: 'liso'
		},
		sectores:[
			{
				nombre:'Noticias',
				html: '<div contenedorNoticias></div>'
			}
		]
	},secNotCum);
	noticias.nodo.classList.add('not-margin');
	cargarNoticias(noticias.buscarSector('Noticias').nodo.querySelector('div[contenedorNoticias]'));

	let cumpleanerosDelMes = UI.agregarVentana({
		tipo: 'cumpleaneros',
		nombre: 'cumpleanerosDelMes',
		sectores:[
			{
				nombre:'calendario',
				html:'<div id="calendar"></div>'
			}
		]
	},secNotCum);
	cumpleanerosDelMes.nodo.classList.add('not-margin');
	
	//llenar calendario
	cargarCalendario();

	//notificaciones
	let notificaciones = UI.agregarVentana({
		tipo: 'notificaciones',
		nombre: 'notificacioens',
		titulo:{
			html: 'Notificaciones',
			tipo: 'basico'
		},
		sectores:[
			{
				nombre:'notificaciones',
				html:'aqui va la lista de notificaciones'
			}
		]
	},secNot);
	notificaciones.nodo.classList.add('not-first');
}

function cargarNoticias(contenedor){
	let noticias = [
		{
			titulo: 'Actualiadad',
			cuerpo: 'el dia de hoy se vendera a traves de punto de venta un carton de huevos por trabajador',
			usuario: 'vmleon',
			tipo: 'A',
			color: '0097A7'
		},{
			titulo: '13 de Junio',
			cuerpo: '',
			usuario: 'vmleon',
			tipo: 'E',
			color: '4CAF50'
		},{
			titulo: 'Servicios',
			cuerpo: 'el dia de hoy se vendera a traves de punto de venta un carton de huevos por trabajador',
			usuario: 'vmleon',
			tipo: 'S',
			color: '1976D2'
		},{
			titulo: 'Complementarias',
			cuerpo: 'el dia de hoy se vendera a traves de punto de venta un carton de huevos por trabajador',
			usuario: 'vmleon',
			tipo: 'C',
			color: '303F9F'
		},{
			titulo: 'Venta de Huevos por nomina',
			cuerpo: 'el dia de hoy se vendera a traves de punto de venta un carton de huevos por trabajador',
			usuario: 'vmleon',
			tipo: 'V',
			color: 'F57C00'
		}

	]
	for( let x = 0; x < noticias.length; x++){
		let noticia = new NoticiaUI(noticias[x]);

		contenedor.appendChild(noticia.nodo);	
	}
	
}

function cargarCalendario(){
		$('#calendar').fullCalendar({
			header: {
				left: '',
				center: 'title',
				right: ''
			},
			lang: 'es',
			defaultDate: new Date(),
			editable: true,
			selectable: true,
			eventLimit: true, // allow "more" link when too many events
			dayClick: function(date) {
				console.log('dayClick', date.format());
			},
			select: function(startDate, endDate) {
				console.log('select', startDate.format(), endDate.format());
			}
		});

	let contenedorfechas = document.querySelector('div.fc-day-grid-container,div.fc-scroller');
	contenedorfechas.classList.remove('fc-scroller');
	contenedorfechas.style.height='390px';
}

var NoticiaUI = function(noticia){

	let Titulo = function(titulo){
		this.texto = titulo;
		this.nodo = null;

		this.construirNodo = function(){
			let nodo = document.createElement('div');
			nodo.setAttribute('not-titulo','');

			nodo.textContent = this.texto;

			this.nodo = nodo;
		}
		this.construirNodo();
	};

	this.atributos = noticia;
	this.nodo = null;
	this.titulo = null;

	this.construirNodo = function(){
		let nodo = document.createElement('div');
		nodo.setAttribute('mat-card','');
		nodo.classList.add('cuadrada');
		nodo.classList.add('viewver');
		nodo.style.backgroundColor='#'+this.atributos.color;

		this.nodo = nodo;

		this.agregarTitulo();
	}
	this.agregarTitulo = function(){
		let titulo = new Titulo(this.atributos.titulo);
		this.nodo.appendChild(titulo.nodo);
		this.titulo = titulo; 
	}
	this.construirNodo();
}
