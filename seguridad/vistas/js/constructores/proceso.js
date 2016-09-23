var proceso = {
  nombre:'proceso',
  modulo: 'seguridad',
  campo_nombre: 'nombre',
  titulo: 'Proceso',
  altura: 300,
  campos:[
    {
      tipo : 'campoDeTexto',
      parametros : {requerido:true,titulo:'Nombre',nombre:'nombre',tipo:'simple',eslabon:'simple',usaToolTip:true}
    },{
      tipo : 'campoDeTexto',
      parametros : {requerido:true,titulo:'Descripcion',nombre:'descripcion',tipo:'area',eslabon:'area',usaToolTip:false}
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
  ],
  botones:{
    nuevo:{
      quitar:['detalle']
    },
    modificar: {
      agregar:[
        {
          tipo:'detalle',
          click: function(boton){
            abrirDetalle('parametroControl');
          }
        }
      ],
      quitar:[]
    }
  }
};
