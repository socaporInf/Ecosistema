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

		let formulario = UI.agregarVentana({
			tipo: 'columna',
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
			let arbol = new Arbol(respuesta.registros,UI.buscarVentana('formulario').buscarSector('arbol').nodo);
		});
	}else{
		UI.crearMensaje(respuesta);
	}
}

//transformar un arbol de nodos en una estructura interactiva
var Arbol = function  construirArbol(nodos,contenedor){
	
	var Hoja = function(titulo){


		var Titulo = function(texto){
			this.nodo = null;
			this.construirNodo = function(texto){
				let nodo = document.createElement('div');
				nodo.setAttribute('titulo-hoja','');
				nodo.textContent = texto;

				nodo.onclick = function asignar(){
					this.classList.toggle('asignado');
					this.previousSibling.classList.toggle('asignado');
				}
				this.nodo = nodo;
			}
			this.construirNodo(texto);
		}
		//------------------fin titulo -----------
		
		var Peciolo =  function(){

			this.nodo = null;

			this.construirNodo = function(){
				//peciolo se llama la parte de la hoja que la une con el tallo
				let nodo = document.createElement('div');
				nodo.setAttribute('peciolo','');

				let boton = document.createElement('button');
				boton.setAttribute('little-mat-button-invisible','');
				boton.classList.add('arrow_down_gray');

				boton.onclick = function(){
					this.parentNode.parentNode.classList.toggle('abierto');
					this.classList.toggle('activo');
				};
				
				nodo.appendChild(boton);				
				this.nodo = nodo;
			}
			this.construirNodo();
		}
		//------------------fin peciolo -----------
		this.titulo = null;
		this.nodo = null;
		this.peciolo = null;
		
		this.construirNodo = function(titulo){
			let nodo =  document.createElement('div');
			nodo.setAttribute('hoja','');

			this.peciolo = new Peciolo();
			nodo.appendChild(this.peciolo.nodo);

			this.titulo = new Titulo(titulo);
			nodo.appendChild(this.titulo.nodo);

			this.nodo =  nodo;
		}
		this.construirNodo(titulo);
	}
	//----------------fin hoja-----------------------
	this.nodos = nodos;
	this.contenedor = contenedor;
	this.nodo = null; 

	this.construirNodo = function(){		
		var arbol = {};
		for(var x = 0; x < nodos.length; x++ ){
			if(nodos[x].codigo==0){
				arbol = nodos[x];
				nodos.splice(x,1);
			}
		}
		arbol.hijos = sesion.buscarHijos(arbol.codigo,nodos);

		arbolUI = this.armarHojas(arbol);
		
		contenedor.appendChild(arbolUI.nodo);
	}

	this.armarHojas =  function(rama){
		let hoja = new Hoja(rama.titulo);
		if(rama.hijos){

			for(let x = 0; x < rama.hijos.length; x++){
				let hijo = this.armarHojas(rama.hijos[x]);
				hoja.nodo.appendChild(hijo.nodo);
			}

		}else{
			hoja.removerTallos();
		}
		return hoja;
	}
	this.construirNodo();
}

// transformar un arbol de nodos en una lista
function construirLista(nodos,contenedor){
	var arbol = {};
	for(var x = 0; x < nodos.length; x++ ){
		if(nodos[x].codigo==0){
			arbol = nodos[x];
			nodos.splice(x,1);
		}
	}
	arbol.hijos = sesion.buscarHijos(arbol.codigo,nodos);
	let contenedorLista = document.createElement('ul');
	arbolUI = armarNodo(arbol);
	contenedorLista.appendChild(arbolUI);
	contenedor.appendChild(contenedorLista);
}
function armarNodo(rama){
	let nodo =  document.createElement('li');
	nodo.textContent = rama.titulo;
	if(rama.hijos){
		let contenedorHijos = document.createElement('ul');
		nodo.appendChild(contenedorHijos);
		for(let x = 0; x < rama.hijos.length; x++){
			let hijo = armarNodo(rama.hijos[x]);
			contenedorHijos.appendChild(hijo);
		}
	}
	return nodo;
}