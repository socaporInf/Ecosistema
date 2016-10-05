var parametroControl = {
  nombre:'parametroControl',
  modulo: 'seguridad',
  campo_nombre: 'nombre',
  codigo_padre: 'codigo_proceso',
  titulo: '',
  altura: 250,
  campos:[
    {
      tipo : 'campoDeTexto',
      parametros : {requerido:true,titulo:'Nombre',nombre:'nombre',tipo:'simple',eslabon:'simple',usaToolTip:true}
    },{
      tipo : 'campoDeTexto',
      parametros : {requerido:true,titulo:'Valor',nombre:'valor',tipo:'area',eslabon:'area',usaToolTip:false}
    },{
      tipo : 'campoDeTexto',
      parametros : {
        requerido:true,
        titulo:'Descripcion',
        nombre:'descripcion',
        tipo:'area',
        eslabon:'area',
        usaToolTip:true
      }
    },{
      tipo : 'Radio',
      parametros : {
        nombre : 'estado',
        opciones : [
          {valor:'A',nombre:'Activo'},
          {valor:'I',nombre:'Inactivo'}
        ]
      }
    }
  ]
};
