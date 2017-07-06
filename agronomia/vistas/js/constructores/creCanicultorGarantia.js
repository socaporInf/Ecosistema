var creCanicultorGarantia = {
	nombre: 'creCanicultorGarantia',
 	modulo: 'agronomia',
	campo_nombre: 'organizacion',
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
           modulo: "agronomia",
           entidad: "crecanicultor",
           operacion: "buscar"
        },
        onclickSlot:function(campo){
          actualizar(campo);
        },
        cuadro: {nombre: 'listar Peticion',mensaje: 'Cargando Peticion'}
      }
    }
	]
};
