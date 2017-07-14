var m01_tipo_formula = {
	nombre: 'm01_tipo_formula',
 	modulo: 'agronomia',
	campo_nombre: 'nombre',
	titulo: 'Tipo Formula',
	altura: 300,
	campos:[
		{
			tipo: 'campoDeTexto',
			parametros:{
				nombre: 'nombre',
				requerido:true,
				titulo: 'Descripcion',
				tipo:'area',
				eslabon: 'area',
				usaToolTip: true
			}
		},{
	     	tipo : 'campoBusqueda',
	      	parametros : {
	        titulo:'Tipo de Garantia',
	        nombre: 'tip_gar',
	        requerido:true,
	        eslabon:'area',
	        peticion:{
	           modulo: "agronomia",
	           entidad: "crecanicultor",
	           operacion: "buscar"
	        },
	        cuadro: {nombre: 'listar Peticion',mensaje: 'Cargando Peticion'}
	      }
	    },{
	        tipo : 'Radio',
	        parametros : {
	          nombre : 'estatus',
	          opciones : [
	            {valor:'A',nombre:'Activo'},
	            {valor:'I',nombre:'Inactivo'}
	          ]
	        }
	    }
	]
};
