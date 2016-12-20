function manejarTablon(nodo){

  var ventana = UI.crearVentanaModal({
        cabecera:{
            html: 'Registrar de Tablon'
        },
        cuerpo:{
            formulario: UI.buscarConstructor('tablon'), //objeto constructor
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
    if(nodo){
      ventana.partes.cuerpo.formulario.buscarCampo('codigo_tablon').asignarValor(nodo.querySelector('td[tablon]').textContent);
    }
    ventana.partes.pie.nodo.querySelector('button.icon-guardar-indigo-32').onclick=function(){
      var formulario = ventana.partes.cuerpo.formulario;
      if(formulario.validar()){
        var peticion = UI.juntarObjetos({
           modulo: "agronomia",
           entidad: "tablon",
           operacion: "guardar",
        },formulario.captarValores());
        var cuadro = {
          contenedor:ventana.partes.cuerpo.nodo,
          cuadro:{
            nombre: 'guardarTablon',
            mensaje: 'Guardando Datos de Tablon'
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
