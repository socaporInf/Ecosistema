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
        eslabon : 'mini',
        usaToolTip: true,
				desabilitado: false,
      }
    },
		{
      tipo: 'campoDeTexto',
      parametros:{
        nombre: 'nombre',
        requerido:true,
        titulo: 'Nombre:',
        tipo:'simple',
        eslabon : 'mini',
        usaToolTip: true
      }
    },
		//---
		{
      tipo: 'campoDeTexto',
      parametros:{
        nombre: 'complemento_peso',
        requerido:true,
        titulo: 'Complemento Peso:',
        tipo:'simple',
        eslabon : 'mini',
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
        eslabon : 'mini',
        usaToolTip: true
      }
    },
		//-- deduccion peso agronomia
		{
      tipo: 'campoDeTexto',
      parametros:{
        nombre: 'complemento_area',
        requerido:true,
        titulo: 'Complemento Area:',
        tipo:'simple',
        eslabon : 'mini',
        usaToolTip: true
      }
    },
		{
			tipo: 'campoDeTexto',
			parametros:{
				nombre: 'factor_complemento_area',
				requerido:true,
				titulo: 'Factor Complemento Area:',
				tipo:'simple',
				eslabon : 'mini',
				usaToolTip: true
			}
		},
		//-- complemento area agro
		{
			tipo: 'campoDeTexto',
			parametros:{
				nombre: 'deduccion_peso',
				requerido:true,
				titulo: 'Deducción Peso:',
				tipo:'simple',
				eslabon : 'mini',
				usaToolTip: true
			}
		},
		{
			tipo: 'campoDeTexto',
			parametros:{
				nombre: 'factor_deduccion_peso',
				requerido:true,
				titulo: 'Factor Deducción Peso:',
				tipo:'simple',
				eslabon : 'mini',
				usaToolTip: true
			}
		},
		//-- deduccion peso agronomia
		{
			tipo: 'campoDeTexto',
			parametros:{
				nombre: 'deduccion_area',
				requerido:true,
				titulo: 'Deducción Area:',
				tipo:'simple',
				eslabon : 'mini',
				usaToolTip: true
			}
		},
		{
			tipo: 'campoDeTexto',
			parametros:{
				nombre: 'factor_deduccion_area',
				requerido:true,
				titulo: 'Factor Deducción Area:',
				tipo:'simple',
				eslabon : 'mini',
				usaToolTip: true
			}
		},
		//--- deduccion area
		/*{tipo:'saltodelinea'},*/
		{
			tipo: 'campoDeTexto',
			parametros:{
				nombre: 'aporte_productor',
				requerido:true,
				titulo: 'Aporte Productor',
				tipo:'simple',
				eslabon : 'mini',
				usaToolTip: true
			}
		},
		{
			tipo: 'campoDeTexto',
			parametros:{
				nombre: 'factor_aporte_productor',
				requerido:true,
				titulo: 'Factor Aporte Productor:',
				tipo:'simple',
				eslabon : 'mini',
				usaToolTip: true
			}
		}
		//-- aporte prod
	]
};
