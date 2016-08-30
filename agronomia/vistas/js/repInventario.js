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
            campoDep.habilitar();
            campoDep.limpiar();
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
    },{
      tipo : 'campoDeTexto',
      parametros : {
        titulo:'Registros por Pagina',nombre:'cantReg',tipo:'simple',eslabon:'simple',max: 3,valor: 40
      }
    },{
      tipo: 'radio',
      parametros : {
        nombre: 'agrupacion',
        titulo: 'Nivel de Detalle',
        eslabon : 'area',
        valor: 'D',
        opciones:[
          {nombre:'Resumido(Finca)',valor:'R'},
          {nombre:'Detallado(Tablon)',valor:'D'}
        ]
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
  formRep.buscarSector('form').formulario.buscarCampo('finca').deshabilitar();
  var botonera = formRep.buscarSector('operaciones').nodo;
  botonera.querySelector('button[ejecutar]').onclick= function(){
    ejecutar();
  };
  botonera.querySelector('button[limpiar]').onclick= function(){
     UI.buscarVentana('formRep').buscarSector('form').formulario.limpiar();     
     formRep.buscarSector('form').formulario.buscarCampo('finca').deshabilitar();
  };
}
function ejecutar(){
  var form = UI.buscarVentana('formRep').buscarSector('form').formulario;
  var operacion;
  var columnas;
  var tipo;
  if(form.buscarCampo('agrupacion').captarValor() === 'D'){
    operacion = "mostrarInventario";
    columnas = '15';
    tipo = 'inventario';
  }else{
    operacion = "mostrarFincas";
    columnas = '8';
    tipo = "inventario-fincas";
  }
  if(!UI.buscarVentana('listado')){
    crearListado(tipo,operacion,columnas,form);
  }else{
    var listado = UI.buscarVentana('listado');
    if(listado.tipo === tipo){
      listado.atributos.carga.peticion.zona = form.buscarCampo('zona').captarValor();
      listado.atributos.carga.peticion.finca = form.buscarCampo('finca').captarValor();
      listado.atributos.carga.peticion.operacion = operacion;
      listado.registrosPorPagina = parseInt(form.buscarCampo('cantReg').captarValor()) || 40;
      listado.recargar();
    }else{
      cerrarListado();
      crearListado(tipo,operacion,columnas,form);
    }
  }
}
function crearListado(tipo,operacion,columnas,form){
  var lista = UI.agregarLista({
    titulo: 'Inventario de Cultivo',
    nombre : 'listado',
    tipo : tipo,
    clases: ['ventana','inversa',tipo,'not-first','last'],
    columnas: columnas,
    registrosPorPagina: parseInt(form.buscarCampo('cantReg').captarValor()) || 40,
    carga:{
      uso:true,
      peticion: {
         modulo: "agronomia",
         entidad: "inventario",
         operacion: operacion,
         zona: form.buscarCampo('zona').captarValor(),
         finca: form.buscarCampo('finca').captarValor()
      }
    },
    paginacion: {
      uso:false
    }
  },document.body.querySelector('div[contenedor]'));
}
function cerrarListado(){
  UI.quitarVentana('listado');
}
