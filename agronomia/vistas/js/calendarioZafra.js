function manejarDia(ventanaDia,diaClick){
  //calendario
  var pet = {
    modulo:'agronomia',
    entidad:'arrimadaVsCampo',
    operacion: 'buscarDatosCalendario'
  };
  var cuadro = {
    contenedor: ventanaDia.nodo.querySelector('div[id="calendar"]'),

    cuadro: {
      nombre: 'buscar dias Calendario',
      mensaje: 'buscando dias disponibles'
    }
  };
  torque.manejarOperacion(pet,cuadro,function(res){
    var contenedor = ventanaDia.cuerpo;
    //guardo los dias para que me queden disponibles cuando los necesite
    contenedor.dias = res.dias;
    //guardo los colores para la leyenda
    contenedor.colores = ['mat-amber500','mat-lightblue500','mat-indigo500','mat-green500'];
    //guardo los procesos para que me queden disponibles cuando los necesite
    contenedor.procesos = res.procesos;
    cargarCalendario(res.dias[0],diaClick,ventanaDia);
    armarLeyenda(ventanaDia);
    marcarDias(ventanaDia);
  });
}

/*----------------------------------------------Calendario -------------------------------------------------------*/
function cargarCalendario(dia,diaClick,ventanaDia){
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
      diaClick(date);
    }
  });
  var contenedor = ventanaDia.cuerpo;
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
    marcarDias(ventanaDia);
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
    marcarDias(ventanaDia);
  };
}
function marcarDias(ventanaDia){
  var contenedor = ventanaDia.cuerpo;
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
function armarLeyenda(ventanaDia){
  var pie = ventanaDia.pie;
  var cuerpo = ventanaDia.cuerpo;
  var procesos = cuerpo.procesos;
  var html = "";
  for (var i = 0; i < procesos.length; i++) {
    html += '<article contenido="'+procesos[i].nombre.toLowerCase()+'" class="tooltip '+cuerpo.colores[i]+' white"></article>';
  }
  pie.nodo.innerHTML = html;
}
