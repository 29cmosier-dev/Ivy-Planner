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






















let timeTotal = 1500; // The "Full" time for the current mode
let timeLeft = 1500; 
let timerInterval = null;
let isBreakMode = false;
const FULL_DASH_ARRAY = 283;

// Elements
const modalLabel = document.getElementById('timer-label');
const toolbarText = document.getElementById('toolbar-timer-text');
const pathRemaining = document.getElementById('timer-path-remaining');
const sessionSlider = document.getElementById('session-slider');
const breakSlider = document.getElementById('break-slider');
const startBtn = document.getElementById('start-btn');
const totalDisplay = document.getElementById('total-time');
const breaks = document.getElementById('breaks');
const time = document.getElementById('time');

function updateDisplay() {
    let mins = Math.floor(timeLeft / 60);
    let secs = timeLeft % 60;
    let formattedTime = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

    modalLabel.innerText = formattedTime;
    
    // Toggle label based on mode
    toolbarText.innerText = isBreakMode ? `${formattedTime} Break` : `${formattedTime} Remaining`;

    // Ring Math
    const timeFraction = timeLeft / timeTotal;
    const dashoffset = (FULL_DASH_ARRAY * (1 - timeFraction));

    pathRemaining.style.strokeDashoffset = dashoffset;
}


// Slider Logic
// Add these listeners to your existing script
sessionSlider.oninput = () => {
    const val = parseInt(sessionSlider.value);
    // Only update the live timer if we are NOT in break mode
    if (!isBreakMode) {
        timeTotal = val * 60;
        timeLeft = timeTotal;
        updateDisplay();
    }
};

breakSlider.oninput = () => {
    const val = parseInt(breakSlider.value);
    // Only update the live timer if we ARE in break mode (like in your image)
    if (isBreakMode) {
        timeTotal = val * 60;
        timeLeft = timeTotal;
        updateDisplay();
    }
};


// Timer Logic
function toggleTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
        startBtn.innerHTML = '<i class="fa-solid fa-play"></i> Start';
    } else {
        startBtn.innerHTML = '<i class="fa-solid fa-pause"></i> Pause';
        timerInterval = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateDisplay();
            } else {
                handleSwitchMode();
            }
        }, 1000);
    }
}

function handleSwitchMode() {
    clearInterval(timerInterval);
    timerInterval = null;
    isBreakMode = !isBreakMode;
    
    // Set new totals based on sliders
    timeTotal = isBreakMode ? breakSlider.value * 60 : sessionSlider.value * 60;
    timeLeft = timeTotal;
    
    // Play Audio
    new Audio(`/uploads/audio/${document.getElementById('audio-select').value}`).play();
    
    alert(isBreakMode ? "Break Time!" : "Back to Work!");
    startBtn.innerHTML = '<i class="fa-solid fa-play"></i> Start';
    updateDisplay();
}

startBtn.onclick = toggleTimer;
document.getElementById('reset-btn').onclick = () => {
    clearInterval(timerInterval);
    timerInterval = null;
    isBreakMode = false;
    timeTotal = sessionSlider.value * 60;
    timeLeft = timeTotal;
    startBtn.innerHTML = '<i class="fa-solid fa-play"></i> Start';
    updateDisplay();
};

function updateTotal() {
    const totalMinutes = sessionSlider.value * breakSlider.value;
    const timeValue = sessionSlider.value;
    const breakValue = breakSlider.value;
    
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;

    // Formats output based on whether there are hours or just minutes
    if (hours > 0) {
        totalDisplay.textContent = `${hours}h ${mins}m`;
    } else {
        totalDisplay.textContent = `${mins}m`;
    }
    breaks.textContent = breakValue;
    time.textContent = `${timeValue}m`;
}

// Update whenever a slider is moved
sessionSlider.addEventListener('input', updateTotal);
breakSlider.addEventListener('input', updateTotal);

// Start initialized
updateDisplay();
