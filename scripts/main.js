const canvas = document.getElementById('draw-panel');
const predictValue = document.getElementById('predict-value')
const ctx = canvas.getContext('2d');

let drawing = false; // Track whether the user is drawing

// Set up the drawing context
ctx.lineWidth = 10;
ctx.strokeStyle = '#000000';

// Start drawing when the mouse button is pressed
canvas.addEventListener('mousedown', function(e) {
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
});

// Draw as the mouse moves while the button is held down
canvas.addEventListener('mousemove', function(e) {
    if (drawing) {
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    }
});

// Stop drawing when the mouse button is released
canvas.addEventListener('mouseup', function() {
    drawing = false;
});

// Stop drawing if the mouse leaves the canvas
canvas.addEventListener('mouseout', function() {
    drawing = false;
});

// Clear the canvas
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    predictValue.innerHTML = ""
}

async function prediction() {
   const dataURL = canvas.toDataURL('image/png');

   const request = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({ dataURL: dataURL }),
    })
    respose = await request.json()

    predictValue.innerHTML = ""
    predictValue.innerHTML = respose.predicted_digit
}
