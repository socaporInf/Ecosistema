function construirUI(){
  var layOut = {};
  //contruir titulo
  layOut.ventTitulo = UI.agregarVentana({
    tipo: 'titulo',
    nombre: 'tituloGeneral',
    titulo:{
      html: 'Arrimada vs Campo <article diferencia>Diferencia General en Toneladas: </article>',
      tipo: 'basico'// liso o basico
    },
    clases : ['arrimada']
  },document.body.querySelector('div[contenedor]'));
  //contruir ventanas laterales
  layOut.pie = construirPie();
  layOut.latIzq = construirLat('izq','Arrimada',{
     modulo: "agronomia",
     entidad: "arrimadaVsCampo",
     operacion: "buscarValidacion"
  });
  layOut.latDer = construirLat('der','Campo',{
     modulo: "agronomia",
     entidad: "arrimadaVsCampo",
     operacion: "buscarValidacionRelacionada"
  });
  UI.elementos.layOut = layOut;
  calcularDiferencia();
}
function construirLat(lado,titulo,petLista){
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
    clases: ['embebida','comprimida'],
    registrosPorPagina: 16,
    cabecera:{
      fija:true
    },
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
function calcularDiferencia(){
  var peticion = {
     modulo: "agronomia",
     entidad: "arrimadaVsCampo",
     operacion: "diferencia"
  };
}
