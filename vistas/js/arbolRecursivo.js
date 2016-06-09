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