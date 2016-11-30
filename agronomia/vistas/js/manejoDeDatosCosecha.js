function organizarDatos(tipo,datos){
  var fincas = extraerFincas(datos);
  var zonas = extraerZonas(datos);
  //guardo las fincas dentro de las zonas
  if(tipo !== 'D'){
    zonas = agregarHijos(zonas,datos,'codzona');
  }
  if(tipo === 'D'){
    fincas = agregarHijos(fincas,datos,'id_finca');
    zonas = agregarHijos(zonas,fincas,'codzona');
    zonas.forEach(function(zona){
      zona.hijos.sort(function(a,b){return parseInt(a.codfinca) - parseInt(b.codfinca);});
    });
  }
  return zonas;
}
//extrae las fincas del crudo de data para agrupacioens
function extraerFincas(datos){
  var fincas = [];
  datos.forEach(function(each){
    var validado = false;
    fincas.forEach(function(finca){
      if(each.id_finca === finca.id_finca){
        validado = true;
      }
    });
    if(!validado){
      fincas.push({
        id_finca: each.id_finca,
        nomfinca: each.nomfinca,
        codfinca: each.codfinca,
        fincalet: each.fincalet,
        codzona: each.codzona
      });
    }
  });
  fincas.sort(function(a,b){
    return parseInt(a.codfinca) - parseInt(b.codfinca);
  });
  return fincas;
}
//extrae las zonas del crudo de data para agrupacioens
function extraerZonas(datos){
  var zonas = [];
  datos.forEach(function(each){
    var validado = false;
    zonas.forEach(function(zona){
      if(each.codzona === zona.codzona){
        validado = true;
      }
    });
    if(!validado){
      zonas.push({
        codzona: each.codzona,
        nomzona: each.nomzona
      });
    }
  });
  zonas.sort(function(a,b){
    return parseInt(a.codzona) - parseInt(b.codzona);
  });
  return zonas;
}
//agrupa hijos en padres y crea los totales
function agregarHijos(padres,hijos,campoCoparacion){
  var propiedades = ['tgzarea_sem','tgzareacana','tgztonestha','tgztotalest','tacortada','taporcortar','ceporcosechar',
                    'tcanacosesttotaltn','tcanacosesttotaltnha','tcanacosrealtotaltn','tcanacosrealtotaltnha','tartotalton',
                    'tartotaltonha'];
  padres.forEach(function(padre){
    hijos.forEach(function(hijo){
      if(padre[campoCoparacion] == hijo[campoCoparacion]){
        if(!padre.hijos){
          padre.hijos = [];
        }
        padre.hijos.push(hijo);
        propiedades.forEach(function(propiedad){
          padre[propiedad]=(!padre.hasOwnProperty(propiedad))?parseFloat(hijo[propiedad]):parseFloat(padre[propiedad]) + parseFloat(hijo[propiedad]);
        });
      }
    });
    propiedades.forEach(function(propiedad){
      padre[propiedad] = round(padre[propiedad],2);
    });
  });
  return padres;
}
//extraido de mozilla
round = function(number,places) {
  return +(Math.round(number + "e+" + places)  + "e-" + places);
};
