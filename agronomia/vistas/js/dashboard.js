function construirUI(){
  //inicializo el layOut
  var LayOut = {
    estado:'construyendo'
  };
  //creo el titulo
  LayOut.titulo = crearTitulo();
  //creo la ventana lateral derecha con los datos de la zafra
  LayOut.latIzq = crearLatIzq();
  //creo el lateral derecho con los datos del dia de zafra
  LayOut.latDer = crearLatDer();
  //creo el sector graficos
  LayOut.pie = crearContenedorGraficos();
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

  LayOut.activarDia = function(dia){
    diaZafra = this.latDer.buscarDia('fechadia',dia.fechadia);
    diaZafra.actualizarDatos(dia);
    diaZafra.reconstruirNodo();
    //construirGraficosDia(dia);
    for(var x = 0; x < this.latDer.dias.length;x++){
      var diferencia = parseInt(this.latDer.dias[x].atributos.numero)-parseInt(dia.numero);
      this.latDer.dias[x].mover(diferencia);
    }
    this.latDer.diaActivo = diaZafra;
    this.manejarSlider();
  };

  LayOut.manejarSlider = function(){
    var botPrev = this.latDer.nodo.querySelector('button.chev-izq');
    var botNext = this.latDer.nodo.querySelector('button.chev-der');
    if(this.latDer.dias.length === 1){
      botPrev.classList.add('invisible');
      botNext.classList.add('invisible');
    }else if(diaZafra.atributos.numero === this.latDer.buscarMayor().atributos.numero){
      botNext.classList.add('invisible');
      if(botPrev.classList.contains('invisible')){
        botPrev.classList.remove('invisible');
      }
    }else if(parseInt(diaZafra.atributos.numero) === 1){
      botPrev.classList.add('invisible');
      if(botNext.classList.contains('invisible')){
        botNext.classList.remove('invisible');
      }
    }else {
      botNext.classList.remove('invisible');
      botPrev.classList.remove('invisible');
    }
  };

  LayOut.construirDia = function(dia){
    var diaZafra = this.latDer.buscarDia('fechadia',dia.fechadia);
    if(!diaZafra){
      diaZafra = new Dia(dia);
      this.latDer.dias.push(diaZafra);
      this.latDer.buscarSector('formDia').nodo.appendChild(diaZafra.nodo);
    }
  };
  UI.elementos.LayOut = LayOut;
}

/*---------------------------------------------------------- FUNCIONES DE CONSTRUCCION ----------------------------------------------------------*/
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
      clases: ['formulario-dias'],
      html: '<button type="button" class="material-icons md-48 green500 chev-izq" ci>chevron_left</button>'+
            '<button type="button" class="material-icons md-48 green500 chev-der" cr>chevron_right</button>'
    },{
      nombre:'botonera',
      clases:['botonera'],
      html: '<button type="button" class="icon material-icons md-24 mat-red500 white" cerrardia>lock_outline</button>'+
            '<button type="button" class="icon material-icons md-24 mat-lightgreen500 white" abrirdia>lock_open</button>'+
            '<button type="button" class="icon material-icons md-24 mat-brown500 white" grafico>pie_chart</button>'+
            '<button type="button" class="icon material-icons md-24 mat-blue500 white" validar>youtube_searched_for</button>'+
            '<button type="button" class="icon material-icons md-24 mat-bluegrey500 white" validarcorreo>mail_outline</button>'+
            '<button type="button" class="icon material-icons md-24 mat-indigo500 white" subirvalidacion>file_upload</button>'+
            '<button type="button" class="icon material-icons md-24 mat-teal500 white" buscarvalidacion>cloud_download</button>'+
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
          UI.elementos.LayOut.construirDia(tupla.atributos);
        });
        if(UI.elementos.LayOut.latDer.diaActivo){
            UI.elementos.LayOut.activarDia(UI.elementos.LayOut.latDer.diaActivo.atributos);
        }else{
            UI.elementos.LayOut.activarDia(lista.Slots[0].atributos);
        }
        //funcionamiento de moviemient de dias
        UI.elementos.LayOut.latDer.nodo.querySelector('button.chev-izq').onclick = function(e){
          agregarRippleEvent(this,e);
          var numero = UI.elementos.LayOut.latDer.diaActivo.atributos.numero - 1;
          buscarDatosDia(numero);
        };
        UI.elementos.LayOut.latDer.nodo.querySelector('button.chev-der').onclick = function(e){
          agregarRippleEvent(this,e);
          var numero = parseInt(UI.elementos.LayOut.latDer.diaActivo.atributos.numero) + 1;
          buscarDatosDia(numero);
        };
        //si se le pasa el dia como parametro
        cargarDiaUrlArranque();
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
        contenedor: lat.buscarSector('formDia').nodo.querySelector('div[formDia="'+slot.atributos.codigo+'"]'),
        cuadro: {
          nombre: 'buscardia',
          mensaje: 'buscando Datos del dia '+slot.atributos.nombre
        }
      };
      UI.elementos.LayOut.abrirdia();
      torque.manejarOperacion(peticion,cuadro,function(respuesta){
        UI.elementos.LayOut.activarDia(respuesta.registro);
        UI.elementos.LayOut.mostrarBotonera();
      });
    }
  },lat.buscarSector('listaDias').nodo);

  //funcionamiento dias
  lat.dias = [];
  lat.diaActivo = null;
  lat.buscarDia = function(atributo,valor){
    for (var i = 0; i < this.dias.length; i++) {
      if(this.dias[i].atributos[atributo] == valor){
        return this.dias[i];
      }
    }
    return false;
  };
  lat.buscarMayor = function(){
    var mayor = 0;
    for (var i = 0; i < this.dias.length; i++) {
      if(this.dias[i].atributos.numero > mayor){
        mayor = this.dias[i].atributos.numero;
      }
    }
    var dia = this.buscarDia('numero',mayor);
    return dia;
  };
  return lat;
}
function crearContenedorGraficos(){
  var ventana = UI.agregarVentana({
    nombre:'contenedoGraficos',
    tipo:'completo',
    clases:['cont-graf'],
    sectores:[{
      nombre:'grafDia',
      html:''
    },{
      nombre:'grafZafra',
      html:''
    }]
  },document.body.querySelector('div[contenedor]'));
  return ventana;
}
function buscarDatosDia(numero){
  var dia = UI.elementos.LayOut.latDer.buscarDia('numero',numero);
  var peticion = {
     modulo: "agronomia",
     entidad: "diaZafra",
     operacion: "estadoDia",
     codigo: dia.atributos.codigo,
     zafra: UI.elementos.LayOut.latIzq.buscarSector('formZafra').formulario.buscarCampo('codigo').captarValor()
  };
  UI.elementos.LayOut.activarDia(dia.atributos);
  var cuadro = {
    contenedor : dia.nodo,
    cuadro: {
      nombre: 'cargaDia'+dia.codigo,
      mensaje: 'Buscando Datos del dia'
    }
  };
  torque.manejarOperacion(peticion,cuadro,function(res){
      UI.elementos.LayOut.activarDia(res.registro);
  });
}
/*-----------------------------------------------------------------BOTONES--------------------------------------------------------------*/
function funcionamientoBotones(secBot){
  //agrego funcionamiento boton por boton
  var btnLista = secBot.nodo.querySelector('button[lista]').onclick= function(){
    UI.buscarVentana('Dias').recargar();
    UI.elementos.LayOut.mostrarLista();
  };
  var btnBuscar = secBot.nodo.querySelector('button[buscarvalidacion]').onclick= function(){
    var lat = UI.elementos.LayOut.latDer;
    lat.diaActivo.buscarValidacion();
  };
  var btnCargarListado = secBot.nodo.querySelector('button[subirvalidacion]').onclick= function(){
    var lat = UI.elementos.LayOut.latDer;
    var ventana = UI.crearVentanaModal({
      tipo:'INFORMACION',
      cabecera:{
        html: 'Cargar listado de validacion de forma manual'
      },
      cuerpo:{
        tipo:'nuevo',
        formulario: {
          campos:[
            {
              tipo : 'campoDeTexto',
              parametros : {
                requerido:true,
                titulo:'Titulo',
                nombre:'titulo',
                tipo:'simple',
                eslabon:'simple',
                usaToolTip:true
              }
            }
          ]
        }
      },
      pie:{
        clases:['botonera'],
        html:
            '<button type="button" class="icon material-icons indigo500">file_upload</button>'+
            '<button type="button" class="icon red500 md-24">close</button>'
      }
    });
  };
  var btnValidarCorreo = secBot.nodo.querySelector('button[validarcorreo]').onclick= function(){
    var lat = UI.elementos.LayOut.latDer;
    lat.diaActivo.validarCorreo();
  };
  var btnValidar = secBot.nodo.querySelector('button[validar]').onclick= function(){
    var lat = UI.elementos.LayOut.latDer;
    lat.diaActivo.validarCampo();
  };
  var btnGraficos = secBot.nodo.querySelector('button[grafico]').onclick= function(){
      construirGraficosDia();
  };
  var btnAbrirDia = secBot.nodo.querySelector('button[abrirdia]').onclick= function(){
    var lat = UI.elementos.LayOut.latDer;
    var diaAbierto = lat.buscarDia('estado','A');
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
}
function cargarDiaUrlArranque(){
  //solo se activa si el LayOut se esta construyendo incialmente
  if(UI.elementos.LayOut.estado === 'construyendo'){
    if (UI.elementos.URL.captarParametroPorNombre('Dia')){
      UI.buscarVentana('Dias').buscarSlot({codigo:UI.elementos.URL.captarParametroPorNombre('Dia')}).nodo.click();
    }
    UI.elementos.LayOut.estado = 'construido';
  }
}
function construirGraficosDia(){
  var pie = UI.elementos.LayOut.pie;
  var peticion = {
     modulo: "agronomia",
     entidad: "arrimadaVsCampo",
     operacion: "buscarValidacionRelacionada",
     dia: UI.elementos.LayOut.latDer.diaActivo.atributos.codigo
  };
  var cuadro ={
    contenedor: pie.buscarSector('grafDia').nodo,
    cuadro:{
      nombre: 'graficosDia',
      mensaje: 'Buscando Informacion Necesaria'
    }
  };
  torque.manejarOperacion(peticion,cuadro,function(res){
    console.log(res);
  });
}
