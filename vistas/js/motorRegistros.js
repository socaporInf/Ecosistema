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
	var contId=roles.length+1;

	
var Motor = function(entidadActiva){
	
	this.estado='apagado';
	//entidad activa es decir la entidad que inicio el motor o la que esta en uso en el momento
	this.entidadActiva=entidadActiva;
	//todos los registros que tiene la entidad activa entidad activa 
	this.registrosEntAct = new Array();

	//funcion de arranque del objeto
	this.ignition = function(){
		if(this.entidadActiva!='acceso'){
			this.registrosEntAct = this.buscarRegistros(this.entidadActiva);
		}
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
	this.buscarRegistros =function(entidad,callback){
		conexionAcc=crearXMLHttpRequest();
		conexionAcc.onreadystatechange = function(){
			if (conexionAcc.readyState == 4 && conexionAcc.status == 200){
		            callback(conexionAcc.responseText);
		    }
		}
		conexionAcc.open('POST','../controladores/cor_Motor.php', true);
		conexionAcc.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		var envio="Operacion="+encodeURIComponent("buscar")+'&Entidad='+encodeURIComponent(entidad);
		conexionAcc.send(envio);
	}
	this.obtenerSesion = function(){
		conexionAcc=crearXMLHttpRequest();
		conexionAcc.onreadystatechange = function(){
			if (conexionAcc.readyState == 4 && conexionAcc.status == 200){
				console.log(conexionAcc.responseText);            
		    }
		}
		conexionAcc.open('POST','../controladores/cor_Validar.php', true);
		conexionAcc.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		var envio="Operacion="+encodeURIComponent("obtenerSesion");
		conexionAcc.send(envio);
	}
	this.cerrarSesion = function(){
		conexionAcc=crearXMLHttpRequest();
		conexionAcc.onreadystatechange = function(){
			if (conexionAcc.readyState == 4 && conexionAcc.status == 200){
				console.log(conexionAcc.responseText);            
		    }
		}
		conexionAcc.open('POST','../controladores/cor_Validar.php', true);
		conexionAcc.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		var envio="Operacion="+encodeURIComponent("cerrarSesion");
		conexionAcc.send(envio);
	}
	//--------------------------------------------funciones de bd--------------------------------
	this.guardar = function(nuevoRegistro,entidad){
		//guardar general por entidad
		if(this.entidadActiva==entidad){
			this.registrosEntAct = this.buscarRegistros(entidad);
		}
	}
	this.eliminar = function(registro,entidad){
		//borrar registro
	}
	this.editarCampo= function(id,campo,valor){
		var registro=torque.buscarRegistro(id);
		//editar campo
		return registro;
	}
	this.guardarEnDetalle= function(id,cambios){
		var registro=this.buscarRegistro(id)
		for(var x=0;x<cambios.length;x++){
			registro.detalle.push(cambios[x]);
		}
		return registro;
	}
	this.peticionMenu = function(){
		var campNom=document.getElementById('nomUsu');
		var campPass=document.getElementById('pass');
		conexionAcc=crearXMLHttpRequest();
		conexionAcc.onreadystatechange = this.respuestaMenu;
		conexionAcc.open('POST','../controladores/cor_Validar.php', true);
		conexionAcc.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		var envio="Operacion="+encodeURIComponent("cargarPermisologia");
		envio+="&Nombre="+encodeURIComponent(campNom.value);
		console.log(envio);
		conexionAcc.send(envio);
	}
	this.respuestaMenu = function(){
		if(conexionAcc.readyState == 4){
			var respuesta=JSON.parse(conexionAcc.responseText);
			console.log(respuesta);

			var ventana={};

			if(respuesta.success==1){
				ventana.cabecera='Acesso';
				ventana.cuerpo=respuesta.mensaje
			}else{
				ventana.tipo='advertencia';
				ventana.cabecera='Error de Acceso';
				ventana.cuerpo=respuesta.mensaje;
			}
			UI.crearVentanaModal(ventana);
		}
	}
	//funcion de arranque 
	this.ignition();
}
//--------------------------------AJAX---------------------------------------
function crearXMLHttpRequest() 
{
  var xmlHttp=null;
  if (window.ActiveXObject) 
    xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
  else 
    if (window.XMLHttpRequest) 
      xmlHttp = new XMLHttpRequest();
  return xmlHttp;
}