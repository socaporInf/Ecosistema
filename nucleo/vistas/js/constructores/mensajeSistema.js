mensaje = {
  nombre:'mensajeSistema',
  campo_nombre: 'titulo',
  titulo: 'Mensajes de Sistema',
  altura: 400,
  campos:[
    {
      tipo : 'campoDeTexto',
      parametros : {requerido:true,titulo:'Codigo',nombre:'codigo',tipo:'simple',eslabon:'simple',usaToolTip:true}
    },{
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
        peticion: {entidad:'registroVirtual' ,operacion: 'listar', nombre_tabla:'TIPO_MENSAJE_SISTEMA',modulo:'seguridad'},
        cuadro: {nombre: 'listaMensajeSistema',mensaje: 'Cargando Tipos de Mensaje'}
      }
    },{
      tipo : 'campoDeTexto',
      parametros : {titulo:'Descripcion',nombre:'descripcion',tipo:'area',eslabon:'area',usaToolTip:true}
    }
  ]
};
