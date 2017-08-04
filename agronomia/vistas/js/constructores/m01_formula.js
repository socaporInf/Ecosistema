var m01_formula = {
	nombre: 'm01_formula',
 	modulo: 'agronomia',
	campo_nombre: 'nombre',
	titulo: 'Formula',
	altura: 240,
	campos:[
		{
			tipo: 'campoDeTexto',
			parametros:{
				nombre: 'nombre',
				requerido:true,
				titulo: 'Fecha Inicio',
				tipo:'simple',
				eslabon: 'simple',
				usaToolTip: true
			}
		},
		{
			tipo: 'campoDeTexto',
			parametros:{
				nombre: 'fec_fin',
				requerido:false,
				titulo: 'Fecha Final',
				tipo:'simple',
				eslabon: 'simple',
				usaToolTip: true
			}
		},{
	     	tipo : 'campoBusqueda',
	      	parametros : {
	        titulo:'Tipo de Formula',
	        nombre: 'tip_for',
	        requerido:true,
	        eslabon:'area',
	        peticion:{
	           modulo: "agronomia",
	           entidad: "m01_tipo_formula",
	           operacion: "buscar"
	        },
	        cuadro: {nombre: 'listar Peticion',mensaje: 'Cargando Peticion'}
	      }
	    },{
			tipo: 'campoDeTexto',
			parametros:{
				nombre: 'tex_for',
				requerido:true,
				titulo: 'Texto Formula',
				tipo:'area',
				eslabon: 'area',
				usaToolTip: true
			}
		}
	],

};