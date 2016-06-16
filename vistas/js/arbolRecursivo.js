//transformar un arbol de nodos en una estructura interactiva
var Arbol = function(atributos){

	var Hoja = function(atributos){

		var Titulo = function(texto){
			this.nodo = null;
			this.construirNodo = function(texto){
				var nodo = document.createElement('div');
				nodo.setAttribute('titulo-hoja','');
				nodo.textContent = texto;
				this.nodo = nodo;
			};
			this.construirNodo(texto);
		};
		//------------------fin titulo -----------

		var Peciolo =  function(){

			this.nodo = null;

			this.construirNodo = function(){
				//peciolo se llama la parte de la hoja que la une con el tallo
				var nodo = document.createElement('div');
				nodo.setAttribute('peciolo','');

				var boton = document.createElement('button');
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
				var button = this.nodo.querySelector('button');
				button.classList.remove('arrow_down_gray');
			};
			this.construirNodo();
		};
		//------------------fin peciolo -----------
		this.atributos = atributos;
		this.titulo = null;
		this.nodo = null;
		this.peciolo = null;

		this.construirNodo = function(){
			var nodo =  document.createElement('div');
			nodo.setAttribute('hoja','');

			this.peciolo = new Peciolo();
			nodo.appendChild(this.peciolo.nodo);

			this.titulo = new Titulo(this.atributos.titulo);
			nodo.appendChild(this.titulo.nodo);

			this.nodo =  nodo;
		};

		this.removerTallos = function(){
			this.peciolo.removerBoton();
		};

		this.construirNodo();
	};
	//----------------fin hoja-----------------------
	this.nodos = atributos.nodos;
	this.contenedor = atributos.contenedor;
	this.hojaOnClick = atributos.hojaOnClick;
	this.hojas = null;

	this.construirNodo = function(){
		var arbol = {};
		for(var x = 0; x < this.nodos.length; x++ ){
			if(this.nodos[x].codigo==='0'){
				arbol = this.nodos[x];
				this.nodos.splice(x,1);
			}
		}
		arbol.hijos = sesion.buscarHijos(arbol.codigo,this.nodos);

		arbolUI = this.armarHojas(arbol);

		this.contenedor.appendChild(arbolUI.nodo);
		this.raiz = arbolUI;
		this.raiz.nodo.classList.add('raiz');
	};

	this.armarHojas =  function(rama){
		var hoja = new Hoja({
			codigo: rama.codigo,
			titulo: rama.titulo,
			padre: rama.padre,
			tit_padre: rama.tit_padre,
			tipo: rama.tipo
		});
		this.asignarOnClickHoja(hoja);
		if(rama.hijos.length){

			for(var x = 0; x < rama.hijos.length; x++){
				var hijo = this.armarHojas(rama.hijos[x]);
				hoja.nodo.appendChild(hijo.nodo);
			}

		}else{
			hoja.removerTallos();
		}
		return hoja;
	};

	this.asignarOnClickHoja = function(hoja){
		var arbol = this;
		hoja.titulo.nodo.onclick = function asignar(){
			if(arbol.hojaOnClick){
				arbol.hojaOnClick(hoja);
			}
		};
	};
	this.construirNodo();
};
