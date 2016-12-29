var detDeduccionLiquidacion= {
	nombre: 'detDeduccionLiquidacion',
 	modulo: 'agronomia',
	campo_nombre: 'nombre',
	titulo: 'Tarifa',
	altura: 230,
	campos:[
		{
      tipo : 'campoBusqueda',
      parametros : {
        titulo:'Deduccion',
        nombre:'codigo_deduccion',
        requerido:true,
        eslabon:'area',
        peticion: {
  			   modulo: "seguridad",
  			   entidad: "registroVirtual",
  			   operacion: "listar",
  			   nombre_tabla: "DEDUCCION_LIQUIDACION"
				 },
        cuadro: {nombre: 'listaComponentes',mensaje: 'Cargando tipos de notificacion'}
      }
    },{
      tipo : 'campoDeTexto',
      parametros : {
        requerido:true,
        nombre:'fecha_desde',
        titulo:'Fecha de Inicio',
        tipo:'simple',
        eslabon:'dual',
        usaToolTip:true
      }
    },{
      tipo : 'campoDeTexto',
      parametros : {
        requerido:true,
        nombre:'fecha_hasta',
        titulo:'Fecha Vencimiento',
        tipo:'simple',
        eslabon:'dual',
        usaToolTip:true
      }
    },
		{
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
