const canva = document.getElementById("canva");
const ctx = canva.getContext("2d");
const clearButton = document.getElementById("clear-bnt");
    
ctx.strokeStyle = "red";
ctx.fillStyle = "red";

canva.addEventListener("click", function(evento) {
    const rect = canva.getBoundingClientRect();   
    const x = evento.offsetX;
    const y = evento.offsetY;
    //ctx.fillRect(x, y, 150, 75); // quadrado
    ctx.arc(x, y, 15, 0, 2*Math.PI);
    ctx.fill();
    //ctx.stroke();
});


function limpar() {
    ctx.clearRect(0, 0, canva.width, canva.height);
}