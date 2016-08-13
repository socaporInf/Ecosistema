construirUI = function(){
  armarListaProductores(document.querySelector('div[contenedor]'));
  var btnNuevo = UI.elementos.botonera.buscarBoton('nuevo');
  btnNuevo.nodo.onclick = productorNuevo;
};
var productorNuevo = function(){
  var nuevo = UI.crearVentanaModal({
    contenido: 'ancho',
    cabecera:{
      html: 'Nuevo '+UI.buscarConstructor('productor').titulo
    },
    cuerpo:{
      tipo: 'nuevo',
      formulario:UI.buscarConstructor('productor'),
    },
    pie:{
        html:   '<section modalButtons>'+
                '<button type="button" class="icon icon-guardar-indigo-32"> </button>'+
                '<button type="button" class="icon icon-cerrar-rojo-32"> </button>'+
                '</section>'
    }
  });
  nuevo.partes.pie.nodo.querySelector("button.icon-cerrar-rojo-32").onclick = function(){
    UI.elementos.modalWindow.eliminarUltimaCapa();
  };
  //TODO: funcionamiento guardado formulario
};
armarListaProductores = function(contenedor){
  var lista = UI.agregarLista({
    titulo: 'Cañicultores',
    clases: ['ventana'],
    campo_nombre: UI.buscarConstructor('productor').campo_nombre,
    carga: {
      uso:true,
      peticion:{
         modulo: UI.buscarConstructor('productor').modulo,
         entidad: UI.buscarConstructor('productor').nombre,
         operacion: "buscar"
      },
      espera:{
        cuadro:{
          nombre: 'cargandoCa',
          mensaje: 'Cargando registros'
        }
      },
      respuesta: function(){
        var slot;
        var lista = UI.buscarVentana('Cañicultores');
        lista.Slots.forEach(function(slot){
          slot.nodo.setAttribute('codigo',slot.atributos.codigo);
          slot.nodo.setAttribute('nombre_completo',slot.atributos.nombre_completo);
          slot.nodo.onclick=editarProductor;
        });
      }
    },
    paginacion: {
      uso:false
    }
  },contenedor);
};
var editarProductor = function(){
  var nodoPro = this;
  var formModificar;
  if(!UI.buscarVentana('editarProductor')){
    formModificar = UI.agregarVentana({
      nombre:'editarProductor',
      tipo: 'formulario',
      clases: ['not-first','last'],
      sectores:[
        {
          nombre:'carga',
        }
      ]
    },document.querySelector('div[contenedor]'));
    formEditarPro(nodoPro);
  }else{
    formModificar = UI.buscarVentana('editarProductor');
    for (var i = formModificar.sectores.length -1 ; i > -1 ; i--){
      if(UI.buscarVentana('Listado fincas')){
        UI.quitarVentana('Listado fincas');
      }
      formModificar.desvanecerSector(formModificar.sectores[i].atributos.nombre);
    }
    setTimeout(function () {
      formModificar.agregarSector({
        nombre:'carga',
      });
      formEditarPro(nodoPro);
    }, 600);
  }
};
var formEditarPro = function(nodoPro){
  var peticion = {
     modulo: "agronomia",
     entidad: "productor",
     operacion: "buscarRegistro",
     codigo_productor: nodoPro.getAttribute('codigo')
  };
  var cuadro = {
    contenedor: UI.buscarVentana('editarProductor').buscarSector('carga').nodo,
    cuadro : {
      nombre: 'cargarProductor',
      mensaje: 'Cargando Datos de '+nodoPro.getAttribute('nombre_completo')
    }
  };
  torque.manejarOperacion(peticion,cuadro,function(respuesta){
    UI.buscarVentana('editarProductor').desvanecerSector('carga');
    modificar(respuesta.registros,respuesta.entidad);
  });
};
