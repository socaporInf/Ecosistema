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
        titulo:'Tipo de Garantia (Formula Asignada)',
        nombre: 'organizacion',
        requerido:true,
        eslabon:'simple',
        peticion:{
           modulo: "agronomia",
           entidad: "crecanicultor",
           operacion: "buscar_formula_asignada"//busca en postgres    operacion: "buscar"//busca en oracle
        },
        onclickSlot:function(campo){
          console.log(campo.captarValor());
          actualizar(campo);
        },
        cuadro: {nombre: 'listar Peticion',mensaje: 'Cargando Peticion'}
      }
    }
	]
};
