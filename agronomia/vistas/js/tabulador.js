var nuevoTabulador = function(entidadTab){
  var modal = UI.crearVentanaModal({
    contenido: 'ancho',
    cabecera:{
      html: 'Nuevo '+UI.buscarConstructor(entidadTab).titulo
    },
    cuerpo:{
      tipo:'nuevo',
      formulario: UI.buscarConstructor(entidadTab)
    },
    pie:{
        html:   '<button type="button" class="icon icon-guardar-indigo-32"> </button>'+
                '<button type="button" class="icon icon-cerrar-rojo-32"> </button>',
        clases:['botonera']
    }
  });
  modal.partes.pie.nodo.querySelector('button.icon-guardar-indigo-32').onclick=function(){
    var formulario = modal.partes.cuerpo.formulario;
    if(formulario.validar()){
      var peticion = {
         modulo: "agronomia",
         entidad: entidadTab,
         operacion: "guardar"
      };
      var cuadro = {
        contenedor: modal.partes.cuerpo.nodo,
        cuadro:{
          nombre: 'guardandoCambios',
          mensaje: 'Guardando Nuevo Tabulador'
        }
      };
      peticion = UI.juntarObjetos(peticion,formulario.captarValores());
      torque.manejarOperacion(peticion,cuadro)
        .then(function(respuesta){
          modal.convertirEnMensaje(respuesta.mensaje);
        });
    }else{
        UI.agregarToasts({
          texto: 'Rellene todos los campos antes de continuar',
          tipo: 'web-arriba-derecha-alto'
        });
    }
  };
};
