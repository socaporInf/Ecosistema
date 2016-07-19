productor= {
	nombre: 'productor',
 	modulo: 'agronomia',
	campo_nombre: 'nombre_completo',
	nuevo:{
		titulo: 'Cañicultor',
		altura: 220,
		campos:[
			{
				tipo: 'campoIdentificacion',
				parametros:{
					nombre: 'rif',
					requerido:true,
					titulo: 'Cedula',
					tipo: 'Cedula'
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
		        entidad: 'tablaVirtual',
		        operacion: 'listarRegistros',
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
	},
	modificar: {
		altura: 220,
		campos: [
			{
        tipo : 'campoEdicion',
        parametros : {nombre:'nombre_completo',titulo:'Nombre completo',tipo:'titulo'}
      },{
				tipo: 'campoEdicion',
				parametros:{
					nombre: 'rif',
					titulo: 'Rif',
					tipo:'simple',
					eslabon: 'simple'
				}
			},{
				tipo: 'campoEdicion',
				parametros:{
					nombre: 'codigo_tipo_persona',
					titulo: 'tipo de Persona',
					tipo:'simple',
					eslabon: 'simple'
				}
			},{
				tipo: 'campoEdicion',
				parametros:{
					nombre: 'codigo_productor',
					titulo: 'Codigo de productor',
					tipo:'simple',
					eslabon: 'simple'
				}
			}
		]
	}
};
