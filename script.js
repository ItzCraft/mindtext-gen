const letterHeight = 76;
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
        symbols.push(img);
    }

    const totalWidth = symbols.reduce((sum, img) => sum + img.width, 0);
    canvas.width = totalWidth;
    canvas.height = letterHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let x = 0;
    for (const img of symbols) {
        const ratio = letterHeight / img.height;
        const drawWidth = img.width * ratio;
        ctx.drawImage(img, x, 0, drawWidth, letterHeight);
        x += drawWidth;
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
        ">": "smaller",
        ":": "double_dot"
    };
    return specialMap[char] || "space";
}
