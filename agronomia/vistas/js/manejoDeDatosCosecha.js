function organizarDatosMinisterio(municipios){
  var estados = extraerEstados(municipios);
  var calcularTotales = ['area','peso','azucar'];
  estados = agregarHijos(estados,municipios,'codestado',calcularTotales);
  municipios.forEach(function(municipio){
    municipio.rdto = round((municipio.azucar * 100 / municipio.peso),2);
    municipio.tch = round((municipio.peso / municipio.area),2);
  });
  estados.forEach(function(estado){
    estado.rdto = round((estado.azucar * 100 / estado.peso),2);
    estado.tch = round((estado.peso / estado.area),2);
  });

  return estados;
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
function extraerDias(datos){
  var dias = [];
  datos.forEach(function(registro){
    var validado = false;
    dias.forEach(function(dia){
      if(registro.fechadia === dia.fechadia){
        validado = true;
        return;
      }
    });
    if(!validado){
      dias.push({
        fechadia: registro.fechadia
      });
    }
  });
  return dias;
}
function organizarDatosTransporte(datos){
  var dias = extraerDias(datos);
  var sumatorias = ['camion','chuto','batea','remolque','sin_identificar','toneladas'];
  dias = agregarHijos(dias,datos,'fechadia',sumatorias);
  return dias;
}
/*------------------------------------------------------------------------------------------------------------------*/
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
  var total={};
  total = sumatoriaGeneral(total,zonas,sumatorias);
  total.zonas = zonas;
  return total;
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
        padre = sumatoria(padre,hijo,propiedades);
      }
    });
    propiedades.forEach(function(propiedad){
      padre[propiedad] = round(padre[propiedad],2);
    });
  });
  return padres;
}
function sumatoriaGeneral(padre,hijos,propiedades){
  hijos.forEach(function(hijo){
    padre = sumatoria(padre,hijo,propiedades);
  });
  return padre;
}
function sumatoria(padre,hijo,propiedades){
  propiedades.forEach(function(propiedad){
    padre[propiedad]=(!padre.hasOwnProperty(propiedad))?parseFloat(hijo[propiedad]):round(parseFloat(padre[propiedad]) + parseFloat(hijo[propiedad]),2);
  });
  return padre;
}
//extraido de mozilla
round = function(number,places) {
  return +(Math.round(number + "e+" + places)  + "e-" + places);
};
/*----------------------------------------------------------- Reporte Luidaciones-------------------------------------------------------------------*/
function organizarLiquidaciones(datos){
  var liquidaciones = datos.liquidaciones;
  var detalle = datos.detalle;
  liquidaciones.forEach(function(liquidacion){
    liquidacion.deducciones=[];
    liquidacion.asignaciones=[];
    liquidacion.total=0;
    liquidacion.subtotal=0;
    detalle.forEach(function(concepto){
      if(concepto.codigo_liquidacion===liquidacion.codigo_liquidacion){
        if(concepto.comportamiento==='A'){
          liquidacion.asignaciones.push(concepto);
          liquidacion.total += parseFloat(concepto.tot_con_iva);
        }else if(concepto.comportamiento==='D'){
          liquidacion.deducciones.push(concepto);
          liquidacion.total -= parseFloat(concepto.tot_con_iva);
          liquidacion.subtotal -= parseFloat(concepto.tot_con_iva);
        }
      }
    });
  });
  liquidaciones = liquidaciones.map(organizarLiquidacion);
  return liquidaciones;
}
function extraerDetalle(detalle){
  var nucleos=extraerNucleos(detalle);
  var sumatorias=["subtotal","tot_con_iva"];
  nucleos = agregarHijos(nucleos,detalle,'codigo_nucleo',sumatorias);
  return nucleos;
}
function organizarLiquidacion(liquidacion){
  var nucleos = extraerDetalle(liquidacion.deducciones);
  liquidacion.deducciones=nucleos;
  return liquidacion;
}
function extraerNucleos(detalle){
  var nucleos = [];
  detalle.forEach(function(each){
    var validado = false;
    nucleos.forEach(function(nucleo){
      if(each.codigo_nucleo === nucleo.codigo_nucleo){
        validado = true;
      }
    });
    if(!validado){
      nucleos.push({
        codigo_nucleo: each.codigo_nucleo,
        nombre_nucleo: each.nombre_nucleo,
        comportamiento: each.comportamiento
      });
    }
  });
  nucleos.sort(function(a,b){
    return parseInt(a.codigo_nucleo) - parseInt(b.codigo_nucleo);
  });
  return nucleos;
}
