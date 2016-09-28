function construirUI(){
  var lista = UI.agregarLista({
      titulo: 'Tipos Notificacion',
      clases: ['maestro'],
      campo_nombre: 'nombre',
      nombre: 'tipoNotificacion',
      carga: {
        uso:true,
        peticion:{
           modulo: "seguridad",
           entidad: "registroVirtual",
           operacion: "listar",
           nombre_tabla: 'TIPO_NOTIFICACION'
        },
        espera:{
          cuadro:{
            nombre: 'listadoTNOF',
            mensaje: 'Buscando Tipos de Noificacion Disponibles'
          }
        },
        respuesta: activarAsignacion
      },
      paginacion: {
        uso:false
      }
    },document.body.querySelector('div[contenedor]'));
}
function activarAsignacion(lista){
  lista.Slots.forEach(function(slot){
    slot.nodo.onclick = function(){
      //PRIVILEGIO: operacion asignar
      if(sesion.privilegioActivo.buscarOperacion('asignar')){
        if(UI.buscarVentana('asignados')){
          cerrarFormulario();
          setTimeout(function () {
            crearFormularioAsignacion(slot);
          }, 810);
        }else{
          crearFormularioAsignacion(slot);
        }
      }
    };
  });
}
function cerrarFormulario(slot){
  UI.buscarVentana('asignados').nodo.classList.remove('aparecer');
  setTimeout(function () {
      UI.quitarVentana('asignados');
      UI.quitarVentana('listado');
  }, 310);
}
function crearFormularioAsignacion(slot){
    var asignados = UI.agregarVentana({
      nombre:'asignados',
      tipo: 'formulario',
      clases: ['maestro','aparecer'],
      sectores:[
        {
          nombre:'listado'
        },{
          nombre: 'botonera',
          html:   '<section botonera>'+
                    '<button type="button" class="icon icon-cerrar-blanco-32 mat-red500"> </button>'+
                    '<button type="button" class="icon icon-green-add mat-green500"> </button>'+
                  '</section>'
        }
      ]
    },document.body.querySelector('div[contenedor]'));
    activarBotonera(asignados.buscarSector('botonera'));
    var listadoAsignados = UI.agregarLista({
      titulo: 'ROLES: '+slot.atributos.nombre,
      codigo_tipo_notificacion: slot.atributos.codigo,
      nombre: 'listado',
      clases : ['embebida'],
      campo_nombre: 'nombre_rol',
      carga: {
        uso:true,
        peticion:{
           modulo: "global",
           entidad: "tipoNotificacionRol",
           operacion: "buscarRolesAsignados",
           codigo_tipo_notificacion: slot.atributos.codigo
        },
        espera:{
          cuadro:{
            nombre: 'cargaRoles',
            mensaje: 'Cargando Roles Asignados'
          }
        },
        respuesta: function(lista){
          //PRIVILEGIO: operacion desasignar
          if(sesion.privilegioActivo.buscarOperacion('desasignar')){
            lista.Slots.forEach(function(slot){
              slot.nodo.onclick = function(){
                formularioEliminar(slot);
              };
            });
          }
        }
      },
      paginacion: {
        uso:false
      }
    },asignados.buscarSector('listado').nodo);
}
function activarBotonera(secBotonera){
  var btnAgregar = secBotonera.nodo.querySelector('button.icon-green-add');
  btnAgregar.onclick = function(){
    agregarVentanaAsignacion();
  };
  secBotonera.nodo.querySelector('button.icon-cerrar-blanco-32').onclick = function(){
    cerrarFormulario();
  };
}
function agregarVentanaAsignacion(){
  var ventana = UI.crearVentanaModal({
    tipo: 'informacion',
    cabecera:{
      html: 'Asignar Rol'
    },
    cuerpo:{
      html:'<div style="position:relative;">'+
              '<div textoModal>Seleccione un Rol para que este tipo de notificacion le paresca dentro de su lista</div>'+
            '</div>'
    },
    pie:{
        html: '<section modalButtons>'+
                '<button type="button" class="icon icon-cerrar-rojo-32"> </button>'+
                '<button type="button" class="icon material-icons md-24 green500">add</button>'+
              '</section>'
    }
  });
  var contenedor = ventana.partes.cuerpo;
  var responsables = new CampoBusqueda({
      titulo:'Rol',
      nombre:'codigo_rol',
      requerido:true,
      eslabon:'area',
      peticion:{
          entidad: 'rol',
          operacion: 'buscar',
          modulo: 'seguridad'
        },
      cuadro: {nombre: 'listaAsignados',mensaje: 'Cargando Posibles Roles'}
    });
  contenedor.nodo.appendChild(responsables.nodo);
  contenedor.nodo.style.height = '100px';
  contenedor.nodo.style.paddingTop  = '0px';
  ventana.partes.pie.nodo.querySelector('button.icon-cerrar-rojo-32').onclick = function(){
    UI.elementos.modalWindow.eliminarUltimaCapa();
  };
  var btnAsignar = ventana.partes.pie.nodo.querySelector('button.green500');
  btnAsignar.onclick = function asignar() {
    var lista = UI.buscarVentana('listado');
    var peticion = {
       modulo: "global",
       entidad: "tipoNotificacionRol",
       operacion: "asignar",
       codigo_rol: responsables.captarValor(),
       codigo_tipo_notificacion: lista.atributos.codigo_tipo_notificacion
    };
    var cuadro = {
      contenedor: ventana.partes.cuerpo.nodo,
      cuadro: {
        nombre: 'asignando Rol',
        mensaje: 'asignando Rol'
      }
    };
    torque.manejarOperacion(peticion,cuadro, function(respuesta){
        lista.agregarSlot(respuesta.registro);
        var slot = lista.buscarSlot(respuesta.registro);
        slot.nodo.onclick = function(){
          formularioEliminar(slot);
        };
        UI.elementos.modalWindow.eliminarUltimaCapa();
    });
  };
}
function formularioEliminar(slot){
  var ventDes = UI.crearVentanaModal({
    tipo: 'advertencia',
    cabecera:{
      html: 'Desincorporar'
    },
    cuerpo:{
      html:'<div style="position:relative;">'+
              '<div textoModal>Desea desincorporar a <strong>'+slot.atributos.nombre_rol+'</strong> de la lista de <strong>'+slot.atributos.nombre_tipo_notificacion+'</strong> </div>'+
            '</div>'
    },
    pie:{
        html:   '<section modalButtons>'+
                  '<button type="button" class="icon material-icons md-24 green500">done</button>'+
                  '<button type="button" class="icon icon-cerrar-rojo-32"> </button>'+
                '</section>'
    }
  });
  ventDes.partes.pie.nodo.querySelector('.icon-cerrar-rojo-32').onclick = function(){
    UI.elementos.modalWindow.eliminarUltimaCapa();
  };
  var btnAceptar = ventDes.partes.pie.nodo.querySelector('.green500');
  btnAceptar.onclick = function(){
    var peticion = {
       modulo: "global",
       entidad: "accesoZona",
       operacion: "desincorporar",
       codigo: slot.atributos.codigo
    };
    var cuadro = {
      contenedor: ventDes.partes.cuerpo.nodo,
      cuadro: {
        nombre: 'desincorporando',
        mensaje: 'desincorporando a '+slot.atributos.nombre+' de la zona '+slot.atributos.nombre_zona
      }
    };
    torque.manejarOperacion(peticion,cuadro,function(respuesta){
      UI.elementos.modalWindow.buscarUltimaCapaContenido().convertirEnMensaje(respuesta.mensaje);
      UI.buscarVentana('listado').quitarSlot(slot.atributos);
    });
  };
}
