//se usa el objeto arbol del archivo arbolRecursivo.js
var ArbolTemp = function(){
	this.hojas = [];

	this.validarPadre = function(privilegio) {
		if(privilegio.padre === null){
			console.log('es la raiz');
			return true;
		}else if(this.buscar(privilegio.padre)){
			//en los casos que no sea la raiz
			return true;
		}else{
			UI.agregarToasts({
				texto: 'no existe rama que lo una al arbol de privilegios',
				tipo: 'web-arriba-derecha-alto'
			});
			return false;
		}
	};
	this.buscarHijos = function(hoja){
		var hijos = [];
		for (var i = 0; i < this.hojas.length; i++) {
			if(this.hojas[i].atributos.padre == hoja.atributos.codigo){
				hijos.push(this.hojas[i]);
				hijos = hijos.concat(this.buscarHijos(this.hojas[i]));
			}
		}
		return hijos;
	};
	this.buscar = function(codigo){
		for (var i = 0; i < this.hojas.length; i++) {
			if(this.hojas[i].atributos.codigo == codigo){
				return this.hojas[i];
			}
		}
		return false;
	};
	this.agregar = function(hoja){
		if(this.validarPadre(hoja.atributos)){
			if(!this.buscar(hoja.atributos.codigo)){
				this.hojas.push(hoja);
				hoja.peciolo.nodo.classList.toggle('asignado');
				return true;
			}else{
				UI.agregarToasts({
					texto: 'privilegio ya esta agregado'
				});
				return false;
			}
		}
	};
	this.remover = function(codigo){
		var hoja = this.buscar(codigo);
		if(hoja){
			var hijos = this.buscarHijos(hoja);
			if(hijos){
				for(var x = 0;x < hijos.length;x++){
					this.remover(hijos[x].atributos.codigo);
				}
			}
			hoja.peciolo.nodo.classList.toggle('asignado');
			this.hojas.splice(this.hojas.indexOf(hoja),1);
			return true;
		}
	};
	this.cambio = function(hoja){
		var resultado;
		if(this.buscar(hoja.atributos.codigo)){
			resultado = this.remover(hoja.atributos.codigo);
			if(resultado){
				resultado = 'removida';
			}
		}else{
			resultado = this.agregar(hoja);
			if(resultado){
				resultado = 'agregada';
			}
		}
		return resultado;
	};
	this.exportarArreglo = function(){
		var arreglo = [];
		for(var i = 0; i < this.hojas.length;i++){
			arreglo.push({
				codigo: this.hojas[i].atributos.codigo,
				padre: this.hojas[i].atributos.padre,
				privilegio: this.hojas[i].atributos.privilegio,
				tipo: this.hojas[i].atributos.tipo,
				tit_padre: this.hojas[i].atributos.tit_padre,
				titulo: this.hojas[i].atributos.titulo
			});
		}
		return arreglo;
	};
};
//--------------------------Fin Objeto Privilegios ---------------------------
function construirUI(){
	var contenedor = document.querySelector('div[contenedor]');
	var venCarga = UI.agregarVentana({
		tipo: 'titulo',
		nombre:'titulo'
	},contenedor);

	var carga = venCarga.agregarSector({nombre:'carga'});

	var Peticion = {
		entidad: 'privilegio',
		operacion: 'buscarRegistro',
		codigo: location.search.substring(6,location.search.length)
	};

	var infoCuadroCarga = {
		contenedor: carga.nodo,
		cuadro:{
			nombre: 'asignarPrivilegiosCarga1',
			mensaje:'Cargando'
		}
	};

	torque.manejarOperacion(Peticion,infoCuadroCarga,costruccionInicial);
}

function costruccionInicial(respuesta){
	if(respuesta.success){
		//acomodo el titulo del formulario
		var titulo = UI.buscarVentana('titulo');
		titulo.quitarSector('carga');
		titulo.agregarTitulo({
			html:'<l><strong>ROL:</strong> '+respuesta.registro.rol+'</l> <r><strong>EMPRESA:</strong> '+respuesta.registro.empresa+'</r>',
			tipo:'basico'
		});

		var formularioArbol = armarVentanaArbol();
		llenarArbol(formularioArbol);
	}else{
		UI.crearMensaje(respuesta.mensaje);
	}
}
function llenarArbol(formularioArbol){
	var Peticion = {
		entidad: 'privilegio',
		operacion: 'buscarArbol',
		codigo: UI.elementos.URL.captarParametroPorNombre('ruta')
	};

	var infoCuadroCarga = {
		contenedor: formularioArbol.buscarSector('arbol').nodo,
		cuadro:{
			nombre: 'cargarArbol',
			mensaje:'Cargando Arbol'
		}
	};

	torque.manejarOperacion(Peticion,infoCuadroCarga,function cargarArbol(respuesta){
		arbolTemp = new ArbolTemp();
		arbol = new Arbol({
			hojasActuales: respuesta.hojasActuales,
			nodos: respuesta.hojasGenereal,
			hojaOnClick: function asignar(hoja){
				var accion = arbolTemp.cambio(hoja);
			},
			hojaOpciones:[
				{
					clases: ['icon','icon-operaciones-negro-32'],
					click: buscarOperaciones,
					privilegio: true
				},{
					clases: ['icon','icon-editar-negro-32'],
					click: editarPrivilegio
				}
			],
			contenedor: UI.buscarVentana('formularioArbol').buscarSector('arbol').nodo
		});
	});
}
//----------------------------------- ventana Arbol ----------------------------------
function armarVentanaArbol(){
	var formularioArbol = UI.agregarVentana({
		tipo: 'arbol',
		nombre: 'formularioArbol',
		titulo:{
			html: 'Asignacion de Privilegios',
			tipo: 'inverso'
		},
		sectores:[
			{
				nombre:'arbol',
				html:'aqui va el arbol'
			},{
				nombre:'operaciones',
				html: '<button class="mat-text-but" guardar>Guardar cambios</button>'+
							'<button class="mat-text-but" limpiar>Limpiar</button>'
			}
		]
	},document.querySelector('div[contenedor]'));

	formularioArbol.nodo.classList.add('not-first');
	formularioArbol.buscarSector('arbol').nodo.style.overflow='auto';
	formularioArbol.buscarSector('arbol').nodo.style.minHeight='100px';

	var botonGuardar = formularioArbol.nodo.querySelector('button[guardar]');
	var botonLimpiar = formularioArbol.nodo.querySelector('button[limpiar]');
	botonGuardar.onclick = function guardarPrivilegios(){
		var peticion = {
			entidad: 'privilegio',
			operacion: 'guardarArbol',
			codigo: UI.elementos.URL.captarParametroPorNombre('ruta'),
			data: JSON.stringify(arbolTemp.exportarArreglo())
		};
		var espera = {
			contenedor: UI.buscarVentana('formularioArbol').buscarSector('arbol').nodo,
			cuadro:{
				nombre: 'guardando Arbol',
				mensaje: 'guardando'
			}
		};
		torque.manejarOperacion(peticion,espera,function resultadoGuardado(respuesta){
			UI.agregarToasts({
				texto:respuesta.mensaje,
				tipo: 'web-arriba-derecha-alto'
			});
			llenarArbol(UI.buscarVentana('formularioArbol'));
		});
	};
	botonLimpiar.onclick = function limpiar(){
		arbolTemp.buscar(0).titulo.nodo.click();
	};
	return formularioArbol;
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
		operacion: 'buscarOperacionesDisponibles',
		codigo : nodo.getAttribute('privilegio')
	};
	var cuadro = {
		contenedor: asignarOperaciones.partes.cuerpo.nodo,
		cuadro:{
			nombre: 'esperaOperaciones',
			mensaje : 'cargando operaciones disponibles'
		}
	};
	UI.elementos.modalWindow.buscarUltimaCapaContenido().registroId = nodo.getAttribute('privilegio');
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
				operacion : 'asignarOperaciones',
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
/*-------------------------- ArmarPeticion ----------------------------*/
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
