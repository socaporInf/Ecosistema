var Formulario = function(atributos){
  this.campos = [];
	this.plano = atributos.plano;
  this.nodo = null;

  this.construirNodo = function(){
		this.nodo = document.createElement('form');
		atributos.contenedor.appendChild(this.nodo);
		atributos.contenedor.setAttribute('formulario','');
		this.agregarCampos(this.plano.campos);
  };

  this.agregarCampos = function(campos){
    for (var i = 0; i < campos.length; i++) {
      var campo = this.agregarCampo(campos[i]);
			this.campos.push(campo);
    }
  };
  this.agregarCampo = function(campo){
    var campoNuevo;
		switch(campo.tipo.toLowerCase()){
			case 'campodetexto':
				campoNuevo = new CampoDeTexto(campo.parametros);
				break;
			case 'combobox':
				campoNuevo = new ComboBox(campo.parametros);
				break;
			case 'radio':
				campoNuevo = new Radio(campo.parametros);
				break;
			case 'saltodelinea':
				campoNuevo = new SaltoDeLinea();
				break;
			case 'checkbox':
				campoNuevo = new CheckBox(campo.parametros);
				break;
			case 'campobusqueda':
				if(typeof CampoBusqueda !== 'undefined'){
					campoNuevo = new CampoBusqueda(campo.parametros);
				}else{
						console.log('dependencia O_CampoBusqueda.js no existe');
				}
				break;
			case 'campoidentificacion':
				if(typeof CampoIdentificacion !== 'undefined'){
					campoNuevo = new CampoIdentificacion(campo.parametros);
				}else{
						console.log('dependencia O_CampoIdentificacion.js no existe');
				}
				break;
		}
		this.nodo.appendChild(campoNuevo.nodo);
		return campoNuevo;
  };
	this.asignarValores = function(registro){
		var campos = contenedor.campos;
		for (var campo in registro) {
			if (registro.hasOwnProperty(campo)) {
				for(var y = 0; y < campos.length; y++){
					if(campos[y].captarNombre() == campo){
						campos[y].asignarValor(registro[campo]);
					}
				}
			}
		}
	};
	this.habilitar = function(){
		for (var i = 0; i < this.campos.length; i++) {
			this.campos[i].habilitar();
		}
	};
	this.deshabilitar = function(){
		for (var i = 0; i < this.campos.length; i++) {
			this.campos[i].deshabilitar();
		}
	};
	this.captarValores = function(){
		var registro = [];
		for (var i = 0; i < this.campos.length; i++) {
			registro.push({
				nombre:this.campos[i].captarNombre(),
				valor:this.campos[i].captarValor()
			});
		}
		return registro;
	};
	this.validar = function(){
		var campos = this.campos;
		for (var i = 0; i < campos.length; i++) {
	    //valido el campo
	    if((campos[i].captarRequerido())&&(!campos[i].captarValor())){
	      return false;
	    }
	  }
		return true;
	};
  this.construirNodo();
};
