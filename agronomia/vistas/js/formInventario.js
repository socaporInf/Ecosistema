construirUI = function(){
  armarListaProductores(document.querySelector('div[contenedor]'));
  var btnNuevo = UI.elementos.botonera.buscarBoton('nuevo');
  btnNuevo.nodo.onclick = productorNuevo;
};
var productorNuevo = function(){
  var nuevo = UI.crearVentanaModal({
    contenido: 'ancho',
    cabecera:{
      html: 'Nuevo '+UI.buscarConstructor('productor').formulario.titulo
    },
    cuerpo:{
      alto: UI.buscarConstructor('productor').formulario.altura,
      campos: UI.buscarConstructor('productor').formulario.campos
    },
    pie:{
        html:   '<section modalButtons>'+
                '<button type="button" class="icon icon-guardar-indigo-32"> </button>'+
                '<button type="button" class="icon icon-cerrar-rojo-32"> </button>'+
                '</section>'
    }
  });
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
      respuesta: function prueba(){
        var slot;
        var lista = UI.buscarVentana('Cañicultores');
        for (var i = 0; i < lista.Slots.length; i++) {
          slot = lista.Slots[i];
          slot.nodo.setAttribute('codigo',slot.atributos.codigo);
          slot.nodo.setAttribute('nombre_completo',slot.atributos.nombre_completo);
          slot.nodo.onclick=editarProductor;
        }
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
      clases: ['not-first'],
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
var  formEditarPro = function(nodoPro){
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
    var  ventanaEditar= UI.buscarVentana('editarProductor');
    ventanaEditar.quitarSector('carga');
    ventanaEditar.agregarSector({
      nombre:'formulario',
      alto : UI.buscarConstructor('productor').formulario.alto,
      campos : UI.buscarConstructor('productor').formulario.campos,
      campo_nombre :  UI.buscarConstructor('productor').campo_nombre
    });
    UI.asignarValores(respuesta.registros,ventanaEditar.buscarSector('formulario'));
    //sector Listado
    agregarListadoFincas(respuesta.registros.codigo_productor,ventanaEditar);
    var botonera = crearBotonera(ventanaEditar,'fincas');
  });
};
//-----------------------------------Fincas---------------------------
var agregarListadoFincas = function(codigo_productor,ventana){
  var contList = ventana.agregarSector({
    nombre:'listado',
  });
  var listaFincas = UI.agregarLista({
    titulo: 'Listado fincas',
    clase: 'embebida',
    campo_nombre: UI.buscarConstructor('finca').campo_nombre,
    carga: {
      uso:true,
      peticion:{
         modulo: "agronomia",
         entidad: "finca",
         operacion: "buscarFincasPorProductor",
         codigo_productor: codigo_productor
      },
      espera:{
        cuadro:{
          nombre: 'cargaFincas',
          mensaje: 'Cargando Fincas'
        }
      },
      respuesta: function(){
        var lista = UI.buscarVentana('Fincas');
      }
    },
    paginacion: {
      uso:false
    }
  },contList.nodo);
};
//-----------------------------------Generales---------------------------
crearBotonera = function(contenedor,nombre){
  var botonera = contenedor.agregarSector({
    nombre:'botonera '+nombre,
    html: '<section botonera>'+
      '<button type="button" class="icon icon-green-add"></button>'+
      '</section>'
  });
  return botonera;
};
