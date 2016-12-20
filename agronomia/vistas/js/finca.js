manejarFinca = function(){
  var ventana = UI.crearVentanaModal({
      cabecera:{
          html: 'Registrar de Finca'
      },
      cuerpo:{
          formulario: UI.buscarConstructor('finca'), //objeto constructor
          tipo: 'nuevo', //operacion a realizar,
      },
      pie:{
          clases:['botonera'],
          html: '<button type="button" class="icon icon-guardar-indigo-32"> </button>'+
                '<button type="button" class="icon icon-cerrar-rojo-32"> </button>'
      }
  });
};
