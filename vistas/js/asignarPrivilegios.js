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
			arreglo.push(this.hojas[i].atributos);
		}
		UI.agregarToasts({
			texto: 'Exportacion realizada con exito',
			tipo: 'web-arriba-derecha'
		});
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
				},{
					nombre:'operaciones',
					html: '<button class="mat-text-but">Guardar cambios</button>'+
								'<button class="mat-text-but">Cancelar</button>'
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
				hojaOnClick: function asignar(hoja){
					var accion = arbolTemp.cambio(hoja);
				},
				contenedor: UI.buscarVentana('formularioArbol').buscarSector('arbol').nodo
			});
		});
	}else{
		UI.crearMensaje(respuesta);
	}
	//funcionamiento botones
	var btnNuevo = document.querySelector('button[btnnuevo]');
	btnNuevo.onclick = construirFormulario;
}
//----------------------------------- Formulario de Componente -----------------------
function construirFormulario(){
	UI.elementos.botonera.buscarBoton('abrir').nodo.click();
	UI.crearVentanaModal({
		contenido: 'ancho',
		cabecera:'Nuevo Componente',
		cuerpo:{
			alto:300,
			campos:[
				{
					tipo : 'campoDeTexto',
					parametros : {titulo:'Titulo',nombre:'titulo',tipo:'simple',eslabon:'simple',usaToolTip:true}
				},{
					tipo : 'campoDeTexto',
					parametros : {titulo:'Color',nombre:'color',tipo:'simple',eslabon:'simple',usaToolTip:false}
				},{
					tipo : 'campoDeTexto',
					parametros : {titulo:'Enlace',nombre:'enlace',tipo:'simple',eslabon:'simple',usaToolTip:false}
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
		},
		pie:{
			html: '<section modalButtons>'+
						'<button type="button" cancelar </button>'+
						'<button type="button" guardar </button>'+
					'</section>'
		}
	});
	var cerrar = document.querySelector('button[cancelar]');
	cerrar.onclick = function cerrarVentanta(){
		UI.elementos.modalWindow.eliminarUltimaCapa();
	};
	var guardar = document.querySelector('button[guardar]');
	guardar.onclick = guardarComponente;
}
function guardarComponente(){
	var campos = UI.elementos.modalWindow.buscarUltimaCapaContenido().partes.cuerpo.campos;
	var data = [];
	for (var i = 0; i < campos.length; i++) {
		if(campos[i].captarValor()){
			data.push({nombre:campos[i].captarNombre(),valor:campos[i].captarValor()});
		}
	}
	if(data.length){
		torque.guardar('componente',data,function guardar(respuesta){
			UI.elementos.modalWindow.buscarUltimaCapaContenido().convertirEnMensaje(respuesta.mensaje);
		});
	}else{
		UI.agregarToasts({
			texto:'debe llenar el formulario para guardar',
			tipo: 'web-arriba-derecha-alto'
		});
	}
}
