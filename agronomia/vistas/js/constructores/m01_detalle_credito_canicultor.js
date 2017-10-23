var m01DetalleCreditoCanicultor = {
	nombre: 'm01DetalleCreditoCanicultor',
 	modulo: 'agronomia',
	campo_nombre: 'organizacion',
	titulo: 'Detalle Credito Cañicultor',
	altura: 500,
	campos:[
		{
      tipo: 'campoDeTexto',
      parametros:{
        nombre: 'rif',
        requerido:true,
        titulo: 'Rif:',
        tipo:'simple',
        eslabon : 'dual',
        usaToolTip: true
      }
    },
		{
      tipo: 'campoDeTexto',
      parametros:{
        nombre: 'nombre',
        requerido:true,
        titulo: 'Nombre:',
        tipo:'simple',
        eslabon : 'dual',
        usaToolTip: true
      }
    },{
      tipo:'saltodelinea'
    },
		{
      tipo: 'campoDeTexto',
      parametros:{
        nombre: 'com_peso',
        requerido:true,
        titulo: 'Complemento Peso:',
        tipo:'simple',
        eslabon : 'dual',
        usaToolTip: true
      }
    },

		{
      tipo: 'campoDeTexto',
      parametros:{
        nombre: 'fac_com_peso',
        requerido:true,
        titulo: 'Factor Complemento Peso:',
        tipo:'simple',
        eslabon : 'dual',
        usaToolTip: true
      }
    },
		{
      tipo:'saltodelinea'
    },
		{
      tipo: 'campoDeTexto',
      parametros:{
        nombre: 'com_area',
        requerido:true,
        titulo: 'Complemento Area:',
        tipo:'simple',
        eslabon : 'dual',
        usaToolTip: true
      }
    },
		{
			tipo: 'campoDeTexto',
			parametros:{
				nombre: 'fac_com_area',
				requerido:true,
				titulo: 'Factor Complemento Area:',
				tipo:'simple',
				eslabon : 'dual',
				usaToolTip: true
			}
		},
		{
      tipo:'saltodelinea'
    },
		{
			tipo: 'campoDeTexto',
			parametros:{
				nombre: 'ded_peso',
				requerido:true,
				titulo: 'Deducción Peso:',
				tipo:'simple',
				eslabon : 'dual',
				usaToolTip: true
			}
		},
		{
			tipo: 'campoDeTexto',
			parametros:{
				nombre: 'fac_ded_peso',
				requerido:true,
				titulo: 'Factor Deducción Peso:',
				tipo:'simple',
				eslabon : 'dual',
				usaToolTip: true
			}
		},
		{
      tipo:'saltodelinea'
    },
		{
			tipo: 'campoDeTexto',
			parametros:{
				nombre: 'ded_area',
				requerido:true,
				titulo: 'Deducción Area:',
				tipo:'simple',
				eslabon : 'dual',
				usaToolTip: true
			}
		},
		{
			tipo: 'campoDeTexto',
			parametros:{
				nombre: 'fac_ded_area',
				requerido:true,
				titulo: 'Factor Deducción Area:',
				tipo:'simple',
				eslabon : 'dual',
				usaToolTip: true
			}
		},
		{
      tipo:'saltodelinea'
    },
		{
			tipo: 'campoDeTexto',
			parametros:{
				nombre: 'apo_pro',
				requerido:true,
				titulo: 'Aporte Productor',
				tipo:'simple',
				eslabon : 'dual',
				usaToolTip: true
			}
		},
		{
			tipo: 'campoDeTexto',
			parametros:{
				nombre: 'fac_apo_pro',
				requerido:true,
				titulo: 'Factor Aporte Productor:',
				tipo:'simple',
				eslabon : 'dual',
				usaToolTip: true
			}
		}
	]
};
