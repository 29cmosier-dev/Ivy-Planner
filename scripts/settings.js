const settingsModal = document.getElementById('settings-modal');
const accentColorPicker = document.getElementById('accent-color-picker');
const accentColorDisplay = document.getElementById('accent-color-display');
const root = document.documentElement;
const backgroundImg = document.getElementById('background-img')

accentColorPicker = getComputedStyle(root).getPropertyValue('--accent-color-solid').trim();

function openSettings() {
    settingsModal.classList.remove('notes-hide');
}

function closeSettings() {
    settingsModal.classList.add('notes-hide');
}

//root.style.setProperty('--accent-color-solid', accentColorPicker.value);
accentColorPicker.oninput = function() {
    accentColorDisplay.innerHTML = accentColorPicker.value;
    accentColorDisplay.style.color = accentColorPicker.value;
} 