import moment from 'moment'
import {
    getFilters
} from './filters';
import {
    sortNotes,
    getNotes,
    removeNote
} from './notes'
// generate the dom structure for note
const generateNoteDOM = function (note) {
    const container = document.createElement("div");
    const noteEl = document.createElement("a");
    const textEl = document.createElement("p");
    const textElbody = document.createElement("p");
    const button = document.createElement("button");
    const status = document.createElement("p");
    // setup the remove button
    container.classList.add("note-cont");
    button.textContent = "X";
    button.classList.add("remove-btn");
    button.classList.add("button");
    container.appendChild(button);
    button.addEventListener("click", () => {
        removeNote(note.id);
        renderNotes();
    });
    //setup the note title text
    if (note.title.length > 0 && note.body.length > 0) {
        textEl.textContent = note.title;
        textElbody.textContent = note.body;
    } else {
        textEl.textContent = "Unnamed note";
        textElbody.textContent = "no description for note";
    }
    textEl.classList.add("list-item__title");
    textElbody.classList.add("list-item__body");

    noteEl.appendChild(textEl);
    noteEl.appendChild(textElbody);

    // setup the link
    noteEl.setAttribute("href", `/edit.html#${note.id}`);
    noteEl.classList.add("list-item");
    // setup the status message
    status.textContent = generateLastEdited(note.updatedAt);
    status.classList.add("list-item__subtitle");

    noteEl.appendChild(status);
    container.appendChild(noteEl);

    return container;
};

//Render app notes
const renderNotes = () => {
    const filters = getFilters()
    const notesEl = document.querySelector("#notes");
    const notes = sortNotes(filters.sortBy);
    const filteredNotes = notes.filter(note =>
        note.title.toLowerCase().includes(filters.searchText.toLowerCase())
    );
    notesEl.innerHTML = "";
    if (filteredNotes.length > 0) {
        filteredNotes.forEach(note => {
            const noteEl = generateNoteDOM(note);
            notesEl.appendChild(noteEl);
        });
    } else {
        const emptyMessage = document.createElement("p");
        emptyMessage.textContent = "no notes to be displayed!";
        emptyMessage.classList.add("empty-message");
        notesEl.appendChild(emptyMessage);
    }
};

// initialize edit page
const initializeEditPage = (noteId) => {
    const titleElement = document.querySelector('#note-title')
    const bodyElement = document.querySelector('#note-body')
    const dateElement = document.querySelector('#last-edited')

    const notes = getNotes()
    const note = notes.find(note => note.id === noteId)

    if (!note) {
        location.assign('/index.html')
    }
    titleElement.value = note.title
    bodyElement.value = note.body
    dateElement.textContent = generateLastEdited(note.updatedAt)

}
//generate the last edited message
const generateLastEdited = timestamp =>
    `Last edited: ${moment(timestamp).fromNow()}`;

export {
    generateNoteDOM,
    renderNotes,
    generateLastEdited,
    initializeEditPage
}