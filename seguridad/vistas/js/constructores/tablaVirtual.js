tablaVirtual = {
  nombre:'tablaVirtual',
  modulo: 'seguridad',
  campo_nombre: 'nombre',
  titulo: 'Tabla Virtual',
  altura: 300,
  campos:[
    {
      tipo : 'campoDeTexto',
      parametros : {requerido:true,titulo:'Nombre',nombre:'nombre',tipo:'simple',eslabon:'simple',usaToolTip:true}
    },{
      tipo : 'campoDeTexto',
      parametros : {requerido:true,titulo:'Campo Relacion',nombre:'campo_relacion',tipo:'simple',eslabon:'simple',usaToolTip:false}
    },{
      tipo : 'campoDeTexto',
      parametros : {requerido:true,titulo:'Funcion',nombre:'funcion',tipo:'area',eslabon:'area',usaToolTip:true}
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
            abrirDetalle('registroVirtual');
          }
        }
      ],
      quitar:[]
    }
  }
};
