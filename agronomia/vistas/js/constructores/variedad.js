variedad= {
	nombre: 'variedad',
 	modulo: 'agronomia',
	campo_nombre: 'nombre',
	titulo: 'Variedad',
	altura: 320,
	campos:[
		{
			tipo : 'campoDeTexto',
			parametros : {titulo:'Codigo CAPCA',nombre:'codigo_variedad_capca',tipo:'simple',eslabon:'simple',usaToolTip:true}
		},{
			tipo : 'saltoDeLinea'
		},{
			tipo : 'campoDeTexto',
			parametros : {titulo:'Nombre',nombre:'nombre',tipo:'simple',eslabon:'simple',usaToolTip:true}
		},{
			tipo : 'campoDeTexto',
			parametros : {titulo:'Dias Punto de Maduracion',nombre:'dias_punto_maduracion',tipo:'simple',eslabon:'simple',usaToolTip:true}
		},{
			tipo : 'campoDeTexto',
			parametros : {titulo:'Descripcion',nombre:'descripcion',tipo:'area',eslabon:'area',usaToolTip:true}
		}
	]
}