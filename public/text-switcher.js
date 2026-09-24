const words = [
    { text: '幻木心', font: '"Noto Sans SC", sans-serif' },
    { text: 'Mux', font: '"Montserrat", sans-serif' },
    { text: 'Муксинай', font: '"PT Sans", sans-serif' },
    { text: 'موكس', font: '"Tajawal", sans-serif' },
    { text: 'মাক্স', font: '"Noto Sans Bengali", sans-serif' },
    { text: 'マルチプレクサ', font: '"Noto Sans JP", sans-serif' }
];

let index = 0;
const textElem = document.getElementById('text');

function switchText() {
    textElem.style.opacity = 0;
    setTimeout(() => {
        textElem.textContent = words[index].text;
        textElem.style.fontFamily = words[index].font;
        textElem.style.opacity = 1;
        index = (index + 1) % words.length;
    }, 1000);
}

setInterval(switchText, 2000);
switchText(); // Initial call
