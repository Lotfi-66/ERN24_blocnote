import '../../assets/style.css'
import NoteService from '../Services/NoteService';
import Note from './Note';

class App {
  //on va définir nos propriétées 

  //********** Element du DOM ********** 
  elInputNewNoteTitle;//Champ pour le titre de la nouvelle note
  elInputNewNoteContent;//Champ pour le contenu de la nouvelle note
  elOlNoteList;// Liste ou les notes seront affichées

  // ******** Propriétés de fonctionnement ********
  noteService; //Service pour la gestion des notes
  arrNotas = []; //Tableau pour stocker les notes
  isEditMode = false; //Flag pour savoir si on est en mode édition
  
  start() {
    console.log('App started');
    //on va instancier notre service
    this.noteService = new NoteService();
    //appelle de la méthode qui construit l'interface graphique
    this.loadDom();
    
    //on recupère les notes depuis le localstorage
    const arrNotes = this.noteService.readStorage();
    
    //si aucun element on quitte
    if(arrNotes.length <= 0) return;
    
    //on va parcourir les notes pour les ajouter dans le tableau
    arrNotes.map((note)=>{
      this.arrNotas.push(new Note(note));
    })
    console.log('arNotas' ,this.arrNotas);

    //on va afficher les notes
    this.renderNotes();
  }

  //méthode pour créer l'interface graphique de l'application
  loadDom() {
    // creation de l'entete avec le titre de l'application
    const elHeader = document.createElement('header');
    elHeader.innerHTML = '<h1>Bloc Note</h1>';

    // creation du formulaire pour ajouter une nouvelle note
    const elForm = document.createElement('form');
    elForm.noValidate = true; //désactivation de la validation HTML5

    //creation du champ pour le titre de la note
    this.elInputNewNoteTitle = document.createElement('input');
    this.elInputNewNoteTitle.type = 'text';
    this.elInputNewNoteTitle.id = 'new-nota-title';
    this.elInputNewNoteTitle.placeholder = 'Titre';

    //creation du champ pour le contenu de la note
    this.elInputNewNoteContent = document.createElement('textarea');
    this.elInputNewNoteContent.id = 'new-nota-content';
    this.elInputNewNoteContent.placeholder = 'Contenu';

    //création du bouton pour ajouter une nouvelle note
    const elButtonNewNoteAdd = document.createElement('button');
    elButtonNewNoteAdd.type = 'button';
    elButtonNewNoteAdd.id = 'new-nota-add';
    elButtonNewNoteAdd.textContent = '➕';
    elButtonNewNoteAdd.addEventListener('click', this.handleNewNoteAdd.bind(this));

    //ajout des champs et du bouton dans le formulaire
    elForm.append(this.elInputNewNoteTitle, this.elInputNewNoteContent, elButtonNewNoteAdd);

    //création d'une section pour le bouton de suppression de toutes les notes
    const elDivClear = document.createElement('div');

    //creation du bouton pour supprimer les notes
    const elButtonClearAll = document.createElement('button');
    elButtonClearAll.type = 'button';
    elButtonClearAll.id = 'clear-all';
    elButtonClearAll.textContent = '🗑️';
    elButtonClearAll.addEventListener('click', () => { console.log('Suppression de toutes les notes') }); //TODO: Ajouter la méthode pour supprimer toutes les notes

    //ajout du bouton dans la section
    elDivClear.appendChild(elButtonClearAll);

    //ajout du formulaire et de la section dans l'entete
    elHeader.append(elForm, elDivClear);

    // création de la section principale de l'interface
    const elMain = document.createElement('main');

    //création de la liste ordonnée pour afficher les notes
    this.elOlNoteList = document.createElement('ol');
    this.elOlNoteList.id = 'nota-list';

    //ajout de la liste dans la section principale
    elMain.appendChild(this.elOlNoteList);

    //ajout de l'entete et de la section principale dans le body
    document.body.append(elHeader, elMain);
  }

  //méthode pour ajouter une note
  handleNewNoteAdd() {
    //on récupère les valeurs des champs de saisie
    const newTitle = this.elInputNewNoteTitle.value.trim();
    const newContent = this.elInputNewNoteContent.value.trim();
    const now = Date.now();

    //verification que les champs ne sont pas vides
    if (newTitle === '' && newContent === '') {
      alert('Veuillez remplir au moins un des champs');
    } else {
      //on va reconstruir un objet note
      const newNote = {
        title: newTitle == '' ? "Note sans titre" : newTitle,
        content: newContent == '' ? "Note sans contenu" : newContent,
        createdDate: now,
        updatedDate: now
      }

      //ajout de la note dans le tableau
      this.arrNotas.push(new Note(newNote));

      //on va sauvegarder les notes dans le localstorage
      this.noteService.saveStorage(this.arrNotas);

      //reinitialisation des champs de saisie
      this.elInputNewNoteTitle.value = '';
      this.elInputNewNoteContent.value = '';
      this.elInputNewNoteTitle.focus();

      //affichage des notes
      this.renderNotes();
    }
  }

  //affichage des notes
  renderNotes(){
    // on vide la liste ordonnée (ol) avant de la remplir
    this.elOlNoteList.innerHTML = '';

    //on tri nos notes par date de mise a jour (de la plus récente à la plus ancienne)
    this.arrNotas.sort((a,b)=> b.updatedDate - a.updatedDate);

    //affichage des notes dans la liste ordonnée
    for(let note of this.arrNotas){
      this.elOlNoteList.appendChild(note.getDom());
    }
    
  }

}

const app = new App();

export default app;