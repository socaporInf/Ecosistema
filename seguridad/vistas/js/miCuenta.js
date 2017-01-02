function construirUI(){
	var divOperaciones = document.querySelector('div[division-operaciones]');
	var seguridad = new Ventana({
		tipo: 'columna',
		titulo: {
			texto: 'Seguridad',
			tipo: 'inverso'
		},sectores: [
			{nombre:'cambiarClave',html:"<aside class='material-icons bluegrey500 md-48'>security</aside><section texto class='lateral-icono'>Cambiar Clave</section>"},
			{nombre:'gestionarPreguntas',html:"<aside class='material-icons indigo500 md-48'>help_outline</aside><section texto class='lateral-icono'>Gestionar preguntas y respues de seguridad</section>"}
		]
	});
	var datosPersonales = new Ventana({
		clases: ['columna','not-first'],
		titulo: {
			texto: 'Datos Personales',
			tipo: 'inverso'
		}
	});
	var cambiarClave = seguridad.buscarSector('cambiarClave');
	var gestionarPreguntas = seguridad.buscarSector('gestionarPreguntas');

	cambiarClave.nodo.onclick = function abrirCambiarClave(e){
		abrirFormularioClave();
	};

	divOperaciones.appendChild(seguridad.nodo);
	divOperaciones.appendChild(datosPersonales.nodo);
}
function abrirFormularioClave(){
	var ventana = new Ventana({
		clases:['formulario','cambio-clave'],
		titulo:{
			texto: 'Cambiar Clave'
		},
		sectores:[
			{
				nombre:"formulario",
				formulario:{
					campos:[
						{
							tipo: 'campoDeTexto',
							parametros:{
								nombre: 'oldPass',
								requerido:true,
								titulo: 'Clave Actual',
								tipo:'password',
								eslabon: 'area'
							}
						},{
							tipo: 'campoDeTexto',
							parametros:{
								nombre: 'newPass',
								requerido:true,
								titulo: 'Nueva Clave',
								tipo:'password',
								eslabon: 'area'
							}
						},{
							tipo: 'campoDeTexto',
							parametros:{
								nombre: 'NewPass2',
								requerido:true,
								titulo: 'Reingrese Nueva Clave',
								tipo:'password',
								eslabon: 'area'
							}
						}
					]
				}				
			},
			{
				nombre:"botonera",
				clases:['botonera'],
				html:"<button class='mat-text-but'>Guardar Cambios</button>"
			}
		]
	});
	var divFormulario = document.querySelector('div[division-formulario]');
	divFormulario.appendChild(ventana.nodo);
	ventana.buscarSector('botonera').nodo.querySelector('button.mat-text-but').onclick=function guardarCambios(){
		var formulario = ventana.buscarSector('formulario').formulario;
		if(formulario.buscarCampo('newPass').captarValor() !== formulario.buscarCampo('newPass2').captarValor()){
			UI.agregarToasts({
				mensaje:'La nueva lave no coinsiden',
				tipo:'mobile'
			});
		}else{
			var modal = UI.crearVentanaModal({
				cuerpo:{
					html:''
				}
			});
			var peticion = UI.juntarObjetos({
				modulo:'seguridad',
				entidad:'usuario',
				operacion:'cambiarClave',
				codigo: sesion.nombre
			},formulario.captarValores());
			var cuadro={
				contenedor:modal.partes.cuerpo.nodo,
				cuadro:{
					nombre:'Actualizando Clave',
					mensaje:'Actualizando Clave'
				}
			}
			torque.manejarOperacion(peticion,cuadro).then(function(res){
				modal.convertirEnMensaje(res.mensaje);
				formulario.limpiar();
			});
		}
	};
}