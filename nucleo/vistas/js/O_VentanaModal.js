var modalWindow = function(){
	/*----------------------------------------------------------------------------------------------------*/
	/*--------------------------------------------Objeto CapaContenido------------------------------------*/
	/*----------------------------------------------------------------------------------------------------*/
	var capaContenido = function(){

		//------------------- Partes-------------------------------------
		var Cabecera = function(contenido){

			this.estado = 'sinConstruir';
			this.nodo = null;

			this.construirNodo = function(){
				var nodo=document.createElement('section');
				nodo.setAttribute('cabecera','');
				this.nodo = nodo;
				this.manejoDeContenido(contenido);
			};
			this.manejoDeContenido = function(contenido){
				var porConstruir;
				if(typeof contenido == 'string'){
						porConstruir = {html: contenido};
				}else{
					porConstruir = contenido;
				}
				if(porConstruir.html){
					this.nodo.innerHTML = porConstruir.html;
				}
			};
			this.agregarTipo = function(tipo){
				this.nodo.classList.add(tipo);
				var icono;
				switch(tipo){
					case 'error':
						icono = UI.crearIcono({
							nombre:'error',
							tamano: 48,
							color: 'white',
							inactivo: false
						});
						this.nodo.appendChild(icono);
						break;

					case 'advertencia':
						icono = UI.crearIcono({
							nombre:'warning',
							tamano: 48,
							color: 'white',
							inactivo: false
						});
						this.nodo.appendChild(icono);
						break;

					case 'informacion':
						icono = UI.crearIcono({
							nombre:'info_outline',
							tamano: 48,
							color: 'white',
							inactivo: false
						});
						this.nodo.appendChild(icono);
						break;

					default:
						console.log('no existe icono para'+tipo);
						break;
				}
			};
			this.construirNodo();
		};

		var Cuerpo = function(contenido){
			this.estado='sinConstruir';
			this.nodo = null;
			this.campos = [];

			this.construirNodo = function(){
				var nodo=document.createElement('section');
				nodo.setAttribute('cuerpo','');
				this.nodo=nodo;
				this.manejoDeContenido(contenido);
			};
			//esta funcion revisa el contenido y construye la interfaz que le
			//fue pasada y la construye
			this.manejoDeContenido = function(contenido){
				var porConstruir;
				if(typeof contenido == 'string'){
						porConstruir = {html: contenido};
				}else{
					porConstruir = contenido;
				}
				if(porConstruir.campos){
					this.agregarCampos(porConstruir.campos);
				}
				if(porConstruir.html){
					this.nodo.innerHTML = porConstruir.html;
				}
				if(porConstruir.alto){
					this.nodo.style.height = porConstruir.alto + 'px';
				}
				if(porConstruir.clase){
					this.nodo.classList.add(porConstruir.clase);
				}
			};

			this.agregarCampos = function(campos){
				for(var x = 0;x < campos.length; x++){
					this.agregarCampo(campos[x]);
				}
			};

			this.agregarCampo = function(campo){
				var contenedor = this.nodo;
				var campoNuevo = UI.agregarCampo(campo,contenedor);
				this.campos.push(campoNuevo);
			};

			this.construirNodo();
		};

		var Pie = function(contenido){
			this.estado = 'sinConstruir';
			this.nodo = null;
			//funcion para agregar funcionamiento a los elementos hijos
			this.funcionamiento = null;
			this.construirNodo = function(){
				var nodo=document.createElement('section');
				nodo.setAttribute('pie','');
				this.nodo=nodo;
				this.manejoDeContenido(contenido);
			};
			this.manejoDeContenido = function(contenido){
				var porConstruir;
				if(typeof contenido == 'string'){
						porConstruir = {html: contenido};
				}else{
					porConstruir = contenido;
				}
				if(porConstruir.html){
					this.nodo.innerHTML = porConstruir.html;
				}
			};
			this.desaparecer = function(){
				this.nodo.style.height = '0px';
				this.nodo.innerHTML='';
			};
			this.construirNodo();
		};
		//------------------- Partes-------------------------------------
		this.estado = 'sinConstruir';
		this.partes = {};
		this.nodo = null;
		this.tipo = 'contenido';

		this.construirNodo = function(){
			var nodo=document.createElement('div');
			var predecesor = UI.elementos.modalWindow.obtenerUltimaCapa();
			nodo.setAttribute('capa','contenido');
			predecesor.nodo.parentNode.insertBefore(nodo,predecesor.nodo.nextSibling);
			this.nodo=nodo;
			this.estado='enUso';
			setTimeout(function(){
				nodo.classList.add('aparecer');
			},300);
		};

		this.agregarParte = function(parte,contenido){
			switch(parte){
				case 'cabecera':
					this.partes.cabecera=new Cabecera(contenido);
					this.nodo.insertBefore(this.partes.cabecera.nodo,this.nodo.firstChild);
				break;
				case 'cuerpo':
					this.partes.cuerpo=new Cuerpo(contenido);
					this.nodo.appendChild(this.partes.cuerpo.nodo);
				break;
				case 'pie':
					this.partes.pie=new Pie(contenido);
					this.nodo.appendChild(this.partes.pie.nodo);
				break;
			}
		};

		this.removerParte = function(parte){
				switch (parte) {
					case 'cabecera':
						if(this.partes.cabecera){
							this.partes.cabecera.nodo.parentNode.removeChild(this.partes.cabecera.nodo);
							this.partes.cabecera = null;
						}
						break;
					case 'cuerpo':
						if(this.partes.cuerpo){
							this.partes.cuerpo.nodo.parentNode.removeChild(this.partes.cuerpo.nodo);
							this.partes.cuerpo = null;
						}
						break;
					case 'cabecera':
						if(this.partes.pie){
							this.partes.pie.nodo.parentNode.removeChild(this.partes.pie.nodo);
							this.partes.pie = null;
						}
						break;
					default:
						console.log(parte+'no existe');
				}
		};

		this.dibujarUI = function(data){
			data.tipo=data.tipo || 'contenedor';
			data.contenido = data.contenido || 'normal';
			if(data.cabecera!==undefined){
				this.agregarParte('cabecera',data.cabecera);
				this.partes.cabecera.agregarTipo(data.tipo.toLowerCase());
			}
			if(data.cuerpo!==undefined){
				this.agregarParte('cuerpo',data.cuerpo);
			}
			if(data.pie!==undefined){
				this.agregarParte('pie',data.pie);
				this.partes.pie.nodo.classList.toggle(data.tipo.toLowerCase());
			}
			if(data.contenido.toLowerCase() === 'ancho' ){
				this.nodo.classList.add('ancho');
			}
		};
		this.convertirEnFormulario = function(formulario){
			//Cambios Generales
			if(!this.nodo.classList.contains('ancho')){
				this.nodo.classList.add('ancho');
			}
			//cambio cabecera
			if(formulario.cabecera){
				if(this.partes.cabecera){
					this.removerParte('cabecera');
				}
				this.agregarParte('cabecera',formulario.cabecera);
			}
			//cuerpo
			if(formulario.cuerpo){
				if(this.partes.cuerpo){
					this.removerParte('cuerpo');
				}
				this.agregarParte('cuerpo',formulario.cuerpo);
			}
			//pie
			if(formulario.pie){
				if(this.partes.pie){
					this.removerParte('pie');
				}
				this.agregarParte('pie',formulario.pie);
			}
		};
		this.convertirEnMensaje = function(mensaje){
			//cambios Generales
			if(this.nodo.classList.contains('ancho')){
				this.nodo.classList.remove('ancho');
			}
			//cambio la cabecera
			if(mensaje.titulo){
				if(!this.partes.cabecera){
					this.agregarParte('cabecera','titulo');
				}
				this.partes.cabecera.nodo.class = '';
				this.partes.cabecera.agregarTipo(mensaje.nombre_tipo.toLowerCase());
			}

			//cambio el cuerpo
			this.partes.cuerpo.nodo.innerHTML=mensaje.cuerpo;
			this.partes.cuerpo.nodo.style.height = '50px';

			//cambio pie
			if(this.partes.pie){
				this.partes.pie.desaparecer();
			}
		};
		this.construirNodo();
	};
	//-------------------Fin CapaContenido-------------------------------------

	var capaExterior = function(bloqueo){

		this.estado='sinConstruir';
		this.nodo = null;
		this.tipo='exterior';
		this.bloqueo=bloqueo || false;

		this.construirNodo = function(){
			var nodo = document.createElement('div');
			nodo.setAttribute('capa','exterior');
			document.body.appendChild(nodo);
			this.nodo=nodo;
			this.estado='enUso';
			setTimeout(function(){
				nodo.style.opacity='0.8';
			},10);

		};
		this.construirNodo();
	};
	//-------------------Fin CapaExterior-------------------------------------

	this.estado='sinConstruir';
	this.capas = [];

	this.arranque = function(data){
		this.agregarCapa('exterior',data.bloqueo);
		var contenido=this.agregarCapa('contenido');
		contenido.dibujarUI(data);
		this.manejoDeCapas();
		return contenido;
	};
	this.agregarCapa = function(tipo,bloqueo){
		var capaNueva=false;
		var zIndex;
		if(tipo=='exterior'){
			if(this.existeExterior()){
				zIndex = window.getComputedStyle(this.buscarUltimaCapaContenido().nodo,null).getPropertyValue("z-index");
				capaNueva=new capaExterior(bloqueo);
				this.capas.push(capaNueva);
				capaNueva.nodo.style.zIndex=parseInt(zIndex)+1;
			}else{
				capaNueva=new capaExterior(bloqueo);
				this.capas.push(capaNueva);
			}
		}else if(tipo=='contenido'){
			if(this.existeExterior()){
				zIndex = window.getComputedStyle(this.obtenerUltimaCapa().nodo,null).getPropertyValue("z-index");
				capaNueva = new capaContenido();
				this.capas.push(capaNueva);
				capaNueva.nodo.style.zIndex=parseInt(zIndex)+1;
			}
		}else if(tipo=='opciones'){

		}
		return capaNueva;
	};
	this.removerCapa = function(){
		var capaExterior=UI.elementos.modalWindow.buscarCapa(this);
		var capaContenido = null;
		if(capaExterior){
			if(capaExterior==UI.elementos.modalWindow.capas[0]){
				capaContenido= UI.elementos.modalWindow.buscarCapa(capaExterior.nodo.nextSibling);
				//los saco de vista con la trancision
				//capa contenido
				capaContenido.nodo.classList.remove('aparecer');
				setTimeout(function(){
					capaExterior.nodo.style.opacity='0';
				},300);
				setTimeout(function(){

					capaContenido.nodo.parentNode.removeChild(capaContenido.nodo);
					capaExterior.nodo.parentNode.removeChild(capaExterior.nodo);

					var indice = UI.elementos.modalWindow.capas.indexOf(capaContenido);
					UI.elementos.modalWindow.capas.splice(indice,1);
					indice = UI.elementos.modalWindow.capas.indexOf(capaExterior);
					UI.elementos.modalWindow.capas.splice(indice,1);

					obtenerContenedor().style.position='inherit';
				},810);
			}else{
				capaContenido= UI.elementos.modalWindow.buscarCapa(capaExterior.nodo.nextSibling);
				//los saco de vista con la transcision
				//capa contenido
				capaContenido.nodo.style.top='200%';
				capaContenido.nodo.style.opacity='0';
				setTimeout(function(){
					capaExterior.nodo.style.opacity='0';
				},300);
				setTimeout(function(){

					capaContenido.nodo.parentNode.removeChild(capaContenido.nodo);
					capaExterior.nodo.parentNode.removeChild(capaExterior.nodo);

					var indice = UI.elementos.modalWindow.capas.indexOf(capaContenido);
					UI.elementos.modalWindow.capas.splice(indice,1);
					indice = UI.elementos.modalWindow.capas.indexOf(capaExterior);
					UI.elementos.modalWindow.capas.splice(indice,1);

				},810);
			}
		}
	};
	this.buscarCapa = function(nodo){
		var capa=false;
		for(var x=0;x<this.capas.length;x++){
			if(this.capas[x].nodo==nodo){
				capa=this.capas[x];
				break;
			}
		}
		return capa;
	};
	this.buscarUltimaCapaContenido = function(){
		var capa=this.obtenerUltimaCapa();
		var cont=0;
		while((capa.tipo!='contenido')||(cont==6)){
			capa=capa.previousSibling;
		}
		return capa;
	};
	this.existeExterior = function(){
		var capas=this.capas;
		var existe = false;
		for(var x=0;x<capas.length;x++){
			if(capas[x].tipo=='exterior'){
				existe=true;
				break;
			}
		}
		return existe;
	};
	this.obtenerUltimaCapa = function(){
		var ultimaCapa = this.capas[this.capas.length-1];
		return ultimaCapa;
	};
	this.manejoDeCapas = function(){
		var contenedor=obtenerContenedor();
		if(this.existeExterior()){
			contenedor.style.position='fixed';
			for(var x=0;x<this.capas.length;x++){
				if(this.capas[x].nodo.getAttribute('capa')=='exterior'){
					if(!this.capas[x].bloqueo){
						this.capas[x].nodo.onclick=this.removerCapa;
					}
				}
			}
		}else{
			contenedor.style.position='inherit';
		}
	};
	this.eliminarUltimaCapa = function(){
		for(var x=this.capas.length-1;x>=0;x--){
			if(this.capas[x].tipo=='exterior'){
				this.capas[x].nodo.onclick=this.removerCapa;
				this.capas[x].nodo.click();
				break;
			}
		}
	};
};
