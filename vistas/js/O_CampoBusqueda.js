var CampoBusqueda = function(atributos){
  var Boton = function(){
    this.nodo = null;
    this.construirNodo = function(){
      var nodo = document.createElement('button');
      nodo.classList.add('mat-but-transp');
      nodo.classList.add('mat-green500');
      nodo.classList.add('icon-search');
      this.nodo = nodo;
      this.nodo.onclick = function activarCampo(){
        //monto venta modal
        var ventSelec = UI.crearVentanaModal({
          contenido: 'ancho'
        });
        //agrego la lista a la ventanaModal
        var lista = UI.agregarLista({
      		titulo: atributos.titulo,
          nombre: atributos.nombre,
          requerido: atributos.requerido,
      		clase: 'lista',
      		carga: {
      			uso:true,
      			peticion:atributos.peticion,
      			espera:{
      				cuadro:atributos.cuadro
      			},
            respuesta: atributos.respuesta
          },
      		paginacion: {
      			uso:false
      		},
          onclickSlot: asignarSlot
      	},ventSelec.nodo);
      };
    };
    this.construirNodo();
  };
  this.atributos = atributos;
  this.comboBox = null;
  this.boton = null;
  this.nodo = null;
  yo = this;

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
  this.captarValor = function(){
    return yo.comboBox.captarValor();
  };
  this.captarNombre = function(){
    return yo.comboBox.captarNombre();
  };
  this.captarRequerido = function(){
    return yo.comboBox.requerido;
  };
  //funciones internas
  asignarSlot = function(slot){
    //agrego opcion al combo
    var opcion = {
      nombre:slot.atributos.nombre,
      codigo:slot.atributos.codigo
    };
    yo.comboBox.agregarOpcion(opcion);
    yo.comboBox.seleccionarOpcion(opcion);
    //cierro la ventana Modal
    UI.quitarVentana(yo.atributos.nombre);
    UI.elementos.modalWindow.eliminarUltimaCapa();
  };

  this.construirNodo();
};
