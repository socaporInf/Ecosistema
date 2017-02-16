var Dia = function(atributos){
  atributos.avance_dia = parseInt(atributos.avance_dia);
  this.atributos = atributos;
  this.nodo = null;

  this.construirNodo = function(){
    var nodo = document.createElement('div');
    nodo.setAttribute('formDia',this.atributos.codigo);
    nodo.classList.add('izquierda');
    this.nodo = nodo;
    this.reconstruirNodo();
  };
  this.actualizarDatos = function(atributos){
    this.atributos = atributos;
  };
  this.reconstruirNodo = function(){
    var textoGraf = this.atributos.nombre_proceso_dia.toLowerCase();
    if(this.atributos.secuencia_proceso_dia === "3"){
        textoGraf = 'Diferencia: '+this.atributos.diferencia;
    }
    var estado = (this.atributos.estado==='A')?'Abierto':'Cerrado';
    var html = '<section titulo class="liso-centrado">Dia '+this.atributos.numero+'</section>';
    html += '<section cont-datos>'+
              '<article general>'+
                  '<article datos>Fecha:<span style="color:black">'+this.atributos.fechadia+'</article><br>'+
                  '<article datos>Estado:<span estado="'+this.atributos.estado+'">'+estado+'</span></article>'+
                  '<article datos>Proceso:<span style="background-color:#'+this.atributos.color_proceso_dia+'">'+this.atributos.nombre_proceso_dia.toLowerCase()+'</span></article>'+
                  '<article datos>Datos:<span style="background-color:#'+this.atributos.color_proceso_dia+'">'+this.atributos.nombre_estado_datos.toLowerCase()+'</span></article>'+
                '</article>'+
              '<article cont-graf>'+
                '<article wid-graf>'+
                  '<div id="container'+this.atributos.codigo+'"></div>'+
                  '<article cont-graf-tex>'+textoGraf+'</article>'+
                '</article>'+
              '</article>'+
            '</sector>';
    this.nodo.innerHTML = html;
    this.agregarSectorProceso();
  };
  this.mover = function(diferencia){
    this.nodo.style.marginLeft = (diferencia * 100) + '%';
  };
  this.agregarSectorProceso = function(){
    var container = this.nodo.querySelector('div[id]');
    var bar = new ProgressBar.SemiCircle(container, {
       strokeWidth: 4,
       easing: 'easeInOut',
       duration: 1400,
       color: '#'+this.atributos.color_proceso_dia,
       trailColor: '#eee',
       trailWidth: 1,
       svgStyle: null,
    });
    var progreso = this.atributos.avance_dia /100;
    bar.animate(progreso);
  };
  this.abrirDia = function(){
    if(this.atributos.estado === 'A'){
        UI.agregarToasts({
          texto: 'Dia '+this.atributos.fechadia+' ya se encuentra abierto',
          tipo: 'web-arriba-derecha-alto'
        });
    }else{
      this.ejecutarOperacion('abrirDia',function(){
        UI.buscarVentana('Dias').recargar();
      });
    }
  };
  this.cerrarDia = function(){
    var yo = this;
    if(this.atributos.estado === 'C'){
      UI.agregarToasts({
        texto: 'Dia '+this.atributos.fechadia+' ya se encuentra cerrado',
        tipo: 'web-arriba-derecha-alto'
      });
    }else{
      UI.crearVerificacion({
        titulo:'Realmente Desea Cerrar el dia ',
        cuerpo: 'Si cierra el dia '+this.atributos.fechadia+' no podra editar la informacion del mismo'
      },function(){
        yo.ejecutarOperacion('cerrarDia',function(){
          UI.elementos.LayOut.mostrarLista();
          UI.buscarVentana('Dias').recargar();
          UI.elementos.modalWindow.eliminarUltimaCapa();
        });
      });
    }
  };
  this.validarCorreo = function(){
    if(this.atributos.nombre_estado_datos == 'EN ESPERA'){
        UI.agregarToasts({
          texto: 'No exiten datos disponibles para este dia',
          tipo: 'web-arriba-derecha-alto'
        });
    }else{
      location.href='../../agronomia/vistas/vis_ValidarDatosCorreo.html?Dia='+this.atributos.codigo;
    }
  };
  this.validarCampo = function(){
    if(this.atributos.nombre_estado_datos != 'IMPORTADOS'){
        UI.agregarToasts({
          texto: 'Los datos deben ser importados antes de poder validarlos',
          tipo: 'web-arriba-derecha-alto'
        });
    }else{
      location.href='../../agronomia/vistas/vis_ArrimadaVsCampo.html?Dia='+this.atributos.codigo;
    }
  };
  this.ejecutarOperacion = function(op,callback){
    var yo = this;
    var pet = {
      operacion: op,
      modulo:'agronomia',
      entidad:'diaZafra',
      codigo: this.atributos.codigo
    };
    var cuadro = {
      contenedor: this.nodo,
      cuadro : {
        nombre: op+this.atributos.codigo,
        mensaje: 'Aplicando Cambios sobre '+this.atributos.fechadia
      }
    };
    torque.manejarOperacion(pet,cuadro,function(res){
      yo.atributos = res.registro;
      yo.reconstruirNodo();
      if(res.success === 1){
        callback();
      }
    });
  };
  this.buscarValidacion = function(){
    var yo = this;
    var pet = {
      operacion: 'buscarListadoCorreo',
      modulo:'agronomia',
      entidad:'diaZafra',
      codigo: this.atributos.codigo
    };
    var cuadro = {
      contenedor: this.nodo,
      cuadro : {
        nombre: 'Dia'+this.atributos.codigo,
        mensaje: 'Cargando Listado del dia '+this.atributos.fechadia
      }
    };
    torque.manejarOperacion(pet,cuadro,function(res){
      if(!res.success){
        if(res.error){
          UI.crearMensaje({
            nombre_tipo:'ERROR',
            contenido:'ancho',
            titulo:'Error al cargar listado de validacion',
            cuerpo:'<pre style="overflow:auto">'+res.contenido+'</pre>'
          });
        }else{
          UI.elementos.modalWindow.buscarUltimaCapaContenido().convertirEnMensaje({
            nombre_tipo:'ERROR',
            contenido:'ancho',
            titulo:'Error al cargar listado de validacion',
            cuerpo:res.mensaje
          });
        }
        yo.reconstruirNodo();
      }else{

          UI.agregarToasts({
            texto: 'Listado Cargado correctamente',
            tipo: 'web-arriba-derecha-alto'
          });
        yo.atributos = res.registro;
        yo.reconstruirNodo();
      }
    });
  };
  this.construirNodo();
};
