const calcBtn = document.getElementById("calc");
const timerBtn = document.getElementById("timer");
const calcModal = document.getElementById("calc-modal");
const timerModal = document.getElementById("timer-modal");

// --- 1. Load saved positions on startup ---
window.addEventListener("load", () => {
    const savedPositions = JSON.parse(localStorage.getItem("modalPositions")) || {};
    Object.keys(savedPositions).forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.style.left = savedPositions[id].x;
            el.style.top = savedPositions[id].y;
        }
    });
});

// --- 2. Toggle and Move to Cursor ---
function toggleModal(modal, event) {
    if (modal.style.display === "block") {
        modal.style.display = "none";
    } else {
        modal.style.display = "block";
        modal.style.left = `${event.clientX}px`;
        modal.style.top = `${event.clientY}px`;
        savePosition(modal.id, event.clientX + 'px', event.clientY + 'px');
    }
}

calcBtn.addEventListener("click", (e) => toggleModal(calcModal, e));
timerBtn.addEventListener("click", (e) => toggleModal(timerModal, e));

// --- 3. Draggable Logic with Saving ---
const dragButtons = document.getElementsByClassName("drag-handle");

let activeElement = null;
let offsetX, offsetY;

Array.from(dragButtons).forEach((button) => {
    button.addEventListener("mousedown", (e) => {
        e.preventDefault(); 
        
        activeElement = button.closest(".modal-card");
        offsetX = e.clientX - activeElement.offsetLeft;
        offsetY = e.clientY - activeElement.offsetTop;
        activeElement.style.cursor = "grabbing";
    });
});

document.addEventListener("mousemove", (e) => {
    if (!activeElement) return;
    
    const x = `${e.clientX - offsetX}px`;
    const y = `${e.clientY - offsetY}px`;
    activeElement.style.left = x;
    activeElement.style.top = y;
  });

document.addEventListener("mouseup", () => {
    if (activeElement) {
        activeElement.style.cursor = "grab";
        activeElement = null;
    }
});

const overlay = document.getElementById('breathe-overlay');
const circle = document.getElementById('breathe-circle');
const label = document.getElementById('breathe-text');
let breatheInterval;

function openBreathe() {
    overlay.style.display = 'flex';
    label.innerText = "Get Ready!";
    setTimeout(() => {
        runCycle();
        breatheInterval = setInterval(runCycle, 4000);
        }, 1000);
}

function runCycle() {
    if (circle.style.transform === 'scale(2.5)') {
        circle.style.transform = 'scale(1)';
        label.innerText = "Exhale...";
    } else {
        circle.style.transform = 'scale(2.5)';
        label.innerText = "Inhale...";
    }
}

function closeBreathe() {
    overlay.style.display = 'none';
    clearInterval(breatheInterval);
}
