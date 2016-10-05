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
  LayOut.mostrarLista= function(){
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
    var html = '<section titulo class="liso-centrado">Dia '+dia.numero+'</section>';
    html += '<section contDatos>'+
              '<article><label>Fecha:</label>'+dia.fechadia+'</article>'+
              '<article><label>Proceso:</label>'+dia.nombre_proceso_dia+'</article>'+
              '<article><label>Datos:</label>'+dia.nombre_estado_datos+'</article>'+
              '<article><label>Carga:</label>'+dia.nombre_tipo_carga+'</article>'+
            '</sector>';
    this.latDer.buscarSector('formDia').nodo.innerHTML = html;
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
    lat.buscarSector('formZafra').agregarFormulario({
      plano: UI.buscarConstructor('zafra'),
      tipo: 'modificar',
      registroAct: resp.registro,
    });
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
      html: '<button type="button" class="icon material-icons md-24 mat-red500 white" cerradia>lock_outline</button>'+
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
      }//,respuesta: callback
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

  return lat;
}
function funcionamientoBotones(secBot){
  //agrego funcionamiento boton por boton
  var btnLista = secBot.nodo.querySelector('button[lista]').onclick= function(){
    UI.elementos.LayOut.mostrarLista();
  };
}
