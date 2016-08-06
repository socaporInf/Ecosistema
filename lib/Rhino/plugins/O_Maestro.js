var Maestro = function(atributos){

	this.entidadActiva = atributos.entidad;
	this.atributos = atributos;
	this.ventanaList = null;
	this.ventanaForm = null;
	this.interval = null;
	this.estado = 'sinInicializar';
	//-----------------------------Metodos----------------------------------------------

	this.agregarLista = function (){
		var yo = this;
		this.ventanaList = UI.agregarLista({
			clases : ['maestro'],
			titulo: UI.buscarConstructor(this.entidadActiva).titulo,
		  campo_nombre: UI.buscarConstructor(this.entidadActiva).campo_nombre,
			carga: {
				uso:true,
				peticion:{
				   modulo: UI.buscarConstructor(this.entidadActiva).modulo,
				   entidad: this.entidadActiva,
				   operacion: "buscar",
				},
				espera:{
					cuadro:{
					  nombre: 'carga '+this.entidadActiva,
					  mensaje: 'cargando Lista'
					}
				}
				//,respuesta:
			},
			paginacion: {
				uso:false
			},
			onclickSlot: function(slot){
				yo.agregarFormulario(slot.atributos);
			}
		},this.atributos.contenedor);
	};

	this.agregarFormulario = function(atributos){
		if(!atributos.tipo){
			atributos.tipo = 'modificar';
		}
		var tiempo = 0;
		if(this.ventanaForm){
			tiempo = 1000;
			var yo = this;
			yo.quitarformulario();
			setTimeout(function () {
				yo.crearformulario(atributos);
			}, tiempo);
		}else{
			this.crearformulario(atributos);
		}
	};
	this.quitarformulario = function(){
		this.ventanaForm.nodo.classList.remove('aparecer');
		var yo = this;
		setTimeout(function () {
			yo.ventanaForm.nodo.parentNode.removeChild(yo.ventanaForm.nodo);
			yo.ventanaForm = null;
		}, 500);
	};
	this.crearformulario = function(atributos){
		this.construirVentana();
		if(atributos.tipo === 'nuevo'){
			this.cambiosNuevo();
		}else{
			this.cambiosModificar(atributos);
		}
	};
	this.construirVentana = function(){
		this.ventanaForm = UI.agregarVentana({
			nombre:'formulario '+UI.buscarConstructor(this.entidadActiva).nombre,
			clases: ['maestro'],
			sectores:[
				{
					nombre: 'carga',
					html: 'aqui va elcuadro carga'
				}
			]
		},this.atributos.contenedor);
		this.ventanaForm.nodo.classList.add('aparecer');
	};
	this.agregarSectorFormulario = function(tipo,registro){
		var sector = {
			nombre: 'formulario',
			tipo: tipo,
			formulario : UI.buscarConstructor(this.entidadActiva)
		};
		if(registro){
			sector.registro = registro;
		}
		this.ventanaForm.agregarSector(sector);
		this.ventanaForm.formulario = this.ventanaForm.buscarSector('formulario').formulario;
		return this.ventanaForm.buscarSector('formulario').formulario;
	};
	this.cambiosNuevo = function(){
		this.ventanaForm.agregarTitulo({
				tipo:'basico',
				html: 'Nueva '+UI.buscarConstructor(this.entidadActiva).titulo
		});
		this.ventanaForm.buscarSector('carga').destruirNodo();
		this.agregarSectorFormulario('nuevo');
		var quitar = ['nuevo','modificar','eliminar','guardar'];
		var agregar = [
			{
				tipo: 'guardar',
				click: function(boton){
					UI.elementos.maestro.guardar();
				}
			}
		];
		var formulario = UI.elementos.maestro.ventanaForm.formulario;
		if(formulario.plano.botones){
			if(formulario.plano.botones.nuevo.quitar){
				quitar = formulario.plano.botones.nuevo.quitar.concat(quitar);
			}
			if(formulario.plano.botones.nuevo.agregar){
				agregar = formulario.plano.botones.nuevo.agregar.concat(agregar);
			}
		}
		UI.elementos.botonera.gestionarBotones({
			quitar: quitar,
			agregar: agregar
		});
	};
	this.cambiosModificar = function(atributos){
		this.ventanaForm.agregarTitulo({
			tipo:'basico',
			html: 'Modificar Registro'
		});
		var peticion = {
			entidad: this.entidadActiva,
			modulo: UI.buscarConstructor(this.entidadActiva).modulo,
			operacion: 'buscarRegistro',
			codigo: atributos.codigo
		};
		var cuadro = {
			contenedor : this.ventanaForm.buscarSector('carga').nodo,
			cuadro: {
				nombre: 'cargaRegistros',
				mensaje: 'Cargando Registro '+atributos.nombre
			}
		};
		torque.manejarOperacion(peticion,cuadro,function(respuesta){
			UI.elementos.maestro.ventanaForm.buscarSector('carga').destruirNodo();
			if(respuesta.success){
				var formulario = UI.elementos.maestro.agregarSectorFormulario('modificar',respuesta.registros);
				formulario.registroId = atributos.codigo;
				var agregar = [
					{
						tipo: 'eliminar',
						click: function(boton){
							console.log('eliminar');
						}
					},{
						tipo:'nuevo',
						click:function(){
							UI.elementos.maestro.agregarFormulario({tipo:'nuevo'});
						}
					},{
						tipo:'modificar',
						click: function(){
							UI.elementos.maestro.modificar();
						}
					}
				];
				var quitar = ['guardar'];
				if(formulario.plano.botones){
					if(formulario.plano.botones.modificar.quitar){
						quitar = formulario.plano.botones.modificar.quitar.concat(quitar);
					}
					if(formulario.plano.botones.modificar.agregar){
						agregar = formulario.plano.botones.modificar.agregar.concat(agregar);
					}
				}
				UI.elementos.botonera.gestionarBotones({
					quitar: quitar,
					agregar: agregar
				});
			}else{
				UI.crearMensaje(respuesta.mensaje);
			}
		});
	};
	this.modificar = function(){
		var formulario = this.ventanaForm.formulario;
		formulario.habilitar();
		var gestionar = {
			quitar: ['modificar'],
			agregar: [
				{
					tipo:'guardar',
					click: function(){
						UI.elementos.maestro.guardarCambios();
					}
				}
			]
		};
		UI.elementos.botonera.gestionarBotones(gestionar);
	};
	this.guardarCambios = function(){
		var formulario = this.ventanaForm.formulario;
		var peticion = formulario.captarValores();
		peticion.entidad = this.entidadActiva;
		peticion.modulo = formulario.plano.modulo;
		peticion.codigo = formulario.registroId;
		peticion.operacion = 'modificar';
		var cuadro = {
			contenedor: this.ventanaForm.buscarSector('formulario').nodo,
			cuadro: {
				nombre: 'guardandoCambiosMaestro',
				mensaje: 'Guardando Cambios'
			}
		};
		torque.manejarOperacion(peticion,cuadro,function(respuesta){
			if(respuesta.success){
				UI.elementos.maestro.ventanaList.actualizarLista(respuesta.registro);
				UI.elementos.maestro.ventanaList.buscarSlot(respuesta.registro).activar();
			}else{
				UI.crearMensaje(respuesta.mensaje);
			}
		});
	};
	this.guardar = function(){
		var formulario = this.ventanaForm.formulario;
		if(formulario.validar()){
			var peticion = formulario.captarValores();
			peticion.entidad = formulario.plano.nombre;
			peticion.modulo = formulario.plano.modulo;
			peticion.operacion = 'guardar';
			var cuadro = {
				contenedor : this.ventanaForm.buscarSector('formulario').nodo,
				cuadro: {
				  nombre: 'guardandoMaestro',
				  mensaje: 'Guardando registro'
				}
			};
			torque.manejarOperacion(peticion,cuadro,function(respuesta){
				if(respuesta.success){
					var slot = UI.elementos.maestro.ventanaList.agregarSlot(respuesta.registros);
					slot.click();
				}else{
					UI.crearMensaje(respuesta.mensaje);
				}
			});
		}else{
			UI.agregarToasts({
				texto: 'Debe Llenr el formulario antes de poder guardar',
				tipo: 'web-arriba-derecha-alto'
			});
		}
	};
	this.validarCombo = function(valoresNoPermitidos,lista){
		normalizarNodo(lista);
		for(var i=0;i<lista.length;i++){
			lista[i].style.display='block';
		}
		for(var x=0;x<lista.length;x++){
			for(var y=0;y<valoresNoPermitidos.length;y++){
				if(lista[x].value==valoresNoPermitidos[y]){
					lista.removeChild(lista[x]);
					x--;
				}
			}
		}
		if(lista.length==1){
			lista.options[0].textContent='No Posee Valores Disponibles';
			lista.options[0].value='cerrar';
		}
	};
	this.abrirtooltipInput = function(event){
		var parent = this;
		var input = parent.firstChild;
		while(input.nodeName=='#text'){
			input=input.nextSibling;
		}
		if(input.value!==''){
			this.interval=setTimeout(function(){
				parent.style.zIndex='4';
				var tooltip = document.createElement('div');
				tooltip.textContent=input.value;
				tooltip.setAttribute('tooltip','');
				parent.appendChild(tooltip);
				setTimeout(function(){
					tooltip.style.opacity=1;
					tooltip.style.top=40+'px';
					tooltip.style.transform='scale(1)';
				},10);
			},1000);
		}

	};
	this.cerrartooltipInput = function(event){
		var parent = this;
		var input = parent.firstChild;
		while(input.nodeName=='#text'){
			input=input.nextSibling;
		}
		if(this.interval!==null){
			clearInterval(this.interval);
			this.interval=null;
			if(parent.lastChild.nodeName.toLowerCase()=='div'){
				if(parent.lastChild.getAttribute('tooltip')!==null){
					var tooltip=parent.lastChild;
						tooltip.style.opacity=0;
						tooltip.style.top='-20px';
						tooltip.style.transform='scale(0)';
					setTimeout(function(){
						parent.style.zIndex=null;
						parent.removeChild(parent.lastChild);
					},310);
				}
			}
		}
	};
	//-------------------------------------Manejo de UI-----------------------------------------------------------
	this.construirUI = function(data){
		this.agregarLista();
	};
	this.construirUI();
};
