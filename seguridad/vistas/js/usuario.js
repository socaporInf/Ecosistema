function abrirFormSeg(){
  var formSeg = UI.crearVentanaModal({
    cabecera:{
      html:'Seguridad',
      clases:['seguridad']
    },
    cuerpo:{
      clases: ['compuesto'],
      html: '<section lista></section>'+
            '<section class="botonera">'+
              '<button type="button" class="mat-text-but" estado>Cambiar Estado</button>'+
              '<button type="button" class="mat-text-but" clave>Reestablecer Clave</button>'+
              '<button type="button" class="mat-text-but" rol>Asignar Nuevo Rol</button>'+
            '</section>',
    }
  });
  //agrego la lista
  var lista = UI.agregarLista({
    nombre: 'asignados',
    titulo: 'Roles Asignados',
    clases: ['embebida','inversa','interna'],
    campo_nombre: 'nombre',
    tamano: 'exacto',
    registrosPorPagina:5,
    carga: {
      uso:true,
      peticion:{
         modulo: "seguridad",
         entidad: "rol",
         operacion: "consultarRolesAsignados",
         codigo_usuario: UI.elementos.maestro.forma.formulario.buscarCampo('codigo').captarValor()
      },
      espera:{
        cuadro: {
          nombre: 'buscarRolesDisp',
          mensaje: 'Buscando Roles de '+ UI.elementos.maestro.forma.formulario.buscarCampo('codigo').captarValor()
        }
      }
      //respuesta: callback
    },
    onclickSlot: function(slot){
      var mensaje = {
        titulo: 'Eliminar Asignacion',
        cuerpo: '¿Desea Remove el Rol '+slot.atributos.nombre+' del usuario '+UI.elementos.maestro.forma.formulario.registroId+
                '? teniendo en cuenta que este perdera todos los privilegios que corresponen a este Rol'
      };
      UI.crearVerificacion(mensaje,function(){
        var peticion = {
           modulo: "seguridad",
           entidad: "rol",
           operacion: "eliminarAsignacion",
           codigo_usuario: UI.elementos.maestro.forma.formulario.registroId,
           llave_acceso: slot.atributos.llave_acceso
        };
        var cuadro = {
          contenedor: UI.elementos.modalWindow.buscarUltimaCapaContenido().partes.cuerpo.nodo,
          cuadro: {
            nombre: 'eliminar',
            mensaje: 'Realizando Operacion'
          }
        };
        torque.manejarOperacion(peticion,cuadro,function(respuesta){
          UI.buscarVentana('asignados').recargar();
          UI.elementos.modalWindow.eliminarUltimaCapa();
        });
      });
    }
  },formSeg.partes.cuerpo.nodo.querySelector('section[lista]'));
  //doy funcionamiento a los botones

  formSeg.partes.cuerpo.nodo.querySelector('button[estado]').onclick = function(){
    //TODO: funcionamiento cambiar estado
    cambiarEstado();
  };
  formSeg.partes.cuerpo.nodo.querySelector('button[clave]').onclick = function(){
    reestablecerClave();
  };
  formSeg.partes.cuerpo.nodo.querySelector('button[rol]').onclick = function(){
    asignarRol();
  };
}
/*----------------------------- Asignar --------------------------------------*/
function asignarRol(){
  var formAsig = UI.crearVentanaModal({
    cabecera:{
      html:'Asignar Rol',
      clases:['asignar']
    },
    cuerpo:{
      tipo:'nuevo',
      formulario: {
        campos:[
          {
              tipo : 'campoBusqueda',
              parametros : {
                titulo:'Rol',
                nombre: 'codigo_rol',
                requerido:true,
                eslabon:'area',
                peticion:{
                   modulo: "seguridad",
                   entidad: "rol",
                   operacion: "buscarDisponiblesUsuario",
                   codigo: UI.elementos.maestro.forma.formulario.registroId
                },
                cuadro: {nombre: 'listaRol',mensaje: 'Cargando Registros'}
              }
          }
        ]
      }
    },
    pie:{
      clases: ['botonera','asignar'],
      html: '<button type="button" class="icon icon-guardar-indigo-32"> </button>'+
            '<button type="button" class="icon icon-cerrar-rojo-32"> </button>',
    }
  });
  formAsig.partes.pie.nodo.querySelector('button.icon-cerrar-rojo-32').onclick = function(){
    //UI.quitarVentana('asignados');
    UI.elementos.modalWindow.eliminarUltimaCapa();
  };
  formAsig.partes.pie.nodo.querySelector('button.icon-guardar-indigo-32').onclick = function(){
    if(formAsig.partes.cuerpo.formulario.buscarCampo('codigo_rol').captarValor()){
      var peticion = {
         modulo: "seguridad",
         entidad: "rol",
         operacion: "asignarRol",
         codigo_usuario: UI.elementos.maestro.forma.formulario.registroId,
         codigo_rol: formAsig.partes.cuerpo.formulario.buscarCampo('codigo_rol').captarValor()
      };
      var cuadro = {
        contenedor : formAsig.partes.cuerpo.nodo,
        cuadro: {
          nombre: 'asignarRol',
          mensaje: 'Asignando Rol'
        }
      };
      torque.manejarOperacion(peticion,cuadro,function(respuesta){
        UI.elementos.modalWindow.eliminarUltimaCapa();
        UI.buscarVentana('asignados').recargar();
      });
    }else{
        UI.agregarToasts({
          texto: 'Debe llenar elegir el rol antes de poder guardar',
          tipo: 'web-arriba-derecha-alto'
        });
    }
  };
}
/*------------------------- Reestablecer clave -------------------------------*/
function reestablecerClave(){
  var mensaje = {
    titulo: 'Reestablecer Clave'
  };
  UI.crearVerificacionUsuario(mensaje,function(clave){
    var peticion = {
       modulo: "seguridad",
       entidad: "usuario",
       operacion: "reactivarClave",
       codigo: UI.elementos.maestro.forma.formulario.registroId,
       contrasena: clave
    };
    var cuadro = {
      contenedor: UI.elementos.modalWindow.buscarUltimaCapaContenido().partes.cuerpo.nodo,
      cuadro: {
        nombre: 'reactivarClave',
        mensaje: 'Reestableciendo clave de acceso'
      }
    };
    torque.manejarOperacion(peticion,cuadro,function(respuesta){
      UI.elementos.modalWindow.buscarUltimaCapaContenido().convertirEnMensaje(respuesta.mensaje);
    });
  });
}
function cambiarEstado(){
  var ventana = UI.crearVentanaModal({
    tipo:'informacion',
    cabecera:{
      html:'Cambio de estado'
    },
    cuerpo:{
      formulario:{
        campos:[
          {
            tipo: 'comboBox',
            parametros : {
              nombre: 'estado',
              titulo: 'Estado',
              eslabon : 'area',
              opciones:[
                {
                  nombre:'ACTIVO',
                  valor:'A'
                },{
                  nombre:'INACTIVO',
                  valor:'I'
                }
              ]
            }
          }
        ],
      },
      tipo:'nuevo'
    }
  });
  UI.agregarBotoneraStandard(ventana,function(){
    //TODO: funcionamiento Cli/Serv de guardado de nuevo estado
    console.log(UI.elementos.modalWindow.buscarUltimaCapaContenido().partes.cuerpo.formulario.buscarCampo('estado').captarValor());
  },'informacion');
}
