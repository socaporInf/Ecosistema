function construirUI(){
	contenedor = obtenerContenedor();
	let seguridad = new Ventana({
		tipo: 'columna',
		titulo: {
			texto: 'Seguridad',
			tipo: 'inverso'
		}
	});
	let datosPersonales = new Ventana({
		tipo: 'columna',
		titulo: {
			texto: 'Datos Personales',
			tipo: 'inverso'
		}
	});
	let cambiarClave = seguridad.agregrarSector({html:"<aside class='clave-grande'></aside><section texto class='lateral-icono'>Cambiar Clave</section>"});
	let gestionarPreguntas = seguridad.agregrarSector({html:"<aside class='interrogacion-grande'></aside><section texto class='lateral-icono'>Gestionar preguntas y respues de seguridad</section>"});

	cambiarClave.nodo.onclick = function abrirCambiarClave(e){
		let formulario = new Ventana({
			tipo: 'formulario',
			titulo:{
				texto: cambiarClave.nodo.querySelector('sector[texto]')
			}
		});
	}

	contenedor.appendChild(seguridad.nodo);
	contenedor.appendChild(datosPersonales.nodo);
}

var Ventana = function(atributos){
	//-----------------Titulo---------------------------
	var Titulo = function(atributos){

		this.nodo = null;
		this.atributos = atributos;
		//valores por defecto
		atributos.tipo = atributos.tipo || 'basico';

		this.construirNodo = function(){
			
			let nodo = document.createElement('section');
			nodo.setAttribute('titulo','');

			nodo.textContent = atributos.texto;
			nodo.classList.add(atributos.tipo);

			this.nodo = nodo;
		}
		this.construirNodo();	
	};
	//--------------------Sector----------------------------
	var Sector = function(atributos){
		this.nodo = null;
		this.atributos = atributos;

		this.construirNodo = function(){
			
			let nodo = document.createElement('section');
			nodo.setAttribute('sector','');

			if(atributos.html){
				nodo.innerHTML = atributos.html;
			}
			this.nodo = nodo;
		}
		this.construirNodo();	
	}

	this.atributos = atributos;
	this.estado = 'porConstruir';
	this.sectores = [];
	this.nodo = null;

	this.construirNodo = function(){
		let nodo = document.createElement('div');
		nodo.setAttribute('mat-window','');
		nodo.classList.add(this.atributos.tipo);
		this.nodo = nodo;

		let titulo = new Titulo(this.atributos.titulo);
		this.nodo.appendChild(titulo.nodo);
	};
	this.agregrarSector = function(atributos){
		let sector = new Sector(atributos);
		this.sectores.push(sector);
		this.nodo.appendChild(sector.nodo);
		return sector;
	}
	this.construirNodo();
}