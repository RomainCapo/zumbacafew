export default class Helper {

  static replaceStringSpace(str, symbol = "_") {
    return str.replace(/\s+/g, symbol).replace("'",symbol);
  }

  static sexToFrench(sexLabel) {
    let french = ""
    switch (sexLabel) {
      case "Men":
        french = "Homme"
        break
      case "Woman":
        french = "Femme"
        break
      default:
        french = "Inconnu"
    }
    return french
  }

  static artistTypeToFrench(artistTypeLabel) {
    let french = ""
    switch (artistTypeLabel) {
      case "Individual":
        french = "Individuel"
        break
      case "Group":
        french = "Groupe"
        break
      default:
        french = "Inconnu"
    }
    return french
  }

  static criterionToFrench(criterion) {
    let french = ""
    switch (criterion) {
      case "gender":
        french = "Sexe"
        break
      case "year":
        french = "Année"
        break
      case "artist_type":
        french = "Type d'artiste"
        break
      default:
        french = "Inconnu"
    }
    return french
  }

  static criterionCompleteConversion(criterion){
    if(criterion){
      return "complete"
    }else {
      return "incomplete"
    }
  }

  static isCompleteToFrench(isComplete){
    let french = ""
    if(isComplete){
      french = "Oui"
    }else{
      french = "Non"
    }
    return french
  }

  static ceilYear(year) {
    let yearStr = year.toString()
    yearStr = yearStr.slice(0, -1) + "0"
    return parseInt(yearStr)
  }

  static round(number, decimal = 2) {
    let factor = Math.pow(10, decimal)
    return Math.round(number * factor) / factor
  }
}