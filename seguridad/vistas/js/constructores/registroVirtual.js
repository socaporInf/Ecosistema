registroVirtual = {
  nombre:'registroVirtual',
  modulo: 'seguridad',
  campo_nombre: 'nombre',
  nuevo:{
    titulo: '',
    altura: 200,
    campos:[
      {
        tipo : 'campoDeTexto',
        parametros : {requerido:true,titulo:'Nombre',nombre:'nombre',tipo:'simple',eslabon:'simple',usaToolTip:true}
      },{
        tipo : 'campoDeTexto',
        parametros : {requerido:true,titulo:'Descripcion',nombre:'Descripcion',tipo:'area',eslabon:'area',usaToolTip:false}
      }
    ]
  },
  modificar:{
    altura: 200,
    campos: [
      {
        tipo : 'campoEdicion',
        parametros : {nombre:'nombre',titulo:'Nombre',tipo:'titulo'}
      },{
        tipo : 'campoEdicion',
        parametros : {nombre:'descripcion',titulo:'Descripcion',tipo:'area'}
      }
    ]
  },
};
