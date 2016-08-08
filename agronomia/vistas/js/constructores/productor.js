productor= {
	nombre: 'productor',
 	modulo: 'agronomia',
	campo_nombre: 'nombre_completo',
	titulo: 'Cañicultor',
	altura: 150,
	campos:[
		{
			tipo: 'campoIdentificacion',
			parametros:{
				nombre: 'rif',
				requerido:true,
				titulo: 'Rif',
				tipo: 'Rif'
			}
		},{
			tipo: 'campoDeTexto',
			parametros:{
				nombre: 'codigo_productor',
				requerido:true,
				titulo: 'Codigo Cañicultor',
				tipo:'simple',
				eslabon: 'simple',
				usaToolTip: true
			}
		},{
		  	tipo : 'campoBusqueda',
		    parametros : {
		      titulo:'Tipo de Persona',
		      nombre:'codigo_tipo_persona',
		      requerido:true,
					eslabon:'simple',
		      peticion:{
			        entidad: 'registroVirtual',
			        operacion: 'listar',
							nombre_tabla: 'TIPO_PERSONA',
							modulo: 'seguridad'
			      },
		      cuadro: {nombre: 'listaTipoPersona',mensaje: 'Cargando Registros'}
		    }
		},{
			tipo: 'campoDeTexto',
			parametros:{
				nombre: 'nombre_completo',
				requerido:true,
				titulo: 'Nombre Completo',
				tipo:'simple',
				eslabon: 'area',
				usaToolTip: true
			}
		}
	]
};
