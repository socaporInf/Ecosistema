componente = {
  nombre:'componente',
  modulo: 'seguridad',
  campo_nombre: 'titulo',
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
      parametros : {titulo:'Enlace',nombre:'enlace',tipo:'simple',eslabon:'simple',usaToolTip:false,usaMinuscula:true}
    },{
      tipo: 'comboBox',
      parametros : {
        nombre:'tipocomponente',
        titulo:'Tipos de Componente',
        eslabon : 'area',
        peticion : {
  			   modulo: "seguridad",
  			   entidad: "registroVirtual",
  			   operacion: "listar",
  			   nombre_tabla: "TIPO_COMPONENTE"
  			}
      }
    },{
      tipo : 'campoDeTexto',
      parametros : {titulo:'Descripcion',nombre:'descripcion',tipo:'area',eslabon:'area',usaToolTip:true}
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
    }
  ]
};
