construirUI = function(){
  //PRIVILEGIO: productor; OPERACION: consultar
  if(sesion.privilegioActivo.buscarOperacion('consultar')){
    armarListaOrganizaciones(document.querySelector('div[contenedor]'));
  }
  var btnNuevo = UI.elementos.botonera.buscarBoton('nuevo');
  btnNuevo.nodo.onclick = productorNuevo;
  //PRIVILEGIO: productor; OPERACION: incluir
  if(!sesion.privilegioActivo.buscarOperacion('incluir')){
    UI.elementos.botonera.quitarBoton('nuevo');
  }
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
armarListaOrganizaciones = function(contenedor){
  var lista = UI.agregarLista({
    titulo: 'Organizaciones',
    clases: ['ventana'],
    campo_nombre: UI.buscarConstructor('productor').campo_nombre,
    carga: {
      uso:true,
      peticion:{
         modulo: UI.buscarConstructor('productor').modulo,
         entidad: UI.buscarConstructor('productor').nombre,
         operacion: "listarProductores"
      },
      espera:{
        cuadro:{
          nombre: 'cargandoCa',
          mensaje: 'Cargando registros'
        }
      },
      respuesta: function(lista){
        var slot;
        lista.Slots.forEach(function(slot){
          slot.nodo.setAttribute('codigo',slot.atributos.codigo);
          slot.nodo.setAttribute('nombre_completo',slot.atributos.nombre_completo);
          slot.nodo.onclick = function(){
            armarListaProductores(slot.atributos.rif);
          };
        });
      }
    },
    paginacion: {
      uso:false
    }
  },contenedor);
};
armarListaProductores = function(rif){
  if(UI.buscarVentana('listadoCanicultores')){
      var listado = UI.buscarVentana('listadoCanicultores');
      listado.atributos.carga.peticion.valor = rif;
      listado.recargar();
      cerrarFormulario('productor');
  }else{
    var lista = UI.agregarLista({
      titulo: 'Cañicultores',
      nombre:'listadoCanicultores',
      clases: ['ventana','not-first'],
      campo_nombre: UI.buscarConstructor('productor').campo_nombre,
      tamano:'libre',
      columnas:3,
      carga: {
        uso:true,
        peticion:{
           modulo: UI.buscarConstructor('productor').modulo,
           entidad: UI.buscarConstructor('productor').nombre,
           operacion: "buscar",
           valor: rif
        },
        espera:{
          cuadro:{
            nombre: 'cargandoPro',
            mensaje: 'Cargando registros'
          }
        },
        respuesta: function(lista){
          var slot;
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
    },document.body.querySelector('div[contenedor]'));
  }
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
      if(UI.buscarVentana('listado de finca')){
        UI.quitarVentana('listado de finca');
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
function existeCanicultor(campo){
  var peticion = {
     modulo: "agronomia",
     entidad: "productor",
     operacion: "consultarProductor",
     codigo: yo.captarValor()
  };
  torque.operacion(peticion,function(respuesta){
    var formulario;
    if(respuesta.registro){
        if(UI.elementos.modalWindow.buscarUltimaCapaContenido()){
          formulario = UI.elementos.modalWindow.buscarUltimaCapaContenido().partes.cuerpo.formulario;
        }else if(UI.buscarVentana('editarProductor').buscarSector('formproductor')){
          formulario = UI.buscarVentana('editarProductor').buscarSector('formproductor').formulario;
        }
        formulario.asignarValores(respuesta.registro);
    }
  });
}
