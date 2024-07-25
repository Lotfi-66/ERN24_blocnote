import app from "./App.js"
const MODE_VIEW = 'view'; //mode de visualisation des notes
const MODE_EDIT = 'edit'; //mode d'édition d'une note

class Note {
  title; //titre de la note
  content; //contenu de la note
  createdDate; //date de création de la note
  updatedDate; //date de mise à jour de la note

  constructor(noteObj) {
    this.title = noteObj.title;
    this.content = noteObj.content;
    this.createdDate = noteObj.createdDate;
    this.updatedDate = noteObj.updatedDate;
  }

  //méthode qui construit l'interface graphique d'une note
  getDom() {
    const elLi = document.createElement('li');//création de l'element li pour aller dans son ol parent
    elLi.className = 'nota';
    elLi.dataset.mode = MODE_VIEW; //initialisation du mode de visualisation

    //on converti les timestamps en date formatée
    let dateCreate = new Date(this.createdDate);
    let dateUpdate = new Date(this.updatedDate);

    //construction du contenu HTML de la note
    let innerDom = '<div class="note-header">';
    innerDom += '<div class="nota-times">';
    innerDom += `<strong>Création:</strong> ${dateCreate.toLocaleString()}<br>`;
    innerDom += `<strong>Modifié:</strong> ${dateUpdate.toLocaleString()}`;
    innerDom += '</div><div class="nota-cmd">';
    innerDom += '<div data-cmd="view">';
    innerDom += '<button type="button" data-role="edit" >✏️</button>'; //bouton pour editer
    innerDom += '<button type="button" data-role="delete" >🗑️</button>'; //bouton pour supprimer
    innerDom += '</div><div data-cmd="edit">';
    innerDom += '<button type="button" data-role="save" >💾</button>'; //bouton pour sauver
    innerDom += '<button type="button" data-role="cancel" >❌</button>'; //bouton pour annuler
    innerDom += '</div></div></div>';
    innerDom += `<div class="nota-title">${this.title}</div>`;//titre de la note
    innerDom += `<div class="nota-content">${this.content}</div>`;//contenu de la note

    //ajout du contenu HTML dans l'element li
    elLi.innerHTML = innerDom;
    elLi.addEventListener('click', this.handleClick.bind(this));
    return elLi;

  }
  //gestionnaire d'evenement pour les actions des boutons de la note
  handleClick(evt) {
    const elLi = evt.currentTarget;// recupérer l'element li spécifique cliqué
    const elBtn = evt.target; //recupérer l'element button spécifique cliqué
    const elTitle = elLi.querySelector('.nota-title');//recupérer l'element contenant le titre
    const elContent = elLi.querySelector('.nota-content');//recupérer l'element contenant le contenu
    const idxLi = Array.from(elLi.parentElement.children).indexOf(elLi); //recupérer l'index de l'element li dans le tableau
    const objNote = app.arrNotas[idxLi]; //recupérer l'objet note correspondant à l'element li
    console.log(elTitle);

    //on vérifie que les données sont cohérentes avant de continuer
    if (!app.isEditMode && elTitle.textContent !== objNote.title) return;

    //gestion des actions des différentys boutons en fonction de leur roles
    switch (elBtn.dataset.role) {
      case 'edit':
        //si on est deja en mode edition, on ignore l'action
        if (app.isEditMode) return;
        //on passe en mode edition
        app.isEditMode = true;
        elLi.dataset.mode = MODE_EDIT; // MAJ du mode de l'element li
        //rendre les elements titre et content modifiables
        elTitle.contentEditable = elContent.contentEditable = true;
        break;

      case 'delete':
        // si en mode edition, on ignore l'action
        if (app.isEditMode) return;
        //Suppression de la note du tableau
        app.arrNotas.splice(idxLi, 1);
        //sauvegarde du tableau dans le localstorage
        app.noteService.saveStorage(app.arrNotas);
        //mise à jour de l'interface graphique
        app.renderNotes();//TODO : à implémenter
        break;

      case 'save':
        //si on est pas en mode edition, on ignore l'action
        if (!app.isEditMode) return;
        //mise a jour des données de la note
        objNote.title = elTitle.textContent;
        objNote.content = elContent.textContent;
        objNote.updatedDate = Date.now();

        //sauvegarde et mise a jour du localstorage
        app.noteService.saveStorage(app.arrNotas);
        //remise en mode visualisation
        app.isEditMode = false;
        //mise a jour de l'interface graphique
        app.renderNotes();//TODO : à implémenter
        break;

      case 'cancel':
        //si on est pas en mode edition on ignore l'action
        if (!app.isEditMode) return;
        //passage en mode visualisation
        app.isEditMode = false;
        elLi.dataset.mode = MODE_VIEW; // MAJ du mode de l'element li
        //on regenere l'interface graphique
        app.renderNotes();//TODO : à implémenter
        break;
      default:
        return;
    }
  }
}

export default Note;