function construirUI(){
  var peticion = {
     modulo: "agronomia",
     entidad: "zafra",
     operacion: "buscarActivo"
  };
  torque.Operacion(peticion).then(function(res){
    UI.elementos.cabecera.agregarHTML('<article Zafra codigo="'+res.registro.codigo+'">Zafra: '+res.registro.nombre+'</article>');
  });
  //form resumen finca
  agregarForm(form,'ResumenFinca','Resumen Finca',ejecutar);
  //form Ministerio
  agregarForm(Ministerio,'Ministerio','Resumen Ministerio',ejecutarMinisterio);
  //form transporte
  agregarForm(Transporte,'Transporte','Transporte Caña',ejecutarTrans);
}
function agregarForm(formulario,nombre,titulo,ejecutarReporte){
  var form = UI.agregarVentana({
    nombre:'form'+nombre,
    tipo: 'ventana',
    clases: ['form-rep'],
    titulo: {
      tipo:'inverso',
      html:titulo
    },
    sectores:[
      {
        nombre:'form'+nombre,
        tipo: 'nuevo',
        formulario: formulario
      },{
        nombre:'operaciones',
        html: '<button class="mat-text-but" ejecutar>Generar Reporte</button>'+
              '<button class="mat-text-but" limpiar>Limpiar</button>'
      }
    ]
  },document.body.querySelector('div[contenedor]'));
  if(sesion.privilegioActivo.buscarOperacion('ejecutar')){
    form.buscarSector('operaciones').nodo.querySelector('button[ejecutar]').onclick= function(){
      ejecutarReporte();
    };
  }
}
function ejecutarTrans(){
  var ventanaCarga = UI.crearVentanaModal({
    cabecera:{
      html: 'Transporte Caña'
    },
    cuerpo:{html:''}
  });
  var peticion = UI.juntarObjetos({
     modulo: "agronomia",
     entidad: "reportesCosecha",
     reporte: "transporte",
     zafra: UI.elementos.cabecera.nodo.querySelector('article').getAttribute('codigo')
  },UI.buscarVentana('formTransporte').buscarSector('formTransporte').formulario.captarValores());
  var cuadro = {
    contenedor: ventanaCarga.partes.cuerpo.nodo,
    cuadro: {
      nombre: 'cargarReporteTransporte',
      mensaje: 'Cargando Datos',
    }
  };
  torque.manejarOperacion(peticion,cuadro)
    .then(function(respuesta){
      generearCuadroSecundario();
      //id de la plantilla del reporte dentro jsreport(servidor de reportes)
      var datos = {
        reporte:{"shortid":"H1KwwmTSl"},
        "data":organizarDatosTransporte(respuesta.registros)
      };
      return datos;
    })
    .then(torque.pedirReporte)
    .then(done,error);
}
function ejecutarMinisterio(){
  var ventanaCarga = UI.crearVentanaModal({
    cabecera:{
      html: 'Resumen Ministerio'
    },
    cuerpo:{html:''}
  });
  var peticion = {
     modulo: "agronomia",
     entidad: "reportesCosecha",
     reporte: 'ministerio',
     municipio: UI.buscarVentana('formMinisterio').buscarSector('formMinisterio').formulario.buscarCampo('municipio').captarValor(),
     zafra: UI.elementos.cabecera.nodo.querySelector('article').getAttribute('codigo')
  };
  var cuadro = {
    contenedor: ventanaCarga.partes.cuerpo.nodo,
    cuadro: {
      nombre: 'cargarReporteMinisterio',
      mensaje: 'Cargando Datos'
    }
  };
  torque.manejarOperacion(peticion,cuadro)
    .then(function(respuesta){
      generearCuadroSecundario();
      //id de la plantilla del reporte dentro jsreport(servidor de reportes)
      var datos = {
        reporte: {"shortid":"rkP2anaMe"},
        data: {
         "estados" :organizarDatosMinisterio(respuesta.registros),
         "zafra": respuesta.zafra
        }
      };
      return datos;
    })
    .then(torque.pedirReporte)
    .then(done,error);
}
function ejecutar(){
  var form = UI.buscarVentana('formResumenFinca').buscarSector('formResumenFinca').formulario;
  if(form.buscarCampo('presentacion').captarValor()==='E'){
    UI.crearMensaje({
      titulo:'Presentacion no disponible',
      cuerpo:'La presentacion de este reporte en Hoja de calculo(Excel) esta en estos momentos en construccion',
      nombre_tipo:'ADVERTENCIA'
    });
  }else{  var ventanaCarga = UI.crearVentanaModal({
      cabecera:{
        html: 'Resumen Finca'
      },
      cuerpo:{html:''}
    });
    var peticion = {
       modulo: "agronomia",
       entidad: "reportesCosecha",
       reporte: "resumenFinca",
       zona: form.buscarCampo("zona").captarValor(),
       finca: form.buscarCampo('finca').captarValor(),
       tipo: form.buscarCampo('agrupacion').captarValor(),
       municipio: form.buscarCampo('municipio').captarValor(),
       presentacion: form.buscarCampo('presentacion').captarValor()
    };
    var cuadro={
      contenedor: ventanaCarga.partes.cuerpo.nodo,
      cuadro:{
        nombre: 'carga reporte',
        mensaje: 'Cargando Datos'
      }
    };
    torque.manejarOperacion(peticion,cuadro)
      .then(generearCuadroSecundario)
      .then(function(respuesta){
        var datos = {};
        switch (UI.buscarVentana('formResumenFinca').buscarSector('formResumenFinca').formulario.buscarCampo('presentacion').captarValor()) {
          case 'P':
            switch (UI.buscarVentana('formResumenFinca').buscarSector('formResumenFinca').formulario.buscarCampo('agrupacion').captarValor()){
              case 'T':
                datos.reporte = {"shortid":"r1NEEf7Mg"};
                datos.data = { "zonas" :organizarDatosResumenFinca('T',respuesta.registros)};
                break;
              case 'R':
                //id de la plantilla del reporte dentro jsreport(servidor de reportes)
                datos.reporte = {"shortid":"BkUi3un-g"};
                datos.data = { "zonas" :organizarDatosResumenFinca('R',respuesta.registros)};
                break;
              case 'D':
                //id de la plantilla del reporte dentro jsreport(servidor de reportes)
                datos.reporte = {"shortid":"BJUZmtQzg"};
                datos.data = { "zonas" :organizarDatosResumenFinca('D',respuesta.registros)};
                break;
            }
            break;
            case 'E':

              datos.reporte = {"shortid":"HJmzQumMx"};
              datos.data = { "zonas" :organizarDatosResumenFinca('R',respuesta.registros)};
              datos.presentacion = 'E';
              break;
        }
        return datos;
      })
      .then(torque.pedirReporte)
      .then(done,error);
  }
}
function generearCuadroSecundario(respuesta){
  var contenedor = UI.elementos.modalWindow.buscarUltimaCapaContenido().partes.cuerpo.nodo;
  //------------Cuadro Carga-------------------------------
    cuadroCarga.contenedor.innerHTML='';
    var cuadroDeCarga = UI.crearCuadroDeCarga({
      nombre:'cargandoPDF1',
      mensaje:'Generando Archivo'
    },contenedor);
    cuadroDeCarga.style.marginTop = '80px';
  //-----------------------------------------------------------
  return respuesta;
}
var done = function(file){
  if(file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"){
    var vinculo = document.createElement('a');
    vinculo.href = window.URL.createObjectURL(file);
    vinculo.click();
    UI.elementos.modalWindow.eliminarUltimaCapa();
  }else if(file.type === 'application/pdf'){
    //cierro cuadro carga secundario
    UI.buscarCuadroCarga('cargandoPDF1').terminarCarga();
    //incrustar pdf en aplicacion
    var iframe = document.createElement('iframe');
    iframe.type = 'application/pdf';
    var enlace = window.URL.createObjectURL(file);
    iframe.src = enlace;
    var capa = UI.elementos.modalWindow.buscarUltimaCapaContenido();
    capa.nodo.classList.add('iframe');
    capa.nodo.classList.add('top');
    capa.nodo.classList.add("completo");
    capa.partes.cuerpo.nodo.appendChild(iframe);
    //agregar boton de cierre
    capa.partes.cabecera.agregarBotonCerrar();
  }
};
//callback si existe algun error
var error = function(error){
  console.log(error);
  var capa = UI.elementos.modalWindow.buscarUltimaCapaContenido();
  capa.convertirEnMensaje({
    titulo: 'Error en Carga de Reporte',
    cuerpo: 'Se ha sucitado un error en el momento de la generacion del reporte, intente de nuevo mas tarde',
    nombre_tipo:'ERROR'
  });
};
