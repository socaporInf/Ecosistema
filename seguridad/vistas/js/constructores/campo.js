campo = {
  nombre: 'campo',
  campo_nombre: 'nombre',
  nuevo:{
    titulo: 'Campo',
    altura: 200,
    campos:[
			{
				tipo: 'campoDeTexto',
				parametros:{
					nombre: 'nombre',
					requerido:true,
					titulo: 'Nombre',
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
			},{
        tipo : 'campoBusqueda',
        parametros : {
          titulo:'Componente Padre',
          nombre:'padre',
          requerido:true,
          peticion: {entidad:'componente',operacion: 'buscar'},
          cuadro: {nombre: 'listaComponentes',mensaje: 'Cargando Componentes'}
        }
      }
		]
  },
  modificar:{

  }
};
