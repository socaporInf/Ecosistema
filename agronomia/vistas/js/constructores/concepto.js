concepto= {
	nombre: 'concepto',
 	modulo: 'agronomia',
	campo_nombre: 'nombre',
	titulo: 'concepto',
	altura: 150,
	campos:[
		{
			tipo : 'campoDeTexto',
			parametros : {titulo:'Codigo',nombre:'codigo_concepto',tipo:'simple',eslabon:'dual',usaToolTip:true}
		},{
			tipo : 'campoDeTexto',
			parametros : {titulo:'Descripcion',nombre:'descripcion',tipo:'simple',eslabon:'dual',usaToolTip:true}
		},{
      tipo: 'radio',
      parametros : {
        nombre: 'comportamiento',
        titulo: 'Comportamiento',
        eslabon : 'area',
        valor: 'D',
        opciones:[
          {nombre:'Asignacion',valor:'A'},
          {nombre:'Deduccion',valor:'D'}
        ]
      }
    },{
      tipo: 'radio',
      parametros : {
        nombre: 'tipo_carga',
        titulo: 'Tipo de Carga',
        eslabon : 'area',
        valor: 'A',
        opciones:[
          {nombre:'Automatica',valor:'A'},
          {nombre:'Manual',valor:'M'}
        ]
      }
    }
	]
};
