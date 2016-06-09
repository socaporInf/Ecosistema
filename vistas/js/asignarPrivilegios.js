//se usa rel objeto arbol del archivo arbolRecursivo.js
function construirUI(){
	let contenedor = document.querySelector('div[contenedor]');
	let venCarga = UI.agregarVentana({
		tipo: 'titulo',
		nombre:'titulo'
	},contenedor);

	let carga = venCarga.agregarSector({nombre:'carga'});

	let Peticion = {
		entidad: 'privilegio',
		operacion: 'buscarRegistro',
		codigo: location.search.substring(6,location.search.length)
	}

	let infoCuadroCarga = {
		nodo: carga.nodo,
		cuadro:{
			mensaje:'Cargando'
		}
	}

	torque.manejarOperacion(Peticion,infoCuadroCarga,costruccionInicial);
}

function costruccionInicial(respuesta){
	if(respuesta.success){
		//acomodo el titulo del formulario
		let titulo = UI.buscarVentana('titulo');
		titulo.quitarSector('carga');
		titulo.agregarTitulo({
			html:'<l><strong>ROL:</strong> '+respuesta.registro.rol+'</l> <r><strong>EMPRESA:</strong> '+respuesta.registro.empresa+'</r>',
			tipo:'basico'
		});		

		let formularioArbol = UI.agregarVentana({
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
		let Peticion = {
			entidad: 'privilegio',
			operacion: 'buscarArbol',
			codigo: ''
		}

		let infoCuadroCarga = {
			nodo: formularioArbol.buscarSector('arbol').nodo,
			cuadro:{
				mensaje:'Cargando Arbol'
			}
		}

		torque.manejarOperacion(Peticion,infoCuadroCarga,function cargarArbol(respuesta){
			let arbol = new Arbol(respuesta.registros,UI.buscarVentana('formularioArbol').buscarSector('arbol').nodo);
		});
	}else{
		UI.crearMensaje(respuesta);
	}
	//funcionamiento botones
	let btnNuevo = document.querySelector('button[btnnuevo]');
	btnNuevo.onclick = construirFormulario;
}
//----------------------------------- Formulario de Privilegios -----------------------
function construirFormulario(){
	let formularioPrivilegios = UI.agregarVentana({
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
	},80)
	
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