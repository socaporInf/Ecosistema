var CampoIdentificacion = function(atributos){
  //valores propios
  this.nombre = atributos.nombre;
  this.requerido = atributos.requerido;
  this.titulo = atributos.titulo;
  this.tipo = atributos.tipo.toLowerCase() || 'cedula';
  //estructura fisica
  this.comboLetra = null;
  this.campoNumero = null;
  this.campoFinal = null;
  this.construirNodo = function(){
    var nodo = document.createElement('div');
    nodo.classList.add('campo-identificacion');
    this.nodo = nodo;
    //partes
    this.comboLetra = new ComboBox({
      nombre:atributos.nombre,
      opciones: [{nombre:'V',codigo:'V'}],
      eslabon:'campo-'+this.tipo,
      deshabilitado: false
    });
    this.comboLetra.nodo.classList.add('combo-letra');
    this.nodo.appendChild(this.comboLetra.nodo);
    //campo de texto
    this.campoNumero = new CampoDeTexto({
      requerido:true,
      titulo:atributos.titulo,
      nombre:'Digitos',
      tipo:'simple',
      eslabon:'campo-'+this.tipo,
      max:8
    });
    this.campoNumero.nodo.classList.add('campo-numero');
    this.nodo.appendChild(this.campoNumero.nodo);
    //campo ultima sigla
    if(this.tipo === 'rif'){
      this.campoFinal = new CampoDeTexto({
        requerido:true,
        titulo:'',
        nombre:'titulo',
        tipo:'simple',
        eslabon:'campo-rif',
        max:1
      });
      this.campoFinal.nodo.classList.add('campo-final');
      this.nodo.appendChild(this.campoFinal.nodo);
    }
  };
  this.captarValor = function(){
    var valor;
    var tamano;
    if(this.tipo === 'rif'){
      valor = this.comboLetra.captarValor() + this.campoNumero.captarValor() + this.campoFinal.captarValor();
      tamano = 10;
    }else{
      valor = this.comboLetra.captarValor() + this.campoNumero.captarValor();
      tamano = 9;
    }
    if(valor.length == tamano){
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
