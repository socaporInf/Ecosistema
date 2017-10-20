var m01DetalleCreditoCanicultor = {
	nombre: 'm01DetalleCreditoCanicultor',
 	modulo: 'agronomia',
	campo_nombre: 'organizacion',
	titulo: 'Detalle Credito Cañicultor',
	altura: 200,
	campos:[
		{
      tipo: 'campoDeTexto',
      parametros:{
        nombre: 'rif',
        requerido:true,
        titulo: 'Rif:',
        tipo:'simple',
        eslabon: 'simple',
        usaToolTip: true
      }
    },
		{
      tipo: 'campoDeTexto',
      parametros:{
        nombre: 'nombre',
        requerido:true,
        titulo: 'Nombre:',
        tipo:'simple',
        eslabon: 'simple',
        usaToolTip: true
      }
    },{
      tipo:'saltodelinea'
    },
		{
      tipo: 'campoDeTexto',
      parametros:{
        nombre: 'com_peso',
        requerido:true,
        titulo: 'Complemento Peso:',
        tipo:'simple',
        eslabon: 'simple',
        usaToolTip: true
      }
    },
		{
      tipo: 'campoDeTexto',
      parametros:{
        nombre: 'fac_com_peso',
        requerido:true,
        titulo: 'Factor Complemento Peso:',
        tipo:'simple',
        eslabon: 'simple',
        usaToolTip: true
      }
    }
	]
};
