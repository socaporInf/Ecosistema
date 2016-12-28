var tabuladorTransp= {
	nombre: 'tabuladorTransp',
 	modulo: 'agronomia',
	campo_nombre: 'nombre',
	titulo: 'Tabulador de Transporte',
	altura: 230,
	campos:[
		{
      tipo : 'campoBusqueda',
      parametros : {
        titulo:'Zafra',
        nombre:'codigo_zafra',
        requerido:true,
        eslabon:'area',
        peticion: {
  			   modulo: "agronomia",
  			   entidad: "zafra",
  			   operacion: "buscar"
				 },
        cuadro: {nombre: 'listaComponentes',mensaje: 'Cargando Zafras'}
      }
    },{
      tipo : 'campoDeTexto',
      parametros : {
        requerido:true,
        nombre:'nombre',
        titulo:'Nombre',
        tipo:'simple',
        eslabon:'simple',
        usaToolTip:true
      }
    },{
      tipo : 'campoDeTexto',
      parametros : {
        requerido:true,
        nombre:'fecha_desde',
        titulo:'Fecha de Inicio',
        tipo:'simple',
        eslabon:'simple',
        usaToolTip:true
      }
    },{
      tipo : 'campoDeTexto',
      parametros : {
        requerido:false,
        nombre:'fecha_hasta',
        titulo:'Fecha Vencimiento',
        tipo:'simple',
        eslabon:'simple',
        usaToolTip:true
      }
    }
	]
};
