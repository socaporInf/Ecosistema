function construirUI(){
	var secEnlaces = document.querySelector('div[enlaces]');
	var secNotCum = document.querySelector('div[not-cum]');
	var secNot = document.querySelector('div[notificaciones]');
	//notificaciones
	var notificaciones = UI.agregarLista({
		titulo: 'notificaciones',
		clase: 'notificaciones',
		elementos : [
			{codigo: 1,nombre:'carga realizada con exito',codigo_tipo:1,cuerpo:'carga de listado de pago a cañicultores realizado de manera exitosa',prioridad: 'N',fecha_hora:"2016-06-14 07:57:59.888"},
			{codigo: 2,nombre:'error en validacion CAPCA',codigo_tipo:1,cuerpo:'error 103: fechas no concuerdan en cargar 2016-06-14',prioridad: 'E',fecha_hora:"2016-06-14 07:57:59.888"},
			{codigo: 3,nombre:'listado de validacion en espera de Autorizacion ',codigo_tipo:1,cuerpo:' listado de validacion de cañicultores de fecha:2016-06-14 en espera de Autorizacion',prioridad: 'A',fecha_hora:"2016-06-14 07:57:59.888"},
			{codigo: 4,nombre:'notificacion 4',codigo_tipo:1,cuerpo:'texto4',prioridad: 'B',fecha_hora:"2016-06-14 07:57:59.888"}
		],
		carga: {
			uso:false
		},
		paginacion: {
			uso:false
		}
	},secNot);
	notificaciones.nodo.classList.add('not-margin');
	gestionarNotificaciones();

	//noticias-Cumpleañeros del mes
	var noticias =  UI.agregarVentana({
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
	noticias.nodo.classList.add('not-first');
	cargarNoticias(noticias.buscarSector('Noticias').nodo.querySelector('div[contenedorNoticias]'));

	var cumpleanerosDelMes = UI.agregarVentana({
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
	cumpleanerosDelMes.nodo.classList.add('not-first');

	//llenar calendario
	cargarCalendario();
}

function gestionarNotificaciones(){
	var slot = null;
	var lista = UI.buscarVentana('notificaciones');
	for(var x = 0; x < lista.Slots.length;x++){
		slot = lista.Slots[x];
		slot.nodo.setAttribute('prioridad',slot.atributos.prioridad);
		slot.nodo.setAttribute('codigo_tipo',slot.atributos.codigo_tipo);
		slot.nodo.setAttribute('nombre_tipo',slot.atributos.nombre_tipo);
		slot.nodo.onclick = mostrarNoticia;
	}
}

function mostrarNoticia(){
	var codigo = this.id;
	var slot = UI.buscarVentana('notificaciones').buscarSlot({codigo:codigo});
	var tipo;
	switch (slot.atributos.prioridad) {
		case 'E':
			tipo = 'error';
			break;
		case 'A':
			tipo = 'advertencia';
			break;
		case 'B':
			tipo = 'informacion';
			break;
	}
	UI.crearVentanaModal({
		tipo: tipo,
		cabecera: slot.atributos.nombre,
		cuerpo: '<label>'+slot.atributos.cuerpo+'</label>'+
						'<div fecha_hora> <span separacion>Fecha: '+slot.atributos.fecha_hora.substr(0,10)+'</span><span> Hora:'+slot.atributos.fecha_hora.substr(10,9)+'</span></div>',
	});
}

function cargarNoticias(contenedor){
	var noticias = [
		{titulo: 'Actualiadad',cuerpo: '',usuario: 'vmleon',tipo: 'A',color: '0097A7'},
		{titulo: '13 de Junio',cuerpo: '',usuario: 'vmleon',tipo: 'E',color: '4CAF50'},
		{titulo: 'Servicios',cuerpo: '',usuario: 'vmleon',tipo: 'S',color: '1976D2'},
		{titulo: 'Complementarias',cuerpo: '',usuario: 'vmleon',tipo: 'C',color: '303F9F'},
		{titulo: 'Venta de Huevos por nomina',cuerpo: '',usuario: 'vmleon',tipo: 'V',color: 'F57C00'}
	];
	for( var x = 0; x < noticias.length; x++){
		var noticia = new NoticiaUI(noticias[x]);
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

	var contenedorfechas = document.querySelector('div.fc-day-grid-container,div.fc-scroller');
	contenedorfechas.classList.remove('fc-scroller');
	contenedorfechas.style.height='390px';
}

/*--------------------------- Noticia ----------------------------------*/
var NoticiaUI = function(noticia){
	var Titulo = function(titulo){
		this.texto = titulo;
		this.nodo = null;

		this.construirNodo = function(){
			var nodo = document.createElement('div');
			nodo.setAttribute('not-titulo','');

			nodo.textContent = this.texto;

			this.nodo = nodo;
		};
		this.construirNodo();
	};

	this.atributos = noticia;
	this.nodo = null;
	this.titulo = null;

	this.construirNodo = function(){
		var nodo = document.createElement('div');
		nodo.setAttribute('mat-card','');
		nodo.classList.add('cuadrada');
		nodo.classList.add('viewver');
		nodo.style.backgroundColor='#'+this.atributos.color;

		this.nodo = nodo;

		this.agregarTitulo();
	};
	this.agregarTitulo = function(){
		var titulo = new Titulo(this.atributos.titulo);
		this.nodo.appendChild(titulo.nodo);
		this.titulo = titulo;
	};
	this.construirNodo();
};
