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
			tipo: 'columna',
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
		tipo: 'columna',
		alto: '340',
		nombre: 'formularioPrivilegios',
		titulo:{
			html: 'Privilegios',
			tipo:'inverso'
		},sectores:[
			{
				nombre:'campos',
				campos:[
					{
						tipo : 'campoDeTexto',
						parametros : {titulo:'Titulo',nombre:'titulo',tipo:'simple',eslabon:'area',usaToolTip:true}
					},{
						tipo : 'campoDeTexto',
						parametros : {titulo:'Descripcion',nombre:'descripcion',tipo:'area',eslabon:'area',usaToolTip:true}
					},{
						tipo: 'comboBox',
						parametros : {
							nombre:'tipoComponente',
							titulo:'Tipos de Componente',
							eslabon : 'area',
							opciones: [{codigo:'S',nombre:'Sistemas'}]
						}
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
			};
			this.removerBoton = function(){
				this.nodo.innerHTML='';
			};
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
		};
		
		this.removerTallos = function(){
			this.peciolo.removerBoton();
		};

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
		if(rama.hijos.length){

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