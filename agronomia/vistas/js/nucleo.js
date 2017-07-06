function acoplar(){
  if(!sesion.privilegioActivo.buscarOperacion('asignar')){
      UI.agregarToasts({
        texto: 'Usted no posee Privilegios para acoplar una organizacion',
        tipo: 'web-arriba-derecha-alto'
      });
  }else{
    var formulario = UI.elementos.maestro.forma.formulario;
    var modal = UI.crearVentanaModal({
      cabecera:{
        html:'Acoplar un nuevo RIF al Codigo '+ formulario.registroAct.codigo
      },
      cuerpo:{
        formulario:{
          campos:[
            {
                tipo : 'campoBusqueda',
                parametros : {
                  titulo:'organizacion',
                  nombre: 'rif',
                  requerido:true,
                  eslabon:'area',
                  peticion:{
                     modulo: "global",
                     entidad: "organizacion",
                     operacion: "buscar"
                  },
                  cuadro: {nombre: 'listaOrganizaciones',mensaje: 'Cargando Registros'}
                }
            }
          ]
        },
        tipo:'nuevo'
      },
      pie:{
        clases:['botonera'],
        html:'<button type="button" class="material-icons green500 md-32 icon">send</button>'
      }
    });
    modal.partes.pie.nodo.querySelector('button.green500').onclick=function(){
      var rif = modal.partes.cuerpo.formulario.captarValores().rif;
      if(!rif){
          UI.agregarToasts({
            texto: 'Debe Seleccionar una organizacion antes de continuar',
            tipo: 'web-arriba-derecha-alto'
          });
      }else{
        var titulo='Realmente Desea Acoplar ';
        var cuerpo= 'Si Acopla el RIF <strong>'+rif+'</strong> a el codigo <strong>'+
                 formulario.registroAct.codigo+'</strong> heredara toda relacion con el mismo';
        UI.elementos.modalWindow.eliminarUltimaCapa();
        setTimeout(function(){
          accion(titulo,cuerpo,{
             "modulo": "agronomia",
             "entidad": "nucleo",
             "operacion": "acoplar",
             "codigo": formulario.registroAct.codigo,
             "rif": rif
          });
        },1010);
      }
    };

  }
}
function desacoplar(){
  if(!sesion.privilegioActivo.buscarOperacion('desasignar')){
      UI.agregarToasts({
        texto: 'Usted no posee Privilegios para desacoplar una organizacion',
        tipo: 'web-arriba-derecha-alto'
      });
  }else{
    var formulario=UI.elementos.maestro.forma.formulario;
    if(formulario.registroAct.rif){
      var titulo='Realmente Desea Desacoplar ';
      var cuerpo= 'Si desacopla <strong>'+formulario.registroAct.nombre_completo+'</strong> el codigo <strong>'+
               formulario.registroAct.codigo+'</strong> perdera toda conexion con el mismo';
      accion(titulo,cuerpo,{
        modulo: "agronomia",
        entidad: "nucleo",
        operacion: "desacoplar",
        codigo: formulario.registroId,
        rif: formulario.registroAct.rif
      });
    }else{
        UI.agregarToasts({
          texto: 'No se Puede Desacoplar un codigo que no posea RIF',
          tipo: 'web-arriba-derecha-alto'
        });
    }
  }
}
function accion(titulo,cuerpo,peticion){
  UI.crearVerificacion({
    "titulo":titulo,
    "cuerpo": cuerpo
  },function(){
    var verificacion = UI.elementos.modalWindow.buscarUltimaCapaContenido();
    var cuadro={
      contenedor: verificacion.partes.cuerpo.nodo,
      cuadro:{
        nombre: 'desacoplar',
        mensaje: 'desacoplarOrganizacion'
      }
    };
    return torque.manejarOperacion(peticion,cuadro)
      .then(function(respuesta){
        verificacion.convertirEnMensaje(respuesta.mensaje);
        return UI.elementos.maestro.lista.recargar()
          .then(function(){
            var slot = UI.elementos.maestro.lista.buscarSlot(respuesta.registro);
            if (slot){
              slot.nodo.click();
            }
          });
      });
    });
  }
