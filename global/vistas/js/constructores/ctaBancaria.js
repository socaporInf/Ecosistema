cuentasBancarias = {
	nombre: 'cuentasBancarias',
 	modulo: 'global',
	campo_codigo:'id_cuenta',
	titulo: 'Cuentas Bancarias',
	altura: 200,
	campos:[
		{
		  	tipo : 'campoBusqueda',
		    parametros : {
		      titulo:'Banco',
		      nombre:'codigo_banco',
		      requerido:true,
					eslabon:'simple',
		      peticion:{
			        entidad: 'banco',
			        operacion: 'buscar',
							modulo: 'global'
			      },
						onclickSlot:function(campo,slot){
							var codigo_banco = slot.atributos.codigo;
							var capa =UI.elementos.modalWindow.buscarCapa(campo.nodo.parentNode.parentNode.parentNode);
							capa.partes.cuerpo.formulario.buscarCampo('codigo_cta').asignarValor(codigo_banco);
							campo.atributos.codigo=codigo_banco;
		        },
		      cuadro: {nombre: 'listaBanco',mensaje: 'Cargando Registros'}
		    }
		},{
			tipo: 'campoDeTexto',
			parametros:{
				nombre: 'codigo_cta',
				requerido:false,
				titulo: 'Codigo cuenta',
				tipo:'simple',
				eslabon: 'simple',
				usaToolTip: true
			}
		},{
		  	tipo : 'campoBusqueda',
		    parametros : {
		      titulo:'Tipo Cuenta',
		      nombre:'codigo_tipo_cuenta',
		      requerido:true,
					eslabon:'simple',
		      peticion:{
			        entidad: 'registroVirtual',
			        operacion: 'listar',
							nombre_tabla: 'TIPO_CUENTA',
							modulo: 'seguridad'
			      },
		      cuadro: {nombre: 'listaTipoPersona',mensaje: 'Cargando Registros'}
		    }
		}
	]
};
