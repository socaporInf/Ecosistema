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
    agregarEmpresas(formulario.registroId)
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
        },{
          nombre:'empresas',
          html: 'aqui van las empresas'
        }
      ]
    },document.querySelector('div[contenedor]'));
    agregarEmpresas(slot.atributos.codigo);
  }
};
function agregarEmpresas(codigo){
  var peticion = {
    entidad : 'rol',
    modulo: 'seguridad',
    operacion: 'buscarDetalle',
    codigo: codigo
  };
  var cuadro = {
    contenedor: UI.buscarVentana('editarRol').buscarSector('empresas').nodo,
    cuadro:{
      nombre: 'Cargado Detalle',
      mensaje: 'Cargando Detalle'
    }
  };
  torque.manejarOperacion(peticion,cuadro,function(respuesta){
    var empresas = respuesta.registros;
    var html = '<div>Empresas</div><section contenedor id="contenedorPri"><article add="empresa"></article>';
    for (var i = 0; i < empresas.length; i++) {
      html+="<article rol='"+empresas[i].codigo_rol+
            "' empresa='"+empresas[i].codigo+
            "' codigo='"+empresas[i].codigoRelacion+"'>"+
            empresas[i].nombre+"</article>";
    }
    html += '</section>';
    var sector = UI.buscarVentana('editarRol').buscarSector('empresas').nodo;
    sector.innerHTML = html;
    activarEmpresas();
  });
}
function activarEmpresas(){
  var contenedor = document.getElementById('contenedorPri');
  var empresas = contenedor.querySelectorAll('article');
  empresas[0].onclick = asignarEmpresa;
  for (var i = 1; i < empresas.length; i++) {
    empresas[i].onclick = abrirEdicionAsignacion;
  }
}
function asignarEmpresa(){
  var constructor = {
    campos: [
      {
        tipo: 'comboBox',
        parametros : {
          nombre:'tipoComponente',
          titulo:'Tipos de Componente',
          eslabon : 'area',
          //TODO: carga de base de datos
        }
      }
    ]
  };
  var ventanaAsignar = UI.crearVentanaModal({
    cabecera: {
      html: 'Asignar Empresa'
    },
    cuerpo: {
      tipo: 'asignacion',
      formulario: constructor
    },
    pie:{
        html: '<section modalButtons>'+
              '<button type="button" class="icon icon-guardar-indigo-32"> </button>'+
              '<button type="button" class="icon icon-cerrar-rojo-32"> </button>'+
            '</section>'
      }
  });
}
function abrirEdicionAsignacion(){
  var nodo = this;
  var ventanaOperaciones = UI.crearVentanaModal({
    cabecera: {
      html: nodo.textContent
    },
    cuerpo: {
      html: 'AQUI VA EL TEXTO'
    },
    pie:{
        html: '<section modalButtons>'+
              '<button type="button" class="icon icon-eliminar-rojo"> </button>'+
              '<button type="button" class="icon icon-modificar-verde"> </button>'+
              '<button type="button" class="icon icon-cerrar-rojo-32"> </button>'+
            '</section>'
      }
  });
  var btnModificar = ventanaOperaciones.nodo.querySelector('button.icon-modificar-verde');
  btnModificar.onclick = function(){
    location.href = 'vis_AsignarPrivilegios.html?ruta='+nodo.getAttribute('codigo');
  }
}