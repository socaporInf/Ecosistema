rol = {
  nombre:'rol',
  modulo: 'seguridad',
  campo_nombre: 'nombre',
  titulo: 'Rol',
  altura: 150,
  campos:[
    {
      tipo : 'campoDeTexto',
      parametros : {requerido:true,titulo:'Nombre',nombre:'nombre',tipo:'simple',eslabon:'area',usaToolTip:true}
    },{
      tipo : 'campoDeTexto',
      parametros : {titulo:'Descripcion',nombre:'descripcion',tipo:'area',eslabon:'area',usaToolTip:false}
    }
  ]
};
