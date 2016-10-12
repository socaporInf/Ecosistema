function construirUI(){
  var layOut = {};
  //contruir titulo
  layOut.ventTitulo = UI.agregarVentana({
    tipo: 'titulo',
    nombre: 'tituloGeneral',
    titulo:{
      html: 'Arrimada vs Campo <article diferencia>Diferencia General en Toneladas:<span></span></article>',
      tipo: 'liso'// liso o basico
    },
    clases : ['arrimada']
  },document.body.querySelector('div[contenedor]'));
  //contruir ventanas laterales
  layOut.pie = construirPie();
  layOut.latIzq = construirLat('izq','Arrimada','apagado',{
     modulo: "agronomia",
     entidad: "arrimadaVsCampo",
     operacion: "buscarValidacion",
     dia: UI.elementos.URL.captarParametroPorNombre('Dia')
  });
  layOut.latDer = construirLat('der','Campo','encendido',{
     modulo: "agronomia",
     entidad: "arrimadaVsCampo",
     operacion: "buscarValidacionRelacionada",
     dia: UI.elementos.URL.captarParametroPorNombre('Dia')
  });
  UI.elementos.layOut = layOut;
  calcularDiferencia(UI.elementos.URL.captarParametroPorNombre('Dia'));
}
function construirLat(lado,titulo,selector,petLista){
  var lateral = UI.agregarVentana({
    nombre:'lat'+lado,
    clases: ['ventana','lat-'+lado],
    sectores:[{
      nombre:'list'+lado,
      html:''
    }]
  },document.body.querySelector('div[contenedor]'));

  var lista =   UI.agregarLista({
    titulo: titulo,
    nombre: titulo.toLowerCase(),
    clases: ['embebida','comprimida','inversa'],
    registrosPorPagina: 16,
    cabecera:{
      fija:true
    },
    selector:selector,
    columnas: 8,
    carga: {
      uso:true,
      peticion:petLista,
      espera:{
        cuadro:{
          nombre: 'buscalista'+lado,
          mensaje: 'Buscando ...'
        }
      },
      respuesta: function(){
        lista.Slots.forEach(function(tupla){
          if (parseFloat(tupla.atributos['pesoneto/ton']) === 0.00) {
            tupla.nodo.setAttribute('diferente','');
          }
          var nodoCana = UI.buscarVentana('pie').buscarSector('total'+lado).nodo.querySelector('article[id="cana'+lado+'"]');
          var nodoAzu = UI.buscarVentana('pie').buscarSector('total'+lado).nodo.querySelector('article[id="azu'+lado+'"]');

          var acuCan = 0;
          var acuAzu = 0;
          for (var i = 0; i < lista.Slots.length; i++) {
            acuCan += parseFloat(lista.Slots[i].atributos['pesoneto/ton']);
            acuAzu += parseFloat(lista.Slots[i].atributos.azucar);
          }
          nodoCana.textContent = acuCan.toFixed(2);
          nodoAzu.textContent = acuAzu.toFixed(4);
        });
      }
    },
  },UI.buscarVentana('lat'+lado).buscarSector('list'+lado).nodo);

  return lateral;
}
function construirPie(){

  var pie = UI.agregarVentana({
    nombre:'pie',
    tipo: 'ventana',
    clases: ['pieArrimada'],
    sectores:[
      {
        nombre:'totalizq',
        html:'<section totales>'+
                '<article total >Total Ton. Caña</article>'+
                '<article valor id="canaizq"></article>'+
                '<article total >Total Ton. Azucar</article>'+
                '<article valor id="azuizq"></article>'+
              '</section>'
      },{
          nombre:'totalder',
          html:'<section totales>'+
                  '<article total >Total Ton. Caña</article>'+
                  '<article valor id="canader"></article>'+
                  '<article total >Total Ton. Azucar</article>'+
                  '<article valor id="azuder"></article>'+
                '</section>'
        }
    ]
  },document.body.querySelector('div[contenedor]'));
  return pie;
}
function calcularDiferencia(codigo){
  UI.elementos.layOut.ventTitulo.nodo.querySelector('article[diferencia]').innerHTML = 'Calculando Diferencia General';
  var peticion = {
     modulo: "agronomia",
     entidad: "arrimadaVsCampo",
     operacion: "buscarDiferencia",
     dia: codigo
  };
  torque.Operacion(peticion,function(res){
    var color;
    if (res.diferencia) {
      if(parseFloat(res.diferencia)>0){
        color = '#e57373';
      }else{
        color = '#64B5F6';
      }
      UI.elementos.layOut.ventTitulo.nodo.querySelector('article[diferencia]').innerHTML = 'Diferencia General: <span style="color:'+color+'">'+res.diferencia+' ton.<span>';
    }else{
      UI.elementos.layOut.ventTitulo.nodo.querySelector('article[diferencia]').innerHTML = '';
    }
  });
}
/*-----------------------------------------------Funcionamiento botones---------------------------------------*/
function manejarTablon(){
  var ventana = UI.crearVentanaModal({
        cabecera:{
            html: 'Registrar de Tablon'
        },
        cuerpo:{
            formulario: UI.buscarConstructor('tablon'), //objeto constructor
            tipo: 'nuevo', //operacion a realizar,
        },
        pie:{
            clases:['botonera'],
            html: '<button type="button" class="icon icon-guardar-indigo-32"> </button>'+
                  '<button type="button" class="icon icon-cerrar-rojo-32"> </button>'
        }
    });
}
function manejarFinca(){
  var ventana = UI.crearVentanaModal({
        cabecera:{
            html: 'Registrar de Finca'
        },
        cuerpo:{
            formulario: UI.buscarConstructor('finca'), //objeto constructor
            tipo: 'nuevo', //operacion a realizar,
        },
        pie:{
            clases:['botonera'],
            html: '<button type="button" class="icon icon-guardar-indigo-32"> </button>'+
                  '<button type="button" class="icon icon-cerrar-rojo-32"> </button>'
        }
    });
}
function manejarProductor(){
  var ventana = UI.crearVentanaModal({
        cabecera:{
            html: 'Registrar de Cañicultor'
        },
        cuerpo:{
            formulario: UI.buscarConstructor('productor'), //objeto constructor
            tipo: 'nuevo', //operacion a realizar,
        },
        pie:{
            clases:['botonera'],
            html: '<button type="button" class="icon icon-guardar-indigo-32"> </button>'+
                  '<button type="button" class="icon icon-cerrar-rojo-32"> </button>'
        }
    });
}

function buscarFaltantes(){
  var ventana = UI.crearVentanaModal({
    cabecera:{
      html:'Elementos Faltantes'
    },
    cuerpo:{
      html:'',
      clases: ['cont-card']
    }
  });
  var peticion = {
     modulo: "agronomia",
     entidad: "arrimadaVsCampo",
     operacion: "buscarElementosFaltantes"
  };
  var cuadro = {
    contenedor: ventana.partes.cuerpo.nodo,
    cuadro: {
      nombre: 'faltantes',
      mensaje: 'Buscando elementos faltantes'
    }
  };
  torque.manejarOperacion(peticion,cuadro,function(res){
    var html = "";
    var cue = "";
    var tit = "";
    if(!res.faltantes){
      html = "<h2> No Existen elementos faltantes en este momento</h2>";
      UI.elementos.modalWindow.buscarUltimaCapaContenido().partes.cuerpo.nodo.innerHTML = html;
    }else{
      var falt = res.faltantes;
      if(falt.productores){
        tit = "Productores";
        cue ="<table faltantes><tr><td>codigo</td></tr>";
        for (var p = 0; p < falt.productores.length; p++) {
          cue +="<tr><td>" + falt.productores[p].codigo + "</td></tr>";
        }
        cue +="</table>";
        var productores = new Card({
          titulo: tit,
          cuerpo: cue,
          color: '4CAF50',
          tipo: 'larga'
        });
        UI.elementos.modalWindow.buscarUltimaCapaContenido().partes.cuerpo.nodo.appendChild(productores.nodo);
      }
      if(falt.fincas){
        tit="Fincas";
        cue="<table faltantes><tr><td>Finca Letra</td></tr>";
        for (var f = 0; f < falt.fincas.length; f++) {
          cue +="<tr><td>" + falt.fincas[f].codigo + "</td></tr>";
        }
        cue +="</table>";
        var fincas = new Card({
          titulo: tit,
          cuerpo: cue,
          color: '8BC34A',
          tipo: 'larga'
        });
        UI.elementos.modalWindow.buscarUltimaCapaContenido().partes.cuerpo.nodo.appendChild(fincas.nodo);
      }
      if(falt.tablones){
        tit ="Tablones";
        cue ="<table faltantes><tr><td>Finca</td><td>Tablon</td</tr>";
        for (var t = 0; t < falt.tablones.length; t++) {
          cue +="<tr><td>" + falt.tablones[t].finca + "</td><td>" + falt.tablones[t].codigo + "</td></tr>";
        }
        cue +="</table>";
        var tablones = new Card({
          titulo: tit,
          cuerpo: cue,
          color: '607D8B',
          tipo: 'larga'
        });
        UI.elementos.modalWindow.buscarUltimaCapaContenido().partes.cuerpo.nodo.appendChild(tablones.nodo);
      }
    }
  });
}
function manejarDia(){
  var modal = UI.crearVentanaModal({
    cabecera:{
      html:'Seleccione dia a visualizar'
    },
    cuerpo:{
      clases:['cont-calendario'],
      html:'<div id="calendar"></div>'
    },
    pie:{
      clases:['leyenda'],
      html:''
    }
  });
  //calendario
  var pet = {
    modulo:'agronomia',
    entidad:'arrimadaVsCampo',
    operacion: 'buscarDatosCalendario'
  };
  var cuadro = {
    contenedor: UI.elementos.modalWindow.buscarUltimaCapaContenido().partes.cuerpo.nodo.querySelector('div[id="calendar"]'),
    cuadro: {
      nombre: 'buscar dias Calendario',
      mensaje: 'buscando dias disponibles'
    }
  };
  torque.manejarOperacion(pet,cuadro,function(res){
    var contenedor = UI.elementos.modalWindow.buscarUltimaCapaContenido().partes.cuerpo;
    //guardo los dias para que me queden disponibles cuando los necesite
    contenedor.dias = res.dias;
    //guardo los colores para la leyenda
    contenedor.colores = ['mat-amber500','mat-lightblue500','mat-indigo500','mat-green500'];
    //guardo los procesos para que me queden disponibles cuando los necesite
    contenedor.procesos = res.procesos;

    cargarCalendario(res.dias[res.dias.length - 1]);
    armarLeyenda();
    marcarDias();
  });
}
/*----------------------------------------------Calendario -------------------------------------------------------*/
function cargarCalendario(dia){
  $('#calendar').fullCalendar({
    header: {
      left: 'prev',
      center: 'title',
      right: 'next'
    },
    lang: 'es',
    defaultDate: new Date(dia.fecha_dia),
    editable: true,
    selectable: true,
    eventLimit: true, // allow "more" link when too many events
    dayClick: function(date){
      //funciomaniento cuando se hace click sobre un dia del calendario
      var diasZafra = UI.elementos.modalWindow.buscarUltimaCapaContenido().partes.cuerpo.dias;
      diasZafra.forEach(function(dia){
        if(dia.fecha_dia == date.format()){
          if(dia.secuencia_proceso_dia == 1){//registro virtual codigo =>31 ,nombre => en espera
            UI.agregarToasts({
              texto: 'Dia '+dia.fecha_dia+' en espera de recepcion de datos',
              tipo: 'web-arriba-derecha-alto'
            });
          }else if(dia.secuencia_proceso_dia == 2){//registro virtual codigo =>32 ,nombre => importacion de datos
            UI.agregarToasts({
              texto: 'Dia '+dia.fecha_dia+' validando datos para importacion',
              tipo: 'web-arriba-derecha-alto'
            });
          }else if(parseInt(dia.secuencia_proceso_dia) >= 3){//registro virtual codigo =>33 ,nombre => arrime vs campo
            armarListados(dia);
          }
        }
      });
    }
  });
  var contenedor = UI.elementos.modalWindow.buscarUltimaCapaContenido().partes.cuerpo;

  var btnNext = contenedor.nodo.querySelector('button.fc-next-button');
  var btnPrev = contenedor.nodo.querySelector('button.fc-prev-button');

  //boton izquierdo
  btnPrev.innerHTML= 'chevron_left';
  btnPrev.classList.add('btnPrev');
  btnPrev.classList.add('material-icons');
  btnPrev.classList.remove('fc-button');
  btnPrev.classList.remove('fc-state-default');
  btnPrev.classList.remove('fc-corner-left');
  btnPrev.classList.remove('fc-corner-right');


  btnPrev.onclick = function(){
    marcarDias();
  };

  //boton Derecho
  btnNext.innerHTML= 'chevron_right';
  btnNext.classList.add('btnNext');
  btnNext.classList.add('material-icons');
  btnNext.classList.remove('fc-button');
  btnNext.classList.remove('fc-state-default');
  btnNext.classList.remove('fc-corner-left');
  btnNext.classList.remove('fc-corner-right');

  btnNext.onclick = function(){
    marcarDias();
  };
}
function marcarDias(){
  var contenedor = UI.elementos.modalWindow.buscarUltimaCapaContenido().partes.cuerpo;
  var calendario = contenedor.nodo.querySelector('div[id="calendar"]');
  var diasZafra = contenedor.dias;
  var procesos = contenedor.procesos;
  diasZafra.forEach(function(dia){
    var diaCalendario = calendario.querySelector('td[data-date="'+dia.fecha_dia+'"].fc-day');
    for (var i = 0; i < procesos.length; i++) {
      if(dia.codigo_proceso_dia == procesos[i].codigo){
        //le agrego la clase del color en el espacio del proceso al igual que se hace en la leyenda
        if(diaCalendario){
          diaCalendario.classList.add(contenedor.colores[i]);
        }
      }
    }
    if(diaCalendario){
      //le agrego la clase al espacio donde esta el numero del dia en el calendario
      calendario.querySelector('td[data-date="'+dia.fecha_dia+'"].fc-day-number').classList.add('rh-activo');
      //le agrego el numero de dia de zafra al dia del calendario
      diaCalendario.classList.add('rh-activo');
      //creo el contenedor del dia
      var html = '<div diaZafra>'+dia.numero+'</div>';
      diaCalendario.innerHTML = html;
    }
  });
}
function armarLeyenda(){
  var pie = UI.elementos.modalWindow.buscarUltimaCapaContenido().partes.pie;
  var cuerpo = UI.elementos.modalWindow.buscarUltimaCapaContenido().partes.cuerpo;
  var procesos = cuerpo.procesos;
  var html = "";
  for (var i = 0; i < procesos.length; i++) {
    html += '<article class="'+cuerpo.colores[i]+' white">'+procesos[i].nombre.toLowerCase()+'</article>';
  }
  pie.nodo.innerHTML = html;
}
function armarListados(dia){
  var listArr = UI.buscarVentana('arrimada');
  var listCam = UI.buscarVentana('campo');
  calcularDiferencia(dia.codigo);
  listArr.atributos.carga.peticion.dia = dia.codigo;
  listArr.recargar();
  listCam.atributos.carga.peticion.dia = dia.codigo;
  listCam.recargar();
  UI.elementos.modalWindow.eliminarUltimaCapa();
}
