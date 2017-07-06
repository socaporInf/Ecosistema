var m01componente = {
	nombre: 'm01componente',
 	modulo: 'agronomia',
	campo_nombre: 'nombre',
	titulo: 'Factor',
	altura: 220,
	campos:[
		{
			tipo: 'campoDeTexto',
			parametros:{
				nombre: 'nombre',
				requerido:true,
				titulo: 'Factor',
				tipo:'simple',
				eslabon: 'simple',
				usaToolTip: true
			}
		},
		{
			tipo: 'campoDeTexto',
			parametros:{
				nombre: 'descripcion',
				requerido:false,
				titulo: 'Descripción',
				tipo:'simple',
				eslabon: 'area',
				usaToolTip: true
			}
		}
	],
	botones:{
    nuevo:{
      quitar:['detalle']
    },
    consulta: {
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
