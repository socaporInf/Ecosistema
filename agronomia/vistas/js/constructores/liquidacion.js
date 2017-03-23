var liquidacion= {
	nombre: 'liquidacion',
 	modulo: 'agronomia',
	campo_nombre: 'nombre',
	titulo: 'Liquidacion',
	altura: 230,
	campos:[
		{
      tipo : 'campoBusqueda',
      parametros : {
        titulo:'Calculo',
        nombre:'codigo_calculo',
        requerido:true,
        eslabon:'area',
        peticion: {
  			   modulo: "agronomia",
  			   entidad: "calculoLiquidacion",
  			   operacion: "buscar"
				 },
        cuadro: {nombre: 'listaComponentes',mensaje: 'Cargando Calculos'}
      }
    },{
      tipo : 'campoBusqueda',
      parametros : {
        titulo:'Calculo',
        nombre:'id_finca',
        requerido:true,
        eslabon:'area',
        peticion: {
  			   modulo: "agronomia",
  			   entidad: "finca",
  			   operacion: "buscar"
				 },
        cuadro: {nombre: 'listaComponentes',mensaje: 'Cargando fincas'}
      }
    },{
      tipo : 'campoDeTexto',
      parametros : {
        requerido:true,
        nombre:'fecha_calculo',
        titulo:'Fecha Calculo',
        tipo:'simple',
        eslabon:'simple',
        usaToolTip:true
      }
    }
	]
};
