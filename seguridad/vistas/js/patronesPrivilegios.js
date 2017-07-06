function construirVentanaAsignacion(disponibles,asignadas,capaContenido,nodo,campoAsignacion,campoDisponible){
	var campos = [];
	for (var i = 0; i < disponibles.length; i++) {
		var campo = {
			tipo: 'checkBox',
			parametros:{
				nombre: disponibles[i].nombreOperacion,
				valor: disponibles[i].codigo,
				requerido: false,
				habilitado: true,
				animacion: 'girar',
				eslabon: 'simple',
				usaTitulo: true,
				marcado: false,
				tipo: 'opciones'
			}
		};
		if(asignadas){
			for(var x = 0; x < asignadas.length; x++){
				if(disponibles[i].nombreOperacion === asignadas[x].nombreOperacion){
					campo.parametros.marcado = true;
				}
			}
		}
		campos.push(campo);
	}
	var cons = {
		campos : campos,
		altura : ((campos.length/3) * 40) + 30
	};
	//PRIVLEGIO: operacion; OPERACION: incluir
	var htmlBotNuevo = (sesion.buscarPrivilegio('operacion').buscarOperacion('incluir'))?'<button type="button" class="icon-nuevo-azul-claro-32"> </button>':'';
	capaContenido.convertirEnFormulario({
		cabecera: {
			html: nodo.getAttribute('titulo')
		},
		cuerpo: {
			tipo: 'nuevo',
			formulario: cons
		},
		pie: {
			html: '<section modalButtons>'+
						'<button type="button" class="icon-guardar-indigo-32"> </button>'+
						'<button type="button" class="icon-cerrar-rojo-32"> </button>'+
						htmlBotNuevo+
					'</section>'
		}
	});
	capaContenido.partes.cuerpo.formulario.registroId = nodo.getAttribute('codigo');
	capaContenido.nodo.classList.remove('ancho');
	var btnCerrrar = capaContenido.partes.pie.nodo.querySelector('button.icon-cerrar-rojo-32');
	btnCerrrar.onclick = function(){
		UI.elementos.modalWindow.eliminarUltimaCapa();
	};
	return capaContenido;
}
function obtenenrValoresFormulario(contenedor){
	var campos = contenedor.campos;
	var data = [];
	var validado = false;
	for (var i = 0; i < campos.length; i++) {
		//valido el campo
		if((campos[i].captarRequerido())&&(!campos[i].captarValor())){
			validado = true;
		}
		if(campos[i].captarValor()){
			data.push({nombre:campos[i].captarNombre(),valor:campos[i].captarValor()});
		}
	}
	if(!validado){
		return data;
	}else{
		return false;
	}
}
