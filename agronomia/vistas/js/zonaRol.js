function construirUI(){
  var lista = UI.agregarLista({
      titulo: 'Zonas',
      clases: ['maestro'],
      campo_nombre: 'nombre',
      nombre: 'zonas',
      carga: {
        uso:true,
        peticion:{
           modulo: "agronomia",
           entidad: "zona",
           operacion: "buscar"
        },
        espera:{
          cuadro:{
            nombre: 'listadoZona',
            mensaje: 'Buscando Zonas Disponibles'
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
      titulo: 'RESPONSABLES: '+slot.atributos.nombre,
      codigo_zona: slot.atributos.codigo,
      nombre: 'listado',
      clases : ['embebida'],
      campo_nombre: 'nombre',
      carga: {
        uso:true,
        peticion:{
           modulo: "agronomia",
           entidad: "accesoZona",
           operacion: "buscarResponsables",
           codigo_zona: slot.atributos.codigo
        },
        espera:{
          cuadro:{
            nombre: 'cargaUsuarios',
            mensaje: 'Cargando Responsalbles'
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
      html: 'Asignar Usuario'
    },
    cuerpo:{
      html:'<div style="position:relative;">'+
              '<div textoModal>Seleccione un Usuario para que este pueda gestiona la zona en cuestion</div>'+
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
      titulo:'Usuario',
      nombre:'nombre',
      requerido:true,
      eslabon:'area',
      peticion:{
          entidad: 'usuario',
          operacion: 'buscar',
          modulo: 'seguridad'
        },
      cuadro: {nombre: 'listaResponsables',mensaje: 'Cargando Posibles Responsables'}
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
       modulo: "agronomia",
       entidad: "accesoZona",
       operacion: "asignar",
       codigo_usuario: responsables.captarValor(),
       codigo_zona: lista.atributos.codigo_zona
    };
    var cuadro = {
      contenedor: ventana.partes.cuerpo.nodo,
      cuadro: {
        nombre: 'asignando Responsable',
        mensaje: 'asignando Responsable'
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
              '<div textoModal>Desea desincorporar a <strong>'+slot.atributos.nombre+'</strong> como responsable de <strong>'+slot.atributos.nombre_zona+'</strong> </div>'+
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
       modulo: "agronomia",
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
