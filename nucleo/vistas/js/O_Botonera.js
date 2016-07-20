var Botonera = function(atributos){

	var Boton = function(atributos){
		this.atributos = atributos;
		this.tipo = atributos.tipo.toLowerCase();
		this.nodo =  null;
		this.estado = 'porConstruir';

		this.construirNodo = function(){
			var nodo = document.createElement('button');
			nodo.setAttribute('type','button');
			switch(this.atributos.tipo){
				case 'abrir':
					nodo.setAttribute('btnAbrir','');
					nodo.setAttribute('estado','oculto');
				break;
				case 'nuevo':
					nodo.setAttribute('btnNuevo','');
				break;
				case 'buscar':
					nodo.setAttribute('btnBuscar','');
				break;
				case 'modificar':
					nodo.setAttribute('btnModificar','');
				break;
				case 'eliminar':
					nodo.setAttribute('btnEliminar','');
				break;
				case 'detalle':
					nodo.setAttribute('btnDetalle','');
				break;
				case 'redactar':
					nodo.setAttribute('btnRedactar','');
				break;
				case 'cancelar':
					nodo.setAttribute('btnCancelar','');
				break;
				case 'guardar':
					nodo.setAttribute('btnGuardar','');
				break;
			}
			this.nodo = nodo;
			this.estado = 'enUso';
			var yo = this;
			if(this.atributos.click){
				this.nodo.onclick = function(){
					yo.atributos.click(yo);
				};
			}

		};
		this.construirNodo();
	};
	//-------------------------------------------- fin objeto boton ----------------------
	this.estructura = atributos.botones;
	this.estado = 'porConstruir';
	this.nodo = null;

	this.botones = [];

	this.construir = function(){
		var contenedor = atributos.contenedor;
		var nodo = document.createElement('div');
		nodo.setAttribute('botonera','');
		contenedor.parentNode.insertBefore(nodo,contenedor.nextSibling);
		this.nodo = nodo;
		this.inicializarBotones();
		//boton nuevo
		if(UI.elementos.maestro!=='noPosee'){
			this.buscarBoton('nuevo').nodo.onclick=function(){
				console.log('presiono Nuevo');
				var data = {
					tipo:'nuevo'
				};
				var maestro = UI.elementos.maestro;
				maestro.agregarFormulario(data);
			};
			//boton buscar
			this.buscarBoton('buscar').nodo.onclick=function(){
				UI.elementos.maestro.ventanaList.abrirCampoBusqueda();
			};
		}
	};
	this.inicializarBotones = function(){
		var botones = this.estructura;
		for(var x = 0; x < botones.length; x++){
			this.agregarBoton(botones[x]);
		}
		this.agregarEfectos();
	};
	this.agregarBoton = function(constructorBoton){
		var botonera = this.nodo;
		var existe = false;
		if(typeof constructorBoton == 'string'){
			constructorBoton = {tipo:constructorBoton};
		}
		for(var x=0;x<this.botones.length;x++){
			if(this.botones[x].tipo==constructorBoton.tipo.toLowerCase()){
				existe=true;
				console.log('el boton '+constructorBoton.tipo+' ya existe');
			}
		}
		if(!existe){

			boton = new Boton(constructorBoton);
			botonera.appendChild(boton.nodo);
			//esta parte es solo para cuando se agrega un boton en un momento posterior a la inicializacion
			if(this.buscarBoton('abrir')!=-1){
				if(this.buscarBoton('abrir').nodo.getAttribute('estado')=='visible'){
					setTimeout(function(){
						var top=(UI.elementos.botonera.botones.length-1)*45;
						boton.nodo.style.top='-'+top+'px';
					},10);
				}
			}
			this.botones.push(boton);
		}
		return boton;
	};
	this.agregarBotones = function(botones){
		var tiempo = 20;
		for(var x = 0; x < botones.length; x++){
			espera(x,tiempo,botones,'agregar');
			tiempo+=20;
		}
	};
	function espera(x,tiempo,botones,operacion){
		setTimeout(function(){
			if(operacion === 'quitar'){
				UI.elementos.botonera.quitarBoton(botones[x]);
			}else{
				UI.elementos.botonera.agregarBoton(botones[x]);
			}
		},tiempo);
	}
	this.quitarBotones = function(botones){
		var tiempo = 20;
		for(var x = 0; x < botones.length; x++){
			espera(x,tiempo,botones,'quitar');
			tiempo+=20;
		}
	};
	this.gestionarBotones = function(botones){
		var tiempo = 20;
		for(var x = 0; x < botones.quitar.length; x++){
			espera(x,tiempo,botones.quitar,'quitar');
			tiempo+=20;
		}
		for(var i = 0; i < botones.agregar.length; i++){
			espera(i,tiempo,botones.agregar,'agregar');
			tiempo+=20;
		}
	};
	this.agregarEfectos = function(){
		var botones = this.botones;
		if(botones.length>1){
			if(!this.buscarBoton('abrir')){
				console.log('no se encuentra el boton de apertura');
			}else{
				this.buscarBoton('abrir').nodo.onclick = function(){
					if(this.getAttribute('estado')=='oculto'){
						var top = 0;
						this.classList.toggle('apertura');
						this.setAttribute('estado','visible');
						for(var x = 0; x < botones.length; x++){
							if(botones[x].tipo!='abrir'){
								top+=45;
								botones[x].nodo.style.top = '-'+top+'px';
							}
						}
					}else{
						this.classList.toggle('apertura');
						this.setAttribute('estado','oculto');
						for(var i = 0; i < botones.length; i++){
							if(botones[i].tipo!='abrir'){
								botones[i].nodo.style.top = 0+'px';
							}
						}
					}
				};
			}
		}
	};
	this.buscarBoton = function(tipo){
		var botones = this.botones;
		for(var x = 0; x < botones.length; x++){
			if(botones[x].tipo==tipo){
				return botones[x];
			}
		}
		return -1;
	};
	this.listarBotones = function(){
		var lista = this.botones;
		var resultado = 'estos son los botones agregados:\n';
		for( var x = 0; x < lista.length; x++){
			resultado += '\t'+lista[x].tipo+'\n';
		}
		console.log(resultado);
	};
	this.getEstado = function(){
		console.log(this.estado);
	};
	this.quitarBoton = function(constructorBoton){
		if(typeof constructorBoton == 'string'){
			constructorBoton = {tipo:constructorBoton};
		}
		var eliminar=this.buscarBoton(constructorBoton.tipo);
		if(eliminar!=-1){
			eliminar.nodo.style.top='0px';
			setTimeout(function(){
				eliminar.nodo.parentNode.removeChild(eliminar.nodo);
			},510);
			this.botones.splice(this.botones.indexOf(eliminar),1);
		}
	};
	this.construir();
};
