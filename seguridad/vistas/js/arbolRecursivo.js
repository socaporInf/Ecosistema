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
		var Opcion = function(atributos){
			this.atributos = atributos;
			this.atributos.id =  Math.floor(Math.random() * (100 - 1)) + 1;
			this.nodo = null;
			this.construirNodo = function(){
				var nodo = document.createElement('article');
				nodo.classList.add('opcion-hoja');
				this.nodo = nodo;
				var yo = this;
				if(this.atributos.click){
					this.nodo.onclick = function(){
							yo.atributos.click(this);
					};
				}
				if(this.atributos.clases){
					this.agregarClases();
				}
			};
			this.agregarClases = function(){
				for (var i = 0; i < this.atributos.clases.length; i++) {
					this.agregarClase(this.atributos.clases[i]);
				}
			};
			this.agregarClase = function(clase){
				this.nodo.classList.add(clase);
			};
			this.construirNodo();
		};
		//------------------fin Opcion -----------
		var Peciolo = function(){

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
			this.activar = function () {
				var button = this.nodo.querySelector('button');
				if(button.classList.contains('arrow_down_gray')){
					button.click();
				}
			};
			this.construirNodo();
		};
		//------------------fin peciolo -----------
		this.atributos = atributos;
		this.titulo = null;
		this.nodo = null;
		this.peciolo = null;
		this.opciones = [];

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

		this.agregarOpciones = function (opciones){
			var opcion;
			for (var i = 0; i < opciones.length; i++) {
				var validar = false;
				if(opciones[i].privilegio){
					if(this.atributos.privilegio){
						validar = true;
					}
				}else{
					validar = true;
				}
				if(validar){
					var nuevaOpcion = this.agregarOpcion(opciones[i]);
					nuevaOpcion.nodo.style.right = (i*29)+5+'px';
					nuevaOpcion.nodo.setAttribute('codigo',this.atributos.codigo);
					nuevaOpcion.nodo.setAttribute('padre',this.atributos.padre);
					nuevaOpcion.nodo.setAttribute('titulo',this.atributos.titulo);
					nuevaOpcion.nodo.setAttribute('tipo',this.atributos.tipo);
					nuevaOpcion.nodo.setAttribute('privilegio',this.atributos.privilegio);
				}
			}
		};
		this.agregarOpcion = function(opcion){
			nuevaOpcion = new Opcion(opcion);
			this.opciones.push(nuevaOpcion);
			this.nodo.appendChild(nuevaOpcion.nodo);
			return nuevaOpcion;
		};
		this.asignarPrivilegio =function(codigoPrivilegio){
			this.atributos.privilegio = codigoPrivilegio;
		};
		this.construirNodo();
	};
	//----------------fin hoja-----------------------
	this.nodos = atributos.nodos;
	this.contenedor = atributos.contenedor;
	this.hojaOnClick = atributos.hojaOnClick;
	this.hojaOpciones = atributos.hojaOpciones;
	this.nodosActivos = atributos.hojasActuales || [];
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

		this.raiz = this.armarHojas(arbol);

		this.contenedor.appendChild(this.raiz.nodo);
		this.raiz = this.raiz;
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
		this.verificarHoja(rama,hoja);
		hoja.agregarOpciones(this.hojaOpciones);
		if(rama.codigo === '0'){
			this.hojas = hoja;
		}
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
	this.verificarHoja = function(rama,hoja){
		if(this.nodosActivos[0] === null){
			this.nodosActivos = [];
		}
		for(var x = 0; x < this.nodosActivos.length; x++){
			if(rama.codigo == this.nodosActivos[x].codigo){
				hoja.peciolo.activar();
				hoja.asignarPrivilegio(this.nodosActivos[x].privilegio);
				hoja.titulo.nodo.click();
			}
		}
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
