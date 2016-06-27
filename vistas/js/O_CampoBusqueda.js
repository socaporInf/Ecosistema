var CampoBusqueda = function(atributos){
  this.atributos = atributos;
  this.campoDeTexto = null;
  this.nodo = null;

  this.construirNodo = function(){
    var nodo = document.createElement('div');
    nodo.setAttribute('campoBusqueda','');
    this.campoDeTexto = new CampoDeTexto({
      titulo:this.atributos.titulo,
      nombre:this.atributos.nombre,
      tipo:'simple',
      eslabon:'area',
      usaToolTip:true
    });
    nodo.appendChild(this.campoDeTexto.nodo);
    this.nodo = nodo;
  }
  this.construirNodo();
}
