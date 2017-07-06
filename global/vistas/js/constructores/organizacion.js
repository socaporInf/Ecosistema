organizacion= {
	nombre: 'organizacion',
 	modulo: 'global',
	campo_nombre: 'nombre_completo',
	campo_codigo:'codigo_nucleo',
	titulo: 'Organizacion',
	altura: 400,
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
			tipo: 'campoIdentificacion',
			parametros:{
				nombre: 'cedula',
				requerido:false,
				titulo: 'Cedula',
				tipo: 'cedula'
			}
		},{
			tipo:'saltoDeLinea'
		},{
			tipo: 'campoDeTexto',
			parametros:{
				nombre: 'primer_nombre',
				requerido:false,
				titulo: 'Primer Nombre',
				tipo:'simple',
				eslabon: 'dual',
				usaToolTip: true
			}
		},{
			tipo: 'campoDeTexto',
			parametros:{
				nombre: 'segundo_nombre',
				requerido:false,
				titulo: 'Segundo Nombre',
				tipo:'simple',
				eslabon: 'dual',
				usaToolTip: true
			}
		},{
			tipo: 'campoDeTexto',
			parametros:{
				nombre: 'primer_apellido',
				requerido:false,
				titulo: 'Primer Apellido',
				tipo:'simple',
				eslabon: 'dual',
				usaToolTip: true
			}
		},{
			tipo: 'campoDeTexto',
			parametros:{
				nombre: 'segundo_apellido',
				requerido:false,
				titulo: 'Segundo Apellido',
				tipo:'simple',
				eslabon: 'dual',
				usaToolTip: true
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
		}
	],
	botones:{
		consulta:{
			agregar:[{
				tipo:'cuentasbanc',
				clases: ['btnCta','mat-bluegrey500','white','md-24','material-icons'],
				click:function(){
					ctasBancarias();
				},
				contenido:'account_balance'
			},{
				tipo:'contacto',
				clases: ['btnContacto','mat-teal500','white','md-24','material-icons'],
				click:function(){
					contactos();
				},
				contenido:'account_box'
			},{
				tipo:'empresa',
				clases: ['btnEmpr','mat-brown500','white','md-24','material-icons'],
				click:function(){
					relacionEmpresarial();
				},
				contenido:'work'
			}],
			quitar:[]
		},
		nuevo:{
			agregar:[],
			quitar:['cuentasbanc','empresa','contacto']
		}
	}
};
