var form = {
  campos:[
    {
        tipo : 'campoBusqueda',
        parametros : {
          titulo:'Zona',
          nombre: 'zona',
          requerido:true,
          eslabon:'simple',
          peticion:{
             modulo: "agronomia",
             entidad: "zona",
             operacion: "buscar"
          },
          onclickSlot:function(campo){
            var campoDep = UI.buscarVentana('formRep').buscarSector('form').formulario.buscarCampo('finca');
            campoDep.atributos.peticion.codigo_zona = campo.captarValor();
          },
          cuadro: {nombre: 'listaZonas',mensaje: 'Cargando Zonas'}
        }
    },
    {
        tipo : 'campoBusqueda',
        parametros : {
          titulo:'Finca',
          nombre: 'finca',
          requerido:true,
          eslabon:'simple',
          peticion:{
             modulo: "agronomia",
             entidad: "finca",
             operacion: "buscarPorZona"
          },
          cuadro: {nombre: 'listafinca',mensaje: 'Cargando fincas'}
        }
    }
  ]
};
function construirUI(){
  var formRep = UI.agregarVentana({
    nombre:'formRep',
    tipo: 'ventana',
    clases: ['form-rep'],
    titulo: {
      tipo:'inverso',
      html:'Parametros'
    },
    sectores:[
      {
        nombre:'form',
        tipo: 'nuevo',
        formulario: form
      },{
				nombre:'operaciones',
				html: '<button class="mat-text-but" ejecutar>Generar Reporte</button>'+
							'<button class="mat-text-but" limpiar>Limpiar</button>'
			}
    ]
  },document.body.querySelector('div[contenedor]'));
  var botonera = formRep.buscarSector('operaciones').nodo;
  botonera.querySelector('button[ejecutar]').onclick= function(){
    ejecutar();
  };
}
function ejecutar(){
  var form = UI.buscarVentana('formRep').buscarSector('form').formulario;
  if(!UI.buscarVentana('listado')){
    var lista = UI.agregarLista({
      titulo: 'Inventario de Cultivo',
      nombre : 'listado',
      clases: ['ventana','inversa','inventario','not-first','last'],
      columnas: "15",
      registrosPorPagina:40,
      carga:{
        uso:true,
        peticion:{
           modulo: "agronomia",
           entidad: "inventario",
           operacion: "mostrarInventario",
           zona: form.buscarCampo('zona').captarValor(),
           finca: form.buscarCampo('finca').captarValor()
        }
      },
      paginacion: {
        uso:false
      }
    },document.body.querySelector('div[contenedor]'));
  }else{
    var listado = UI.buscarVentana('listado');
    listado.atributos.carga.peticion.zona = form.buscarCampo('zona').captarValor();
    listado.atributos.carga.peticion.finca = form.buscarCampo('finca').captarValor();
    listado.recargar();
  }
}
