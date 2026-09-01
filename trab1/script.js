class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        
    }

}

function lerp(x1, y1, x2, y2) {
    let y = 0;
    for(let x = 0; x <= 1; x = x + 0.1) {
        y = y1 + (x - x1)*((y2 - y1)/(x2 - x1));
        //y = (y1 * (x2 - x) + y2 * (x - x1))/(x2 - x1);

        ctx.beginPath(); 
        ctx.arc(x, y, 10, 0, 2*Math.PI);
        ctx.fill();
    }
}

let p = new Point(100, 100);

const canva = document.getElementById("canva");
const ctx = canva.getContext("2d");

ctx.fillStyle = "red";

// Desenhar enquanto clica
// canva.addEventListener("click", function(evento) {  
//     const x = evento.offsetX;
//     const y = evento.offsetY;

//     ctx.beginPath(); 
//     ctx.arc(x, y, 10, 0, 2*Math.PI);
//     ctx.fill();
// });

let x1 = 100;
let y1 = 100;
let x2 = 500;
let y2 = 100;

ctx.beginPath(); 
ctx.arc(x1, y1, 10, 0, 2*Math.PI);
ctx.fill();
ctx.beginPath(); 
ctx.arc(x2, y2, 10, 0, 2*Math.PI);
ctx.fill();

lerp(x1, y1, x2, y2);

function limpar() {
    ctx.clearRect(0, 0, canva.width, canva.height);
}