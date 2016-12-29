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
  this.nodo = null;
  this.construirNodo = function(){
    var nodo = document.createElement('div');
    nodo.classList.add('campo-identificacion');
    this.nodo = nodo;
    //partes
    this.comboLetra = new ComboBox({
      nombre:atributos.nombre,
      opciones: [
        {nombre:'V',codigo:'V'},
        {nombre:'J',codigo:'J'},
        {nombre:'G',codigo:'G'},
        {nombre:'P',codigo:'P'},
        {nombre:'E',codigo:'E'}
      ],
      eslabon:'campo-'+this.tipo,
      deshabilitado: false,
      sinTitulo: true
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
      this.campoFinal = new ComboBox({
        nombre:atributos.nombre+'Final',
        opciones: [
          {nombre:0,codigo:0},
          {nombre:1,codigo:1},
          {nombre:2,codigo:2},
          {nombre:3,codigo:3},
          {nombre:4,codigo:4},
          {nombre:5,codigo:5},
          {nombre:6,codigo:6},
          {nombre:7,codigo:7},
          {nombre:8,codigo:8},
          {nombre:9,codigo:9}
        ],
        eslabon:'campo-'+this.tipo,
        deshabilitado: false,
        sinTitulo: true
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
  this.captarTipo = function(){
    return this.tipo;
  };
  this.asignarValor = function(valor){
    var valorCombo = valor.substring(0,1);
    var valorNumero = valor.substring(1,9);
    this.comboLetra.asignarValor(valorCombo);
    this.campoNumero.asignarValor(valorNumero);
    if(this.tipo === 'rif'){
      var valorFinal = valor.substring(9,10);
      this.campoFinal.asignarValor(valorFinal);
    }
  };
  this.habilitar = function(){
    this.comboLetra.habilitar();
    this.campoNumero.habilitar();
    if(this.captarTipo() === 'rif'){
      this.campoFinal.habilitar();
    }
  };
  this.deshabilitar = function(){
    this.comboLetra.deshabilitar();
    this.campoNumero.deshabilitar();
    if(this.captarTipo() === 'rif'){
      this.campoFinal.deshabilitar();
    }
  };
  this.limpiar = function(){
    this.comboLetra.limpiar();
    this.campoNumero.limpiar();
    if(this.captarTipo() === 'rif'){
      this.campoFinal.limpiar();
    }
  };
  this.construirNodo();
};
