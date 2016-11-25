var WidGraf = function(atributos){
  this.atributos = atributos;
  this.atributos.series = this.atributos.series || [];
  this.atributos.contenido = this.atributos.contenido || '';
  this.construirNodo();
};
WidGraf.prototype.construirNodo = function () {
  var nodo = document.createElement('div');
  nodo.setAttribute('wid-graf','');
  nodo.innerHTML = '<section id="'+this.atributos.nombre+'" graf-cont></section>'+
                   '<section wid-titulo-graf>'+this.atributos.titulo+'</section>';
  if(this.atributos.contenido.toLowerCase() === 'ancho'){
    nodo.classList.add('ancho');
  }
  this.nodo = nodo;
};
WidGraf.prototype.armarSerieBasicaTorta = function(nombre,data){
  nombre = nombre || 'predeterminada';
  var serie ={
    name: nombre,
    colorByPoint: true,
    data: []
  };
  data.forEach(function(each){
    var elemento = {
      name : each.nombre.toLowerCase(),
      color: '#'+each.color,
      y: parseFloat(each.valor)
    };
    if(each.seleccionado){
      elemento.sliced = true;
      selected= true;
    }
    serie.data.push(elemento);
  });
  this.atributos.series=serie ;
};
WidGraf.prototype.armarSerieBasicaColumna = function(nombre,data){
  var yo = this;
  nombre = nombre || 'predeterminada';
  data.forEach(function(each){
    var serie = {
      name:each.nombre.toLowerCase(),
      color: '#'+each.color,
      data:[parseFloat(each.valor)]
    };
    yo.atributos.series.push(serie);
  });
};
WidGraf.prototype.construirGrafPie = function (){
  var yo = this;
  $(function () {
    $('#'+yo.atributos.nombre).highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: yo.atributos.tipo
        },
        title: {
            text: ''
        },
        plotOptions: {
            pie: {
              dataLabels: {
                enabled: true,
                    format: '{point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
                        fontSize:'9px'
                      }
              },
              showInLegend: true,
              allowPointSelect: true,
              cursor: 'pointer'
            }
        },
        legend: {
              itemStyle: {
                 fontSize:'7px',
                 font: '7pt Trebuchet MS, Verdana, sans-serif',
                 color: '#A0A0A0'
              },
              itemHoverStyle: {
                 color: '#000'
              },
              itemHiddenStyle: {
                 color: '#444'
              }
        },
        series: [yo.atributos.series] 
    });
  });
};
WidGraf.prototype.construirGrafColumna = function() {
  var yo = this;
  $(function () {
     $('#'+yo.atributos.nombre).highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: ''
        },
        yAxis: {
            min: 0,
            title: {
                text: yo.atributos.nombre
            }
        },
        plotOptions: {
            series: {
                borderWidth: 0,
                dataLabels: {
                    enabled: true,
                    format: '{point.y:.3f}'
                }
            }
        },
        legend: {
              itemStyle: {
                 fontSize:'7px',
                 font: '7pt Trebuchet MS, Verdana, sans-serif',
                 color: '#A0A0A0'
              },
              itemHoverStyle: {
                 color: '#000'
              },
              itemHiddenStyle: {
                 color: '#444'
              }
        },
        series: yo.atributos.series
    });
  });
};
WidGraf.prototype.construirGrafLinea = function() {
  var yo = this;
  $(function () {
    $('#'+yo.atributos.nombre).highcharts({
         chart: {
            type: 'line'
        },
        title: {
            text: ''
        },
        xAxis: {
            categories: yo.atributos.categorias
        },
        yAxis: {
            title: {
                text: ''
            }
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true
                },
                enableMouseTracking: false
            }
        },
        legend: {
              itemStyle: {
                 fontSize:'7px',
                 font: '7pt Trebuchet MS, Verdana, sans-serif',
                 color: '#A0A0A0'
              },
              itemHoverStyle: {
                 color: '#000'
              },
              itemHiddenStyle: {
                 color: '#444'
              }
        },
        series: yo.atributos.series
    });
 });
};
