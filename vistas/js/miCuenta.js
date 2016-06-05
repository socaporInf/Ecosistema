function construirUI(){
	let divOperaciones = document.querySelector('div[division-operaciones]');
	let seguridad = new Ventana({
		tipo: 'columna',
		titulo: {
			texto: 'Seguridad',
			tipo: 'inverso'
		}
	});
	let datosPersonales = new Ventana({
		tipo: 'columna',
		titulo: {
			texto: 'Datos Personales',
			tipo: 'inverso'
		}
	});
	let cambiarClave = seguridad.agregrarSector({html:"<aside class='clave-grande'></aside><section texto class='lateral-icono'>Cambiar Clave</section>"});
	let gestionarPreguntas = seguridad.agregrarSector({html:"<aside class='interrogacion-grande'></aside><section texto class='lateral-icono'>Gestionar preguntas y respues de seguridad</section>"});

	cambiarClave.nodo.onclick = function abrirCambiarClave(e){
		let formulario = new Ventana({
			tipo: 'formulario',
			titulo:{
				texto: cambiarClave.nodo.querySelector('section[texto]').textContent
			}
		});
		let divFormulario = document.querySelector('div[division-formulario]');
		divFormulario.appendChild(formulario.nodo);
	}

	divOperaciones.appendChild(seguridad.nodo);
	divOperaciones.appendChild(datosPersonales.nodo);
}