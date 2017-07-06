var detTabuladorTransp= {
	nombre: 'detTabuladorTransp',
 	modulo: 'agronomia',
	campo_nombre: 'nombre',
	titulo: 'Tipo Carretera',
	altura: 230,
	campos:[
		{
      tipo : 'campoBusqueda',
      parametros : {
        titulo:'Tabulador',
        nombre:'codigo_tabulador',
        requerido:true,
        eslabon:'area',
        peticion: {
  			   modulo: "agronomia",
  			   entidad: "tabuladorTransp",
  			   operacion: "buscar"
				 },
        cuadro: {nombre: 'listaComponentes',mensaje: 'Cargando Tabuladores'}
      }
    },{
      tipo : 'campoBusqueda',
      parametros : {
        titulo:'Tipo de carretera',
        nombre:'codigo_tipo_carretera',
        requerido:true,
        eslabon:'simple',
        peticion: {
  			   modulo: "seguridad",
  			   entidad: "registroVirtual",
  			   operacion: "listar",
  			   nombre_tabla: "TIPO_CARRETERA"
				 },
        cuadro: {nombre: 'listaComponentes',mensaje: 'Cargando Tipos de Carretera'}
      }
    },{
			tipo: 'campoDeTexto',
			parametros:{
				nombre: 'kilometros',
				requerido:false,
				titulo: 'Kilometros',
				tipo:'simple',
				eslabon: 'simple',
				usaToolTip: true
			}
		},{
			tipo: 'campoDeTexto',
			parametros:{
				nombre: 'tarifa',
				requerido:false,
				titulo: 'Tarifa',
				tipo:'simple',
				eslabon: 'simple',
				usaToolTip: true
			}
		}
	]
};
