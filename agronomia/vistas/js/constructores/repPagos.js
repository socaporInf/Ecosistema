var form = {
  campos:[
    {
      tipo : 'campoBusqueda',
      parametros : {
        titulo:'Tipo Liquidacion',
        nombre: 'codigo_tipo_liquidacion',
        requerido:true,
        eslabon:'simple',
        peticion:{
           modulo: "agronomia",
           entidad: "tipoLiquidacion",
           operacion: "buscar"
        },
        onclickSlot:function(campo){
          var campoDep = UI.buscarVentana('formLiquidacion').buscarSector('formLiquidacion').formulario.buscarCampo('codigo_calculo');
          campoDep.atributos.peticion.codigo_padre = campo.captarValor();
          campoDep.habilitar();
          campoDep.limpiar();
        },
        cuadro: {nombre: 'listaZonas',mensaje: 'Cargando Zonas'}
      }
    },
    {
      tipo : 'campoBusqueda',
      parametros : {
        titulo:'Numero Liquidacion',
        nombre: 'codigo_calculo',
        requerido:true,
        eslabon:'simple',
        peticion:{
          modulo: "agronomia",
          entidad: "calculoLiquidacion",
          operacion: "buscar"
        },
        cuadro: {nombre: 'listaLiqidaciones',mensaje: 'Cargando Liquidaciones'}
        }
    }
  ]
};
