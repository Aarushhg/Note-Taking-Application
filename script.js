const addNoteButton = document.getElementById("add-note-btn");
const notesContainer = document.getElementById("notes-container");

// Array of colors for sticky notes
const colors = ['pink', 'yellow', 'blue', 'green', 'coral'];

// Require ipcRenderer from Electron
const { ipcRenderer } = require('electron');

// Function to create a new note
function createNote() {
    const note = document.createElement("div");
    note.classList.add("note");

    // Randomly select a color from the color array
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    note.setAttribute("data-color", randomColor); // Assign the random color to the note

    // Create a contenteditable div for rich text editing
    const noteText = document.createElement("div");
    noteText.classList.add("note-text");
    noteText.contentEditable = true;  // Make it editable like a rich-text area
    noteText.placeholder = "Add Note here"; // Placeholder text

    // Listen for input to hide the placeholder when user starts typing
    noteText.addEventListener("input", function() {
        if (noteText.innerText.trim().length > 0) {
            noteText.setAttribute('data-placeholder', ''); // Hide placeholder
        } else {
            noteText.setAttribute('data-placeholder', 'Add Note here'); // Show placeholder if text is empty
        }
    });

    // Adding a blur event to ensure the placeholder hides if there's text written
    noteText.addEventListener("blur", function() {
        if (noteText.innerText.trim().length === 0) {
            noteText.setAttribute('data-placeholder', 'Add Note here'); // Show placeholder if text is empty
        }
    });

    // Adding a toolbar for text formatting inside each note
    const toolbar = document.createElement("div");
    toolbar.id = "toolbar";

    // Bold Button
    const boldButton = document.createElement("button");
    boldButton.innerText = "B";
    boldButton.onclick = () => toggleBold(boldButton, noteText);

    // Italic Button
    const italicButton = document.createElement("button");
    italicButton.innerText = "I";
    italicButton.onclick = () => toggleItalic(italicButton, noteText);

    // Underline Button
    const underlineButton = document.createElement("button");
    underlineButton.innerText = "U";
    underlineButton.onclick = () => toggleUnderline(underlineButton, noteText);

    // Cut Button (Strikethrough)
    const cutButton = document.createElement("button");
    cutButton.innerText = "-";
    cutButton.onclick = () => toggleStrikethrough(cutButton, noteText);

    // Popout Button (NEW)
    const popoutButton = document.createElement("button");
    popoutButton.innerText = "📌";
    popoutButton.onclick = () => {
        ipcRenderer.send('popout-note', {
            content: noteText.innerHTML,
            color: randomColor
        });
    };

    toolbar.appendChild(boldButton);
    toolbar.appendChild(italicButton);
    toolbar.appendChild(underlineButton);
    toolbar.appendChild(cutButton);
    toolbar.appendChild(popoutButton);  // append popout button

    // Adding delete button
    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.onclick = () => note.remove();

    // Append toolbar, note text, and delete button to the note
    note.appendChild(toolbar);
    note.appendChild(noteText);
    note.appendChild(deleteButton);

    // Append the new note to the notes container
    notesContainer.appendChild(note);
}

// Toggle Bold Function
function toggleBold(button, noteText) {
    const isBold = noteText.style.fontWeight === 'bold';
    document.execCommand('bold');
    toggleButtonState(button, isBold);  // Toggle button pressed state
}

// Toggle Italic Function
function toggleItalic(button, noteText) {
    const isItalic = noteText.style.fontStyle === 'italic';
    document.execCommand('italic');
    toggleButtonState(button, isItalic);  // Toggle button pressed state
}

// Toggle Underline Function
function toggleUnderline(button, noteText) {
    const isUnderline = noteText.style.textDecoration === 'underline';
    document.execCommand('underline');
    toggleButtonState(button, isUnderline);  // Toggle button pressed state
}

// Toggle Strikethrough (Cut) Function
function toggleStrikethrough(button, noteText) {
    const isStrikethrough = noteText.style.textDecoration === 'line-through';
    document.execCommand('strikeThrough');
    toggleButtonState(button, isStrikethrough);  // Toggle button pressed state
}

// Function to toggle button state (pressed/unpressed)
function toggleButtonState(button, isActive) {
    if (isActive) {
        button.classList.remove('active');  // Unpress the button
    } else {
        button.classList.add('active');  // Press the button
    }
}

// Event listener to create a new note when the button is clicked
addNoteButton.addEventListener("click", createNote);
