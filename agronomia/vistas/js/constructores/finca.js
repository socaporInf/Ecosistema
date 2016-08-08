finca = {
	nombre: 'finca',
 	modulo: 'agronomia',
	campo_nombre: 'nombre',
	titulo: 'finca',
	altura: 220,
	campos:[
		{
		  tipo : 'campoDeTexto',
		  parametros : {
		    requerido:true,
		    titulo:'Codigo Productor',
		    nombre:'codigo_productor',
		    tipo:'simple',
		    eslabon:'simple',
		    usaToolTip:true
		  }
		},
		{
		  tipo : 'campoDeTexto',
		  parametros : {
		    requerido:true,
		    titulo:'Letra Finca',
		    nombre:'letra',
		    tipo:'simple',
		    eslabon:'simple',
		    usaToolTip:true
		  }
		},
		{
			tipo: 'campoDeTexto',
			parametros:{
				nombre: 'nombre_finca',
				requerido:true,
				titulo: 'Nombre',
				tipo:'simple',
				eslabon: 'simple',
				usaToolTip: true
			}
		},
		{
		  tipo : 'campoDeTexto',
		  parametros : {
		    requerido:true,
		    titulo:'Kilimetros al central',
		    nombre:'titulo',
		    tipo:'simple',
		    eslabon:'simple',
		    usaToolTip:true
		  }
		}
	]
};
