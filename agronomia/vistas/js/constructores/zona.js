var zona = {
	nombre: 'zona',
 	modulo: 'agronomia',
	campo_nombre: 'nombre',
	titulo: 'Zona',
	altura: 220,
	campos:[
		{
			tipo: 'campoDeTexto',
			parametros:{
				nombre: 'nombre',
				requerido:true,
				titulo: 'Nombre',
				tipo:'simple',
				eslabon: 'simple',
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
