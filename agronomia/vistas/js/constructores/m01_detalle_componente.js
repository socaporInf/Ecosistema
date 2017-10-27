detalle_componente = {
  nombre:'detalle_componente',
  modulo: 'agronomia',
  campo_nombre: 'nombre',
  codigo_padre : 'codigo_componente',
  titulo: '',
  altura: 200,
  campos:[
    {
     	tipo : 'campoDeTexto',
     	parametros : {
      		requerido:true,
      		titulo:'Descripcion',
      		nombre:'nombre',
      		tipo:'area',
      		eslabon:'area',
      		usaToolTip:true
      	}
    },{
      tipo : 'campoDeTexto',
      	parametros : {
      	requerido:true,
      		titulo:'Valor',
      		nombre:'valor',
      		tipo:'simple',
      		eslabon:'simple',
      		usaToolTip:false
      	}
    },{
      tipo : 'campoDeTexto',
      	parametros : {
      	requerido:true,
      		titulo:'Fecha Inicio',
      		nombre:'fec_ini',
      		tipo:'simple',
      		eslabon:'simple',
      		usaToolTip:false
      	}
    },{
      tipo : 'campoDeTexto',
      	parametros : {
      	requerido:true,
      		titulo:'Fecha Fin',
      		nombre:'fec_fin',
      		tipo:'simple',
      		eslabon:'simple',
      		usaToolTip:false
      	}
    }
  ]
};
