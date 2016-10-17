function construirUI(){
	var secEnlaces = document.querySelector('div[enlaces]');
	var secNotCum = document.querySelector('div[not-cum]');
	var secNot = document.querySelector('div[notificaciones]');
	//notificaciones
	var notificaciones = UI.agregarLista({
		titulo: 'Notificaciones',
		nombre: 'notificaciones',
		clases: ['notificaciones'],
		registrosPorPagina: 5,
		carga: {
			uso:true,
			peticion:{
				modulo: 'global',
				entidad: 'notificacion',
				operacion: 'buscarNotificacionesUsu'
			},
			espera:{
				cuadro:{
					nombre: 'Notificaciones',
					mensaje: 'Cargando notificaciones'
				}
			},
			respuesta: function gestionarNotificaciones(lista) {
				var slot = null;
				for(var x = 0; x < lista.Slots.length;x++){
					slot = lista.Slots[x];
					slot.nodo.setAttribute('id',slot.atributos.codigo);
					slot.nodo.setAttribute('prioridad',slot.atributos.nombre_prioridad);
					slot.nodo.setAttribute('codigo_tipo',slot.atributos.codigo_tipo_notificacion);
					slot.nodo.setAttribute('nombre_tipo',slot.atributos.nombre_tipo_notificacion);
					slot.nodo.onclick = mostrarNotificacion;
				}
			}
		}
	},secNot);
	notificaciones.nodo.classList.add('not-margin');

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

function mostrarNotificacion(){
	var codigo = this.id;
	var slot = UI.buscarVentana('notificaciones').buscarSlot({codigo:codigo});
	var tipo;
	switch (slot.atributos.nombre_prioridad) {
		case 'ALTA':
			tipo = 'error';
			break;
		case 'MEDIA':
			tipo = 'advertencia';
			break;
		case 'BAJA':
			tipo = 'informacion';
			break;
	}
	var fecha = UI.voltearFecha(slot.atributos.fecha_hora.substr(0,10));
	var hora = slot.atributos.fecha_hora.substr(10,9);
	UI.crearVentanaModal({
		tipo: tipo,
		cabecera: slot.atributos.nombre,
		cuerpo: '<div texto>'+slot.atributos.cuerpo+'</div>'+
						'<div fecha_hora> <span separacion>Fecha: '+fecha+'</span><span> Hora:'+hora+'</span></div>',
	});
}

function cargarNoticias(contenedor){
	var peticion = {
		modulo: 'global',
		entidad: 'noticia',
		operacion: 'buscar'
	};
	var cuadroEspera = {
		cuadro: {
				nombre: 'noticias',
				mensaje: 'Cargando Noticias'
		},
		contenedor: contenedor
	};
	torque.manejarOperacion(peticion,cuadroEspera,function cargarNoticiasBD(respuesta){
		var noticias = respuesta.registros;
		for( var x = 0; x < noticias.length; x++){
			var noticia = new Card(noticias[x]);
			contenedor.appendChild(noticia.nodo);
		}
	});
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
	document.body.querySelector('div.fc-center h2').innerHTML = "Cumpleañeros del mes de "+document.body.querySelector('div.fc-center h2').innerHTML;
}
