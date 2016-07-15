empresa = {
  nombre: 'empresa',
  campo_nombre: 'nombre',
  nuevo: {
    titulo: 'Empresa',
    altura: 400,
    campos:  [
      {
        tipo: 'campoDeTexto',
        parametros: {titulo:'Rif',nombre:'rif',tipo:'simple',eslabon:'simple',usaToolTip:false}
      },{
        tipo: 'saltoDeLinea'
      },{
        tipo : 'campoDeTexto',
        parametros : {titulo:'Nombre',nombre:'nombre',tipo:'simple',eslabon:'simple',usaToolTip:true}
      },{
        tipo : 'campoDeTexto',
        parametros : {titulo:'Nombre Abreviado',nombre:'nombre_abreviado',tipo:'simple',eslabon:'simple',usaToolTip:true}
      },{
        tipo : 'campoDeTexto',
        parametros : {titulo:'Telefono',nombre:'telefono',tipo:'simple',eslabon:'simple',usaToolTip:true}
      },{
        tipo : 'campoDeTexto',
        parametros : {titulo:'Correo',nombre:'correo',tipo:'simple',eslabon:'simple',usaToolTip:true}
      },{
        tipo : 'campoDeTexto',
        parametros : {titulo:'Direccion Fisica',nombre:'direccion_fiscal',tipo:'area',eslabon:'area',usaToolTip:true}
      }
    ]
  },
  modificar: {
    altura: 400,
    campos: [
      {
        tipo : 'campoEdicion',
        parametros : {nombre:'rif',valor:data.rif,titulo:'Rif'}
      },{
        tipo : 'campoEdicion',
        parametros : {nombre:'nombre_abreviado',valor:data.nombre_abreviado,titulo:'Nombre Abreviado'}
      },{
        tipo : 'campoEdicion',
        parametros : {nombre:'telefono',valor:data.telefono,titulo:'Telefono'}
      },{
        tipo : 'campoEdicion',
        parametros : {nombre:'correo',valor:data.correo,titulo:'Correo'}
      },{
        tipo : 'campoEdicion',
        parametros : {nombre:'direccion_fiscal',valor:data.direccion_fiscal,titulo:'Direccion Fisica',tipo:'area'}
      }
    ]
  }
};
