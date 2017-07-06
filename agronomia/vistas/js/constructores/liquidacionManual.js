var liquidacionManual= {
	nombre: 'liquidacionManual',
 	modulo: 'agronomia',
	campo_nombre: 'nombre',
	titulo: 'Concepto',
	altura: 280,
	campos:[
		{
      tipo : 'campoBusqueda',
      parametros : {
        titulo:'Liquidacion',
        nombre:'id_liq_nuc',
        requerido:true,
        eslabon:'simple',
        peticion: {
  			   modulo: "agronomia",
  			   entidad: "liquidacion",
  			   operacion: "buscar"
				 },
        cuadro: {nombre: 'listaComponentes',mensaje: 'Cargando Liquidaciones'}
      }
    },{
      tipo : 'campoBusqueda',
      parametros : {
        titulo:'Nucleo',
        nombre:'id_nuc',
        requerido:false,
        eslabon:'simple',
        peticion: {
  			   modulo: "agronomia",
  			   entidad: "nucleo",
  			   operacion: "buscar"
				 },
        cuadro: {nombre: 'listaComponentes',mensaje: 'Cargando Nucleos'}
      }
    },{
      tipo : 'campoBusqueda',
      parametros : {
        titulo:'Concepto',
        nombre:'id_con',
        requerido:true,
        eslabon:'simple',
        peticion: {
  			   modulo: "agronomia",
  			   entidad: "concepto",
  			   operacion: "buscar"
				 },
        cuadro: {nombre: 'listaComponentes',mensaje: 'Cargando Conceptos'}
      }
    },{
      tipo : 'campoDeTexto',
      parametros : {
        requerido:false,
        nombre:'tar',
        titulo:'Tarifa',
        tipo:'simple',
        eslabon:'simple',
        usaToolTip:true
      }
    },{
      tipo : 'campoDeTexto',
      parametros : {
        requerido:false,
        nombre:'ton',
        titulo:'Toneladas',
        tipo:'simple',
        eslabon:'simple',
        usaToolTip:true
      }
    },{
			tipo: 'campoDeTexto',
			parametros:{
				nombre: 'por_iva',
				requerido:false,
				titulo: 'Alicuota',
				tipo:'simple',
				eslabon: 'simple',
				usaToolTip: true
			}
		},{
			tipo: 'campoDeTexto',
			parametros:{
				nombre: 'monto',
				requerido:true,
				titulo: 'Subtotal',
				tipo:'simple',
				eslabon: 'simple',
				usaToolTip: true
			}
		},{
			tipo: 'campoDeTexto',
			parametros:{
				nombre: 'tot_con_iva',
				requerido:true,
				titulo: 'Total',
				tipo:'simple',
				eslabon: 'simple',
				usaToolTip: true
			}
		}
	]
};
