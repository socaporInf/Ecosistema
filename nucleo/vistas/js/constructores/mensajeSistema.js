mensaje = {
  nombre:'mensajeSistema',
  campo_nombre: 'titulo',
  nuevo:{
    titulo: 'Mensajes de Sistema',
    altura: 400,
    campos:[
      {
        tipo : 'campoDeTexto',
        parametros : {requerido:true,titulo:'Titulo',nombre:'titulo',tipo:'simple',eslabon:'simple',usaToolTip:true}
      },{
        tipo : 'campoDeTexto',
        parametros : {titulo:'Cuerpo',nombre:'cuerpo',tipo:'area',eslabon:'area',usaToolTip:false}
      },{
        tipo : 'campoBusqueda',
        parametros : {
          titulo:'Tipo de Mensaje',
          nombre:'tipo',
          requerido:true,
          eslabon:'area',
          peticion: {entidad:'tablaVirtual' ,operacion: 'buscarRegistrosPorNombreTabla', nombre_tabla:'TIPO_MENSAJE_SISTEMA'},
          cuadro: {nombre: 'listaMensajeSistema',mensaje: 'Cargando Tipos de Mensaje'}
        }
      },{
        tipo : 'campoDeTexto',
        parametros : {titulo:'Descripcion',nombre:'descripcion',tipo:'area',eslabon:'area',usaToolTip:true}
      }
    ]
  },
  modificar:{
    altura: 500,
    campos: [
      {
        tipo : 'campoEdicion',
        parametros : {nombre:'cuerpo',titulo:'Cuerpo',tipo:'area'}
      },{
        tipo : 'campoEdicion',
        parametros : {nombre:'tipo',titulo:'Tipo de Mensaje'}
      },{
        tipo : 'campoEdicion',
        parametros : {titulo:'Descripcion',nombre:'descripcion',tipo:'area'}
      }
    ]
  }
};
