var plantillaNotificacion= {
	nombre: 'plantillaNotificacion',
 	modulo: 'global',
	campo_nombre: 'nombre_plantilla',
	titulo: 'Plantilla Notificacion',
	altura: 420,
	campos:[
    {
      tipo : 'campoDeTexto',
      parametros : {
        requerido:true,
        nombre:'nombre_plantilla',
        titulo:'Nombre',
        tipo:'simple',
        eslabon:'simple',
        usaToolTip:true
      }
    },{
      tipo : 'campoBusqueda',
      parametros : {
        titulo:'tipo de notificacion',
        nombre:'codigo_tipo_notificacion',
        requerido:true,
        eslabon:'area',
        peticion: {
  			   modulo: "seguridad",
  			   entidad: "registroVirtual",
  			   operacion: "listar",
  			   nombre_tabla: "TIPO_NOTIFICACION"
				 },
        cuadro: {nombre: 'listaComponentes',mensaje: 'Cargando tipos de notificacion'}
      }
    },{
      tipo : 'campoDeTexto',
      parametros : {
        requerido:true,
        titulo:'Titulo',
        nombre:'titulo',
        tipo:'simple',
        eslabon:'area',
        usaToolTip:true
      }
    },
		{
			tipo: 'campoDeTexto',
			parametros:{
				nombre: 'cuerpo',
				requerido:false,
				titulo: 'contenido de la notificacion',
				tipo:'area',
				eslabon: 'area',
				usaToolTip: true
			}
		},
    {
        tipo : 'campoBusqueda',
        parametros : {
          titulo:'Prioridad',
          nombre: 'codigo_prioridad',
          requerido:true,
          eslabon:'simple',
          peticion:{
             modulo: "seguridad",
             entidad: "registroVirtual",
             operacion: "listar",
             nombre_tabla: "PRIORIDAD"
          },
          cuadro: {nombre: 'listaPrioridad',mensaje: 'Cargando Registros'}
        }
    }
	]
};
