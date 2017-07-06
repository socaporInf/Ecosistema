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
  //nuevo reporte
  agregarForm(FechaCorte,'FechaCorte','Fecha de Corte',ejecutarFechaCorte);
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
    .then(generearCuadroSecundario)
    .then(function(respuesta){
      var datos = {};
      switch (UI.buscarVentana('formTransporte').buscarSector('formTransporte').formulario.buscarCampo('presentacion').captarValor()) {
        case 'P':
          //id de la plantilla del reporte dentro jsreport(servidor de reportes)
          datos.reporte = {"shortid":"H1KwwmTSl"};
          datos.data = {
            "dias" :organizarDatosTransporte(respuesta.registros)
          };
        break;

        case 'E':
        datos.reporte = {"shortid":"H1KwwmTSl"};
          datos.data = {
            "dias" :organizarDatosTransporte(respuesta.registros)
          };
          datos.ruta = '/agronomia/clases/rep_TransporteCana.php';
          datos.presentacion = 'E';
        break;
      }
      return datos;
    })
    .then(torque.pedirReporte)
    .then(done,error);
}
//-----------------------------------------------
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
    .then(generearCuadroSecundario)
    .then(function(respuesta){
      var datos = {};
      var data = organizarDatosMinisterio(respuesta.registros);
      switch (UI.buscarVentana('formMinisterio').buscarSector('formMinisterio').formulario.buscarCampo('presentacion').captarValor()) {
        case 'P':
            //id de la plantilla del reporte dentro jsreport(servidor de reportes)
            datos.reporte = {"shortid":"rkP2anaMe"};
            datos.data = {
             "estados" :data.estados,
             "zafra": respuesta.zafra,
             "zonas": data.zonas
           };
        break;

        case 'E':
          datos.data = {
           "estados" :data.estados,
           "zafra": respuesta.zafra,
           "zonas": data.zonas
          };
          datos.reporte = {"shortid":"rkP2anaMe"};
          datos.ruta = '/agronomia/clases/rep_ResumenMinisterio.php';
          datos.presentacion = 'E';
        break;
      }
      return datos;
    })
    .then(torque.pedirReporte)
    .then(done,error);
}

//-----------------------------------------------
function ejecutar(){
  var form = UI.buscarVentana('formResumenFinca').buscarSector('formResumenFinca').formulario;
  var ventanaCarga = UI.crearVentanaModal({
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
       presentacion: form.buscarCampo('presentacion').captarValor(),
       codigo_indicador_cana_diferida: form.buscarCampo('codigo_indicador_cana_diferida').captarValor(),
       cortadas: form.buscarCampo('cortadas').captarValor(),
       zafra: UI.elementos.cabecera.nodo.querySelector('article').getAttribute('codigo')
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
                datos.reporte = {"shortid":"HyP9xM2Ie"};
                datos.data = {
                  "total" :organizarDatosResumenFinca('T',respuesta.registros),
                  "zafra": respuesta.zafra
                };
                break;
              case 'R':
                //id de la plantilla del reporte dentro jsreport(servidor de reportes)
                datos.reporte = {"shortid":"BkUi3un-g"};
                datos.data = {
                  "total" :organizarDatosResumenFinca('R',respuesta.registros),
                  "zafra": respuesta.zafra
                };
                break;
              case 'D':
                //id de la plantilla del reporte dentro jsreport(servidor de reportes)
                datos.reporte = {"shortid":"BJUZmtQzg"};
                datos.data = {
                  "total" :organizarDatosResumenFinca('D',respuesta.registros),
                  "zafra": respuesta.zafra
                };
                break;
            }
            break;
            case 'E':
              datos.agrupacion = UI.buscarVentana('formResumenFinca').buscarSector('formResumenFinca').formulario.buscarCampo('agrupacion').captarValor();
              datos.reporte = {"shortid":"HJmzQumMx"};
              datos.data = {
                "zonas" :organizarDatosResumenFinca(datos.agrupacion,respuesta.registros),
                "zafra": respuesta.zafra
              };
              datos.ruta = '/agronomia/clases/rep_CosechaExcel.php';
              datos.presentacion = 'E';
              break;
        }
        return datos;
      })
      .then(torque.pedirReporte)
      .then(done,error);
}

//-----------------------------------------------
function ejecutarFechaCorte(){
  var form = UI.buscarVentana('formFechaCorte').buscarSector('formFechaCorte').formulario;
  var ventanaCarga = UI.crearVentanaModal({
      cabecera:{
        html: 'Fecha de Corte'
      },
      cuerpo:{html:''}
    });
    var peticion = {
       modulo: "agronomia",
       entidad: "reportesCosecha",
       reporte: "fechacorte",
       presentacion: form.buscarCampo('presentacion').captarValor(),
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
        switch (UI.buscarVentana('formFechaCorte').buscarSector('formFechaCorte').formulario.buscarCampo('presentacion').captarValor()) {
          case 'P':
              datos.reporte = {"shortid":"HyP9xM2Ie"};
              datos.data = {
                "total" :organizarDatosResumenFinca('T',respuesta.registros),
                "zafra": respuesta.zafra
              };
              break;

            case 'E':
              //datos.agrupacion = '';
              datos.data = { "datos" :respuesta.registros};
              datos.ruta = '/agronomia/clases/rep_Fecha_Corte.php';
              datos.presentacion = 'E';
              break;
        }
        return datos;
      })
      .then(torque.pedirReporte)
      .then(done,error);
}
