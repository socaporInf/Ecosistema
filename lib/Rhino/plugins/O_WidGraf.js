var WidGraf = function(atributos){
  this.atributos = atributos;
  this.atributos.series = this.atributos.series || {};
};
WidGraf.prototype.connstruirNodo = function () {
  var nodo = document.createElement('div');
  nodo.setAtributte('wid-graf');
  nodo.innerHTML = '<section id="'+this.atributos.nombre+'" graf-cont></section>'+
                   '<section wid-titulo-graf>'+this.atributos.titulo+'</section>';
  this.nodo = nodo;
};
WidGraf.prototype.armarSerieBasicaTorta = function(data){
  /*ejemplo serie
    {
      name: 'Brands',
      colorByPoint: true,
      data: [
        //ejemplo data:{name: 'Microsoft',y: 56.33,color: '#ffc107',sliced: true,selected: true}
      ]
  }*/
  var serie ={
    name: 'predeteminada',
    colorByPoint: true,
    data: []
  };
  data.forEach(function(each){
    var elemento = {
      name : each.nombre,
      color: each.color,
      y: each.valor
    };
    if(each.seleccionado){
      elemento.sliced = true;
      selected= true;
    }
    serie.data.push(elemento);
  });
  return serie;
};
WidGraf.prototype.construirGraf = function (){
  $(function () {
    $('#'+this.atributos.nombre).highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: this.atributos.tipo
        },
        title: {
            text: ''
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
            }
        },
        series: [this.atributos.series]
    });
  });
};
