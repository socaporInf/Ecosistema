//BUG: no muestra cambios al inserta u nuevo registro
var Maestro = function(atributos){

	this.entidadActiva = atributos.entidad;
	this.atributos = atributos;
	this.lista = null;
	this.listaPadre = null;
	this.forma = null;
	this.interval = null;
	this.estado = 'sinInicializar';
	this.atributos.dependiente = atributos.dependiente || false;
	this.botones = this.atributos.botones || [];

	//-----------------------------Metodos----------------------------------------------
	//-------------------------------------Manejo de UI-----------------------------------------------------------
	this.construirUI = function(data){
		var ID = setInterval(function(){
			if(sesion.privilegioActivo){
				var maestro = UI.elementos.maestro;
				clearInterval(ID);
				if(!sesion.privilegioActivo.buscarOperacion('incluir')){
					UI.elementos.botonera.quitarBoton('nuevo');
				}
				if(sesion.privilegioActivo.buscarOperacion('consultar')){
					if(maestro.atributos.dependiente){
						if(maestro.atributos.padre){
							if(UI.buscarConstructor(maestro.atributos.padre)){
								//si es dependiente y el padre esta agregado creo la lista del padre
									maestro.agregarListaPadre();
							}else{

							}
						}
					}else{
						// si no es dependiente creo la lista basica
						UI.elementos.maestro.agregarLista();
					}
				}
			}
		},10);
	};
	this.nuevo = function(){
		return this.agregarFormulario({tipo:'nuevo'});
	};
	//-------------------------------------Manejo de UI-----------------------------------------------------------

	this.agregarLista = function (){
		var yo = this;
		var consLista = this.estructuraLista(this.entidadActiva,function(slot){
				yo.agregarFormulario(slot.atributos);
		});
		this.lista = UI.agregarLista(consLista,this.atributos.contenedor);
	};

	this.agregarListaPadre = function(){
		var yo = this;
		var consLista =this.estructuraLista(this.atributos.padre,function(){},'padre');

		//en caso de registros virtuales
		if(this.atributos.padre_virtual){
			consLista.carga.peticion.operacion = 'listar';
			consLista.carga.peticion.nombre_tabla = this.atributos.nombre_tabla;
			consLista.titulo = this.atributos.nombre_tabla;
		}
		consLista.onclickSlot = function(slot){
			yo.gestionarOperaciones('modificarPadre');
			var consLista = yo.estructuraLista(yo.entidadActiva,function(slot){
					yo.agregarFormulario(slot.atributos);
			});
			if(!UI.buscarVentana(yo.entidadActiva)){
				consLista.carga.peticion.codigo_padre = slot.atributos.codigo;
				consLista.clases.push('not-first');
				consLista.clases.push('hija');
				yo.lista = UI.agregarLista(consLista,yo.atributos.contenedor);
			}else{
				lista = UI.buscarVentana(yo.entidadActiva);
				lista.atributos.carga.peticion.codigo_padre = slot.atributos.codigo;
				lista.recargar();
				if(UI.elementos.maestro.forma){
						UI.elementos.maestro.forma.destruirNodo();
						UI.elementos.maestro.gestionarOperaciones('inicial');
				}
			}
		};
		this.listaPadre = UI.agregarLista(consLista,this.atributos.contenedor);
		this.listaPadre.nodo.classList.add('padre');
	};

	this.estructuraLista = function(entidad,onclick,parentesco){
		parentesco = parentesco || 'hijo';
		if(this.atributos.lista && (parentesco != 'padre')){
			this.atributos.lista.columnas = this.atributos.lista.columnas || 1;
			this.atributos.lista.selector = this.atributos.lista.selector || 'apagado';
		}else{
			if(parentesco === 'padre'){
				this.atributos.listaPadre = {
					columnas: 1,
					selector: 'apagado'
				};
			}else{
				this.atributos.lista = {
					columnas: 1,
					selector: 'apagado'
				};
			}
		}
		var lista = (parentesco =='hijo')?this.atributos.lista:this.atributos.listaPadre;
		lista.registrosPorPagina = lista.registrosPorPagina || 12;
		var consLista = {
			clases : ['maestro'],
			titulo: UI.buscarConstructor(entidad).titulo,
		  campo_nombre: UI.buscarConstructor(entidad).campo_nombre,
			nombre: entidad,
			selector: lista.selector,
			columnas: lista.columnas,
			registrosPorPagina: lista.registrosPorPagina,
			carga: {
				uso:true,
				peticion:{
				   modulo: UI.buscarConstructor(entidad).modulo,
				   entidad: entidad,
				   operacion: "buscar",
				},
				espera:{
					cuadro:{
					  nombre: 'carga '+entidad,
					  mensaje: 'cargando Lista'
					}
				}
				//,respuesta:
			},
			paginacion: {
				uso:false
			},
			onclickSlot: onclick
		};
		return consLista;
	};

	this.agregarFormulario = function(atributos){
		var yo = this;
		return new Promise(function(completada,rechazada){
			if(!atributos.tipo){
				atributos.tipo = 'modificar';
			}
			if(yo.forma){
				completada('quitar');
			}else{
				completada('agregar');
			}
		})
		.then(function(accion){
			if(accion==='quitar'){
				return yo.quitarformulario()
					.then(function(){
						return yo.crearformulario(atributos);
					});
			}else{
				return yo.crearformulario(atributos);
			}
		});
	};
	this.quitarformulario = function(){
		var yo = this;
		return new Promise(function(completada,rechazada){
			if(yo.forma){
				yo.forma.nodo.classList.remove('aparecer');
				setTimeout(function () {
					UI.quitarVentana(yo.forma.atributos.nombre);
					yo.forma = null;
					completada();
				}, 500);
			}
		});
	};
	this.crearformulario = function(atributos){
		var yo = this;
		return new Promise(function(completada,rechazada){
			yo.construirVentana();
			if(atributos.tipo === 'nuevo'){
				yo.cambiosNuevo();
			}else{
				yo.cambiosModificar(atributos);
			}
			completada();
		});
	};
	this.construirVentana = function(){
		var clases = [];
		if(this.listaPadre){
			clases = ['maestro','dependiente'];
		}else{
			clases = ['maestro'];
		}
		this.forma = UI.agregarVentana({
			nombre:'formulario '+UI.buscarConstructor(this.entidadActiva).nombre,
			clases: clases,
			sectores:[
				{
					nombre: 'carga',
					html: 'aqui va elcuadro carga'
				}
			]
		},this.atributos.contenedor);
		this.forma.nodo.classList.add('aparecer');
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
		this.forma.agregarSector(sector);
		this.forma.formulario = this.forma.buscarSector('formulario').formulario;
		return this.forma.buscarSector('formulario').formulario;
	};
	this.cambiosNuevo = function(){
		this.forma.agregarTitulo({
				tipo:'basico',
				html: 'Nueva '+UI.buscarConstructor(this.entidadActiva).titulo
		});
		this.forma.buscarSector('carga').destruirNodo();
		this.agregarSectorFormulario('nuevo');
		this.gestionarOperaciones('nuevo');
	};
	this.cambiosModificar = function(atributos){
		this.forma.agregarTitulo({
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
			contenedor : this.forma.buscarSector('carga').nodo,
			cuadro: {
				nombre: 'cargaRegistros',
				mensaje: 'Cargando Registro '+atributos.nombre
			}
		};
		torque.manejarOperacion(peticion,cuadro,function(respuesta){
			UI.elementos.maestro.forma.buscarSector('carga').destruirNodo();
			if(respuesta.success){
				var formulario = UI.elementos.maestro.agregarSectorFormulario('modificar',respuesta.registros);
				formulario.registroId = atributos.codigo;
				UI.elementos.maestro.gestionarOperaciones('consultar');
			}else{
				UI.crearMensaje(respuesta.mensaje);
			}
		});
	};
	this.modificar = function(){
		var formulario = this.forma.formulario;
		formulario.habilitar();
		this.gestionarOperaciones('modificar');
	};
	this.guardarCambios = function(){
		var formulario = this.forma.formulario;
		var peticion = formulario.captarValores();
		peticion.entidad = this.entidadActiva;
		peticion.modulo = formulario.plano.modulo;
		peticion.codigo = formulario.registroId;
		peticion.operacion = 'modificar';
		var cuadro = {
			contenedor: this.forma.buscarSector('formulario').nodo,
			cuadro: {
				nombre: 'guardandoCambiosMaestro',
				mensaje: 'Guardando Cambios'
			}
		};
		torque.manejarOperacion(peticion,cuadro)
			.then(torque.evaluarRespuesta)
			.then(function(respuesta){
					if(respuesta.registro){
						UI.elementos.maestro.lista.actualizarLista(respuesta.registro)
							.then(function(){
								UI.elementos.maestro.lista.buscarSlot(respuesta.registro).activar();
							});
					}else{
						UI.crearMensaje(respuesta.mensaje);
						UI.elementos.maestro.quitarformulario();
					}
			},function(respuesta){
					UI.crearMensaje(respuesta.mensaje);
			});
	};
	this.guardar = function(){
		var formulario = this.forma.formulario;
		if(formulario.validar()){
			var peticion = formulario.captarValores();
			peticion.entidad = formulario.plano.nombre;
			peticion.modulo = formulario.plano.modulo;
			peticion.operacion = 'guardar';
			var cuadro = {
				contenedor : this.forma.buscarSector('formulario').nodo,
				cuadro: {
				  nombre: 'guardandoMaestro',
				  mensaje: 'Guardando registro'
				}
			};
			torque.manejarOperacion(peticion,cuadro,function(respuesta){
				UI.crearMensaje(respuesta.mensaje);
				UI.elementos.maestro.forma.destruirNodo();
				UI.elementos.maestro.gestionarOperaciones('inicial');
			}).then(function(){
				return UI.elementos.maestro.lista.recargar();
			});
		}else{
			UI.agregarToasts({
				texto: 'Debe llenar el formulario antes de poder guardar',
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
			if(parent.querySelector('div[tooltip]')){
				if(parent.lastChild.getAttribute('tooltip')!==null){
					var tooltip=parent.querySelector('div[tooltip]');
						tooltip.style.opacity=0;
						tooltip.style.top='-20px';
						tooltip.style.transform='scale(0)';
					setTimeout(function(){
						parent.style.zIndex=null;
						if(parent.querySelector('div[tooltip]')){
							parent.removeChild(parent.querySelector('div[tooltip]'));
						}
					},310);
				}
			}
		}
	};
	this.retornarBoton = function(tipo){
		var boton = this.buscarBoton(tipo);
		if(!boton){
			switch (tipo) {
				case 'nuevo':
					boton = {
						tipo:'nuevo',
						click:function(){
							UI.elementos.maestro.nuevo();
						}
					};
					break;
				case 'guardar':
					boton = {
						tipo:'guardar',
						click: function(){
							UI.elementos.maestro.guardar();
						}
					};
					break;
				case 'guardarCambios':
					boton = {
						tipo:'guardar',
						click: function(){
							UI.elementos.maestro.guardarCambios();
						}
					};
					break;
				case 'modificar':
					boton={
						tipo:'modificar',
						click: function(){
							UI.elementos.maestro.modificar();
						}
					};
					break;
				case 'eliminar':
					boton={
						tipo: 'eliminar',
						click: function(boton){
							console.log('eliminar');
						}
					};
					break;
			}
		}
		return boton;
	};
	this.buscarBoton = function(tipo){
		var boton = false;
		this.botones.forEach(function(each){
			if(each.tipo === tipo){
				boton = each;
			}
		});
		return boton;
	};
	this.gestionarOperaciones = function(operacion){

		var formulario = (!this.forma)?null:this.forma.formulario;
		var agregar = [];
		var quitar = [];
		var privilegio = sesion.privilegioActivo;
		switch(operacion.toLowerCase()){

			case 'nuevo':
				quitar = ['nuevo','modificar','eliminar','guardar'];
				agregar = [this.retornarBoton('guardar')];

				if(formulario.plano.botones){
					if(formulario.plano.botones.nuevo.quitar){
						quitar = formulario.plano.botones.nuevo.quitar.concat(quitar);
					}
					if(formulario.plano.botones.nuevo.agregar){
						agregar = formulario.plano.botones.nuevo.agregar.concat(agregar);
					}
				}
				break;

			case 'consultar':
				agregar = [];
				if(privilegio.buscarOperacion('eliminar')){
					agregar.push(this.retornarBoton('eliminar'));
				}
				if(privilegio.buscarOperacion('incluir')){
					agregar.push(this.retornarBoton('nuevo'));
				}
				if(privilegio.buscarOperacion('modificar')){
					agregar.push(this.retornarBoton('modificar'));
				}
				quitar = ['guardar'];

				if(formulario.plano.botones){
					if(formulario.plano.botones.consulta.quitar){
						quitar = formulario.plano.botones.consulta.quitar.concat(quitar);
					}
					if(formulario.plano.botones.consulta.agregar){
						agregar = formulario.plano.botones.consulta.agregar.concat(agregar);
					}
				}
				break;

			case 'modificar':
				quitar = ['modificar'];
				agregar = [this.retornarBoton('guardarCambios')];
				break;

			case 'modificarpadre':
				agregar = [];
				if(privilegio.buscarOperacion('modificar')){
					agregar.push({
						tipo: 'modificarPadre',
						clases: ['mat-deeppurple500'],
						contenido:"edit",
						click: function(boton){
							UI.elementos.maestro.modificarPadre();
						}
					});
				}
				quitar = [];
				break;

			case 'inicial':
				agregar = [];
				if(privilegio.buscarOperacion('incluir')){
					agregar.push(this.retornarBoton('nuevo'));
				}
				quitar = ['todos'];
				break;
		}
		UI.elementos.botonera.gestionarBotones({
			quitar: quitar,
			agregar: agregar
		});
	};
	this.modificarPadre = function(){
		var cons = UI.buscarConstructor(this.atributos.padre);
		var modal = UI.crearVentanaModal({
		  contenido: 'ancho',
		  cabecera:{
		    html: cons.titulo
		  },
		  cuerpo:{
		    tipo:'modificar',
		    formulario: cons,
		    registro : this.listaPadre.obtenerSeleccionado().atributos
		  },
		  pie:{
				clases:['botonera'],
		      html:'<button type="button" class="icon green500 material-icons">edit</button>'+
		           '<button type="button" class="icon icon-cerrar-rojo-32"> </button>'
		  }
		});
		modal.partes.cuerpo.formulario.habilitar();
		modal.partes.pie.nodo.querySelector('button.green500').onclick=function(){
			var peticion = UI.juntarObjetos({
				"modulo":cons.modulo,
				"entidad":cons.nombre,
				"operacion":'modificar',
				"codigo":modal.partes.cuerpo.formulario.registroId
			},modal.partes.cuerpo.formulario.captarValores());
			var cuadro = {
				"contenedor": modal.partes.cuerpo.nodo,
				"cuadro":{
					"nombre":'modificar padre',
					"mensaje":'Aplicando Cambios'
				}
			};
			torque.manejarOperacion(peticion,cuadro)
				.then(function(respuesta){
					if(respuesta.success){
						if(UI.elementos.maestro.listaPadre.buscarSlot(respuesta.registro)){
							UI.elementos.maestro.listaPadre.recargar();
							UI.elementos.modalWindow.eliminarUltimaCapa();
						}
					}else{
					  modal.convertirEnMensaje(respuesta.mensaje);
					}
				});
		};
	};
	this.construirUI();
};
