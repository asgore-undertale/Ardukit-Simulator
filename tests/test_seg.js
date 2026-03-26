const globalSegments = new Array(8).fill(0);
const digitBuffers = Array.from({ length: 4 }, () => new Array(8).fill(0));

function drawNumber(n) {
    if (n === 3) globalSegments.fill(3); // Mock draw 3
    else if (n === 0) globalSegments.fill(0); // Mock draw 0
    // else keep intact!
}

function displayDigit(digitIdx, value) {
    // disableAll
    // draw
    drawNumber(value);
    
    // digit HIGH
    for(let i=0; i<8; i++) digitBuffers[digitIdx][i] = globalSegments[i];
}

function refreshDisplay(n) {
    let b = n;
    let digit4 = b % 10;
    b = b / 10; // Floating point!
    let digit3 = b % 10;
    b = b / 10;
    let digit2 = b % 10;
    b = b / 10;
    let digit1 = b % 10;
    
    displayDigit(3, digit4);
    displayDigit(2, digit3);
    displayDigit(1, digit2);
    displayDigit(0, digit1);
}

refreshDisplay(3);
console.log("Without floor:");
console.dir(digitBuffers);

function refreshDisplayWithFloor(n) {
    let b = n;
    let digit4 = b % 10;
    b = Math.floor(b / 10);
    let digit3 = b % 10;
    b = Math.floor(b / 10);
    let digit2 = b % 10;
    b = Math.floor(b / 10);
    let digit1 = b % 10;
    
    displayDigit(3, digit4);
    displayDigit(2, digit3);
    displayDigit(1, digit2);
    displayDigit(0, digit1);
}

refreshDisplayWithFloor(3);
console.log("With floor:");
console.dir(digitBuffers);
