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
        eslabon:'simple',
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
        requerido:false,
        eslabon:'simple',
        peticion: {
  			   modulo: "seguridad",
  			   entidad: "registroVirtual",
  			   operacion: "listar",
  			   nombre_tabla: "LABOR"
				 },
        cuadro: {nombre: 'listaComponentes',mensaje: 'Cargando Labores'}
      }
    },{
      tipo : 'campoBusqueda',
      parametros : {
        titulo:'Concepto',
        nombre:'codigo_concepto',
        requerido:true,
        eslabon:'simple',
        peticion: {
  			   modulo: "agronomia",
  			   entidad: "concepto",
  			   operacion: "buscar"
				 },
        cuadro: {nombre: 'listaConcepto',mensaje: 'Cargando concepto'}
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
