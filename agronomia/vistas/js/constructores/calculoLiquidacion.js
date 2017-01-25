var calculoLiquidacion= {
	nombre: 'calculoLiquidacion',
 	modulo: 'agronomia',
	campo_nombre: 'nombre',
	titulo: 'Calculo',
	altura: 230,
	campos:[
		{
      tipo : 'campoBusqueda',
      parametros : {
        titulo:'Zafra',
        nombre:'codigo_zafra',
        requerido:true,
        eslabon:'simple',
        peticion: {
  			   modulo: "agronomia",
  			   entidad: "zafra",
  			   operacion: "buscar"
				 },
        cuadro: {nombre: 'listaZafra',mensaje: 'Cargando Zafras'}
      }
    },{
      tipo : 'campoBusqueda',
      parametros : {
        titulo:'Tipo Liquidacion',
        nombre:'codigo_tipo_liquidacion',
        requerido:true,
        eslabon:'simple',
        peticion: {
  			   modulo: "agronomia",
  			   entidad: "tipoLiquidacion",
  			   operacion: "buscar"
				 },
        cuadro: {nombre: 'listaTiposLiquidacion',mensaje: 'Cargando Tipos'}
      }
    },{
			tipo: 'campoDeTexto',
			parametros:{
				nombre: 'numero',
				requerido:false,
				titulo: 'Numero',
				tipo:'simple',
				eslabon: 'simple',
				usaToolTip: true
			}
		},{
			tipo: 'campoDeTexto',
			parametros:{
				nombre: 'fecha_desde',
				requerido:false,
				titulo: 'Desde',
				tipo:'simple',
				eslabon: 'simple',
				usaToolTip: true
			}
		},{
			tipo: 'campoDeTexto',
			parametros:{
				nombre: 'fecha_hasta',
				requerido:false,
				titulo: 'Hasta',
				tipo:'simple',
				eslabon: 'simple',
				usaToolTip: true
			}
		}
	],
	botones:{
		consulta:{
			agregar:[
				{
					tipo:'aperturar',
					clases: ['btnAperturar','mat-green500','white','md-18','material-icons'],
					click:function(){
							aperturar();
					},
					contenido: 'lock_open'
				},{
					tipo:'cerrar',
					clases: ['btnCerrar','mat-red500','white','md-18','material-icons'],
					click:function(){
							cerrar();
					},
					contenido: 'lock_outline'
				},{
					tipo:'generar',
					clases: ['btnGenerar','mat-deeppurple500','white','md-18','material-icons'],
					click:function(){
							generar();
					},
					contenido: 'sync'
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
