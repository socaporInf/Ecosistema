tablon = {
  nombre: 'tablon',
  modulo: 'agronomia',
  campo_nombre: 'codigo_tablon',
  campo_codigo: 'id_tablon',
  entidad_padre:'lote',
  campo_padre: 'id_lote',
  titulo: 'Tablones',
  altura: 400,
  campos: [
    {
	  	tipo : 'campoBusqueda',
	    parametros : {
	      titulo:'Lote',
	      nombre:'id_lote',
	      requerido:true,
				eslabon:'simple',
	      peticion:{
		        entidad: 'lote',
		        operacion: 'buscar',
						modulo: 'agronomia'
		      },
	      cuadro: {nombre: 'listaLote',mensaje: 'Cargando Lotes'}
	    }
		},{
      tipo: 'campoDeTexto',
      parametros:{
          nombre: 'codigo_tablon',
          requerido:false,
          titulo: 'Codigo Tablon',
          tipo:'simple',
          eslabon: 'simple',
          usaToolTip: true
      }
    },{
      tipo:'saltodelinea'
    },{
	  	tipo : 'campoBusqueda',
	    parametros : {
	      titulo:'Clase',
	      nombre:'codigo_clase',
	      requerido:true,
				eslabon:'simple',
	      peticion:{
		        entidad: 'clase',
		        operacion: 'buscar',
						modulo: 'agronomia'
		      },
	      cuadro: {nombre: 'listaClase',mensaje: 'Cargando Clases'}
	    }
		},{
	  	tipo : 'campoBusqueda',
	    parametros : {
	      titulo:'Lote',
	      nombre:'id_lote',
	      requerido:true,
				eslabon:'simple',
	      peticion:{
		        entidad: 'lote',
		        operacion: 'buscar',
						modulo: 'agronomia'
		      },
	      cuadro: {nombre: 'listafinca',mensaje: 'Cargando Fincas'}
	    }
		},{
	  	tipo : 'campoBusqueda',
	    parametros : {
	      titulo:'Variedad',
	      nombre:'codigo_variedad',
	      requerido:true,
				eslabon:'simple',
	      peticion:{
		        entidad: 'variedad',
		        operacion: 'buscar',
						modulo: 'agronomia'
		      },
	      cuadro: {nombre: 'listavariedad',mensaje: 'Cargando Variedades'}
	    }
		},{
	  	tipo : 'campoBusqueda',
	    parametros : {
	      titulo:'Tipos de Corte',
	      nombre:'codigo_tipo_corte',
	      requerido:true,
				eslabon:'simple',
	      peticion:{
		        entidad: 'registroVirtual',
		        operacion: 'buscar',
						modulo: 'seguridad',
						nombre_tabla: 'TIPO_CORTE'
		      },
	      cuadro: {nombre: 'listaTipoCorte',mensaje: 'Cargando Tipos de Corte'}
	    }
		},{
	  	tipo : 'campoBusqueda',
	    parametros : {
	      titulo:'Indicador Caña Diferida',
	      nombre:'codigo_indicador_cana_diferida',
	      requerido:true,
				eslabon:'simple',
	      peticion:{
		        entidad: 'registroVirtual',
		        operacion: 'buscar',
						modulo: 'seguridad',
						nombre_tabla: 'INDICADOR_CANA_DIFERIDA'
		      },
	      cuadro: {nombre: 'listaICD',mensaje: 'Cargando Registros'}
	    }
		},{
      tipo:'saltodelinea'
    },{
      tipo: 'campoDeTexto',
      parametros:{
          nombre: 'area_cana',
          requerido:false,
          titulo: 'Area Caña',
          tipo:'simple',
          eslabon: 'simple',
          usaToolTip: true
      }
    },{
      tipo: 'campoDeTexto',
      parametros:{
          nombre: 'area_semilla',
          requerido:false,
          titulo: 'Area Semilla',
          tipo:'simple',
          eslabon: 'simple',
          usaToolTip: true
      }
    },{
			tipo: 'saltodelinea'
		},{
      tipo: 'campoDeTexto',
      parametros:{
          nombre: 'toneladas_estimadas_hectarea',
          requerido:false,
          titulo: 'Toneladas estimadas por hectarea',
          tipo:'simple',
          eslabon: 'simple',
          usaToolTip: true
      }
    },{
      tipo: 'campoDeTexto',
      parametros:{
          nombre: 'toneladas_real',
          requerido:false,
          titulo: 'Cantidad Real de Toneladas',
          tipo:'simple',
          eslabon: 'simple',
          usaToolTip: true
      }
    },{
      tipo: 'campoDeTexto',
      parametros:{
          nombre: 'toneladas_azucar',
          requerido:false,
          titulo: 'Toneladas de Azucar',
          tipo:'simple',
          eslabon: 'simple',
          usaToolTip: true
      }
    },
		{
      tipo: 'campoDeTexto',
      parametros:{
          nombre: 'fecha_ultimo_arrime',
          requerido:false,
          titulo: 'Fecha Ultimo Arrime',
          tipo:'simple',
          eslabon: 'simple',
          usaToolTip: true
      }
    },{
      tipo: 'campoDeTexto',
      parametros:{
          nombre: 'fecha_siembra_corte',
          requerido:false,
          titulo: 'Fecha Siembra/Corte',
          tipo:'simple',
          eslabon: 'simple',
          usaToolTip: true
      }
    }
  ]
};
