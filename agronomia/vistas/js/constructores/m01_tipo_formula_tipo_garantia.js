var m01_tipo_formula_tipo_garantia = {
	nombre: 'm01_tipo_formula_tipo_garantia',
 	modulo: 'agronomia',
	campo_nombre: 'nombre',
	titulo: 'Asignacion Formula a Tipo de Garantia',
	altura: 200,
	campos:[
	{
      tipo : 'campoBusqueda',
      parametros : {
        titulo:'Tipo Garantia',
        nombre:'tip_gar',
        requerido:true,
        eslabon:'area',
        peticion: {
  			   modulo: "agronomia",
  			   entidad: "crecanicultor",
  			   operacion: "buscar"
				 },
        cuadro: {nombre: 'ListaTipoGarantia',mensaje: 'Cargando Tipos de Garantia'}
      }
    },{
      tipo : 'campoBusqueda',
      parametros : {
        titulo:'Tipo Formula',
        nombre:'tip_for',
        requerido:true,
        eslabon:'area',
        peticion: {
  			   modulo: "agronomia",
  			   entidad: "m01_tipo_formula",
  			   operacion: "buscar"
				 },
        cuadro: {nombre: 'ListaTipoFormula',mensaje: 'Cargando Tipos de Formula'}
      }
    }
	]
};
