const letterHeight = 76;
const defaultWidth = 60;
const symbolWidths = {
    "A": 60, "B": 60, "C": 60, "D": 60, "E": 60, "F": 60, "G": 60, "H": 60,
    "I": 21, "J": 60, "K": 60, "L": 60, "M": 60, "N": 60, "O": 60, "P": 60,
    "Q": 60, "R": 60, "S": 60, "T": 60, "U": 60, "V": 60, "W": 60, "X": 60,
    "Y": 60, "Z": 60,
}
const letterPath = "assets/";
const canvas = document.getElementById("outputCanvas");
const ctx = canvas.getContext("2d");
const generateBtn = document.getElementById("generateBtn");
const downloadBtn = document.getElementById("downloadBtn");
const textInput = document.getElementById("textInput");

generateBtn.addEventListener("click", async () => {
    const text = textInput.value.trim();
    if (!text) return;

    const symbols = [];
    for (const char of text) {
        const img = await loadLetterImage(char);
        const width = symbolWidths[char.toUpperCase()] || defaultWidth;
        symbols.push({ img, width });
    }

    // вычисляем ширину текста
    const totalWidth = symbols.reduce((sum, s) => sum + s.width, 0);
    canvas.width = totalWidth;
    canvas.height = letterHeight;

    // рисуем посимвольно
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let x = 0;
    for (const s of symbols) {
        ctx.drawImage(s.img, x, 0, s.width, letterHeight);
        x += s.width;
    }

    downloadBtn.disabled = false;
});

downloadBtn.addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = "mindustry_text.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
});

function loadLetterImage(char) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.crossOrigin = "anonymous";
        const name = getFileName(char);
        img.src = `${letterPath}${name}.png`;
        img.onerror = () => {
            const fallback = new Image();
            fallback.src = `${letterPath}space.png`;
            fallback.onload = () => resolve(fallback);
        };
    });
}

function getFileName(char) {
    if (char === " ") return "space";
    if (/[a-z]/.test(char)) return char.toUpperCase();
    if (/[A-Z]/.test(char)) return char;
    if (/[0-9]/.test(char)) return char;
    const specialMap = {
        "!": "excl",
        "?": "quest",
        ".": "dot",
        ",": "comma",
        "-": "dash",
        "(": "circl_bracket_start",
        ")": "circl_bracket_end",
        "[": "squr_bracket_start",
        "]": "squr_bracket_end",
        "{": "figure_bracket_start",
        "}": "figure_bracket_end",
        "/": "slash",
        "+": "plus",
        "-": "minus",
        "=": "equal",
        "'": "single",
        "<": "bigger",
        ">": "smaller"
    };
    return specialMap[char] || "space";
}
