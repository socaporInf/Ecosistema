var Card = function(atributos){
	/*objeto constructor ={
		titulo: string,
		color: string(sin el #),
		cuerpo: string
	}*/
	var Titulo = function(titulo){
		this.texto = titulo;
		this.nodo = null;

		this.construirNodo = function(){
			var nodo = document.createElement('div');
			nodo.setAttribute('card-titulo','');

			nodo.textContent = this.texto;

			this.nodo = nodo;
		};
		this.construirNodo();
	};

	this.atributos = atributos;
	this.nodo = null;
	this.titulo = null;

	this.construirNodo = function(){
		var nodo = document.createElement('div');
		nodo.setAttribute('mat-card','');
		nodo.classList.add('cuadrada');
		nodo.classList.add('viewver');
		nodo.style.backgroundColor='#'+this.atributos.color;
		console.log(this.atributos);
		nodo.innerHTML = this.atributos.cuerpo;
		this.nodo = nodo;

		this.agregarTitulo();
	};
	this.agregarTitulo = function(){
		var titulo = new Titulo(this.atributos.titulo);
		this.nodo.appendChild(titulo.nodo);
		this.titulo = titulo;
	};
	this.construirNodo();
};
