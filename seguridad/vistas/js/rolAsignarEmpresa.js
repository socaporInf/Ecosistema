function construirUI(){
  var lista =  UI.agregarLista({
    titulo: 'rol',
    clases: ['maestro'],
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
          nombre: 'carga roles',
          mensaje: 'Cargando Registros'
        }
      }
    },
    paginacion: {
      uso:false
    },
    onclickSlot: editarRol
  },document.querySelector('div[contenedor]'));
}
var editarRol = function(slot){
  if(UI.buscarVentana('editarRol')){
    var formulario = UI.buscarVentana('editarRol').buscarSector('formulario').formulario;
    formulario.asignarValores(slot.atributos);
    formulario.registroId = slot.atributos.codigo;
    // TODO: 1 funcionamiento empresas rol, asignacion modificacion y eliminacion
  }else{
    var ventForm = UI.agregarVentana({
      nombre:'editarRol',
      tipo: 'formulario',
      clases: ['maestro','aparecer'],
      titulo: {
        tipo:'basico',
        html:'Modificar '+slot.atributos.nombre
      },
      sectores:[
        {
          nombre:'formulario',
          tipo: 'modificar',
          formulario:UI.buscarConstructor('rol'),
          registro : slot.atributos
        }
      ]
    },document.querySelector('div[contenedor]'));
  }
};
