registroVirtual = {
  nombre:'registroVirtual',
  modulo: 'seguridad',
  campo_nombre: 'nombre',
  codigo_padre : 'codigo_tabla',
  titulo: '',
  altura: 200,
  campos:[
    {
      tipo : 'campoDeTexto',
      parametros : {requerido:true,titulo:'Nombre',nombre:'nombre',tipo:'simple',eslabon:'simple',usaToolTip:true}
    },{
      tipo : 'campoDeTexto',
      parametros : {requerido:true,titulo:'Descripcion',nombre:'descripcion',tipo:'area',eslabon:'area',usaToolTip:false}
    }
  ]
};
