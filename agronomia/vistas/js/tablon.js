function actualizarTablones(){
  var ventana = UI.crearVentanaModal({
        cabecera:{
            html: 'Actualizando Tablones'
        },
        cuerpo:{
          html:''
        }
    });
  var peticion = {
     modulo: "agronomia",
     entidad: "tablon",
     operacion: "actualizarTablones"
  };
  var cuadro = {
    contenedor:ventana.partes.cuerpo.nodo,
    cuadro:{
      nombre: 'actualizar',
      mensaje: 'Actualizando'
    }
  };
  torque.manejarOperacion(peticion,cuadro).then(function(respuesta){
    ventana.convertirEnMensaje(respuesta.mensaje);
  });
}
