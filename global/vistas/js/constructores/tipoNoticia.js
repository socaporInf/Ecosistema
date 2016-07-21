tipoNoticia = {
  nombre:'tipoNoticia',
  modulo: 'global',
  campo_nombre: 'nombre',
  titulo: 'Tipo de Noticia',
  altura: 120,
  campos:[
    {
      tipo : 'campoDeTexto',
      parametros : {requerido:true,titulo:'Nombre',nombre:'nombre',tipo:'simple',eslabon:'simple',usaToolTip:true}
    },{
      tipo : 'campoDeTexto',
      parametros : {requerido:true,titulo:'Color',nombre:'color',tipo:'simple',eslabon:'simple',usaToolTip:true}
    }
  ]

};
