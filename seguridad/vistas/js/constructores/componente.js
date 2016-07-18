componente = {
  nombre:'componente',
  modulo: 'seguridad',
  campo_nombre: 'titulo',
  nuevo :{
    titulo: 'Componente',
    altura: 400,
    campos:[
      {
        tipo : 'campoDeTexto',
        parametros : {requerido:true,titulo:'Titulo',nombre:'titulo',tipo:'simple',eslabon:'simple',usaToolTip:true}
      },{
        tipo : 'campoDeTexto',
        parametros : {titulo:'Color',nombre:'color',tipo:'simple',eslabon:'simple',usaToolTip:false}
      },{
        tipo : 'campoDeTexto',
        parametros : {titulo:'Enlace',nombre:'enlace',tipo:'simple',eslabon:'simple',usaToolTip:false}
      },{
        tipo : 'campoBusqueda',
        parametros : {
          titulo:'Componente Padre',
          nombre:'padre',
          requerido:true,
          eslabon:'area',
          peticion: {modulo:'seguridad',entidad:'componente',operacion: 'buscar'},
          cuadro: {nombre: 'listaComponentes',mensaje: 'Cargando Componentes'}
        }
      },{
        tipo: 'comboBox',
        parametros : {
          nombre:'tipoComponente',
          titulo:'Tipos de Componente',
          eslabon : 'area',
          opciones: [
            {codigo:'S',nombre:'Sistemas'},
            {codigo:'F',nombre:'Formulario'},
            {codigo:'R',nombre:'Reporte'},
            {codigo:'M',nombre:'Modulo'}
          ]
        }
      },{
        tipo : 'campoDeTexto',
        parametros : {titulo:'Descripcion',nombre:'descripcion',tipo:'area',eslabon:'area',usaToolTip:true}
      }
    ]
  },
  modificar:{
    altura: 370,
    campos: [
      {
        tipo : 'campoEdicion',
        parametros : {nombre:'titulo',titulo:'Titulo',tipo:'titulo'}
      },{
        tipo : 'campoEdicion',
        parametros : {nombre:'color',titulo:'Color'}
      },{
        tipo : 'campoEdicion',
        parametros : {nombre:'enlace',titulo:'Enlace'}
      },{
        tipo : 'campoEdicion',
        parametros : {nombre:'tipo',titulo:'Tipo de Componente'}
      },{
        tipo : 'campoEdicion',
        parametros : {nombre:'componente_padre',titulo:'Componente Padre'}
      },{
        tipo : 'campoEdicion',
        parametros : {titulo:'Descripcion',nombre:'descripcion',tipo:'area'}
      }
    ]
  }
};
