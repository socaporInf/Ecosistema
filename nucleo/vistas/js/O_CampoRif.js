var CampoRif = function(atributos){
  //valores propios
  this.nombre = atributos.nombre;
  this.requerido = atributos.requerido;
  this.titulo = atributos.titulo;
  //estructura fisica
  this.comboLetra = null;
  this.campoNumero = null;
  this.campoFinal = null;
  this.construirNodo = function(){
    var nodo = document.createElement('div');
    nodo.classList.add('campo-rif');
    //partes
    this.comboLetra = new ComboBox({
      nombre:atributos.nombre,
      opciones: [{nombre:'V',codigo:'V'}],
      eslabon:'campo-rif',
      deshabilitado: false
    });
    this.comboLetra.nodo.classList.add('combo-letra');
    //campo de texto
    this.campoNumero = new CampoDeTexto({
      requerido:true,
      titulo:atributos.titulo,
      nombre:'Digitos',
      tipo:'simple',
      eslabon:'campo-rif',
      max:8
    });
    this.campoNumero.nodo.classList.add('campo-numero');
    //campo ultima sigla
    this.campoFinal = new CampoDeTexto({
      requerido:true,
      titulo:'',
      nombre:'titulo',
      tipo:'simple',
      eslabon:'campo-rif',
      max:1
    });
    this.campoFinal.nodo.classList.add('campo-final');
    this.nodo = nodo;
    this.nodo.appendChild(this.comboLetra.nodo);
    this.nodo.appendChild(this.campoNumero.nodo);
    this.nodo.appendChild(this.campoFinal.nodo);
  };
  this.captarValor = function(){
    var valor = this.comboLetra.captarValor() + this.campoNumero.captarValor() + this.campoFinal.captarValor();
    if(valor.length == 10){
      return valor;
    }else{
      return false;
    }
  };
  this.captarNombre =  function(){
    return this.nombre;
  };
  this.captarRequerido = function(){
    return this.requerido;
  };
  this.construirNodo();
};
