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
        eslabon : 'dual',
        valor: 'P',
        opciones:[
          {nombre:'PDF',valor:'P'},
          {nombre:'Excel',valor:'E'}
        ]
      }
    },
    {
      tipo: 'radio',
      parametros : {
        nombre: 'codigo_indicador_cana_diferida',
        titulo: 'Indicador Diferidas',
        eslabon : 'dual',
        valor: '',
        opciones:[
          {nombre:'Diferida',valor:'18'},
          {nombre:'No Diferida',valor:'19'},
        ]
      }
    },
    {
      tipo: 'radio',
      parametros : {
        nombre: 'cortadas',
        titulo: 'Tipo Reporte',
        eslabon : 'dual',
        valor: '1',
        opciones:[
          {nombre:'Cortadas',valor:'1'},
          {nombre:'Todas',valor:'2'},
        ]
      }
    }
  ]
};
var Ministerio = {
  campos:[
    {
      tipo : 'campoDeTexto',
      parametros : {
        requerido:false,
        titulo:'Desde',
        nombre:'fecha_desde',
        tipo:'simple',
        eslabon:'simple',
        usaToolTip:true
      }
    },{
      tipo : 'campoDeTexto',
      parametros : {
        requerido:false,
        titulo:'Hasta',
        nombre:'fecha_hasta',
        tipo:'simple',
        eslabon:'simple',
        usaToolTip:true
      }
    },{
      tipo: 'radio',
      parametros : {
        nombre: 'presentacion',
        titulo: 'Presentación',
        eslabon : 'dual',
        valor: 'P',
        opciones:[
          {nombre:'PDF',valor:'P'},
          {nombre:'Excel',valor:'E'}
        ]
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
           modulo: "agronomia",
           entidad: "nucleo",
           operacion: "buscar"
        },
        cuadro: {nombre: 'listaNucleos',mensaje: 'Cargando Nucleos'}
      }
    },{
      tipo : 'campoDeTexto',
      parametros : {
        requerido:false,
        titulo:'Desde',
        nombre:'desde',
        tipo:'simple',
        eslabon:'simple',
        usaToolTip:true
      }
    },{
      tipo : 'campoDeTexto',
      parametros : {
        requerido:false,
        titulo:'Hasta',
        nombre:'hasta',
        tipo:'simple',
        eslabon:'simple',
        usaToolTip:true
      }
    },{
      tipo: 'radio',
      parametros : {
        nombre: 'presentacion',
        titulo: 'Presentación',
        eslabon : 'dual',
        valor: 'P',
        opciones:[
          {nombre:'PDF',valor:'P'},
          {nombre:'Excel',valor:'E'}
        ]
      }
    }
  ]
};

var FechaCorte = {
  campos:[

    {
      tipo: 'radio',
      parametros : {
        nombre: 'presentacion',
        titulo: 'Presentación',
        eslabon : 'dual',
        valor: 'P',
        opciones:[
          {nombre:'Excel',valor:'E'}
        ]
      }
    }
  ]
};
