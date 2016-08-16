function construirUI(){
  var lista = UI.agregarLista({
      titulo: 'Zonas',
      clases: ['maestro'],
      campo_nombre: 'nombre',
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
      crearFormularioAsignacion(slot);
    };
  });
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
    clases : ['embebida'],
    campo_nombre: 'nombre',
    carga: {
      uso:true,
      peticion:{
         modulo: "seguridad",
         entidad: "rol",
         operacion: "buscar"
      },
      espera:{
        cuadro:{
          nombre: 'cargaUsuarios',
          mensaje: 'Cargando Responsalbles'
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
    var ventana = UI.crearVentanaModal({
      cabecera:{
        tipo: 'informacion',
        html: 'Asignar Usuario'
      },
      cuerpo:{
        html:'<div style="position:relative;">'+
                '<i class="material-icons blue500 md-36">info_ouline</i>'+
                '<div textoModal>Seleccione un Usuario para que este pueda gestiona la zona en cuestion</div>'+
              '</div>'
      },
      pie:{
          tipo:   'informacion',
          html:   '<section modalButtons>'+
                  '<button type="button" class="icon icon-guardar-indigo-32"> </button>'+
                  '<button type="button" class="icon icon-cerrar-rojo-32"> </button>'+
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
  };

}
