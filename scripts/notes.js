const notesModal = document.getElementById('notes-modal');
const noteTitle = document.getElementById('note-title');
const noteContent = document.getElementById('note-content');
const noteSearch = document.getElementById('note-search');
const noteFilter = document.getElementById('note-filter');
const noteInject = document.getElementById('note-inject');

let currentNoteId = null;


function openNotes() {
    notesModal.classList.remove('notes-hide');
    loadNotes();
}

function closeNotes() {
    saveNote();
    notesModal.classList.add('notes-hide');
}

async function saveNote() {
    let titleValue = noteTitle.value;
    let contentValue = noteContent.value;

    if (titleValue === '' && contentValue === '') {
        return;
    } else if (titleValue === '' && contentValue !== '') {
        titleValue = 'Untitled Note';
        if (!currentNoteId) {
            currentNoteId = "note_" + Date.now(); 
        }
        const dataToSave = {
        id: currentNoteId,
        title: titleValue,
        contentA: contentValue,
        date: new Date().toLocaleString()
        };
    
        try {
            await localforage.setItem(currentNoteId, dataToSave);
            console.log("Saved uniquely at " + dataToSave.date);
        } catch (err) {
            console.error("Save failed:", err);
        }
    } else if (titleValue !== '' && contentValue === '') {
        return;
    } else {
        if (!currentNoteId) {
            currentNoteId = "note_" + Date.now(); 
        }
        const dataToSave = {
        id: currentNoteId,
        title: titleValue,
        contentA: contentValue,
        date: new Date().toLocaleString()
        };
    
        try {
            await localforage.setItem(currentNoteId, dataToSave);
            console.log("Saved uniquely at " + dataToSave.date);
        } catch (err) {
            console.error("Save failed:", err);
        }
    }
    loadNotes();
}

setInterval(saveNote, 5000);

async function loadNotes() {
    const allKeys = await localforage.keys();
    if (allKeys.length === 0) return;
    noteInject.innerHTML = "";

    for (const key of allKeys) {
        const data = await localforage.getItem(key);

        const noteHTML = `
            <div class="card note-display">
                <div class="note-head">
                    <h2>${data.title}</h2>
                    <button onclick="deleteNote(event, '${key}')" class="delete-btn">Delete</button>
                </div>
                <button onclick="openSpecificNote('${key}')">
                    <i class="note-date">${data.date}</i>
                    <p class="note-content-display">${data.contentA}</p>
                </button>
            </div>
        `;
        noteInject.innerHTML += noteHTML;
    }
}

async function openSpecificNote(key) {
    const data = await localforage.getItem(key);

    if (data) {
        currentNoteId = key;
        noteTitle.value = data.title;
        noteContent.value = data.contentA;
        
        console.log("Opened note:", data.title);
    }
}

async function deleteNote(event, key) { // Added 'event' here
    event.stopPropagation();
    if (confirm("Are you sure?")) {
        await localforage.removeItem(key);
        // If the note being deleted is the one currently open, reset the editor
        if (currentNoteId === key) {
            startNewNote();
        }
        loadNotes();
    }
}

function startNewNote() {
    saveNote();
    currentNoteId = null; // Reset the ID
    noteTitle.value = '';
    noteContent.value = '';
}
