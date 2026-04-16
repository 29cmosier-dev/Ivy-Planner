let lastAns = 0;
let justSolved = false;

function appendToDisplay(input) {
    const display = document.getElementById('display');

    // If we just hit '=', clear the screen for a new number
    // But keep it if we are adding an operator like +, -, *, /
    if (justSolved) {
        if (!isNaN(input) || input === '(' || input === '√(') {
            display.value = "";
        }
        justSolved = false;
    }
    display.value += input;
}

function appendAns() {
    const display = document.getElementById('display');
    if (justSolved) {
        display.value = "";
        justSolved = false;
    }
    display.value += lastAns;
}

function calculate() {
    const display = document.getElementById('display');
    try {
        let expression = display.value;

        // 1. Basic replacements
        expression = expression.replace(/\^/g, '**');
        expression = expression.replace(/√/g, 'Math.sqrt');

        // 2. Fix implicit multiplication
        expression = expression.replace(/(\d)\(/g, '$1*('); 
        expression = expression.replace(/\)(\d)/g, ')*$1'); 
        expression = expression.replace(/\)\(/g, ')*(');     
        expression = expression.replace(/(\d)Math\.sqrt/g, '$1*Math.sqrt');

        // 3. Auto-close parentheses
        let openCount = (expression.match(/\(/g) || []).length;
        let closeCount = (expression.match(/\)/g) || []).length;
        while (openCount > closeCount) {
            expression += ')';
            closeCount++;
        }

        console.log("Input:", display.value);
        console.log("Evaluated as:", expression);

        let result = eval(expression);
        if (!isFinite(result)) {
            display.value = "Error";
        } else {
            display.value = result;
            lastAns = result;
            justSolved = true;
        }
    } catch (error) {
        display.value = "ERR";
        justSolved = true;
    }
}


function appendPi() {
    const display = document.getElementById('display');
    if (justSolved) {
        display.value = "";
        justSolved = false;
    }
    // We use the actual Math property for perfect accuracy
    display.value += Math.PI;
}

function clearDisplay() {
    const display = document.getElementById('display'); // Added this line
    display.value = "";
}

function calculateSqrt() {
    const display = document.getElementById('display'); // Added this line
    try {
        // Use your existing logic
        let value = eval(display.value);
        let result = Math.sqrt(value);
        
        if (isNaN(result)) {
            display.value = "Error"; 
        } else {
            display.value = result;
        }
    } catch (error) {
        display.value = "ERR";
    }
}




