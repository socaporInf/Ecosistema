function abrirDetalle(entidad){
  UI.buscarConstructor(entidad).titulo = UI.elementos.maestro.forma.formulario.registroAct.nombre;
  //monto venta modal
  var ventTabla = UI.crearVentanaModal({
    contenido: 'ancho',
    cuerpo:{
      html: '',
      clases: ['lista']
    },
    pie: {
      html: '<section modalButtons>'+
            '<button type="button" class="icon icon-nuevo-azul-claro-32"> </button>'+
            '<button type="button" class="icon icon-cerrar-rojo-32"> </button>'+
          '</section>'
    }
  });
  ventTabla.partes.pie.nodo.querySelector('button.icon-nuevo-azul-claro-32').onclick = function(){
    abrirDetalleNuevo(entidad);
  };
  ventTabla.partes.pie.nodo.querySelector('button.icon-cerrar-rojo-32').onclick = function(){UI.elementos.modalWindow.eliminarUltimaCapa();};
  //agrego la lista a la ventanaModal
  var lista = UI.agregarLista({
    titulo: UI.buscarConstructor(entidad).titulo,
    nombre: UI.buscarConstructor(entidad).titulo,
    clase: 'lista',
    carga: {
      uso:true,
      peticion:{
        entidad: entidad,
        operacion: 'listar',
        codigo: UI.elementos.maestro.forma.formulario.registroId
      },
      espera:{
        cuadro:{nombre: 'listarRegistros',mensaje: 'Cargando Registros'}
      }
    },
    paginacion: {
      uso:false
    },
    onclickSlot: function(slot){
      editarRegistro(slot,entidad);
    }
  },ventTabla.partes.cuerpo.nodo);
}

/*----------------------------------------Edicion Registro----------------------------------------------*/
editarRegistro = function(slot,entidad){
  UI.elementos.modalWindow.eliminarUltimaCapa();
  setTimeout(function motarFormularioNuevo(){
    var formTabla = UI.crearVentanaModal({
      contenido: 'ancho',
      cabecera:{
        html: 'Modificar '+slot.atributos.nombre
      },
      cuerpo:{
        tipo:'modificar',
        formulario: UI.buscarConstructor(entidad)
      },
      pie:{
        html: '<section modalButtons>'+
              '<button type="button" class="icon icon-modificar-verde"> </button>'+
              '<button type="button" class="icon icon-cerrar-rojo-32"> </button>'+
            '</section>'
      }
    });
    var formulario = formTabla.partes.cuerpo.formulario;
    formulario.registroId = slot.atributos.codigo;
    formulario.asignarValores(slot.atributos);
    formulario.deshabilitar();
    formTabla.partes.pie.nodo.querySelector('button.icon-cerrar-rojo-32').onclick = function(){
      UI.elementos.modalWindow.eliminarUltimaCapa();
      setTimeout(function(){
        abrirDetalle(entidad);
      },1000);
    };
    formTabla.partes.pie.nodo.querySelector('button.icon-modificar-verde').onclick = function(){
      activarEdicion(entidad,this);
    };
  },1000);
};
var activarEdicion = function(entidad,obj){
  var formTabla = UI.elementos.modalWindow.buscarUltimaCapaContenido();
  formTabla.partes.cuerpo.formulario.habilitar();
  obj.classList.remove('icon-modificar-verde');
  obj.classList.add('icon-guardar-indigo-32');
  obj.onclick = function(){
    finalizarEdicion(entidad);
  };
};
var finalizarEdicion = function(entidad){
  var formulario = UI.elementos.modalWindow.buscarUltimaCapaContenido().partes.cuerpo.formulario;
  if(formulario.validar()){
    var registro = formulario.captarValores();
    registro.codigo = formulario.registroId;
    enviarCambios(registro,UI.elementos.modalWindow.buscarUltimaCapaContenido().partes.cuerpo.nodo,entidad);
  }else{
    UI.agregarToasts({
      texto: 'Debe rellenar el formulario para continuar',
      tipo: 'web-arriba-derecha-alto'
    });
  }
};
var enviarCambios = function(cambios,contenedor,entidad){
  //armo la peticion
  cambios.entidad = entidad;
  cambios.operacion = 'modificar';
  cambios.modulo = UI.buscarConstructor(entidad).modulo;
  //luego el cuadro
  var infoCuadro = {
    contenedor: contenedor,
    cuadro:{
      nombre: 'guardando cambios',
      mensaje: 'Guardando cambios'
    }
  };
  torque.manejarOperacion(cambios,infoCuadro,function guardarCambios(respuesta){
    if(respuesta.success){
      UI.elementos.modalWindow.eliminarUltimaCapa();
      setTimeout(function(){
        abrirDetalle(entidad);
      },1000);
    }else{
      UI.elementos.modalWindow.buscarUltimaCapaContenido().convertirEnMensaje(respuesta.mensaje);
    }
  });
};
/*----------------------------------------Nuevo Registro ----------------------------------------------*/
var abrirDetalleNuevo = function(entidad){
  UI.elementos.modalWindow.eliminarUltimaCapa();
  setTimeout(function motarFormularioNuevo(){
    var formTabla = UI.crearVentanaModal({
      contenido: 'ancho',
      cabecera: 'Nuevo '+UI.buscarConstructor(entidad).titulo,
      cuerpo:{
        tipo: 'nuevo',
        formulario: UI.buscarConstructor(entidad)
      },
      pie:{
        html: '<section modalButtons>'+
              '<button type="button" class="icon icon-guardar-indigo-32"> </button>'+
              '<button type="button" class="icon icon-cerrar-rojo-32"> </button>'+
            '</section>'
      }
    });
    formTabla.partes.pie.nodo.querySelector('button.icon-cerrar-rojo-32').onclick = function(){UI.elementos.modalWindow.eliminarUltimaCapa();};
    formTabla.partes.pie.nodo.querySelector('button.icon-guardar-indigo-32').onclick = function(){
      guardarRegistro(entidad);
    };
  },1000);
};
var guardarRegistro = function(entidad){
  var formulario = UI.elementos.modalWindow.buscarUltimaCapaContenido().partes.cuerpo.formulario;
  if(formulario.validar()){
    var peticion = formulario.captarValores();
    peticion[UI.buscarConstructor(entidad).codigo_padre] = UI.elementos.maestro.forma.formulario.registroId;
    peticion.entidad = entidad;
    peticion.operacion = 'guardar';
    var InfoCuadro = {
      contenedor: UI.elementos.modalWindow.buscarUltimaCapaContenido().partes.cuerpo.nodo,
      cuadro:{
        nombre: 'guardando ' + UI.elementos.maestro.forma.formulario.registroAct.nombre,
        mensaje: 'Guardando Registro'
      }
    };
    torque.manejarOperacion(peticion,InfoCuadro,function guardar(respuesta){
      if(respuesta.success){
        UI.elementos.modalWindow.eliminarUltimaCapa();
        setTimeout(function(){
          abrirDetalle(entidad);
        },1000);
      }else{
        UI.elementos.modalWindow.buscarUltimaCapaContenido().convertirEnMensaje(respuesta.mensaje);
      }
    });
  }else{
    UI.agregarToasts({
      texto:'debe llenar el formulario',
      tipo: 'web-arriba-derecha'
    });
  }
};
var validar = function(contenedor){
  var data = {};
  var campos = contenedor.campos;
  for (var i = 0; i < campos.length; i++) {
    //valido el campo
    if((campos[i].captarRequerido())&&(!campos[i].captarValor())){
      return false;
    }
    if(campos[i].captarValor()){
      data[campos[i].captarNombre()]=campos[i].captarValor();
    }
  }
  return data;
};
