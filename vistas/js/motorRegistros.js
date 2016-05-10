var Sesion = function(){

	this.estado='cerrada';
	this.nombre;
	this.privilegios= null;
	this.arbolPribilegios = null;

	this.obtenerSesion = function(){
		conexionAcc=crearXMLHttpRequest();
		var sesionActiva=this;
		conexionAcc.onreadystatechange = function(){
			if (conexionAcc.readyState == 4 && conexionAcc.status == 200){
				var respuesta=JSON.parse(conexionAcc.responseText);
				console.log(respuesta);
				if(respuesta.success==1){
					sesionActiva.estado='activa';
					sesionActiva.nombre=respuesta.sesion.Nombre;
					sesionActiva.armarPrivilegios(respuesta.sesion.privilegios[0]);
				}else{
					location.href='index.html';
				}
		    }
		};
		conexionAcc.open('POST','../controladores/cor_Validar.php', true);
		conexionAcc.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		var envio="Operacion="+encodeURIComponent("obtenerSesion");
		conexionAcc.send(envio);
	};
	this.cerrarSesion = function(){
		conexionAcc=crearXMLHttpRequest();
		conexionAcc.onreadystatechange = function(){
			if (conexionAcc.readyState == 4 && conexionAcc.status == 200){
				var respuesta=JSON.parse(conexionAcc.responseText);
				if(respuesta.success==1){
					location.href='index.html';
				}            
		    }
		};
		conexionAcc.open('POST','../controladores/cor_Validar.php', true);
		conexionAcc.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		var envio="Operacion="+encodeURIComponent("cerrarSesion");
		conexionAcc.send(envio);
	};
	this.mostrarSesion = function(){
		console.log('Sesion Activa:');
		console.log('Nombre de Usuario: '+this.nombre);
		console.log('Estado de la Sesion: '+this.estado);
	};
	this.armarPrivilegios = function(privilegios){
		this.privilegios = privilegios;
		//ubico la raiz
		for(var x = 0; x < privilegios.length; x++){
			if(privilegios[x].componente=0){
				var raiz = componente[x];
			}
		}
		console.log(raiz);
	};
	this.buscarHijos = function(componentes){

	}
};	
var Motor = function(entidadActiva){
	
	this.estado='apagado';
	//entidad activa es decir la entidad que inicio el motor o la que esta en uso en el momento
	this.entidadActiva=entidadActiva;
	//todos los registros que tiene la entidad activa entidad activa 
	this.registrosEntAct = null;
	//resultado busqueda
	this.resultadoBusqueda;
	
	//funcion de arranque del objeto
	this.ignition = function(){
		if(this.entidadActiva!='acceso'){
			this.buscarRegistros(this.entidadActiva,function(respuesta){
				torque.registrosEntAct=respuesta.registros;
			});
		}
	};

	//busqueda en bd
	this.buscarRegistros =function(entidad,callback){
		var conexionBuscar=crearXMLHttpRequest();
		conexionBuscar.onreadystatechange = function(){
			if (conexionBuscar.readyState == 4){
		        callback(JSON.parse(conexionBuscar.responseText));
		    }
		};
		conexionBuscar.open('POST','../controladores/cor_Motor.php', true);
		conexionBuscar.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		var envio="operacion="+encodeURIComponent("buscar")+'&entidad='+encodeURIComponent(entidad);
		conexionBuscar.send(envio);
	};

	this.Busqueda = function(info,callback){
		var conexionBusqueda=crearXMLHttpRequest();
		conexionBusqueda.onreadystatechange = function(){
			if (conexionBusqueda.readyState == 4){
		            callback(JSON.parse(conexionBusqueda.responseText));
		    }
		};
		conexionBusqueda.open('POST','../controladores/cor_Motor.php', true);
		conexionBusqueda.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		var envio="operacion="+encodeURIComponent(info.operacion)+'&entidad='+encodeURIComponent(info.entidad);
		envio+="&codigo="+encodeURIComponent(info.codigo);
		conexionBusqueda.send(envio);
	};
	this.Operacion = function(info,callback){
		var conexionMotor=crearXMLHttpRequest();
		conexionMotor.onreadystatechange = function(){
			if (conexionMotor.readyState == 4){
		            callback(JSON.parse(conexionMotor.responseText));
		    }
		};
		conexionMotor.open('POST','../controladores/cor_Motor.php', true);
		conexionMotor.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		var envio='';
		for(var llave in info){
			envio+=llave.toLowerCase()+'='+encodeURIComponent(info[llave])+'&';
		}
		conexionMotor.send(envio);
	};
	//--------------------------------------------funciones de bd--------------------------------
	this.guardar = function(entidad,info,callback){
		var conexionMotor=crearXMLHttpRequest();
		conexionMotor.onreadystatechange = function(){
			if (conexionMotor.readyState == 4){
		            callback(JSON.parse(conexionMotor.responseText));
		    }
		};
		conexionMotor.open('POST','../controladores/cor_Motor.php', true);
		conexionMotor.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		var envio="operacion="+encodeURIComponent('guardar')+'&entidad='+encodeURIComponent(entidad);+'&';
		for(var x=0;x<info.length;x++){
			envio+=info[x].nombre.toLowerCase()+'='+encodeURIComponent(info[x].valor)+'&';
		}
		console.log(envio);
		//conexionMotor.send(envio);
	};
	this.editarCampo= function(id,campo,valor){
		var registro=torque.buscarRegistro(id);
		//editar campo
		return registro;
	};
	//funcion de arranque 
	this.ignition();
};
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