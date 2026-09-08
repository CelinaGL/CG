class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
const canva = document.getElementById("canva");
const ctx = canva.getContext("2d");

let points = [];
let splinePoints = [];

function lerp(x1, y1, x2, y2, t) {
    let x = (1 - t) * x1 + (t * x2);
    let y = (1 - t) * y1 + (t * y2);
    let p = new Point(x, y);
    
    return p;
}

function cubicBezier() {
    t = 0;
    let a, b, c, d, e, p;
    for(; t < 1; t = t + 0.01) {
        a = lerp(points[0].x, points[0].y, points[1].x, points[1].y, t);
        b = lerp(points[1].x, points[1].y, points[2].x, points[2].y, t);
        c = lerp(points[2].x, points[2].y, points[3].x, points[3].y, t);
        d = lerp(a.x, a.y, b.x, b.y, t);
        e = lerp(b.x, b.y, c.x, c.y, t);
        p = lerp(d.x, d.y, e.x, e.y, t);
        
        splinePoints.push(p);
        let spLen = splinePoints.length;
        
        if(spLen > 2) {
            drawLine(splinePoints[spLen - 2].x, splinePoints[spLen - 2].y, p.x, p.y, "white");
        }
    }
    drawLine(points[0].x, points[0].y, splinePoints[1].x, splinePoints[1].y, "white");
    drawLine(p.x, p.y, points[3].x, points[3].y, "white");
    points.forEach(p => {
        drawPoint(p.x, p.y, "aquamarine", 5);
    });
}

canva.addEventListener("click", function(evento) {  
    const x = evento.offsetX;
    const y = evento.offsetY;
    points.push(new Point(x, y));
    let pLen = points.length;
    
    let color = "aquamarine";
    drawPoint(x, y, color, 5);

    if(pLen%4 == 0) {
        cubicBezier();
        splinePoints.length = 0;
        points.length = 0;
        points.push(new Point(x, y));
    }
});

function drawPoint(x, y, color, tam) {
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.beginPath(); 
    ctx.arc(x, y, tam, 0, 2*Math.PI);
    ctx.fill();
    ctx.stroke();
}

function drawLine(x1, y1, x2, y2, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();            
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function limpar() {
    ctx.clearRect(0, 0, canva.width, canva.height);
    points.length = 0;
    splinePoints.length = 0;
}