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
		UI.crearMensaje(respuesta);
	}
	//funcionamiento botones
	var btnNuevo = document.querySelector('button[btnnuevo]');
	btnNuevo.onclick = construirFormulario;
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
					click: operaciones
				},{
						clases: ['icon','icon-editar-blanco-32','mat-deeporange500'],
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
			var sectorArbol = UI.buscarVentana('formularioArbol').buscarSector('arbol');
			sectorArbol.nodo.appendChild(arbol.raiz.nodo);
		});
	};
	botonLimpiar.onclick = function limpiar(){
		arbolTemp.buscar(0).titulo.nodo.click();
	};
	return formularioArbol;
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
	var campos = UI.elementos.modalWindow.buscarUltimaCapaContenido().partes.cuerpo.campos;
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
		torque.guardar('componente',data,function guardar(respuesta){
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
//--------------------------- Funciones Opciones ------------------------
var operaciones = function operacionesHoja(nodo){
	console.log(nodo.getAttribute('privilegio'));
	var asignarOperaciones = UI.crearVentanaModal({
		cuerpo:{
			html: 'aqui va el cuadro carga'
		}
	});
	var peticion = {
		entidad : 'privilegio',
		operacion: 'buscarOperacionesDisponibles',
		codigo : nodo.getAttribute('codigo')
	};
	var cuadro = {
		contenedor: asignarOperaciones.partes.cuerpo.nodo,
		cuadro:{
			nombre: 'esperaOperaciones',
			mensaje : 'cargando operaciones disponibles'
		}
	};
	torque.manejarOperacion(peticion,cuadro,function armarOperaciones(respuesta){
		UI.elementos.modalWindow.buscarUltimaCapaContenido().convertirEnMensaje(respuesta.mensaje);
	});
};
var editarPrivilegio = function(hoja){

};
