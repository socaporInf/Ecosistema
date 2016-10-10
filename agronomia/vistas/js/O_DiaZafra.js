var Dia = function(atributos){
  this.atributos = atributos;
  this.nodo = null;

  this.construirNodo = function(){
    var nodo = document.createElement('div');
    nodo.setAttribute('formDia','');
    this.nodo = nodo;
    this.reconstruirNodo();
  };
  this.actualizarDatos = function(atributos){
    this.atributos = atributos;
  };
  this.reconstruirNodo = function(){
    var estado = (this.atributos.estado==='A')?'Abierto':'Cerrado';
    var html = '<section titulo class="liso-centrado">Dia '+this.atributos.numero+'</section>';
    html += '<section cont-datos>'+
              '<article general>'+
              '<label>Fecha:</label>'+this.atributos.fechadia+'<label>'+
              'Estado:</label><span estado="'+this.atributos.estado+'">'+estado+'</span>'+
              '</article>'+
              '<article proceso><label>Proceso:</label></article>'+
            '</sector>';
    this.nodo.innerHTML = html;
    this.agregarSectorProceso();
  };
  this.agregarSectorProceso = function(){
    var sec = this.nodo.querySelector('article[proceso]');
    sec.innerHTML += this.atributos.nombre_proceso_dia.toLowerCase();
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
      location.href='../../agronomia/vistas/vis_ValidarDatosCorreo.html?Dia='+this.atributos.codigo;
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
  this.construirNodo();
};
