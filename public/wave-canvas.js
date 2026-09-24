const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resize();
window.addEventListener('resize', resize);

// Random analogous colors
const baseHue = 182;
const hues = [baseHue - 30, baseHue, baseHue + 30];
const colors = hues.map(h => `hsl(${(h + 360) % 360}, 80%, 50%)`);

const layers = 4;
const amplitudes = [100, 120, 80, 110];
const frequencies = [0.002, 0.003, 0.0015, 0.0025];
const speeds = [0.01, 0.015, -0.012, 0.018];
let phases = [0, 0, 0, 0];

function drawWaves() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < layers; i++) {
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, colors[i % colors.length]);
        gradient.addColorStop(1, colors[(i + 1) % colors.length]);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height);

        for (let x = 0; x <= canvas.width; x += 10) {
            let y = (canvas.height / 2) + amplitudes[i] * Math.sin((x * frequencies[i]) + phases[i]);
            ctx.lineTo(x, y);
        }

        ctx.lineTo(canvas.width, canvas.height);
        ctx.closePath();
        ctx.fill();
    }
}

function animate() {
    phases = phases.map((p, i) => p + speeds[i]);
    drawWaves();
    requestAnimationFrame(animate);
}

animate();
