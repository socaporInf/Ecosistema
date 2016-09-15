function construirUI(){
	var formularioArbol = armarVentanaArbol();
	llenarArbol(formularioArbol);
	var btnNuevo = document.querySelector('button[btnnuevo]');
	btnNuevo.onclick = construirFormulario;
	if(!sesion.buscarPrivilegio('componente').buscarOperacion('incluir')){
		UI.elementos.botonera.quitarBoton('nuevo');
	}
}
//----------------------------------- formulario Arbol -------------------------------
function armarVentanaArbol(){
	var formularioArbol = UI.agregarVentana({
		tipo: 'arbol',
		nombre: 'formularioArbol',
		titulo:{
			html: 'Configuracion Componentes',
			tipo: 'inverso'
		},
		sectores:[
			{
				nombre:'arbol',
				html:'aqui va el arbol'
			}
		]
	},document.querySelector('div[contenedor]'));

	formularioArbol.buscarSector('arbol').nodo.style.overflow='auto';
	formularioArbol.buscarSector('arbol').nodo.style.minHeight='100px';

	return formularioArbol;
}

function llenarArbol(formularioArbol){
	var Peticion = {
		entidad: 'privilegio',
		operacion: 'buscarArbolComponente',
		modulo: 'seguridad'
	};

	var infoCuadroCarga = {
		contenedor: formularioArbol.buscarSector('arbol').nodo,
		cuadro:{
			nombre: 'cargarArbol',
			mensaje:'Cargando Arbol'
		}
	};

	torque.manejarOperacion(Peticion,infoCuadroCarga,function cargarArbol(respuesta){
		var opciones = [
			{
				clases: ['icon','icon-operaciones-negro-32'],
				click: buscarOperaciones
			},{
				clases: ['icon','icon-campo-negro-32'],
				click: buscarCampos
			}
		];
		if(sesion.buscarPrivilegio('componente').buscarOperacion('modificar')){
			opciones.push({
				clases: ['icon','icon-editar-negro-32'],
				click: formularioEditarComponente
			});
		}
		arbol = new Arbol({
			nodos: respuesta.hojasGenereal,
			hojaOnClick: function editar(hoja){
					hoja.peciolo.activar();
			},
			hojaOpciones:opciones,
			contenedor: UI.buscarVentana('formularioArbol').buscarSector('arbol').nodo
		});
	});
}

//--------------------------- Funciones Opciones ------------------------
var buscarOperaciones = function operacionesHoja(nodo){
	var asignarOperaciones = UI.crearVentanaModal({
		cuerpo:{
			html: 'aqui va el cuadro carga'
		}
	});
	var peticion = {
		entidad : 'privilegio',
		operacion: 'buscarOperaciones',
		codigo : nodo.getAttribute('codigo'),
		modulo:'seguridad'
	};
	var cuadro = {
		contenedor: asignarOperaciones.partes.cuerpo.nodo,
		cuadro:{
			nombre: 'esperaOperaciones',
			mensaje : 'cargando operaciones disponibles'
		}
	};
	UI.elementos.modalWindow.buscarUltimaCapaContenido().registroId = nodo.getAttribute('codigo');
	torque.manejarOperacion(peticion,cuadro,function armarOperaciones(respuesta){
		if (respuesta.success) {
			construirFormAsignarOp(UI.elementos.modalWindow.buscarUltimaCapaContenido(),respuesta.registro,nodo);
		}else{
			UI.elementos.modalWindow.buscarUltimaCapaContenido().convertirEnMensaje(respuesta.mensaje);
		}
	});
};
	//------------------------------------ Formulario asignar Operaciones -----------------
function construirFormAsignarOp(capaContenido,operaciones,nodo){
	if(operaciones.disponibles){
		//creo la ventana de asignacion dependiendo a lo que necesito
		capaContenido = construirVentanaAsignacion(operaciones.disponibles,operaciones.asignadas,capaContenido,nodo);

		var btnGuardar = capaContenido.partes.pie.nodo.querySelector('button.icon-guardar-indigo-32');
		btnGuardar.onclick = function(){
			var data = obtenenrValoresFormulario(UI.elementos.modalWindow.buscarUltimaCapaContenido().partes.cuerpo.formulario);
			peticion ={
				entidad : 'privilegio',
				modulo:'seguridad',
				operacion : 'guardarOperacionesDisponibles',
				codigo : UI.elementos.modalWindow.buscarUltimaCapaContenido().partes.cuerpo.formulario.registroId,
				data : JSON.stringify(data)
			};
			var cuadro = {
				contenedor: UI.elementos.modalWindow.buscarUltimaCapaContenido().partes.cuerpo.nodo,
				cuadro:{
					nombre: 'guardarOperaciones',
					mensaje : 'guardando Cambios'
				}
			};
			torque.manejarOperacion(peticion,cuadro,function guardarOperaciones(respuesta){
				if (respuesta.success) {
					UI.agregarToasts({
						texto: respuesta.mensaje.cuerpo,
						tipo: 'web-arriba-derecha-alto'
					});
					UI.elementos.modalWindow.eliminarUltimaCapa();
				}else{
					UI.elementos.modalWindow.buscarUltimaCapaContenido().convertirEnMensaje(respuesta.mensaje);
				}
			});
		};
		//--------------------- Funcionamiento boton nuevo -------------------------------------------
		var btnNuevo = capaContenido.partes.pie.nodo.querySelector('button.icon-nuevo-azul-claro-32');
		btnNuevo.onclick = function(){
			UI.elementos.modalWindow.eliminarUltimaCapa();
			setTimeout(crearventananuevo,1000);
		};

	}else{
		UI.elementos.modalWindow.buscarUltimaCapaContenido().convertirEnMensaje(respuesta.mensaje);
	}
}
function crearventananuevo(){
	var ventanaNuevo = UI.crearVentanaModal({
		cabecera: {
			html: UI.buscarConstructor('operacion').titulo
		},
		cuerpo: {
			tipo: 'nuevo',
			formulario: UI.buscarConstructor('operacion')
		},
		pie: {
			html: 	'<section modalButtons>'+
						'<button type="button" class="icon-guardar-indigo-32"> </button>'+
						'<button type="button" class="icon-cerrar-rojo-32"> </button>'+
					'</section>'
		}
	});
	var btnGuardar = ventanaNuevo.partes.pie.nodo.querySelector('button.icon-guardar-indigo-32');
	var btnCerrar = ventanaNuevo.partes.pie.nodo.querySelector('button.icon-cerrar-rojo-32');
	btnCerrar.onclick = function(){
		UI.elementos.modalWindow.eliminarUltimaCapa();
	};
	btnGuardar.onclick = function(){
		var formulario = UI.elementos.modalWindow.buscarUltimaCapaContenido().partes.cuerpo.formulario;
		if(formulario.validar()){
			var peticion = formulario.captarValores();
			peticion.entidad = 'operacion';
			peticion.modulo = 'seguridad';
			peticion.operacion = 'guardar';
			var cuadro = {
				contenedor: UI.elementos.modalWindow.buscarUltimaCapaContenido().partes.cuerpo.nodo,
				cuadro:{
					nombre: 'guardarOperaciones',
					mensaje : 'Guardando Cambios'
				}
			};
			torque.manejarOperacion(peticion,cuadro,function(respuesta){
				if (respuesta.success) {
					UI.agregarToasts({
						texto: respuesta.mensaje.cuerpo,
						tipo: 'web-arriba-derecha-alto'
					});
					UI.elementos.modalWindow.eliminarUltimaCapa();
				}else{
					UI.elementos.modalWindow.buscarUltimaCapaContenido().convertirEnMensaje(respuesta.mensaje);
				}
			});
		}
	};
}
//------------------------------------ Campos -----------------------------------
var buscarCampos = function camposHoja(nodo){
	var asignarOperaciones = UI.crearVentanaModal({
		cuerpo:{
			html: 'aqui va el cuadro carga'
		}
	});
	var peticion = {
		entidad : 'privilegio',
		operacion: 'buscarCampos',
		modulo: 'seguridad',
		codigo : nodo.getAttribute('codigo')
	};
	var cuadro = {
		contenedor: asignarOperaciones.partes.cuerpo.nodo,
		cuadro:{
			nombre: 'esperaCampos',
			mensaje : 'cargando campos disponibles'
		}
	};
	UI.elementos.modalWindow.buscarUltimaCapaContenido().registroId = nodo.getAttribute('codigo');
	torque.manejarOperacion(peticion,cuadro,function armarOperaciones(respuesta){
		if (respuesta.success) {
			construirFormularioAsignarCampo(UI.elementos.modalWindow.buscarUltimaCapaContenido(),respuesta.registro,nodo);
		}else{
			formCampoNuevo(UI.elementos.modalWindow.buscarUltimaCapaContenido(),nodo);
			UI.agregarToasts({
				texto: respuesta.mensaje.titulo,
				tipo: 'web-arriba-derecha-alto'
			});
		}
	});
};
var formCampoNuevo = function(capaContenido,nodo){
	var constructor = UI.buscarConstructor('campo');
	constructor.campos.splice(2,1);
	capaContenido.convertirEnFormulario({
		cabecera:{
			html: 'Nuevo '+UI.buscarConstructor('campo').titulo+' Restringido para '+nodo.getAttribute('titulo')
		},
		cuerpo:{
			formulario: constructor ,
			tipo: 'nuevo'
		},
		pie:{
			html: '<section modalButtons>'+
						'<button type="button" class="icon-guardar-indigo-32"> </button>'+
						'<button type="button" class="icon-cerrar-rojo-32"> </button>'+
					'</section>'
		}
	});
};
function construirFormularioAsignarCampo(capaContenido,campos,nodo){
		// TODO: formulario de campos disponibles
		capaContenido.convertirEnFormulario({
			cabecera: {
				html: 'Campos Disponibles'
			},
			cuerpo:{
				html: JSON.stringify(campos.disponibles)
			},
			pie: {
				html: '<section modalButtons>'+
							'<button type="button" class="icon-nuevo-azul-claro-32"> </button>'+
							'<button type="button" class="icon-cerrar-rojo-32"> </button>'+
						'</section>'
			}
		});
		var btnNuevo = capaContenido.partes.pie.nodo.querySelector('button.icon-nuevo-azul-claro-32');
		btnNuevo.onclick = function invocarCampoNuevo(){
			formCampoNuevo(capaContenido,nodo);
		};
}
//----------------------------------- Formulario de Componente -----------------------
function construirFormulario(){
	UI.elementos.botonera.buscarBoton('abrir').nodo.click();
	var formComponente = UI.crearVentanaModal({
		contenido: 'ancho',
		cabecera:'Nuevo Componente',
		cuerpo:{
			tipo: 'nuevo',
			formulario: UI.buscarConstructor('componente')
		},
		pie:{
			html: '<section modalButtons>'+
						'<button type="button" class="icon icon-guardar-indigo-32"> </button>'+
						'<button type="button" class="icon icon-cerrar-rojo-32"> </button>'+
					'</section>'
		}
	});
	var cerrar = formComponente.nodo.querySelector('button.icon-cerrar-rojo-32');
	cerrar.onclick = function cerrarVentanta(){
		UI.elementos.modalWindow.eliminarUltimaCapa();
	};
	var guardar = formComponente.nodo.querySelector('button.icon-guardar-indigo-32');
	guardar.onclick = guardarComponente;
}
function guardarComponente(){
	var formulario = UI.elementos.modalWindow.buscarUltimaCapaContenido().partes.cuerpo.formulario;
	if(formulario.validar()){
		var peticion = formulario.captarValores();
		peticion.entidad = 'componente';
		peticion.modulo = 'seguridad';
		peticion.operacion = 'guardar';
		var cuadro = {
			contenedor : UI.elementos.modalWindow.buscarUltimaCapaContenido().partes.cuerpo.nodo,
			cuadro :{
			  nombre: 'Guardar Componente nuevo',
			  mensaje: 'Guardando registro'
			}
		};
		torque.manejarOperacion(peticion,cuadro,function guardar(respuesta){
			UI.elementos.modalWindow.buscarUltimaCapaContenido().convertirEnMensaje(respuesta.mensaje);
			llenarArbol(UI.buscarVentana('formularioArbol'));
		});
	}else{
		UI.agregarToasts({
			texto:'debe llenar el formulario para guardar',
			tipo: 'web-arriba-derecha-alto'
		});
	}
}
function formularioEditarComponente(nodo){
	var formComp = UI.crearVentanaModal({
		cuerpo:{
			html: 'cuadro de carga'
		}
	});
	var peticion = {
		entidad : 'componente',
		modulo:'seguridad',
		operacion: 'buscarRegistro',
		codigo: nodo.getAttribute('codigo')
	};
	var cuadroCarga = {
		contenedor: formComp.partes.cuerpo.nodo,
		cuadro:{
			nombre: 'cargando componente',
			mensaje: 'Buscando datos del componente'
		}
	};
  torque.manejarOperacion(peticion,cuadroCarga,function motarFormularioNuevo(respuesta){
		var formulario = UI.elementos.modalWindow.buscarUltimaCapaContenido().convertirEnFormulario({
			contenido: 'ancho',
			cabecera:{
				html: 'Modificar '+respuesta.registros.titulo
			},
			cuerpo:{
				tipo: 'modificar',
				formulario: UI.buscarConstructor('componente'),
				registro: respuesta.registros
			},
			pie:{
				html: '<section modalButtons>'+
							'<button type="button" class="icon icon-modificar-verde"> </button>'+
							'<button type="button" class="icon icon-cerrar-rojo-32"> </button>'+
						'</section>'
			}
		});
    formComp.partes.pie.nodo.querySelector('button.icon-cerrar-rojo-32').onclick = function(){
      UI.elementos.modalWindow.eliminarUltimaCapa();
    };
    formComp.partes.pie.nodo.querySelector('button.icon-modificar-verde').onclick = activarEdicion;
  });
}
var activarEdicion = function(){
  var formComp = UI.elementos.modalWindow.buscarUltimaCapaContenido();
  formComp.partes.cuerpo.formulario.habilitar();
	var boton = formComp.partes.pie.nodo.querySelector('button.icon-modificar-verde');
	boton.classList.remove('icon-modificar-verde');
	boton.classList.add('icon-guardar-indigo-32');
  this.onclick = finalizarEdicion;
};
var finalizarEdicion = function(){
  var formComp = UI.elementos.modalWindow.buscarUltimaCapaContenido().partes.cuerpo.formulario;
  var nuevoRegistro = formComp.captarValores();
  nuevoRegistro.codigo = formComp.registroId;
	console.log(nuevoRegistro);
	enviarCambios(nuevoRegistro,formComp.partes.cuerpo.nodo);
};

function enviarCambios(peticion,contenedor){
	peticion.entidad = 'componente';
	peticion.modulo = 'seguridad';
	peticion.operacion = 'modificar';
	//luego el cuadro
	var infoCuadro = {
		contenedor: contenedor,
		cuadro:{
			nombre: 'guardando cambios',
			mensaje: 'Guardando cambios'
		}
	};
	torque.manejarOperacion(peticion,infoCuadro,function guardarCambios(respuesta){
		if(respuesta.success){
			llenarArbol(UI.buscarVentana('formularioArbol'));
			UI.elementos.modalWindow.eliminarUltimaCapa();
		}else{
			UI.elementos.modalWindow.buscarUltimaCapaContenido().convertirEnMensaje(respuesta.mensaje);
		}
	});
}
