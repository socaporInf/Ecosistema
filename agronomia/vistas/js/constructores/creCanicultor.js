var creCanicultor = {
	nombre: 'creCanicultor',
 	modulo: 'agronomia',
	campo_nombre: 'nombre',
	titulo: 'creCanicultor',
	altura: 50,
	campos:[
		{
      tipo : 'campoBusqueda',
      parametros : {
        titulo:'Organizacion',
        nombre: 'organizacion',
        requerido:true,
        eslabon:'simple',
        peticion:{
           modulo: "global",
           entidad: "organizacion",
           operacion: "buscar"
        },
        cuadro: {nombre: 'listaOrganizacion',mensaje: 'Cargando Organizacion'}
      }
    },{
			tipo: 'campoDeTexto',
			parametros:{
				nombre: 'rif',
				requerido:true,
				titulo: 'Rif',
				tipo:'simple',
				eslabon: 'simple',
				usaToolTip: true
			}

		}
	]
};
