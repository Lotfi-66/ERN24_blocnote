const STORAGE_NAME = "notabene" //nom utilisé pour stocker les données dans le localstorage

class NoteService {
  //méthode pour récupérer les données du localstorage
  readStorage(){
    // tableau pour stocker les notes récupérer
    let arrNotas = [];
    //Récupération des données depuis le localstorage en utilisant le nom de la clé
    const serializedData = localStorage.getItem(STORAGE_NAME);

    //si aucune donnée n'est trouver, on retourne un tableau vide
    if(!serializedData) return arrNotas;

    //Tentative de parsing des données récupérées
    try {
      arrNotas = JSON.parse(serializedData);
    } catch (error) {
      // en cas d'erreur lors du parsing (données corrompues ou invalide)
      //on supprime les données du localstorage
      localStorage.removeItem(STORAGE_NAME);
    }

    return arrNotas;
  }

  //méthode pour sauvegarder les données dans le localstorage
  saveStorage(arrNotas){
    //convertir le tableau de données en string
    const serializedData = JSON.stringify(arrNotas);
    
    // Tentative de sauvegarde des données dans le localstorage
    try {
      localStorage.setItem(STORAGE_NAME, serializedData);
    } catch (error) {
      console.log('Erreur lors de l\'enregistrement ', error);
      return false; // flag pour dire que l'enregistrement a échoué
    }
  }
}

export default NoteService;