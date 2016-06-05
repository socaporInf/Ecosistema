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
	agregarBotones();
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

		let formulario = UI.agregarVentana({
			tipo: 'formulario',
			nombre: 'formulario',
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

		formulario.nodo.classList.add('not-first');

		let Peticion = {
			entidad: 'privilegio',
			operacion: 'buscarArbol',
			codigo: ''
		}

		let infoCuadroCarga = {
			nodo: formulario.buscarSector('arbol').nodo,
			cuadro:{
				mensaje:'Cargando Arbol'
			}
		}

		torque.manejarOperacion(Peticion,infoCuadroCarga,function cargarArbol(respuesta){
			console.log(respuesta);
		});
	}else{
		UI.crearMensaje(respuesta);
	}
}

function agregarBotones(){
	let botones = ['nuevo','abrir'];
	UI.elementos.botonera = new Botonera(botones);
}