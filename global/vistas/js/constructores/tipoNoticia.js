tipoNoticia = {
  nombre:'tipoNoticia',
  modulo: 'global',
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
        parametros : {requerido:true,titulo:'Color',nombre:'color',tipo:'simple',eslabon:'simple',usaToolTip:true}
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
        parametros : {nombre:'color',titulo:'color',tipo:'area'}
      }
    ]
  },
};