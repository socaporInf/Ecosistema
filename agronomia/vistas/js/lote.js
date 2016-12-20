function manejarLote(){
  var ventana = UI.crearVentanaModal({
        cabecera:{
            html: 'Registrar de Lote'
        },
        cuerpo:{
            formulario: UI.buscarConstructor('lote'), //objeto constructor
            tipo: 'nuevo', //operacion a realizar,
        },
        pie:{
            clases:['botonera'],
            html: '<button type="button" class="icon icon-guardar-indigo-32"> </button>'+
                  '<button type="button" class="icon icon-cerrar-rojo-32"> </button>'
        }
    });
    ventana.partes.pie.nodo.querySelector('button.icon-cerrar-rojo-32').onclick=function(){
      UI.elementos.modalWindow.eliminarUltimaCapa();
    };

    ventana.partes.pie.nodo.querySelector('button.icon-guardar-indigo-32').onclick=function(){
      var formulario = ventana.partes.cuerpo.formulario;
      if(formulario.validar()){
        var peticion = UI.juntarObjetos({
           modulo: "agronomia",
           entidad: "lote",
           operacion: "guardar",
        },formulario.captarValores());
        var cuadro = {
          contenedor:ventana.partes.cuerpo.nodo,
          cuadro:{
            nombre: 'lote',
            mensaje: 'Guardando Datos de lote'
          }
        };
        torque.manejarOperacion(peticion,cuadro).then(function(respuesta){
          ventana.convertirEnMensaje(respuesta.mensaje);
        });
      }else{
          UI.agregarToasts({
            texto: 'Rellene todos los campos para continuar',
            tipo: 'web-arriba-derecha-alto'
          });
      }
    };
}
