var CamporArchivo = function(atributos){
  var Boton = function(attr,campo){
    this.nodo = null;
    this.construirNodo = function(){
      var nodo = document.createElement('button');
      nodo.classList.add('mat-indigo500');
      nodo.classList.add('material-icons');
      nodo.classList.add('white');
      nodo.classList.add('icon');
      nodo.type = 'button';
      nodo.textContent = 'file_upload';
      this.nodo = nodo;
      this.habilitar();
    };
    this.habilitar = function(){
      this.nodo.classList.remove('deshabilitado');
      this.nodo.onclick = this.activarCampo;
    };
    this.deshabilitar = function(){
      this.nodo.classList.add('deshabilitado');
      this.nodo.onclick = function(){};
    };
    this.construirNodo();
  };
  this.atributos = atributos;
  this.campoDeTexto = null;
  this.boton = null;
  this.nodo = null;

  this.construirNodo = function(){
    var nodo = document.createElement('div');
    nodo.setAttribute('campoBusqueda','');
    if(this.atributos.eslabon === 'area'){
      nodo.setAttribute('area','');
    }
    //TODO: agregar el campo de texto y el boton
    //this.campoDeTexto =
    nodo.appendChild(this.comboBox.nodo);
    this.comboBox.select.setAttribute('tabindex','-1');
    this.boton = new Boton(atributos,this);
    nodo.appendChild(this.boton.nodo);
    this.nodo = nodo;
  };
  this.habilitar = function(){
    this.comboBox.select.classList.remove('deshabilitado');
    this.boton.habilitar();
  };
  this.deshabilitar = function(){
    this.comboBox.select.classList.add('deshabilitado');
    this.boton.deshabilitar();
  };
  this.construirNodo();
};
