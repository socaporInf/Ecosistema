function construirUI(){
	var formularioArbol = armarVentanaArbol();
	llenarArbol(formularioArbol);
	var btnNuevo = document.querySelector('button[btnnuevo]');
	btnNuevo.onclick = construirFormulario;
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
		operacion: 'buscarArbolComponente'
	};

	var infoCuadroCarga = {
		contenedor: formularioArbol.buscarSector('arbol').nodo,
		cuadro:{
			nombre: 'cargarArbol',
			mensaje:'Cargando Arbol'
		}
	};

	torque.manejarOperacion(Peticion,infoCuadroCarga,function cargarArbol(respuesta){
		arbol = new Arbol({
			nodos: respuesta.hojasGenereal,
			hojaOnClick: function editar(hoja){
					hoja.peciolo.activar();
			},
			hojaOpciones:[
				{
					clases: ['icon','icon-operaciones-negro-32'],
					click: buscarOperaciones
				},{
					clases: ['icon','icon-campo-negro-32'],
					click: buscarCampos
				},{
					clases: ['icon','icon-editar-negro-32'],
					click: formularioEditarComponente
				}
			],
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
		codigo : nodo.getAttribute('codigo')
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
			var data = obtenenrValoresFormulario(UI.elementos.modalWindow.buscarUltimaCapaContenido().partes.cuerpo);
			peticion ={
				entidad : 'privilegio',
				operacion : 'guardarOperacionesDisponibles',
				codigo : UI.elementos.modalWindow.buscarUltimaCapaContenido().registroId,
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
		}

	}else{
		UI.elementos.modalWindow.buscarUltimaCapaContenido().convertirEnMensaje(respuesta.mensaje);
	}
}
function crearventananuevo(){
	var ventanaNuevo = UI.crearVentanaModal({
		cabecera: {
			html: UI.buscarConstructor('operacion').nuevo.titulo
		},
		cuerpo: {
			alto: UI.buscarConstructor('operacion').nuevo.altura,
			campos: UI.buscarConstructor('operacion').nuevo.campos
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
	}
	btnGuardar.onclick = function(){
		var data = obtenenrValoresFormulario(UI.elementos.modalWindow.buscarUltimaCapaContenido().partes.cuerpo);
		peticion ={
			entidad : 'operacion',
			operacion : 'guardar'
		};
		for (var i = 0; i < data.length; i++) {
		  peticion[data[i].nombre] = data[i].valor;
		}
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
	}
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
	capaContenido.convertirEnFormulario({
		cabecera:{
			html: 'Nuevo '+UI.buscarConstructor('campo').nuevo.titulo+' para '+nodo.getAttribute('titulo')
		},
		cuerpo:{
			campos: [UI.buscarConstructor('campo').nuevo.campos[0],UI.buscarConstructor('campo').nuevo.campos[1]],
			alto:UI.buscarConstructor('campo').nuevo.altura
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
		//creo la ventana de asignacion dependiendo a lo que necesito
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
			alto: UI.buscarConstructor('componente').nuevo.altura,
			campos: UI.buscarConstructor('componente').nuevo.campos
		},
		pie:{
			html: '<section modalButtons>'+
						'<button type="button" cancelar> </button>'+
						'<button type="button" guardar> </button>'+
					'</section>'
		}
	});
	var cerrar = formComponente.nodo.querySelector('button[cancelar]');
	cerrar.onclick = function cerrarVentanta(){
		UI.elementos.modalWindow.eliminarUltimaCapa();
	};
	var guardar = formComponente.nodo.querySelector('button[guardar]');
	guardar.onclick = guardarComponente;
}
function guardarComponente(){
	var peticion = obtenenrValoresFormulario(UI.elementos.modalWindow.buscarUltimaCapaContenido().partes.cuerpo);
	if(peticion){
		torque.guardar('componente',peticion,function guardar(respuesta){
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
		UI.elementos.modalWindow.buscarUltimaCapaContenido().convertirEnFormulario({
			contenido: 'ancho',
			cuerpo:{
				clase: 'lista',
				alto: UI.buscarConstructor('componente').modificar.altura,
				campos: UI.buscarConstructor('componente').modificar.campos
			},
			pie:{
				html: '<section modalButtons>'+
							'<button type="button" class="icon-cerrar-rojo-32"> </button>'+
						'</section>'
			}
		});
    UI.asignarValores(respuesta.registros,formComp.partes.cuerpo);
    formComp.partes.cuerpo.registroId = respuesta.registros.codigo;
    formComp.partes.pie.nodo.querySelector('button.icon-cerrar-rojo-32').onclick = function(){
      UI.elementos.modalWindow.eliminarUltimaCapa();
    };
    formComp.partes.cuerpo.nodo.querySelector('article[update]').onclick = activarEdicion;
  });
}
var activarEdicion = function(){
  var formComp = UI.elementos.modalWindow.buscarUltimaCapaContenido();
  formComp.partes.cuerpo.registro = UI.modificar(formComp.partes.cuerpo);
  this.onclick = finalizarEdicion;
};
var finalizarEdicion = function(){
  var formComp = UI.elementos.modalWindow.buscarUltimaCapaContenido();
  var nuevoRegistro = UI.modificar(formComp.partes.cuerpo);
  nuevoRegistro.push({nombre:'codigo',valor:formComp.partes.cuerpo.registroId});
  enviarCambios(nuevoRegistro,formComp.partes.cuerpo.nodo);
};

function enviarCambios(cambios,contenedor){
	//armo la peticion
	var peticion = {
		entidad: 'componente',
		operacion: 'modificar'
	};
	for (var i = 0; i < cambios.length; i++) {
		peticion[cambios[i].nombre] = cambios[i].valor;
	}
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
