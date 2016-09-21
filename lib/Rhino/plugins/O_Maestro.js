//BUG: no muestra cambios al inserta u nuevo registro
var Maestro = function(atributos){

	this.entidadActiva = atributos.entidad;
	this.atributos = atributos;
	this.ventanaList = null;
	this.ventanaForm = null;
	this.interval = null;
	this.estado = 'sinInicializar';
	this.atributos.dependiente = atributos.dependiente || false;

	//-----------------------------Metodos----------------------------------------------

	this.agregarLista = function (){
		var yo = this;
		var consLista = this.estructuraLista(this.entidadActiva,function(slot){
				yo.agregarFormulario(slot.atributos);
		});
		this.ventanaList = UI.agregarLista(consLista,this.atributos.contenedor);
	};

	this.agregarListaPadre = function(){
		var yo = this;
		var consLista =this.estructuraLista(this.atributos.padre,function(){});
		//en caso de registros virtuales
		if(this.atributos.padre_virtual){
			consLista.carga.peticion.operacion = 'listar';
			consLista.carga.peticion.nombre_tabla = this.atributos.nombre_tabla;
			consLista.titulo = this.atributos.nombre_tabla;
		}
		consLista.onclickSlot = function(slot){
			var consLista = yo.estructuraLista(yo.entidadActiva,function(slot){
					yo.agregarFormulario(slot.atributos);
			});
			if(!UI.buscarVentana(yo.entidadActiva)){
				consLista.carga.peticion.codigo_padre = slot.atributos.codigo;
				yo.ventanaList = UI.agregarLista(consLista,yo.atributos.contenedor);
			}else{
				lista = UI.buscarVentana(yo.entidadActiva);
				lista.atributos.carga.peticion.codigo_padre = slot.atributos.codigo;
				lista.recargar();
				//BUG: al recargar la lista no se borran los slots de no existe registros
			}
		};
		this.ventanaList = UI.agregarLista(consLista,this.atributos.contenedor);
	};

	this.estructuraLista = function(entidad,onclick){
		var consLista = {
			clases : ['maestro'],
			titulo: UI.buscarConstructor(entidad).titulo,
		  campo_nombre: UI.buscarConstructor(entidad).campo_nombre,
			nombre: entidad,
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
		//Botones
		this.gestionarOperaciones('nuevo');
		// fin Botones
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
				//Botones
				UI.elementos.maestro.gestionarOperaciones('consultar');
				//fin Botones
			}else{
				UI.crearMensaje(respuesta.mensaje);
			}
		});
	};
	this.modificar = function(){
		var formulario = this.ventanaForm.formulario;
		formulario.habilitar();
		//Botones
		this.gestionarOperaciones('modificar');
		//fin Botones
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
				UI.crearMensaje(respuesta.mensaje);
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
	//-------------------------------------Manejo de UI-----------------------------------------------------------
	this.gestionarOperaciones = function(operacion){
		var formulario = this.ventanaForm.formulario;
		var agregar = [];
		var quitar = [];
		if(operacion.toLowerCase() === 'nuevo'){
			quitar = ['nuevo','modificar','eliminar','guardar'];
			agregar = [
				{
					tipo: 'guardar',
					click: function(boton){
						UI.elementos.maestro.guardar();
					}
				}
			];
			if(formulario.plano.botones){
				if(formulario.plano.botones.nuevo.quitar){
					quitar = formulario.plano.botones.nuevo.quitar.concat(quitar);
				}
				if(formulario.plano.botones.nuevo.agregar){
					agregar = formulario.plano.botones.nuevo.agregar.concat(agregar);
				}
			}
		}else if(operacion.toLowerCase() === 'consultar'){
			agregar = [];
			if(sesion.privilegioActivo.buscarOperacion('eliminar')){
				agregar.push({
					tipo: 'eliminar',
					click: function(boton){
						console.log('eliminar');
					}
				});
			}
			if(sesion.privilegioActivo.buscarOperacion('incluir')){
				agregar.push({
					tipo:'nuevo',
					click:function(){
						UI.elementos.maestro.agregarFormulario({tipo:'nuevo'});
					}
				});
			}
			if(sesion.privilegioActivo.buscarOperacion('modificar')){
				agregar.push({
					tipo:'modificar',
					click: function(){
						UI.elementos.maestro.modificar();
					}
				});
			}
			quitar = ['guardar'];
			if(formulario.plano.botones){
				if(formulario.plano.botones.modificar.quitar){
					quitar = formulario.plano.botones.modificar.quitar.concat(quitar);
				}
				if(formulario.plano.botones.modificar.agregar){
					agregar = formulario.plano.botones.modificar.agregar.concat(agregar);
				}
			}
		}else if(operacion.toLowerCase() === 'modificar'){
			quitar = ['modificar'];
			agregar = [
				{
					tipo:'guardar',
					click: function(){
						UI.elementos.maestro.guardarCambios();
					}
				}
			];
		}
		UI.elementos.botonera.gestionarBotones({
			quitar: quitar,
			agregar: agregar
		});
	};
	this.construirUI();
};
