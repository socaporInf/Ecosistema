function total(semilla, cana) {
    return round(parseFloat(semilla) + parseFloat(cana),2);
}
round = function(number,places) {
  return +(Math.round(number + "e+" + places)  + "e-" + places);
};