//-----------------------------Objeto CheckBox-------------------------
var CheckBox = function(info){
	//marcado,habilitado,valor,nombre,requerido,usaTitulo,eslabon
	var Campo = function(animacion){
		this.nodo = null;
		this.check =null;
		this.box = null;

		this.construirNodo = function(){
			var nodo = document.createElement('div');
			nodo.setAttribute('checkbox','');
			this.nodo = nodo;

			var check = document.createElement('div');
			check.setAttribute('check','');
			nodo.appendChild(check);

			var box = document.createElement('div');
			box.setAttribute('box','');
			nodo.appendChild(box);

			box.classList.add(animacion);
			check.classList.add(animacion);

			this.check = check;
			this.box = box;
		};
		this.construirNodo();
	};
	var Titulo = function(nombre){
		this.nodo = null;

		this.construirNodo = function(){
			var nodo = document.createElement('div');
			nodo.setAttribute('titulo','');
			this.nodo = nodo;

			nodo.textContent = nombre;
		};
		this.construirNodo();
	};
	//partes
	this.nodo = null;
	this.campo = null;
	this.texto = null;
	// valores
	this.habilitado = 'habilitado';
	this.marcado = false;
	this.valor = info.valor;
	this.nombre = info.nombre;
	this.requerido = info.requerido || false;

	this.construirNodo = function(){
		var nodo = document.createElement('div');
		nodo.setAttribute('o-checkbox','');
		this.nodo = nodo;

		animacion = info.animacion || 'girar';
		this.campo = new Campo(animacion);
		this.nodo.appendChild(this.campo.nodo);

		tipo = info.tipo || 'campo';
		this.nodo.classList.add(tipo);
		info.usaTitulo = info.usaTitulo || true;
		if(info.usaTitulo){
			this.titulo = new Titulo(info.nombre);
			this.nodo.appendChild(this.titulo.nodo);
		}
		if(info.eslabon === 'area'){
			this.nodo.setAttribute('area','');
		}

		if(!info.habilitado){
			this.deshabilitar();
		}else {
			this.habilitar();
		}
		if(info.marcado){
			this.marcar();
		}else{
			this.desmarcar();
		}
	};
	this.cambiarEstado = function(){
		if(this.marcado){
			this.desmarcar();
		}else{
			this.marcar();
		}
	};
	this.marcar = function(){
		this.campo.nodo.classList.add('marcado');
		this.marcado = true;
	};
	this.desmarcar = function(){
		this.campo.nodo.classList.remove('marcado');
			this.marcado = false;
	};
	this.deshabilitar = function(){
		var yo = this;
		this.nodo.onclick = function(){};
		this.estado = 'deshabilitado';
	};
	this.habilitar = function(){
		var yo = this;
		this.nodo.onclick = function(){
			yo.cambiarEstado();
		};
		this.estado = 'habilitado';
	};
	this.captarNombre = function(){
		return this.nombre;
	};
	this.captarValor = function(){
		if(this.marcado){
			return this.valor;
		}else{
			return false;
		}
	};
	this.captarRequerido = function(){
		return this.requerido;
	};
	this.construirNodo();
};
//-----------------------------Objeto Radio----------------------------
var Radio = function(info){
	//nombre,opciones,seleccionado
	this.data = info;
	this.estado = 'porConstriur';
	this.nodo = null;

	this.construirNodo = function(){
		var nodo = document.createElement('div');
		nodo.setAttribute('formElements','');
		this.nodo = nodo;
		this.agregarOpciones();
	};
	this.agregarOpcion = function(opcion){
		var nodoOpcion = document.createElement('label');
		nodoOpcion.classList.toggle('radio');
		var html = '';
		html+='<input type="radio" name="'+this.data.nombre+'" value="'+opcion.valor+'"><span class="outer"><span class="inner"></span></span>'+opcion.nombre;
		nodoOpcion.innerHTML=html;
		this.nodo.appendChild(nodoOpcion);
	};
	this.agregarOpciones = function(){
		for(var x=0; x<this.data.opciones.length;x++){
			this.agregarOpcion(this.data.opciones[x]);
		}
	};

	this.captarValor = function(){
		var valor = (this.nodo.querySelector('radio').value==='')?null:this.nodo.querySelector('radio').value;
		return valor;
	};
	this.captarNombre = function(){
		return this.nodo.querySelector('radio').name;
	};
	this.captarRequerido = function(){
		return this.atributos.requerido;
	};
	this.asignarValor = function(valor){
		this.valor = valor;
		this.nodo.querySelector('radio').value = valor;
	};
	this.construirNodo();
};

//--------------------------Combo Box -------------------------------------
var ComboBox = function(info){
	//nombre,opciones,seleccionado,eslabon
	this.data = info;
	this.estado = 'porConstriur';
	this.data.eslabon = info.eslabon||'simple';
	this.data.seleccionado = info.seleccionado||'-';
	this.nodo = null;

	this.construir = function(){
		var nodo=document.createElement('div');
		nodo.setAttribute(this.data.eslabon,'');
		nodo.setAttribute('formElements','');

		//se crea el article
		var article=document.createElement('article');
		article.setAttribute('capaSelect','');
		if(this.data.deshabilitado !== true ){
			article.onclick=function(){
				construirCapaSelect(this);
			};
		}
		nodo.appendChild(article);

		//se crea el select
		var select=document.createElement('select');
		select.setAttribute('tabindex','-1');
		select.name=this.data.nombre;
		if(this.data.id!==undefined){
			select.id=this.data.id;
		}

		nodo.appendChild(select);

		this.nodo=nodo;
		if(this.data.titulo){
			//creo la primera opcion
			var opcion = {
				codigo : '-',
				nombre : 'Elija un '+this.data.titulo
			};
			this.agregarOpcion(opcion);
		}

		//genero y asigno el resto de las opciones
		this.agregarOpciones(this.data.opciones);
		this.estado='enUso';
	};
	this.agregarOpciones = function(opciones){
		for(var x=0;x<opciones.length;x++){
			this.agregarOpcion(opciones[x]);
		}
	};
	this.agregarOpcion = function(opcion){
		var select=this.nodo.getElementsByTagName('select')[0];
		var nuevaOp=document.createElement('option');
		nuevaOp.textContent=opcion.nombre;
		nuevaOp.value=opcion.codigo;
		select.appendChild(nuevaOp);
	};
	this.seleccionarOpcion = function(opcion){
		var select=this.nodo.getElementsByTagName('select')[0];
		select.value = opcion.codigo;
	};
	this.captarValor = function(){
		var valor = (this.nodo.querySelector('select').value==='-')?null:this.nodo.querySelector('select').value;
		return valor;
	};
	this.captarNombre = function(){
		return this.nodo.querySelector('select').name;
	};
	this.captarRequerido = function(){
		return this.data.requerido;
	};
	this.asignarValor = function(valor){
		this.seleccionarOpcion({codigo:valor});
	};
	this.deshabilitar = function(){
		var article = this.nodo.querySelector('article');
		article.onclick = function(){};
	};
	this.habilitar = function(){
		var article = this.nodo.querySelector('article');
		article.onclick = function(){
			construirCapaSelect(this);
		};
	};
	this.construir();
};

//-------------------- Salto de linea ---------------
var SaltoDeLinea = function(){
	this.nodo = null;
	this.construirNodo = function(){
		var nodo = document.createElement('div');
		nodo.setAttribute('clear','');
		this.nodo = nodo;
	};
	this.construirNodo();
};

//-------------------- Campo  de Texto ---------------------------
var CampoDeTexto = function(info){
	this.data = info;
	this.estado = 'porConstriur';
	this.data.eslabon = info.eslabon || 'simple';
	this.data.usaToolTip = info.usaToolTip ||  false;
	this.nodo = null;

	this.construir = function(){
		var CampoDeTexto = document.createElement('div');
		CampoDeTexto.classList.toggle('group');
		CampoDeTexto.setAttribute(this.data.eslabon,'');
		var html='';
		max=(info.max)?"maxlength="+info.max:'';
		if(this.data.tipo=='simple'){
			html+='<input type="text" name="'+this.data.nombre+'" value="" '+max+' required>';
		}else if(this.data.tipo=='password'){
			html+='<input type="password" name="'+this.data.nombre+'" '+max+' value="" required>';
		}else if(this.data.tipo=='area'){
			html+='<textarea name="'+this.data.nombre+'" required></textarea>';
		}else{
			console.log(this.data.tipo);
		}

		html+='<span class="highlight"></span>'+
		      '<span class="bar"></span>'+
		    	'<label>'+this.data.titulo+'</label>';
		CampoDeTexto.innerHTML=html;
		this.nodo=CampoDeTexto;
		if(this.data.usaToolTip!==false){
			this.nodo.onmouseover=UI.elementos.maestro.abrirtooltipInput;
			this.nodo.onmouseout=UI.elementos.maestro.cerrartooltipInput;
		}
		this.estado='enUso';
	};
	this.captarValor = function(){
		var tipo = this.captarTipo();
		var valor;
		if(this.nodo.querySelector(tipo).value===''){
			valor = null;
		}else{
			valor = this.nodo.querySelector(tipo).value;
		}
		return valor;
	};
	this.captarNombre = function(){
		var tipo = this.captarTipo();
		return this.nodo.querySelector(tipo).name;
	};
	this.captarTipo = function(){
		var tipo;
		if(this.data.tipo==='area'){
			tipo = 'textarea';
		}else{
			tipo = 'input';
		}
		return tipo;
	};
	this.captarRequerido = function(){
		return this.data.requerido;
	};
	this.asignarValor = function(valor) {
		var tipo = this.captarTipo();
		this.nodo.querySelector(tipo).value = valor;
	};
	this.construir();
};
//-------------------- Campo titulo----------------------------------------------------------
var CampoTitulo = function(info){

	this.data =  info;
	this.nodo = null;
	this.data.valor = info.valor || '';
	this.estado = 'mostrando';

	this.construirNodo = function(){
		var nodo =  null;
		var campo = '';
		var html = '';
		nodo = document.createElement('section');
		nodo.setAttribute('titulo','');
		nodo.setAttribute('area','');
		html = "<div cont>"+
				"<textarea  name='"+this.data.nombre+"'></textarea>"+
				"<div display>"+this.data.valor+"</div>"+
			"</div>"+
			"<article update='campo'></article>";
		nodo.innerHTML=html;
		this.nodo=nodo;
	};
	this.asignarValor = function(valor){
		this.data.valor = valor;
		this.nodo.querySelector('div[display]').textContent = valor;
	};
	this.activarEdicion = function(){
		this.nodo.classList.add('edicion');
		//contenedor
		var contenedorEdit = this.nodo.querySelector('div[cont]');
		//campo donde se muestra el valor del campo pero de solo lectura
		var display = contenedorEdit.querySelector('div[display]');
		//campo donde se edita la informacion
		var campoEdit = null;
		if(this.tipo === 'simple'){
			campoEdit = contenedorEdit.querySelector('input');
		}else{
			campoEdit = contenedorEdit.querySelector('textarea');
		}
		campoEdit.value = display.textContent;
		campoEdit.focus();
		this.estado = 'editando';
		if(this.tipo === 'titulo'){
			this.nodo.querySelector('article[update]').classList.add('edicion');
		}
	};
	this.finalizarEdicion = function(){
		this.nodo.classList.remove('edicion');
		//contenedor
		var contenedorEdit = this.nodo.querySelector('div[cont]');
		//campo donde se muestra el valor del campo pero de solo lectura
		var display = contenedorEdit.querySelector('div[display]');
		//campo donde se edita la informacion
		var campoEdit = null;
		if(this.tipo === 'simple'){
			campoEdit = contenedorEdit.querySelector('input');
		}else{
			campoEdit = contenedorEdit.querySelector('textarea');
		}
		display.textContent = campoEdit.value;
		this.estado = 'mostrando';
		if(this.tipo === 'titulo'){
			this.nodo.querySelector('article[update]').classList.remove('edicion');
		}
	};
	this.captarValor = function(){
		if(this.estado === 'mostrando'){
			return this.nodo.querySelector('div[display]').textContent;
		}else{
			if(this.tipo === 'simple'){
				return this.nodo.querySelector('input').value;
			}else{
				return this.nodo.querySelector('textarea').value;
			}
		}
	};
	this.captarNombre = function(){
		return this.data.nombre;
	};
	this.construirNodo();
};

/*----------------------------------Funciones del Objeto Select-------------------------------*/
		construirCapaSelect= function(capaSelect){
			capaSelect.onclick=function(){};
			var opciones =[];
			var opcion = null;
			var nodo = null;
			var select = capaSelect.nextSibling;
			while(select.nodeName=='#text'){
				select=select.nextSibling;
			}
			var margen;
			for(var x = 0; x < select.options.length;x++){

				opcion = {
					nombre:select.options[x].textContent,
					value:select.options[x].value,
					nodo:null
				};

				nodo=document.createElement('div');
				nodo.setAttribute('option','');
				nodo.textContent=opcion.nombre;
				if(select.options[x]==select.options[select.selectedIndex]){
					nodo.setAttribute('selecionado','');
					margen='-'+parseInt(opciones.length*41)+'px';
					capaSelect.style.marginTop=margen;
				}

				nodo.style.transition='all '+parseInt(opciones.length*0.2)+'s ease-in-out';
				nodo.style.marginTop=parseInt(opciones.length*41)+'px';

				nodo.setAttribute('valor',opcion.value);
				nodo.onclick = capaClick;
				opcion.nodo=nodo;
				opciones.push(opcion);
				capaSelect.appendChild(nodo);
			}

			//creo el contenedor de las opciones
			capaSelect.style.opacity='1';
			capaSelect.style.height=parseInt(opciones.length*41)+'px';
			capaSelect.style.width='60px';
		};

		//funcion extraida de un bucle
		function capaClick(e){
			//agrego el efecto Ripple
			agregarRippleEvent(this,e);
			var select = this.parentNode.nextSibling;
			while(select.nodeName=='#text'){
				select=select.nextSibling;
			}
			select.value=this.getAttribute('valor');
			destruirCapaSelect(this.parentNode);
		}

		destruirCapaSelect = function(capaSelect){
			var lista = capaSelect.childNodes;
			var opcion;
			capaSelect.style.opacity='0';
			capaSelect.style.height='100%';
			capaSelect.style.width='100%';
			capaSelect.style.marginTop='0px';
			for(var x = 0;x < lista.length;x++){
				lista[x].style.transition='all 0.3s linear';
				lista[x].style.marginTop='0px';
			}
			setTimeout(function(){
				while(capaSelect.childNodes.length>0){
					capaSelect.removeChild(capaSelect.lastChild);
				}
				capaSelect.onclick=function(){
					construirCapaSelect(this);
				};
			},300);
		};
	/*------------------------------Fin Funciones del Objeto Select-------------------------------*/
