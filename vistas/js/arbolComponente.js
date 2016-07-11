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
				console.log(hoja);
			},
			hojaOpciones:[
				{
					clases: ['icon','icon-operaciones-negro-32'],
					click: buscarOperaciones
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
			construirFormularioAsignarOp(UI.elementos.modalWindow.buscarUltimaCapaContenido(),respuesta.registro);
		}else{
			UI.elementos.modalWindow.buscarUltimaCapaContenido().convertirEnMensaje(respuesta.mensaje);
		}
	});
};
var editarPrivilegio = function(hoja){

};
//------------------------------------ Formulario asignar Operaciones -----------------
function construirFormularioAsignarOp(capaContenido,operaciones,privilegio){
	var disponibles = operaciones.disponibles;
	var asignadas = operaciones.asignadas;
	var campos = [];
	if(disponibles){
		for (var i = 0; i < disponibles.length; i++) {
			var campo = {
				tipo: 'checkBox',
				parametros:{
					nombre: disponibles[i].nombreOperacion,
					valor: disponibles[i].codigoOperacion,
					requerido: false,
					habilitado: true,
					tipo: 'girar',
					eslabon: 'area',
					usaTitulo: true,
					marcado: false
				}
			};
			if(asignadas){
				for(var x = 0; x < asignadas.length; x++){
					if(disponibles[i].codigoOperacion === asignadas[x].codigoOperacion){
						campo.parametros.marcado = true;
					}
				}
			}
			campos.push(campo);
		}
		capaContenido.convertirEnFormulario({
			cabecera: {
				html: 'Asignar Operaciones'
			},
			cuerpo: {
				alto: 150,
				campos: campos
			},
			pie: {
				html: '<section modalButtons>'+
							'<button type="button" class="icon-guardar-indigo-32"> </button>'+
							'<button type="button" class="icon-cerrar-rojo-32"> </button>'+
						'</section>'
			}
		});
		capaContenido.nodo.classList.remove('ancho');
		var btnCerrrar = capaContenido.partes.pie.nodo.querySelector('button.icon-cerrar-rojo-32');
		var btnGuardar = capaContenido.partes.pie.nodo.querySelector('button.icon-guardar-indigo-32');
		btnCerrrar.onclick = function(){
			UI.elementos.modalWindow.eliminarUltimaCapa();
		};
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
	}else{
		UI.elementos.modalWindow.buscarUltimaCapaContenido().convertirEnMensaje(respuesta.mensaje);
	}
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
//-------------------------------------------formularios ---------------------------------------------
function obtenenrValoresFormulario(contenedor){
	var campos = contenedor.campos;
	var data = [];
	var validado = false;
	for (var i = 0; i < campos.length; i++) {
		//valido el campo
		if((campos[i].captarRequerido())&&(!campos[i].captarValor())){
			validado = true;
		}
		if(campos[i].captarValor()){
			data.push({nombre:campos[i].captarNombre(),valor:campos[i].captarValor()});
		}
	}
	if(!validado){
		return data;
	}else{
		return false;
	}
}
