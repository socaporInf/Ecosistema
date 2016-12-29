var tipoLiquidacion = {
	nombre: 'tipoLiquidacion',
 	modulo: 'agronomia',
	campo_nombre: 'nombre',
	titulo: 'Tipo de Liquidacion',
	altura: 220,
	campos:[
		{
			tipo: 'campoDeTexto',
			parametros:{
				nombre: 'codigo',
				requerido:true,
				titulo: 'Codigo',
				tipo:'simple',
				eslabon: 'dual',
				usaToolTip: true
			}
		},{
			tipo: 'campoDeTexto',
			parametros:{
				nombre: 'nombre',
				requerido:true,
				titulo: 'Nombre',
				tipo:'simple',
				eslabon: 'dual',
				usaToolTip: true
			}
		},
		{
			tipo: 'campoDeTexto',
			parametros:{
				nombre: 'descripcion',
				requerido:false,
				titulo: 'Descripción',
				tipo:'simple',
				eslabon: 'area',
				usaToolTip: true
			}
		}
	]
};
