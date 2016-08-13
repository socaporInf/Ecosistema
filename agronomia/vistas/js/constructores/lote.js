lote = {
  nombre: 'lote',
  modulo: 'agronomia',
  campo_nombre: 'nombre_lote',
  campo_codigo: 'id_lote',
  entidad_padre:'finca',
  campo_padre: 'id_finca',
  entidad_hijo: 'tablon',
  titulo: 'Lotes',
  altura: 150,
  campos: [
    {
      tipo: 'campoDeTexto',
      parametros:{
          nombre: 'codigo_lote',
          requerido:false,
          titulo: 'Codigo Lote',
          tipo:'simple',
          eslabon: 'simple',
          usaToolTip: true
      }
    },{
       tipo: 'campoDeTexto',
       parametros:{
          nombre: 'nombre_lote',
          requerido:true,
          titulo: 'Nombre',
          tipo:'simple',
          eslabon: 'simple',
          usaToolTip: true
       }
    },{
	  	tipo : 'campoBusqueda',
	    parametros : {
	      titulo:'Finca',
	      nombre:'id_finca',
	      requerido:true,
				eslabon:'area',
	      peticion:{
		        entidad: 'finca',
		        operacion: 'buscar',
						modulo: 'agronomia'
		      },
	      cuadro: {nombre: 'listafinca',mensaje: 'Cargando Fincas'}
	    }
		}
  ]
};
