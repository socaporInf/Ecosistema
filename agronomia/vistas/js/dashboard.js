// TODO:
  //1: en el display dias mostrar progresBar con el proceso en el cual se encuentra(mostrar diferencia en estado final de proceso)
  //2: navegacion lateral de dias en la parte del display
function construirUI(){
  //inicializo el layOut
  LayOut = {};
  //creo el titulo
  LayOut.titulo = crearTitulo();
  //creo la ventana lateral derecha con los datos de la zafra
  LayOut.latIzq = crearLatIzq();
  //creo el lateral derecho con los datos del dia de zafra
  LayOut.latDer = crearLatDer();
  //le asigno las Funciones
  LayOut.abrirdia = function(){
    if(!this.latIzq.nodo.classList.contains('reducir')){
      this.latIzq.nodo.classList.add('reducir');
      this.latDer.nodo.classList.add('ampliar');
      this.latDer.buscarSector('listaDias').nodo.classList.add('subir');
    }
  };
  LayOut.mostrarLista = function(){
    if(this.latIzq.nodo.classList.contains('reducir')){
      this.latIzq.nodo.classList.remove('reducir');
      this.latDer.nodo.classList.remove('ampliar');
      this.latDer.buscarSector('listaDias').nodo.classList.remove('subir');
    }
  };
  LayOut.mostrarBotonera = function(){
    this.latDer.buscarSector('formDia').nodo.classList.add('comprimir');
  };
  LayOut.construirDia = function(dia){
    var diaZafra;
    if(!this.latDer.buscarDiaPorFecha(dia.fechadia)){
      diaZafra = new Dia(dia);
      this.latDer.dias.push(diaZafra);
    }else{
      diaZafra =this.latDer.buscarDiaPorFecha(dia.fechadia);
      diaZafra.actualizarDatos(dia);
      diaZafra.reconstruirNodo();
    }
    this.latDer.buscarSector('formDia').nodo.appendChild(diaZafra.nodo);
    this.latDer.diaActivo = diaZafra;
  };
  UI.elementos.LayOut = LayOut;
}
function crearTitulo(){
  var titulo = UI.agregarVentana({
   nombre:'titulo',
   tipo: 'titulo',
   clases: ['completo'],
   titulo: {
     tipo:'basico',
     html:'Gestion Zafra'
   }
 },UI.contGeneral);
 return titulo;
}
function crearLatIzq(){
  var lat = UI.agregarVentana({
    nombre:'latIzq',
    clases:['lat-izq'],
    tipo: 'formulario',
    titulo: {
      tipo:'liso',
      html:'Zafra'
    },
    sectores:[{
      nombre:'formZafra',
    }]
  },UI.contGeneral);

  var peticion = {
     modulo: "agronomia",
     entidad: "zafra",
     operacion: "buscarActivo"
  };
  cuadro = {
    contenedor: lat.buscarSector('formZafra').nodo,
    cuadro: {
      nombre: 'zafra',
      mensaje: 'buscando Datos de zafra'
    }
  };
  torque.manejarOperacion(peticion,cuadro,function(resp){
    if(resp.success){
      lat.buscarSector('formZafra').agregarFormulario({
        plano: UI.buscarConstructor('zafra'),
        tipo: 'modificar',
        registroAct: resp.registro,
      });
    }else{
      UI.crearMensaje({
        nombre_tipo:'ERROR',
        titulo:'No hay una Zafra aperturada',
        cuerpo:'Para poder utilizar este Componente debe existir una zafra aperturada<br>'
      });
      document.body.querySelector('div[capa="exterior"]').onclick = function(){
        location.href = '../../global/vistas/vis_Landing.html';
      };
    }
  });
  return lat;
}
function crearLatDer(){
  var lat = UI.agregarVentana({
    nombre:'latDer',
    tipo: 'formulario',
    clases:['lat-der'],
    sectores:[{
      nombre:'listaDias',
      clases: ['listado-dias']
    },{
      nombre:'formDia',
      clases: ['formulario-dias']
    },{
      nombre:'botonera',
      clases:['botonera'],
      html: '<button type="button" class="icon material-icons md-24 mat-red500 white" cerrardia>lock_outline</button>'+
            '<button type="button" class="icon material-icons md-24 mat-lightgreen500 white" abrirdia>lock_open</button>'+
            '<button type="button" class="icon material-icons md-24 mat-blue500 white" validar>search</button>'+
            '<button type="button" class="icon material-icons md-24 mat-bluegrey500 white" validarcorreo>mail_outline</button>'+
            '<button type="button" class="icon material-icons md-24 mat-indigo500 white" subirvalidacion>file_upload</button>'+
            '<button type="button" class="icon material-icons md-24 mat-amber500 white" lista>list</button>'
    }]
  },UI.contGeneral);

  funcionamientoBotones(lat.buscarSector('botonera'));

  var listaDias = UI.agregarLista({
    noUsatitulo: true,
    titulo: 'Dias',
    clases:['embebida'],
    campo_nombre: 'fechadia',
    carga: {
      uso:true,
      peticion:{
         modulo: "agronomia",
         entidad: "diaZafra",
         operacion: "buscarDiasZafraActiva"
      },
      espera:{
        cuadro:{
          nombre: 'dias',
          mensaje: 'Buscando Dias'
        }
      },
      respuesta: function(lista){
        lista.Slots.forEach(function(tupla){
          tupla.nodo.setAttribute('estado',tupla.atributos.estado);
        });
      }
    },
    onclickSlot: function(slot){
      //muestro formulario dia
      var peticion = {
         modulo: "agronomia",
         entidad: "diaZafra",
         operacion: "estadoDia",
         codigo: slot.atributos.codigo,
         zafra: UI.elementos.LayOut.latIzq.buscarSector('formZafra').formulario.buscarCampo('codigo').captarValor()
      };
      var cuadro ={
        contenedor: lat.buscarSector('formDia').nodo,
        cuadro: {
          nombre: 'buscardia',
          mensaje: 'buscando Datos del dia '+slot.atributos.nombre
        }
      };
      UI.elementos.LayOut.abrirdia();
      torque.manejarOperacion(peticion,cuadro,function(respuesta){
        UI.elementos.LayOut.construirDia(respuesta.registros);
        UI.elementos.LayOut.mostrarBotonera();
      });
    }
  },lat.buscarSector('listaDias').nodo);

  //funcionamiento dias
  lat.dias = [];
  lat.diaActivo = null;
  lat.buscarDiaPorNumero = function(numero){
    for (var i = 0; i < this.dias.length; i++) {
      if(this.dias[i].atributos.numero == numero){
        return this.dias[i];
      }
    }
    return false;
  };
  lat.buscarDiaPorFecha = function(fecha){
    for (var i = 0; i < this.dias.length; i++) {
      if(this.dias[i].atributos.fechadia == fecha){
        return this.dias[i];
      }
    }
    return false;
  };
  lat.buscarDiaAbierto = function(){
    for (var i = 0; i < this.dias.length; i++) {
      if(this.dias[i].atributos.estado === 'A'){
        return this.dias[i];
      }
    }
    return false;
  };
  return lat;
}
function funcionamientoBotones(secBot){
  //agrego funcionamiento boton por boton
  var btnLista = secBot.nodo.querySelector('button[lista]').onclick= function(){
    UI.buscarVentana('Dias').recargar();
    UI.elementos.LayOut.mostrarLista();
  };
  var btnAbrirDia = secBot.nodo.querySelector('button[abrirdia]').onclick= function(){
    var lat = UI.elementos.LayOut.latDer;
    var diaAbierto = lat.buscarDiaAbierto();
    if(diaAbierto){
        UI.crearMensaje({
          nombre_tipo:'ERROR',
          titulo: 'Imposible abrir Dia '+lat.diaActivo.atributos.fechadia,
          cuerpo: 'no se puede abrir un dia de zafra si ya existe otro abierto<br>'+
                  'Debe cerrar el Dia '+diaAbierto.atributos.numero+' ('+diaAbierto.atributos.fechadia+') '+
                  'para poder abrir otro dia'
        });
    }else{
        lat.diaActivo.abrirDia();
    }
  };
  var btnCerrarDia = secBot.nodo.querySelector('button[cerrardia]').onclick= function(){
    var lat = UI.elementos.LayOut.latDer;
    lat.diaActivo.cerrarDia();
  };
  var btnValidarCorreo = secBot.nodo.querySelector('button[validarcorreo]').onclick= function(){
    var lat = UI.elementos.LayOut.latDer;
    lat.diaActivo.validarCorreo();
  };
  var btnValidar = secBot.nodo.querySelector('button[validar]').onclick= function(){
    var lat = UI.elementos.LayOut.latDer;
    lat.diaActivo.validarCampo();
  };
}
