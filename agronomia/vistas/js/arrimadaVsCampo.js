function construirUI(){
  var layOut = {};
  //contruir titulo
  layOut.ventTitulo = UI.agregarVentana({
    tipo: 'titulo',
    nombre: 'tituloGeneral',
    titulo:{
      html: 'Arrimada vs Campo  <article diferencia><article>',
      tipo: 'liso'// liso o basico
    },
    clases : ['arrimada']
  },document.body.querySelector('div[contenedor]'));
  //contruir ventanas laterales
  layOut.pie = construirPie();
  layOut.latIzq = construirLat({
    lado: 'izq',
    titulo: 'Arrimada',
    selector: 'apagado',
    petLista:{
      modulo: "agronomia",
      entidad: "arrimadaVsCampo",
      operacion: "buscarValidacion",
      dia: UI.elementos.url.captarParametroPorNombre('Dia')
    },
    editable:false
  });
  layOut.latDer = construirLat({
    lado: 'der',
    titulo: 'Campo',
    selector: 'encendido',
    petLista:{
      modulo: "agronomia",
      entidad: "arrimadaVsCampo",
      operacion: "buscarValidacionRelacionada",
      dia: UI.elementos.url.captarParametroPorNombre('Dia')
    },
    editable:{
      celdas: [4]
    }
  });
  UI.elementos.layOut = layOut;
  rellenarTitulo(UI.elementos.url.captarParametroPorNombre('Dia'));
}
function construirLat(objCons){
  var lateral = UI.agregarVentana({
    nombre:'lat'+objCons.lado,
    clases: ['ventana','lat-'+objCons.lado],
    sectores:[{
      nombre:'list'+objCons.lado,
      html:''
    }]
  },document.body.querySelector('div[contenedor]'));

  var lista =   UI.agregarLista({
    titulo: objCons.titulo,
    nombre: objCons.titulo.toLowerCase(),
    clases: ['embebida','comprimida','inversa'],
    registrosPorPagina: 16,
    cabecera:{
      fija:true
    },
    selector:objCons.selector,
    onSelect:manejoBoton,
    onDeselect:manejoBoton,
    columnas: 8,
    editable:objCons.editable,
    carga: {
      uso:true,
      peticion:objCons.petLista,
      espera:{
        cuadro:{
          nombre: 'buscalista'+objCons.lado,
          mensaje: 'Buscando ...'
        }
      },
      respuesta: function(){
        lista.Slots.forEach(function(tupla){
          if (parseFloat(tupla.atributos['pesoneto/ton']) === 0.00) {
            tupla.nodo.setAttribute('diferente','');
          }
          var nodoCana = UI.buscarVentana('pie').buscarSector('total'+objCons.lado).nodo.querySelector('article[id="cana'+objCons.lado+'"]');
          var nodoAzu = UI.buscarVentana('pie').buscarSector('total'+objCons.lado).nodo.querySelector('article[id="azu'+objCons.lado+'"]');

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
  },UI.buscarVentana('lat'+objCons.lado).buscarSector('list'+objCons.lado).nodo);

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
                '<article total der>Total Ton. Caña</article>'+
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
function rellenarTitulo(codigo){
  UI.elementos.layOut.ventTitulo.nodo.querySelector('article[diferencia]').innerHTML = 'Calculando Diferencia General';
  var peticion = {
     modulo: "agronomia",
     entidad: "arrimadaVsCampo",
     operacion: "buscarDatosDia",
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
      UI.elementos.cabecera.nodo.innerHTML += '<article diaZafra>Dia: '+res.numero+' Fecha: '+res.fechadia+'</article>';
      UI.elementos.cabecera.funcionamientoBoton();
    }else{
      UI.elementos.layOut.ventTitulo.nodo.querySelector('article[diferencia]').innerHTML = '';
    }
  });
}
/*-----------------------------------------------Funcionamiento botones---------------------------------------*/
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
          cue +="<tr onclick='manejarTablon(this)'><td>" + falt.tablones[t].finca + "</td><td tablon>" + falt.tablones[t].codigo + "</td></tr>";
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

function armarListados(dia){
  var listArr = UI.buscarVentana('arrimada');
  var listCam = UI.buscarVentana('campo');
  rellenarTitulo(dia.codigo);
  listArr.atributos.carga.peticion.dia = dia.codigo;
  listArr.recargar();
  listCam.atributos.carga.peticion.dia = dia.codigo;
  listCam.recargar();
  UI.elementos.modalWindow.eliminarUltimaCapa();
}
/*-----------------------------------------funcionamiento lista---------------------------------------------------*/
function manejoBoton(slot){
  var lista = UI.buscarVentana('campo');
  if(lista.obtenerSeleccionado()){
    if(!UI.elementos.botonera.buscarBoton('editar')){
      UI.elementos.botonera.agregarBoton({
        tipo:'editar',
        clases: ['btnEditar','material-icons','mat-green500','white','md-18'],
        click: cambiarGrupal,
        contenido: 'edit_mode'
      });
    }
  }else{
     UI.elementos.botonera.quitarBoton('editar');
  }
}
function cambiarGrupal(){
    var ventana = UI.crearVentanaModal({
      tipo:'INFORMACION',
      cabecera:{
        html: 'Elija Tablon A Colocar'
      },
      cuerpo:{
        tipo:'nuevo',
        formulario: {
          campos:[
             {
              tipo : 'campoBusqueda',
              parametros : {
                titulo:'Finca',
                nombre:'id_finca',
                requerido:true,
                eslabon:'simple',
                peticion:{
                  entidad: 'finca',
                  operacion: 'buscarValidado',
                  modulo: 'agronomia'
                },
                onclickSlot: function(campo){
                  var campoDep = ventana.partes.cuerpo.formulario.buscarCampo('id_lote');
                  campoDep.atributos.peticion.id_finca = campo.captarValor();
                  campoDep.habilitar();
                  campoDep.limpiar();
                },
                cuadro: {nombre: 'listaFinca',mensaje: 'Cargando Fincas'}
              }
            },{
              tipo : 'campoBusqueda',
              parametros : {
                titulo:'Lote',
                nombre:'id_lote',
                requerido:true,
                eslabon:'simple',
                peticion:{
                  entidad: 'lote',
                  operacion: 'buscarHijos',
                  modulo: 'agronomia'
                },
                onclickSlot: function(campo){
                  var campoDep = ventana.partes.cuerpo.formulario.buscarCampo('id_tablon');
                  campoDep.atributos.peticion.id_lote = campo.captarValor();
                  campoDep.habilitar();
                  campoDep.limpiar();
                },
                cuadro: {nombre: 'listaLote',mensaje: 'Cargando Lotes'}
              }
            },{
              tipo : 'campoBusqueda',
              parametros : {
                titulo:'Tablon',
                nombre:'id_tablon',
                requerido:true,
                eslabon:'simple',
                peticion:{
                  entidad: 'tablon',
                  operacion: 'buscarValidado',
                  modulo: 'agronomia'
                },
                cuadro: {nombre: 'listaTablones',mensaje: 'Cargando Tablones'}
              }
            }
          ]
        }
      },
      pie:{
        clases:['botonera'],
        html:
            '<button type="button" class="icon material-icons green500">edit_Mode</button>'+
            '<button type="button" class="icon red500 md-24">close</button>'
      }
    });
  ventana.partes.cuerpo.formulario.buscarCampo('id_lote').deshabilitar();
  ventana.partes.cuerpo.formulario.buscarCampo('id_tablon').deshabilitar();
  ventana.partes.pie.nodo.querySelector('button.red500').onclick=function(){
    UI.elementos.modalWindow.eliminarUltimaCapa();
  };
  ventana.partes.pie.nodo.querySelector('button.green500').onclick=function(){
    var valor = ventana.partes.cuerpo.formulario.buscarCampo('id_tablon').captarValor();
    if(!valor){
      UI.agregarToasts({
        texto: 'Debe seleccionar un tablon antes de poder continuar',
        tipo: 'web-arriba-derecha-alto'
      });
    }else{
      var lista = UI.buscarVentana('campo');
      lista.Slots.forEach(function(slot){
        if(slot.selector.check.marcado){
          slot.buscarCelda('tablon').nodo.querySelector('span').textContent = valor;
          slot.selector.nodo.click();
        }
      });
      UI.elementos.modalWindow.eliminarUltimaCapa();
    }
  };
}

function manejarProductor(){
  var modal = UI.crearVentanaModal({
    contenido: 'ancho',
    cabecera:{
      html: 'Verificacion de Rif',
      clases:['verificacion']
    },
    cuerpo:{
      tipo:'nuevo',
      formulario: {
        campos:[UI.buscarConstructor('productor').campos[0]]
      },
    },
    pie:{
        html:'<button type="button" class="mat-text-but" ver>Verificar</button>'+
            '<button type="button" class="mat-text-but" reg>Registrar sin Rif</button>',
        clases:['operaciones']
    }
  });
  modal.nodo.querySelector('button[reg]').onclick = function(){
    registrar();
  };
  modal.nodo.querySelector('button[ver]').onclick = function(){
    verificar();
  };
}
function verificar() {
  var modal = UI.elementos.modalWindow.buscarUltimaCapaContenido();
  var rif =  modal.partes.cuerpo.formulario.buscarCampo('rif').captarValor();
  if(rif){
    var peticion = {
       modulo: "global",
       entidad: "organizacion",
       operacion: "buscarRegistro",
       codigo: rif
    };
    var cuadro = {
      contenedor: modal.partes.cuerpo.nodo,
      cuadro:{
        nombre: 'verificacionRif',
        mensaje: 'Verificando Rif en la Base de Datos'
      }
    };
    torque.manejarOperacion(peticion,cuadro).then(function(respuesta){
      cambiarFormularioProductor({
        tipo:'modificar',
        formulario:UI.buscarConstructor('productor')
      });
      var formulario = modal.partes.cuerpo.formulario;
      if(respuesta.success){
        formulario.asignarValores(respuesta.registros);
        formulario.deshabilitar();
        formulario.buscarCampo('codigo_productor').habilitar();
      }else{
        formulario.buscarCampo('rif').asignarValor(rif);
        formulario.buscarCampo('rif').deshabilitar();
      }

      modal.nodo.querySelector('button.icon-guardar-indigo-32').onclick = function(){
        if(modal.partes.cuerpo.formulario.validar()){
          var peticion = UI.juntarObjetos({
             modulo: "agronomia",
             entidad: "productor",
             operacion: "guardar"
          },formulario.captarValores());
          var cuadro={
            contenedor:modal.partes.cuerpo.nodo,
            cuadro:{
              nombre: 'guardarProductor',
              mensaje: 'Guardando Productor'
            }
          };
          torque.manejarOperacion(peticion,cuadro).then(function(respuesta){
            modal.convertirEnMensaje(respuesta.mensaje);
          });
        }else{
          UI.agregarToasts({
            texto: 'Rellene el campo para continuar',
            tipo: 'web-arriba-derecha'
          });
        }
      };
    });
  }else{
      UI.agregarToasts({
        texto: 'Rellene el campo para poder verificar',
        tipo: 'web-arriba-derecha-alto'
      });
  }
}
function registrar(){
    var modal = UI.elementos.modalWindow.buscarUltimaCapaContenido();

    cambiarFormularioProductor({
      tipo:'nuevo',
      formulario:{
        campos: [UI.buscarConstructor('productor').campos[1]]
      }
    });
    modal.nodo.querySelector('button.icon-guardar-indigo-32').onclick = function(){
      if(modal.partes.cuerpo.formulario.validar()){
        var peticion = {
           modulo: "agronomia",
           entidad: "productor",
           operacion: "guardarSinRif",
           codigo_productor: modal.partes.cuerpo.formulario.buscarCampo('codigo_productor').captarValor()
        };
        var cuadro={
          contenedor:modal.partes.cuerpo.nodo,
          cuadro:{
            nombre: 'guardarProductor',
            mensaje: 'Guardando Productor'
          }
        };
        torque.manejarOperacion(peticion,cuadro).then(function(respuesta){
          modal.convertirEnMensaje(respuesta.mensaje);
        });
      }else{
        UI.agregarToasts({
          texto: 'Rellene el campo para continuar',
          tipo: 'web-arriba-derecha'
        });
      }
    };
}
function cambiarFormularioProductor(cuerpo){
  var modal = UI.elementos.modalWindow.buscarUltimaCapaContenido();
  //cambios cabecera
  modal.partes.cabecera.nodo.classList.remove('verificacion');
  modal.partes.cabecera.nodo.innerHTML='Registrar Productor';

  //cambios cuerpo
  modal.partes.cuerpo.nodo.innerHTML="";
  modal.partes.cuerpo.agregarFormulario(cuerpo);

  //cambio pie
  modal.partes.pie.nodo.classList.remove('operaciones');
  modal.partes.pie.nodo.classList.add('botonera');
  modal.partes.pie.nodo.innerHTML='<button type="button" class="icon icon-guardar-indigo-32"> </button>'+
        '<button type="button" class="icon icon-cerrar-rojo-32"> </button>';

  //funcionamiento botones
  modal.nodo.querySelector('button.icon-cerrar-rojo-32').onclick = function(){
    UI.elementos.modalWindow.eliminarUltimaCapa();
  };
}
function manejar(modelo,nodo){
  var ventana = UI.crearVentanaModal({
        cabecera:{
            html: 'Registro de '+UI.buscarConstructor(modelo).titulo
        },
        cuerpo:{
            formulario: UI.buscarConstructor(modelo), //objeto constructor
            tipo: 'nuevo', //operacion a realizar,
        },
        pie:{
            clases:['botonera'],
            html: '<button type="button" class="icon icon-guardar-indigo-32"> </button>'+
                  '<button type="button" class="icon icon-cerrar-rojo-32"> </button>'
        }
    });
    ventana.partes.pie.nodo.querySelector('button.icon-cerrar-rojo-32').onclick=function(){
      UI.elementos.modalWindow.eliminarUltimaCapa();
    };
    if(nodo){
      ventana.partes.cuerpo.formulario.buscarCampo('codigo_tablon').asignarValor(nodo.querySelector('td['+modelo+']').textContent.trim());
    }
    ventana.partes.pie.nodo.querySelector('button.icon-guardar-indigo-32').onclick=function(){
      var formulario = ventana.partes.cuerpo.formulario;
      if(formulario.validar()){
        var peticion = UI.juntarObjetos({
           modulo: "agronomia",
           entidad: modelo,
           operacion: "guardar",
        },formulario.captarValores());
        var cuadro = {
          contenedor:ventana.partes.cuerpo.nodo,
          cuadro:{
            nombre: modelo,
            mensaje: 'Guardando Datos de '+modelo
          }
        };
        torque.manejarOperacion(peticion,cuadro).then(function(respuesta){
          ventana.convertirEnMensaje(respuesta.mensaje);
        });
      }else{
          UI.agregarToasts({
            texto: 'Rellene todos los campos para continuar',
            tipo: 'web-arriba-derecha-alto'
          });
      }
    };
}
function guardarCambios(){
  var campo = UI.buscarVentana('campo');
  var cambios = [];
  campo.Slots.forEach(function(slot){
    if(slot.buscarCelda('tablon').captarValor()!==slot.buscarCelda('tablon').atributos.valor.trim()){
      cambios.push({
        tablon:slot.buscarCelda('tablon').captarValor(),
        boleto:slot.buscarCelda('boleto').captarValor(),
        codigo_productor:slot.atributos.codcanicultor,
        letra:slot.atributos.letrafinca
      });
    }
  });
  if(cambios.length){

    var mensaje = UI.crearMensaje({
      nombre_tipo:'INFORMACION',
      titulo: 'Guardando',
      cuerpo:''
    });

    var peticion = {
       modulo: "agronomia",
       entidad: "arrimadaVsCampo",
       operacion: "guardarCambios",
       registros: JSON.stringify(cambios)
    };

    var cuadro = {
      contenedor: mensaje.partes.cuerpo.nodo,
      cuadro:{
        nombre: 'guardandoCampo',
        mensaje: 'Validando y Guardando cambios'
      }
    };
    torque.manejarOperacion(peticion,cuadro)
      .then(function(respuesta){
        if(respuesta.success){
          UI.buscarVentana('arrimada').recargar();
          UI.buscarVentana('campo').recargar();
          UI.agregarToasts({
            texto: 'Operacion Exitosa',
            tipo: 'web-arriba-derecha'
          });
          var html = '';
          console.log(respuesta);
          respuesta.datos.forEach(function(each){
            html+=each.mensaje;
          });
          mensaje.partes.cuerpo.nodo.innerHTML=html;
        }
      });
  }
}
