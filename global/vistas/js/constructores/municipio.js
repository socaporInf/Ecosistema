var municipio= {
	nombre: 'municipio',
 	modulo: 'global',
	campo_nombre: 'nombre',
	titulo: 'Municipio',
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
		},{
		  	tipo : 'campoBusqueda',
		    parametros : {
		      titulo:'Estado',
		      nombre:'codigo_estado',
		      requerido:true,
					eslabon:'simple',
		      peticion:{
			        entidad: 'estado',
			        operacion: 'buscar',
							modulo: 'global'
			      },
		      cuadro: {nombre: 'listaEstado',mensaje: 'Cargando Estados'}
		    }
		}
	]
};
