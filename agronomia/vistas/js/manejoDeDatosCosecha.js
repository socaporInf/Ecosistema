function organizarDatosMinisterio(fincas){
  var municipios = extraerMunicipios(fincas);
  var estados = extraerEstados(municipios);
  var calcularTotales = ['tacortada','tgzarea','tcanacosrealtotaltn','tartotalton'];
  municipios = agregarHijos(municipios,fincas,'codmunicipio',calcularTotales);
  estados = agregarHijos(estados,municipios,'codestado',calcularTotales);
  municipios.forEach(function(municipio){
    municipio.rdto = round((municipio.tartotalton * 100 / municipio.tcanacosrealtotaltn),2);
    municipio.tch = round((municipio.tcanacosrealtotaltn / municipio.tacortada),2);
  });
  estados.forEach(function(estado){
    estado.rdto = round((estado.tartotalton * 100 / estado.tcanacosrealtotaltn),2);
    estado.tch = round((estado.tcanacosrealtotaltn / estado.tacortada),2);
  });

  return estados;
}

function extraerMunicipios(datos){
  var municipios = [];
  datos.forEach(function(registro){
    var validado = false;
    municipios.forEach(function(municipio){
      if(registro.codmunicipio === municipio.codmunicipio){
        validado = true;
        return;
      }
    });


    if(!validado){
      municipios.push({
        codmunicipio: registro.codmunicipio,
        nommunicipio: registro.nommunicipio,
        codestado: registro.codestado,
        nomestado: registro.nomestado
      });
    }
  });
  return municipios;
}
function extraerEstados(datos){
  var estados = [];
  datos.forEach(function(registro){
    var validado = false;
    estados.forEach(function(estado){
      if(registro.codestado === estado.codestado){
        validado = true;
        return;
      }
    });
    if(!validado){
      estados.push({
        codestado: registro.codestado,
        nomestado: registro.nomestado
      });
    }
  });
  return estados;
}
function organizarDatosResumenFinca(tipo,datos){
  var fincas = extraerFincas(datos);
  var zonas = extraerZonas(datos);
  var sumatorias = ['tgzarea_sem','tgzareacana','tgztonestha','tgztotalest','tacortada','taporcortar','ceporcosechar',
                    'tcanacosesttotaltn','tcanacosesttotaltnha','tcanacosrealtotaltn','tcanacosrealtotaltnha','tartotalton',
                    'tartotaltonha'];
  //guardo las fincas dentro de las zonas
  if(tipo !== 'D'){
    zonas = agregarHijos(zonas,datos,'codzona',sumatorias);
  }else if(tipo === 'D'){
    fincas = agregarHijos(fincas,datos,'id_finca',sumatorias);
    zonas = agregarHijos(zonas,fincas,'codzona',sumatorias);
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
        return;
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
function agregarHijos(padres,hijos,campoCoparacion,propiedades){
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
