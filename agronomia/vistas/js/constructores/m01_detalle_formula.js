m01_detalle_formula = {
  nombre:'m01_detalle_formula',
  modulo: 'agronomia',
  campo_nombre: 'nombre',
  codigo_padre : 'codigo_formula',
  titulo: '',
  altura: 230,
  campos:[
    {
      tipo: 'comboBox',
      parametros : {
        nombre:'nombre',
        titulo:'Tipo de Operador',
        eslabon : 'area',
        opciones : [
          {codigo:'*',nombre:'* Multiplicar'},
          {codigo:'/',nombre:'/ Dividir'},
          {codigo:'+',nombre:'+ Sumar'},
          {codigo:'-',nombre:'- Restar'}
        ]
      }
    },{
      tipo : 'campoDeTexto',
      	parametros : {
      	requerido:true,
      		titulo:'Secuencia',
      		nombre:'secuencia',
      		tipo:'simple',
      		eslabon:'area',
      		usaToolTip:false
      	}
    },{
        tipo : 'campoBusqueda',
          parametros : {
          titulo:'Componente',
          nombre: 'codigo_componente',
          requerido:true,
          eslabon:'area',
          peticion:{
             modulo: "agronomia",
             entidad: "m01componente",
             operacion: "buscar"
          },
          cuadro: {nombre: 'listar Peticion',mensaje: 'Cargando Peticion'}
        }
      }
  ]
};
