var detTabuladorLabor= {
	nombre: 'detTabuladorLabor',
 	modulo: 'agronomia',
	campo_nombre: 'nombre',
	titulo: 'Labor',
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
  			   entidad: "tabuladorLabor",
  			   operacion: "buscar"
				 },
        cuadro: {nombre: 'listaComponentes',mensaje: 'Cargando Tabuladores'}
      }
    },{
      tipo : 'campoBusqueda',
      parametros : {
        titulo:'Labor',
        nombre:'codigo_labor',
        requerido:true,
        eslabon:'area',
        peticion: {
  			   modulo: "seguridad",
  			   entidad: "registroVirtual",
  			   operacion: "listar",
  			   nombre_tabla: "LABOR"
				 },
        cuadro: {nombre: 'listaComponentes',mensaje: 'Cargando Labores'}
      }
    },{
			tipo: 'campoDeTexto',
			parametros:{
				nombre: 'tarifa',
				requerido:false,
				titulo: 'Tarifa',
				tipo:'simple',
				eslabon: 'area',
				usaToolTip: true
			}
		}
	]
};
