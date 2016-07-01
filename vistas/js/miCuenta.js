function construirUI(){
	var divOperaciones = document.querySelector('div[division-operaciones]');
	var seguridad = new Ventana({
		tipo: 'columna',
		titulo: {
			texto: 'Seguridad',
			tipo: 'inverso'
		},sectores: [
			{nombre:'cambiarClave',html:"<aside class='clave-grande'></aside><section texto class='lateral-icono'>Cambiar Clave</section>"},
			{nombre:'gestionarPreguntas',html:"<aside class='interrogacion-grande'></aside><section texto class='lateral-icono'>Gestionar preguntas y respues de seguridad</section>"}
		]
	});
	var datosPersonales = new Ventana({
		tipo: 'columna',
		titulo: {
			texto: 'Datos Personales',
			tipo: 'inverso'
		}
	});
	var cambiarClave = seguridad.buscarSector('cambiarClave');
	var gestionarPreguntas = seguridad.buscarSector('gestionarPreguntas');

	cambiarClave.nodo.onclick = function abrirCambiarClave(e){
		var formulario = new Ventana({
			tipo: 'formulario',
			titulo:{
				texto: cambiarClave.nodo.querySelector('section[texto]').textContent
			}
		});
		var divFormulario = document.querySelector('div[division-formulario]');
		divFormulario.appendChild(formulario.nodo);
	};

	divOperaciones.appendChild(seguridad.nodo);
	divOperaciones.appendChild(datosPersonales.nodo);
}
