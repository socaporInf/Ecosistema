var m01_tipo_formula = {
	nombre: 'm01_tipo_formula',
 	modulo: 'agronomia',
	campo_nombre: 'nombre',
	titulo: 'Tipo Formula',
	altura: 200,
	campos:[
		{
			tipo: 'campoDeTexto',
			parametros:{
				nombre: 'nombre',
				requerido:true,
				titulo: 'Descripcion',
				tipo:'area',
				eslabon: 'area',
				usaToolTip: true
			}
		},{
	        tipo : 'Radio',
	        parametros : {
	          nombre : 'estatus',
	          opciones : [
	            {valor:'A',nombre:'Activo'},
	            {valor:'I',nombre:'Inactivo'}
	          ]
	        }
	    }
	]
};
