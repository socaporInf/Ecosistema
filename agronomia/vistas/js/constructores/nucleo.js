nucleo= {
	nombre: 'nucleo',
 	modulo: 'agronomia',
	campo_nombre: 'nombre_completo',
	campo_codigo:'codigo_nucleo',
	titulo: 'Nucleo',
	altura: 200,
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
				nombre: 'codigo',
				requerido:true,
				titulo: 'Codigo nucleo',
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
	],
	botones:{
		consulta:{
			agregar:[
				{
					tipo:'Acoplar',
					clases: ['btnAcoplar','mat-green500','white','md-18','material-icons'],
					click:function(){
							acoplar();
					},
					contenido: 'lock_outline'
				},{
					tipo:'cerrar',
					clases: ['btnDesacoplar','mat-amber500','white','md-18','material-icons'],
					click:function(){
							desacoplar();
					},
					contenido: 'lock_open'
				}
			],
			quitar:[]
		},
		nuevo:{
			agregar:[],
			quitar:['aperturar','cerrar','generar']
		}
	}
};
