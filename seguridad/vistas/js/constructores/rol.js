rol = {
  nombre:'rol',
  modulo: 'seguridad',
  campo_nombre: 'nombre',
  titulo: 'Rol',
  altura: 200,
  campos:[
    {
      tipo : 'campoDeTexto',
      parametros : {requerido:true,titulo:'Nombre',nombre:'nombre',tipo:'simple',eslabon:'area',usaToolTip:true}
    },{
      tipo : 'campoDeTexto',
      parametros : {titulo:'Color',nombre:'color',tipo:'simple',eslabon:'simple',usaToolTip:false}
    }
  ]
};
