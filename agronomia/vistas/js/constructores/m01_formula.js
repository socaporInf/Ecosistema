var m01_formula = {
	nombre: 'm01_formula',
 	modulo: 'agronomia',
	campo_nombre: 'fec_ini',
	titulo: 'Formula',
	altura: 550,
	campos:[
		{
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
	        onclickSlot:function(campo){
	          //buscar_fecha_tipo_garantia(campo);
	        },
	        cuadro: {nombre: 'listar Peticion',mensaje: 'Cargando Peticion'}
	      }
	    },{
			tipo: 'campoDeTexto',
			parametros:{
				nombre: 'fec_ini',
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
			
			tipo: 'campoDeTexto',
			parametros:{
				nombre: 'tex_for',
				requerido:true,
				titulo: 'Formula',
				tipo:'simple',
				eslabon: 'area',
				usaToolTip: true
			}
		},{
			
			tipo: 'campoDeTexto',
			parametros:{
				nombre: 'val_for',
				requerido:true,
				titulo: 'Valor Formula',
				tipo:'simple',
				eslabon: 'area',
				usaToolTip: true
			}
		}
	]

};