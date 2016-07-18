empresa = {
  nombre: 'empresa',
  campo_nombre: 'nombre',
  modulo: 'global',
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
        parametros : {nombre:'rif',titulo:'Rif'}
      },{
        tipo : 'campoEdicion',
        parametros : {nombre:'nombre_abreviado',titulo:'Nombre Abreviado'}
      },{
        tipo : 'campoEdicion',
        parametros : {nombre:'telefono',titulo:'Telefono'}
      },{
        tipo : 'campoEdicion',
        parametros : {nombre:'correo',titulo:'Correo'}
      },{
        tipo : 'campoEdicion',
        parametros : {nombre:'direccion_fiscal',titulo:'Direccion Fisica',tipo:'area'}
      }
    ]
  }
};
