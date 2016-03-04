var Sesion = function(){

	this.estado='cerrada';
	this.nombre;
	this.privilegios= null;

	this.obtenerSesion = function(){
		var contEspera=0;

		var intervaloCargaSession = setInterval(function(){
			console.log('contador de espera:'+contEspera);
			contEspera++;
			if(contEspera>=10){
				console.log('culmino tiempo de espera');
				//clearInterval(intervaloCargaSession);
			}
		},20); 
		console.log('intervalo carga session:'+intervaloCargaSession);
		conexionAcc=crearXMLHttpRequest();
		var sesionActiva=this;
		conexionAcc.onreadystatechange = function(){
			if (conexionAcc.readyState == 4 && conexionAcc.status == 200){
				clearInterval(intervaloCargaSession);
				var respuesta=JSON.parse(conexionAcc.responseText);
				if(respuesta.success==1){
					sesionActiva.estado='activa';
					sesionActiva.nombre=respuesta.sesion.Nombre;
					sesionActiva.armarPrivilegios(respuesta.sesion.privilegios[0]);
				}else{
					location.href='index.html';
				}

		    }
		}
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
		}
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
	this.armarPrivilegios =function(privilegios){
		var modEnc=false;
		var subEnc=false;
		var modulo;
		var submodulo;
		var modulos=new Array();
		var submodulos=new Array();
		for(var x=0;x<privilegios.length;x++){
			
			modEnc=false;
			subEnc=false;

			//------------------------------------Evaluar Modulos
			var y=0;
			if(modulos.length==0){
				modulo={
					codigo:privilegios[x].Cod_Mod,
					nombre:privilegios[x].Modulo
				}
				modulos.push(modulo);
			}

			do{
				if(privilegios[x].Cod_Mod==modulos[y].codigo){
					modEnc=true;
					break;
				}
				y++;
			}while(y<modulos.length);

			if(!modEnc){
				modulo={
					codigo:privilegios[x].Cod_Mod,
					nombre:privilegios[x].Modulo
				}
				modulos.push(modulo);
			}
			//----------------------------------------Evaluar Submodulos
			var z=0;
			if(submodulos.length==0){
				submodulo={
					codigo:privilegios[x].Codigo,
					nombre:privilegios[x].Nombre,
					enlace:privilegios[x].Enlace,
					codPadre:privilegios[x].Cod_Mod
				}
				submodulos.push(submodulo);
			}
			do{
				if(privilegios[x].Codigo==submodulos[z].codigo){
					subEnc=true;
					break
				}
				z++;
			}while(z<submodulos.length);
			if(!subEnc){
				submodulo={
					codigo:privilegios[x].Codigo,
					nombre:privilegios[x].Nombre,
					enlace:privilegios[x].Enlace,
					codPadre:privilegios[x].Cod_Mod
				}
				submodulos.push(submodulo);
			}
		}
		var privilegio;
		for(var x=0;x<modulos.length;x++){
			privilegio={
				nombre:modulos[x].nombre,
				codigo:modulos[x].codigo,
				hijos:[]
			}
			for(var y=0;y<submodulos.length;y++){
				if(modulos[x].codigo==submodulos[y].codPadre){
					privilegio.hijos.push(submodulos[y]);
				}
			}
			if(this.privilegios==null){
				this.privilegios=new Array();
			}
			this.privilegios.push(privilegio);
		}
	}
}	
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
		}
		conexionBuscar.open('POST','../controladores/cor_Motor.php', true);
		conexionBuscar.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		var envio="operacion="+encodeURIComponent("buscar")+'&entidad='+encodeURIComponent(entidad);
		conexionBuscar.send(envio);
	}

	this.Busqueda = function(info,callback){
		var conexionBusqueda=crearXMLHttpRequest();
		conexionBusqueda.onreadystatechange = function(){
			if (conexionBusqueda.readyState == 4){
		            callback(JSON.parse(conexionBusqueda.responseText));
		    }
		}
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
		}
		conexionMotor.open('POST','../controladores/cor_Motor.php', true);
		conexionMotor.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		var envio='';
		var valor;
		for(var llave in info){
			envio+=llave.toLowerCase()+'='+encodeURIComponent(info[llave])+'&';
		}
		conexionMotor.send(envio);
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