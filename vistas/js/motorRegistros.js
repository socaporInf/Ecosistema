//borrar
	var roles = [
					{
						nombre:'Analista Cuentas por Cobrar',
						id:1,
						descripcion:'cuentasxpagar',
						detalle:[
								{id:'3',nombre:'ProbioAgro'},{id:'2',nombre:'SocaPortuguesa'}
							],
						estado:'A'
					},
					{
						nombre:'Administrador Del Sistema',
						id:2,
						descripcion:'este rol esta encargado de supervisar lo que ocurre dentro del sistema con opcion a ver la mayoria de los modulos ademas de asegurar el correcto funcionamiento del mismo',
						detalle:[
								{id:'3',nombre:'ProbioAgro'},{id:'2',nombre:'SocaPortuguesa'},{id:'1',nombre:'SocaServicios'}
							],
						estado:'A'
					},
					{
						nombre:'Gerente Administracion',
						id:3,
						descripcion:'',
						detalle:[
							],
						estado:'A'
					},
					{
						nombre:'Analista Cuentas por Pagar',
						id:4,
						descripcion:'',
						detalle:[
							],
						estado:'A'
					},
					{
						nombre:'Analistas Cuentas por Pagar Productores',
						id:5,
						descripcion:'',
						detalle:[
							],
						estado:'A'
					},
					{
						nombre:'Cajera Principal',
						id:6,
						descripcion:'',
						detalle:[
							],
						estado:'A'
					},
					{
						nombre:'Analista Tributos',
						id:7,
						descripcion:'',
						detalle:[
							],
						estado:'A'
					},
					{
						nombre:'Analista Finanzas',
						id:8,
						descripcion:'',
						detalle:[
							],
						estado:'A'
					},
					{
						nombre:'Auditoria General',
						id:9,
						descripcion:'',
						detalle:[
							],
						estado:'A'
					},
					{
						nombre:'almacen-facturacion',
						id:10,
						descripcion:'factura en almacen',
						detalle:[
								{id:'2',nombre:'SocaPortuguesa'}
							],
						estado:'A'
					}
				];
	var empresas = [
		{	
			id:0,
			nombre:'SocaServicios',
			descripcion:'empresa con mayor movimiento'
		},{
			id:1,
			nombre:'ProbioAgro',
			descripcion:'empresa de materiales agricolas'
		},{
			id:2,
			nombre:'SocaPortuguesa',
			descripcion:'Principal'
		},{
			id:3,
			nombre:'E/S Piedritas Blancas',
			descripcion:'Estacion de servicio'
		}
	]
	var modulos = [
		{id:'1',nombre:'Global'},
		{id:'2',nombre:'Seguridad'},
		{id:'3',nombre:'Agronomina'}
	]
	var submodulos = [
		{id:1,idPadre:1,nombre:'Empresa'	,enlace:'vis_Empresa.html'},
		{id:2,idPadre:2,nombre:'Rol'		,enlace:'vis_Rol.html'},
		{id:3,idPadre:2,nombre:'Modulos'	,enlace:'vis_Pribilegios.html'},
		{id:4,idPadre:3,nombre:'Finca'		,enlace:'vis_Finca.html'},
		{id:5,idPadre:3,nombre:'Tablon'		,enlace:'vis_Tablon.html'},
		{id:6,idPadre:3,nombre:'Canicultor'	,enlace:'vis_Canicultor.html'},
		{id:7,idPadre:3,nombre:'Variedad'	,enlace:'vis_Variedad.html'},
		{id:8,idPadre:3,nombre:'Clase'		,enlace:'vis_Clase.html'},
		{id:9,idPadre:1,nombre:'Estado'		,enlace:'vis_Estado.html'},
		{id:10,idPadre:1,nombre:'Municipio'	,enlace:'vis_Municipio.html'}
	]
	var estados = [
					{id:0,nombre:'Portuguesa',descripcion:'localidad'}
					];
	var municipios = [];
	var contId=roles.length+1;

	
var Motor = function(entidadActiva){
	
	this.estado='apagado';
	//entidad activa es decir la entidad que inicio el motor o la que esta en uso en el momento
	this.entidadActiva=entidadActiva;
	//todos los registros que tiene la entidad activa entidad activa 
	this.registrosEntAct = new Array();

	//funcion de arranque del objeto
	this.ignition = function(){
		this.registrosEntAct = this.buscarRegistros(this.entidadActiva);
	};

	this.buscarRegistro = function(id,entidad){
		var registro=false;
		var registros;
		//si la entidad a la cual se va a buscar es la misma que esta activa en el motor se utiliza el arreglo temporal
		if(entidad=this.entidadActiva){
			registros = this.registrosEntAct;
		} 
		//en caso contraria se dispara la busqueda
		else 
		{
			registros = this.buscarRegistros(entidad);
		}
		
		for(var x=0;x<registros.length;x++){
			if(registros[x].id==id){
				registro=registros[x];
			}
		}
		return registro;
	};

	this.buscarDetalle = function(idPadre,entidadPadre){
		console.log('se disparo una busueda de '+entidadPadre+' con id:'+idPadre);
		var registroPadre = this.buscarRegistro(idPadre,entidadPadre);
		var data = new Array();
		for(var y=0;y<registroPadre.detalle.length;y++){
			data.push(registroPadre.detalle[y]);
		}
		return data;
	}
	//busqueda en bd
	this.buscarRegistros =function(entidad){
		if(entidad=='empresa'){
			return empresas;
		}else if(entidad=='rol'){
			return roles;
		}else if(entidad=='modulo'){
			return modulos;
		}else if(entidad=='submodulo'){
			return submodulos;
		}else if(entidad=='estado'){
			return estados;
		}else if(entidad=='municipio'){
			return municipios;
		}
	}
	//--------------------------------------------funciones de bd--------------------------------
	this.guardar = function(nuevoRegistro,entidad){
		if(entidad=='empresa'){
			nuevoRegistro.id=empresas.length;
			empresas.push(nuevoRegistro);
		}else if(entidad=='rol'){
			roles.push(nuevoRegistro);
		}else if(entidad=='estado'){
			nuevoRegistro.id=estados.length;
			estados.push(nuevoRegistro);
		}
		if(this.entidadActiva==entidad){
			this.registrosEntAct = this.buscarRegistros(entidad);
		}
	}
	this.eliminar = function(registro,entidad){
		var indice;
		if(entidad=='empresa'){
			indice = empresas.indexOf(this.buscarRegistro(registro.id,entidad));
			empresas.splice(indice,1);
		}
	}
	this.editarCampo= function(id,campo,valor){
		var registro=torque.buscarRegistro(id);
		registro[campo]=valor;
		return registro;
	}
	this.guardarEnDetalle= function(id,cambios){
		var registro=this.buscarRegistro(id)
		for(var x=0;x<cambios.length;x++){
			registro.detalle.push(cambios[x]);
		}
		return registro;
	}
	//funcion de arranque 
	this.ignition();
}
	