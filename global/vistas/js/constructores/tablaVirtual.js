tablaVirtual = {
  nombre:'tablaVirtual',
  campo_nombre: 'nombre',
  nuevo:{
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
    ]
  },
  modificar:{
    altura: 300,
    campos: [
      {
        tipo : 'campoEdicion',
        parametros : {nombre:'campo_relacion',titulo:'Campo Relacion'}
      },{
        tipo : 'campoEdicion',
        parametros : {nombre:'funcion',titulo:'Funcion',tipo:'area'}
      }
    ],
    botones: [
      {
        tipo:'detalle',
        click: function(boton){
          abrirFormTabla();
        }
      }
    ]
  },
};
