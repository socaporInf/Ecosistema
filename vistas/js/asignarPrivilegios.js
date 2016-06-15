//se usa el objeto arbol del archivo arbolRecursivo.js
var Privilegios = function(){
	this.privilegios = [];

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
	this.buscar = function(codigo){
		for (var i = 0; i < this.privilegios.length; i++) {
			if(this.privilegios[i].codigo == codigo){
				return this.privilegios[i];
			}
		}
		return false;
	};
	this.agregar = function(privilegio){
		if(this.validarPadre(privilegio)){
			if(!this.buscar(privilegio.codigo)){
				this.privilegios.push(privilegio);
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
		var privilegio = this.buscar(codigo);
		this.privilegios.splice(this.privilegios.indexOf(privilegio),1);
		return true;
	};
	this.cambio = function(privilegio){
		var resultado;
		if(this.buscar(privilegio.codigo)){
			resultado = this.remover(privilegio.codigo);
		}else{
			resultado = this.agregar(privilegio);
		}
		return resultado;
	};
};

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
		nodo: carga.nodo,
		cuadro:{
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
				}
			]
		},document.querySelector('div[contenedor]'));

		formularioArbol.nodo.classList.add('not-first');

		//formulario arbol
		formularioArbol.buscarSector('arbol').nodo.style.overflow='auto';
		formularioArbol.buscarSector('arbol').nodo.style.minHeight='100px';
		var Peticion = {
			entidad: 'privilegio',
			operacion: 'buscarArbol',
			codigo: ''
		};

		var infoCuadroCarga = {
			nodo: formularioArbol.buscarSector('arbol').nodo,
			cuadro:{
				mensaje:'Cargando Arbol'
			}
		};

		torque.manejarOperacion(Peticion,infoCuadroCarga,function cargarArbol(respuesta){
			var arbol = new Arbol({
				nodos: respuesta.registros,
				contenedor: UI.buscarVentana('formularioArbol').buscarSector('arbol').nodo,
				hojaOnClick: function asignar(hoja){
					if(privilegiosTemp.cambio(hoja.atributos)){
						hoja.titulo.nodo.classList.toggle('asignado');
						hoja.titulo.nodo.previousSibling.classList.toggle('asignado');
					}
				}
			});
		});
	}else{
		UI.crearMensaje(respuesta);
	}
	//funcionamiento botones
	var btnNuevo = document.querySelector('button[btnnuevo]');
	btnNuevo.onclick = construirFormulario;
}
//----------------------------------- Formulario de Privilegios -----------------------
function construirFormulario(){
	var formularioPrivilegios = UI.agregarVentana({
		tipo: 'form-lat',
		alto: '400',
		nombre: 'formularioPrivilegios',
		titulo:{
			html: 'Privilegios',
			tipo:'inverso'
		},sectores:[
			{
				nombre:'campos',
				alto: '350',
				campos:[
					{
						tipo : 'campoDeTexto',
						parametros : {titulo:'Titulo',nombre:'titulo',tipo:'simple',eslabon:'area',usaToolTip:true}
					},{
						tipo: 'comboBox',
						parametros : {
							nombre:'tipoComponente',
							titulo:'Tipos de Componente',
							eslabon : 'area',
							opciones: [
								{codigo:'S',nombre:'Sistemas'},
								{codigo:'F',nombre:'Formulario'},
								{codigo:'R',nombre:'Reporte'},
								{codigo:'M',nombre:'Modulo'}
							]
						}
					},{
						tipo : 'campoDeTexto',
						parametros : {titulo:'Descripcion',nombre:'descripcion',tipo:'area',eslabon:'area',usaToolTip:true}
					}
				]
			}
		]
	},document.querySelector('div[contenedor]'));

	formularioPrivilegios.nodo.classList.add('not-first');
	//cambios botonera
	UI.elementos.botonera.agregarBotones(['guardar','cancelar']);
	UI.elementos.botonera.quitarBoton('nuevo');
	//debido al tiempo que tarda la transicion de entrada de los botones le coloco un tiempo de 20 extra por cada boton

	setTimeout(function(){
		UI.elementos.botonera.buscarBoton('guardar').nodo.onclick = guardarPrivilegios;
		UI.elementos.botonera.buscarBoton('cancelar').nodo.onclick = cancelarPrivilegios;
	},80);

}
function guardarPrivilegios(){
	console.log('entro');
}

function cancelarPrivilegios(){
	UI.quitarVentana('formularioPrivilegios');
	UI.elementos.botonera.quitarBoton('cancelar');
	UI.elementos.botonera.quitarBoton('guardar');
	UI.elementos.botonera.agregarBoton('nuevo').nodo.onclick = construirFormulario;
}
