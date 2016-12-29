var Card = function(atributos){
	/*objeto constructor ={
		titulo: string,
		color: string(sin el #),
		cuerpo: string
		tipo: string
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
	atributos.tipo = atributos.tipo || 'cuadrada';
	this.atributos = atributos;
	this.nodo = null;
	this.titulo = null;

	this.construirNodo = function(){
		var nodo = document.createElement('div');
		nodo.setAttribute('mat-card','');
		nodo.classList.add(this.atributos.tipo);
		nodo.classList.add('viewver');
		nodo.style.backgroundColor='#'+this.atributos.color;
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
