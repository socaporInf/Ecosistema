clase= {
	nombre: 'clase',
 	modulo: 'agronomia',
	campo_nombre: 'nombre',
	nuevo:{
		titulo: 'Clase',
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
	},
	modificar: {
		altura: 220,
		campos: [
			{
				tipo: 'campoEdicion',
				parametros:{
					nombre: 'descripcion',
					titulo: 'Descripción', 
					tipo:'simple', 
					eslabon: 'area'
				}
			}
		]

	}
}