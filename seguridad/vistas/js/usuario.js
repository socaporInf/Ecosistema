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
         codigo_usuario: UI.elementos.maestro.ventanaForm.formulario.buscarCampo('codigo').captarValor()
      },
      espera:{
        cuadro: {
          nombre: 'buscarRolesDisp',
          mensaje: 'Buscando Roles de '+ UI.elementos.maestro.ventanaForm.formulario.buscarCampo('codigo').captarValor()
        }
      },
      //respuesta: callback
    }
  },formSeg.partes.cuerpo.nodo.querySelector('section[lista]'));
  //doy funcionamiento a los botones

  formSeg.partes.cuerpo.nodo.querySelector('button[estado]').onclick = function(){
    //TODO: funcionamiento cambiar estado
    cambiarEstado();
  };
  formSeg.partes.cuerpo.nodo.querySelector('button[clave]').onclick = function(){
    //TODO: funcionamiento reestablecer clave
    reestablecerClave();
  };
  formSeg.partes.cuerpo.nodo.querySelector('button[rol]').onclick = function(){
    //TODO: funcionamiento asignar rol
    asignarRol();
  };
}
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
                   operacion: "buscar"
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
}
