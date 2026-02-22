const letterHeight = 76;
const letterPath = "assets/";
const canvas = document.getElementById("outputCanvas");
const ctx = canvas.getContext("2d");
const generateBtn = document.getElementById("generateBtn");
const downloadBtn = document.getElementById("downloadBtn");
const tintBtn = document.getElementById("tintBtn");
const textInput = document.getElementById("textInput");
const alignSelect = document.getElementById("alignSelect");
const colorInput = document.getElementById("colorInput"),
      colorInputNum = document.getElementById("colorInputNum"),
      colorInputSym = document.getElementById("colorInputSym");

let useTint = false;

generateBtn.addEventListener("click", async () => {

    const text = textInput.value;
    if (!text) return;

    const lines = text.split("\n");

    const allLines = [];

    let maxWidth = 0;

    for (const line of lines) {

        const symbols = [];

        for (const char of line) {

            const img = await loadLetterImage(char);

            ctx.clearRect(0,0,img.width,img.height);
            ctx.drawImage(img,0,0);

            let data = ctx.getImageData(0,0,img.width,img.height).data;

            const code = char.charCodeAt(0);
            let col = "#000000";

            if(useTint){

                if(code>=65 && code<=122){
                    col=colorInput.value;
                }
                else if(code>=47 && code<=57){
                    col=colorInputNum.value;
                }
                else{
                    col=colorInputSym.value;
                }

                for (let i=0;i<data.length;i+=4){

                    const r=data[i],g=data[i+1],b=data[i+2];
                    const rgb=Math.max(r,Math.max(g,b));

                    data[i]  = parseInt(col.slice(1,3),16)/255*rgb;
                    data[i+1]= parseInt(col.slice(3,5),16)/255*rgb;
                    data[i+2]= parseInt(col.slice(5,7),16)/255*rgb;
                }
            }

            const newimg=new ImageData(data,img.width,img.height);

            symbols.push(newimg);
        }

        const width = symbols.reduce((sum,img)=>sum+img.width,0);

        if(width > maxWidth) maxWidth = width;

        allLines.push(symbols);
    }

    canvas.width = maxWidth;
    canvas.height = letterHeight * allLines.length;

    ctx.clearRect(0,0,canvas.width,canvas.height);

    let y = 0;

    for(const symbols of allLines){
          const lineWidth = symbols.reduce((sum,img)=>{
                const ratio = letterHeight / img.height;
                return sum + img.width * ratio;
          }, 0);
          
          let x = 0;
          const align = alignSelect.value;
          
          if(align === "center"){
                x = (canvas.width - lineWidth) / 2;
          } else if(align === "right"){
                x = canvas.width - lineWidth;
          }

          for(const img of symbols){
                const ratio = letterHeight / img.height;
                const drawWidth = img.width * ratio;
      
                const tempCanvas = document.createElement("canvas");
                tempCanvas.width = img.width;
                tempCanvas.height = img.height;
                tempCanvas.getContext("2d").putImageData(img, 0, 0);

                ctx.drawImage(tempCanvas, 0, 0, img.width, img.height, x, y, drawWidth, letterHeight);

                x += drawWidth;
          }

          y += letterHeight;
    }

    downloadBtn.disabled = false;
});

downloadBtn.addEventListener("click", () => {

    const link = document.createElement("a");

    link.download = "mindustry_text.png";
    link.href = canvas.toDataURL("image/png");

    link.click();
});

function loadLetterImage(char){

    return new Promise((resolve)=>{

        const img = new Image();

        img.onload = ()=>resolve(img);

        img.crossOrigin = "anonymous";

        const name = getFileName(char);

        img.src = `${letterPath}${name}.png`;

        img.onerror = ()=>{

            const fallback = new Image();

            fallback.src = `${letterPath}space.png`;

            fallback.onload = ()=>resolve(fallback);
        };
    });
}

function getFileName(char){

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

tintBtn.addEventListener("click", ()=>{

    useTint = !useTint;

    document.getElementById("colorDiv").style.display = useTint ? "flex" : "none";

    generateBtn.click();
});

colorInput.addEventListener("change",()=>generateBtn.click());
colorInputNum.addEventListener("change",()=>generateBtn.click());
colorInputSym.addEventListener("change",()=>generateBtn.click());
