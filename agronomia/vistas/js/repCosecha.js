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
        "data":{"dias":organizarDatosTransporte(respuesta.registros)}
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
  var peticion = UI.juntarObjetos({
     modulo: "agronomia",
     entidad: "reportesCosecha",
     reporte: 'ministerio'
  },UI.buscarVentana('formMinisterio').buscarSector('formMinisterio').formulario.captarValores());
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
      console.log(JSON.stringify(datos.data));
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
