validarRif =function (){
	UI.elementos.maestro.quitarformulario();
	var modal = UI.crearVentanaModal({
	  contenido: 'ancho',
	  cabecera:{
	    html: 'Verificacion de Rif',
			clases:['verificacion']
	  },
	  cuerpo:{
	    tipo:'nuevo',
	    formulario: {
				campos:[UI.buscarConstructor(UI.elementos.maestro.entidadActiva).campos[0]]
			},
	  },
	  pie:{
	      html:'<button type="button" class="mat-text-but">Verificar</button>',
				clases:['operaciones']
	  }
	});

	modal.nodo.querySelector('button.mat-text-but').onclick = function(){
		var rif =  modal.partes.cuerpo.formulario.buscarCampo('rif').captarValor();
		if(rif){
			var peticion = {
			   modulo: "global",
			   entidad: "organizacion",
			   operacion: "buscarRegistro",
			   codigo: rif
			};
			var cuadro = {
				contenedor: modal.partes.cuerpo.nodo,
				cuadro:{
				  nombre: 'verificacionRif',
				  mensaje: 'Verificando Rif en la Base de Datos'
				}
			};
			torque.manejarOperacion(peticion,cuadro).then(function(respuesta){
				UI.elementos.maestro.agregarFormulario({tipo:'nuevo'});
				formulario = UI.elementos.maestro.forma.formulario;
				if(respuesta.success){
					formulario.asignarValores(respuesta.registros);
					formulario.buscarCampo('codigo').limpiar();
					formulario.buscarCampo('rif').deshabilitar();
					formulario.buscarCampo('nombre_completo').deshabilitar();
					formulario.buscarCampo('codigo_tipo_persona').deshabilitar();
				}else{
					formulario.buscarCampo('rif').asignarValor(rif);
					formulario.buscarCampo('rif').deshabilitar();
				}
				UI.elementos.modalWindow.eliminarUltimaCapa();
			});
		}else{
			  UI.agregarToasts({
			    texto: 'Rellene el campo para poder verificar',
			    tipo: 'web-arriba-derecha-alto'
			  });
		}
	};
};
ctasBancarias = function(){
	UI.elementos.maestro.quitarformulario();
	var modal = UI.crearVentanaModal({
	  contenido: 'ancho',
	  cabecera:{
	    html: 'Cuentas Bancarias',
			clases:['verificacion']
	  },
	  cuerpo:{
	    tipo:'nuevo',
	    formulario: {
				campos:UI.buscarConstructor('cuentasBancarias').campos
			},
	  },
	  pie:{
	      html:'<button type="button" class="mat-text-but">Verificar</button>',
				clases:['operaciones']
	  }
	});
};
