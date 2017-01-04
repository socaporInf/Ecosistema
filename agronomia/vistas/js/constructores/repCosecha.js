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
          var campoDep = UI.buscarVentana('formResumenFinca').buscarSector('formResumenFinca').formulario.buscarCampo('finca');
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
    },
    {
      tipo : 'campoBusqueda',
      parametros : {
        titulo:'Municipio',
        nombre: 'municipio',
        requerido:true,
        eslabon:'simple',
        peticion:{
           modulo: "global",
           entidad: "municipio",
           operacion: "buscar"
        },
        cuadro: {nombre: 'listaMunicipio',mensaje: 'Cargando Municipios'}
      }
    },
    {
      tipo: 'radio',
      parametros : {
        nombre: 'agrupacion',
        titulo: 'Nivel de Detalle',
        eslabon : 'area',
        valor: 'T',
        opciones:[
          {nombre:'Resumido Total(Zona)',valor:'T'},
          {nombre:'Resumido(Finca)',valor:'R'},
          {nombre:'Detallado(Tablon)',valor:'D'}
        ]
      }
    },
    {
      tipo: 'radio',
      parametros : {
        nombre: 'presentacion',
        titulo: 'Presentación',
        eslabon : 'doble',
        valor: 'P',
        opciones:[
          {nombre:'PDF',valor:'P'},
          {nombre:'Excel',valor:'E'}
        ]
      }
    }
  ]
};
var Ministerio = {
  campos:[
    {
      tipo : 'campoBusqueda',
      parametros : {
        titulo:'Municipio',
        nombre: 'municipio',
        requerido:true,
        eslabon:'simple',
        peticion:{
           modulo: "global",
           entidad: "municipio",
           operacion: "buscar"
        },
        cuadro: {nombre: 'listaMunicipio',mensaje: 'Cargando Municipios'}
      }
    }
  ]
};
var Transporte = {
  campos:[
    {
      tipo : 'campoBusqueda',
      parametros : {
        titulo:'Nucleo',
        nombre: 'nucleo',
        requerido:true,
        eslabon:'simple',
        peticion:{
           modulo: "agronmia",
           entidad: "nucleo",
           operacion: "buscar"
        },
        cuadro: {nombre: 'listaNucleos',mensaje: 'Cargando Nucleos'}
      }
    }
  ]
};
