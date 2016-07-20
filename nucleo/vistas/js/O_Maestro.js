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
		UI.agregarLista({
			clases : ['maestro'],
			titulo: UI.buscarConstructor(this.entidadActiva).nombre,
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
	this.quitarformulario = function(){
		this.ventanaForm.nodo.classList.remove('aparecer');
		var yo = this;
		setTimeout(function () {
			yo.ventanaForm.nodo.parentNode.removeChild(yo.ventanaForm.nodo);
			yo.ventanaForm = null;
		}, 500);
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
	this.agregarSectorFormulario = function(){
		this.ventanaForm.agregarSector({
			nombre: 'formulario',
			tipo:'sector',
			formulario : UI.buscarConstructor(this.entidadActiva)
		});
	};
	this.cambiosNuevo = function(){
		this.ventanaForm.agregarTitulo({
				tipo:'basico',
				html: 'Nueva '+UI.buscarConstructor(this.entidadActiva).nombre
		});
		agregarSectorFormulario();
		UI.elementos.botonera.gestionarBotones({
			quitar: ['nuevo'],
			agregar: [
				{
					tipo: 'guardar',
					click: function(boton){
						console.log(guardar);
					}
				}
			]
		});
	};
	this.cambiosModificar = function(atributos){
		this.ventanaForm.agregarTitulo({
			tipo:'basico',
			html: 'Modificar Registro'
		});
		this.ventanaForm.agregarSectorFormulario();
		// TODO: buscar em la base de datos el registro a modificar
		var agregar = [
			{
				tipo: 'eliminar',
				click: function(boton){
					console.log('eliminar');
				}
			},{
				tipo:'modificar',
				click: function(){
					console.log('modificar');
				}
			}
		];
		var gestionar = {
			agregar: agregar,
			quitar: []
		};
		UI.elementos.botonera.gestionarBotones(gestionar);
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
