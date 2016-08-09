finca = {
	nombre: 'finca',
 	modulo: 'agronomia',
	campo_nombre: 'nombre',
	titulo: 'finca',
	altura: 220,
	campos:[
		{
		  tipo : 'campoDeTexto',
		  parametros : {requerido:true,titulo:'Codigo Productor',nombre:'codigo_productor',tipo:'simple',eslabon:'simple',usaToolTip:true}
		},
		{
		  tipo : 'campoDeTexto',
		  parametros : {requerido:true,titulo:'Letra Finca',nombre:'letra',tipo:'simple',eslabon:'simple',usaToolTip:true}
		},
		{
			tipo: 'campoDeTexto',
			parametros:{nombre: 'nombre_finca',requerido:true,titulo: 'Nombre',tipo:'simple',eslabon: 'simple',usaToolTip: true}
		},
		{
		  tipo : 'campoDeTexto',
		  parametros : {requerido:true,titulo:'Kilimetros al central',nombre:'titulo',tipo:'simple',eslabon:'simple',usaToolTip:true}
		},{
	  	tipo : 'campoBusqueda',
	    parametros : {
	      titulo:'Tipo de Carretera',
	      nombre:'codigo_tipo_carretera',
	      requerido:true,
				eslabon:'simple',
	      peticion:{
		        entidad: 'registroVirtual',
		        operacion: 'listar',
						nombre_tabla: 'TIPO_CARRETERA',
						modulo: 'seguridad'
		      },
	      cuadro: {nombre: 'listaTipoCarretera',mensaje: 'Cargando Registros'}
	    }
		},
		{
	  	tipo : 'campoBusqueda',
	    parametros : {
	      titulo:'Tipo de Afiliacion',
	      nombre:'codigo_tipo_Afiliacion',
	      requerido:true,
				eslabon:'simple',
	      peticion:{
		        entidad: 'registroVirtual',
		        operacion: 'listar',
						nombre_tabla: 'TIPO_AFILIACION',
						modulo: 'seguridad'
		      },
	      cuadro: {nombre: 'listaTipoAfiliacion',mensaje: 'Cargando Registros'}
	    }
		},
		{
	  	tipo : 'campoBusqueda',
	    parametros : {
	      titulo:'Zona',
	      nombre:'codigo_zona',
	      requerido:true,
				eslabon:'simple',
	      peticion:{
		        entidad: 'zona',
		        operacion: 'buscar',
						modulo: 'agronomia'
		      },
	      cuadro: {nombre: 'listaZona',mensaje: 'Cargando Zonas'}
	    }
		},
		{
	  	tipo : 'campoBusqueda',
	    parametros : {
	      titulo:'Municipio',
	      nombre:'codigo_municipio',
	      requerido:true,
				eslabon:'simple',
	      peticion:{
		        entidad: 'municipio',
		        operacion: 'buscar',
						modulo: 'global'
		      },
	      cuadro: {nombre: 'listaTipoAfiliacion',mensaje: 'Cargando Registros'}
	    }
		}
	]
};
