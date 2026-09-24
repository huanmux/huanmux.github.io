const logo = document.getElementById("muxLogo");

let logoSize = Math.min(window.innerWidth, window.innerHeight) * 0.15; // 15% of smaller dimension
let x = Math.random() * (window.innerWidth - logoSize);
let y = Math.random() * (window.innerHeight - logoSize);
let dx = (Math.random() < 0.5 ? 1 : -1) * 3;
let dy = (Math.random() < 0.5 ? 1 : -1) * 3;

function resizeLogo() {
    logoSize = Math.min(window.innerWidth, window.innerHeight) * 0.15;
    logo.style.width = `${logoSize}px`;
    logo.style.height = `${logoSize}px`;
}
resizeLogo();
window.addEventListener("resize", resizeLogo);

function moveLogo() {
    x += dx;
    y += dy;

    if (x <= 0 || x + logoSize >= window.innerWidth) {
        dx = -dx;
        x = Math.max(0, Math.min(x, window.innerWidth - logoSize));
    }
    if (y <= 0 || y + logoSize >= window.innerHeight) {
        dy = -dy;
        y = Math.max(0, Math.min(y, window.innerHeight - logoSize));
    }

    logo.style.left = `${x}px`;
    logo.style.top = `${y}px`;

    requestAnimationFrame(moveLogo);
}
moveLogo();
