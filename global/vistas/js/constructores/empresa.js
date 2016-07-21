empresa = {
  nombre: 'empresa',
  campo_nombre: 'nombre',
  modulo: 'global',
  titulo: 'Empresa',
  altura: 400,
  campos:  [
    {
      tipo: 'campoidentificacion',
      parametros: {requerido:true,titulo:'Rif',nombre:'rif',tipo:'rif'}
    },{
      tipo: 'saltoDeLinea'
    },{
      tipo : 'campoDeTexto',
      parametros : {titulo:'Nombre',nombre:'nombre',tipo:'simple',eslabon:'simple',requerido:true,usaToolTip:true}
    },{
      tipo : 'campoDeTexto',
      parametros : {titulo:'Nombre Abreviado',nombre:'nombre_abreviado',tipo:'simple',requerido:true,eslabon:'simple',usaToolTip:true}
    },{
      tipo : 'campoDeTexto',
      parametros : {titulo:'Telefono',nombre:'telefono',tipo:'simple',eslabon:'simple',requerido:true,usaToolTip:true}
    },{
      tipo : 'campoDeTexto',
      parametros : {titulo:'Correo',nombre:'correo',tipo:'simple',eslabon:'simple',requerido:true,usaToolTip:true}
    },{
      tipo : 'campoDeTexto',
      parametros : {titulo:'Direccion Fisica',nombre:'direccion_fiscal',tipo:'area',requerido:true,eslabon:'area',usaToolTip:true}
    }
  ]
};
