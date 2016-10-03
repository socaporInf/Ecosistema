var zafra = {
	nombre: 'zafra',
 	modulo: 'agronomia',
	campo_nombre: 'nombre',
	titulo: 'Zafra',
	altura: 220,
	campos:[
		{
			tipo: 'campoDeTexto',
			parametros:{
				nombre: 'codigo',
				requerido:true,
				titulo: 'Codigo',
				tipo:'simple',
				eslabon: 'simple',
				usaToolTip: true
			}
		},
		{
			tipo: 'campoDeTexto',
			parametros:{
				nombre: 'nombre',
				requerido:false,
				titulo: 'Nombre',
				tipo:'simple',
				eslabon: 'simple',
				usaToolTip: true
			}
		},{
		  tipo : 'campoDeTexto',
		  parametros : {
		    requerido:true,
		    titulo:'Fecha de Inicio',
		    nombre:'fecha_inicio',
		    tipo:'simple',
		    eslabon:'simple',
		    usaToolTip:true
		  }
		},{
		  tipo : 'campoDeTexto',
		  parametros : {
		    requerido:true,
		    titulo:'Fecha Final',
		    nombre:'fecha_final',
		    tipo:'simple',
		    eslabon:'simple',
		    usaToolTip:true
		  }
		},{
      tipo : 'Radio',
      parametros : {
        nombre : 'estado',
        opciones : [
          {valor:'A',nombre:'Activo'},
          {valor:'I',nombre:'Inactivo'}
        ]
      }
    }
	]
};
