const canva = document.getElementById("canva");
const ctx = canva.getContext("2d");
ctx.fillStyle = "aquamarine";
ctx.strokeStyle = "aquamarine";

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

let points = [];
let i = 0;

canva.addEventListener("click", function(evento) {  
    let p = new Point(evento.offsetX, evento.offsetY);
    points[i] = p;
    i++;
    
    ctx.beginPath(); 
    ctx.arc(p.x, p.y, 10, 0, 2*Math.PI);
    ctx.fill();
    ctx.stroke();

    if( i >= 2 ) {
        line( i - 2, i - 1 );
    }
});

function line(p1, p2) {
    ctx.beginPath();            
    ctx.moveTo(points[p1].x, points[p1].y);
    ctx.lineTo(points[p2].x, points[p2].y);
    ctx.stroke();
}

function limpar() {
    ctx.clearRect(0, 0, canva.width, canva.height);
    points.length = 0;
    i = 0;
}

function mostrar() {
    for(let j = 0; j < i; j++) {
        console.log('p[' + j + '] = x - ' + points[j].x + ' | y = ' + points[j].y + '\n') ;
    }
    if( i == 0 ) {
        console.log('Vazio');
    }
}