var MenuTest = function(){
	
	this.estructura = [];
	this.capaActual = [];
	this.directorio = [];

	this.inicializar = function(est){
		this.estructura = this.capaActual = est;
		this.armarCapa();
	}
	this.armarCapa = function(){
		var elemsCapa = [];
		for (var x = 0;x < this.capaActual.length;x++){
			elemsCapa[x] = this.capaActual[x].nombre+'/'+x;
		}
		console.log(elemsCapa);
	}
	this.cambiarCapa = function(accion,indice){

		if(accion == 'atras'){
			console.log(this.directorio.pop());
			this.capaActual=this.regresar();
		}else{
			this.capaActual = this.capaActual[indice].childs;
			console.log(JSON.stringify(this.capaActual));
			this.directorio.push(indice);	
		}
		this.armarCapa();
	}
	this.regresar = function(){
		var capa=this.estructura;
		for(var x = 0; x < this.directorio.length; x++){
			capa = capa[this.directorio[x]].childs;
		}
		return capa;
	}
}

var estructuraObj = 
[
	{
		nombre:'1',
		tipo:'submenu',
		childs:[{
					nombre:'1.1',
					tipo:'submenu',
					childs:[{
						nombre:'1.1.1',
						tipo:'enlace',
						enlace: '1.1.1.html'
					}]
				},
				{
					nombre:'1.2',
					tipo:'enlace',
					enlace:'1.2.html'
				}]
	},
	{
		nombre:'2',
		tipo:'submenu',
		childs:[{
					nombre:'2.1',
					tipo:'enlace',
					enlace:'2.1.html'
				},
				{
					nombre:'2.2',
					tipo:'submenu',
					childs: [{
								nombre:'2.2.1',
								tipo:'enlace',
								enlace:'2.2.1.html'
							},
							{
								nombre:'2.2.2',
								tipo:'enlace',
								enlace:'2.2.2.html'
							}]
				}]
	},
	{
		nombre:'3',
		tipo:'submenu',
		childs:[{
					nombre:'3.1',
					tipo:'enlace',
					enlace:'3.1.html'
				}]
	}
];
