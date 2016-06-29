var CampoBusqueda = function(atributos){
  var Boton = function(){
    this.nodo = null;
    this.construirNodo = function(){
      var nodo = document.createElement('button');
      nodo.classList.add('mat-but-transp');
      nodo.classList.add('icon-search');
      this.nodo = nodo;
      this.nodo.onclick = function(){
        console.log('hola');
      };
    };
    this.construirNodo();
  };
  this.atributos = atributos;
  this.comboBox = null;
  this.boton = null;
  this.nodo = null;

  this.construirNodo = function(){
    var nodo = document.createElement('div');
    nodo.setAttribute('campoBusqueda','');
    this.comboBox = new ComboBox({
      titulo:this.atributos.titulo,
      nombre:this.atributos.nombre,
      opciones: [],
      eslabon:'busqueda',
      deshabilitado: true
    });
    nodo.appendChild(this.comboBox.nodo);
    this.boton = new Boton();
    nodo.appendChild(this.boton.nodo);
    this.nodo = nodo;
  };
  this.construirNodo();
};
