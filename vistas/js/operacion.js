operacion= {
	nombre: 'operacion',
	campo_nombre: 'nombre',
	nuevo:{
		titulo: 'Operación',
		altura: 220,
		campos:[
			{
				tipo: 'campoDeTexto',
				parametros:{requerido:true, titulo: 'Nombre', tipo:'simple', eslabon: 'simple', usaToolTip: true}
			},
			{
				tipo: 'campoDeTexto',
				parametros:{requerido:false, titulo: 'Descripción', tipo:'simple', eslabon: 'area', usaToolTip: true}
			}
		]
	},
	modificar: {
		altura: 220,
		campos: [
			{
				tipo: 'campoEdicion',
				parametros:{nombre: 'descripcion',titulo: 'Descripción', tipo:'simple', eslabon: 'area'}
			}
		]

	}
}