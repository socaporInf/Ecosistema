function construirUI(){
	let secEnlaces = document.querySelector('div[enlaces]');
	let secNotCum = document.querySelector('div[not-cum]');
	let secNot = document.querySelector('div[notificaciones]');

	//noticias-Cumpleañeros del mes
	let noticias =  UI.agregarVentana({
		tipo: 'column-5',
		nombre: 'noticias',
		titulo:{
			html: 'Noticias',
			tipo: 'inverso'
		},
		sectores:[
			{
				nombre:'Noticias',
				html:'aqui van las noticias'
			}
		]
	},secNotCum);
	noticias.nodo.classList.add('not-margin');

	let cumpleanerosDelMes = UI.agregarVentana({
		tipo: 'column-3',
		nombre: 'cumpleanerosDelMes',
		titulo:{
			html: 'Cumpleañeros del Mes',
			tipo: 'inverso'
		},
		sectores:[
			{
				nombre:'calendario',
				html:'Calendario'
			}
		]
	},secNotCum);
	cumpleanerosDelMes.nodo.classList.add('not-margin');

	//notificaciones
	let notificaciones = UI.agregarVentana({
		tipo: 'column-8',
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