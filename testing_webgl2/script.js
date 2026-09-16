"use strict";

var vs = `#version 300 es
in vec2 a_position;

uniform vec2 u_resolution;

void main() {
    vec2 zeroToOne = a_position / u_resolution;
    vec2 zeroToTwo = zeroToOne * 2.0;
    vec2 clipSpace = zeroToTwo - 1.0;

    gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
}
`;

var fs = `#version 300 es
precision highp float;

uniform vec4 u_color;
out vec4 outColor;

void main() {
    outColor = u_color;
}`;

function createShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) return shader;

    console.log(gl.getShaderInfoLog(shader));  
    gl.deleteShader(shader);
    return undefined;
}

function createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) return program;

    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return undefined;
}

function main() {
    var canvas = document.querySelector("#canva");
    var gl = canvas.getContext("webgl2");
    if(!gl) return;

    var vertexShader = createShader(gl, gl.VERTEX_SHADER, vs);
    var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fs);

    // Link the shaders into a program
    var program = createProgram(gl, vertexShader, fragmentShader);

    // Look up where the vertex data needs to go
    var positionAttributeLocation = gl.getAttribLocation(program, "a_position");

    // look up uniform locations
    var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
    var colorLocation = gl.getUniformLocation(program, "u_color");

    // Create a buffer
    var positionBuffer = gl.createBuffer();

    // Create a vertex array object (attribute state)
    var vao = gl.createVertexArray();

    // Use what we created
    gl.bindVertexArray(vao);
    
    // Turn on the attribute
    gl.enableVertexAttribArray(positionAttributeLocation);
    
    // Bind it to ARRAY_BUFFER
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
 
    var size = 2;          // 2 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);
    
    var positions = [
        0, 0,
        0, 100,
        200, 100,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    // Decide the color at random
    var color = [Math.random(), Math.random(), Math.random(), 1];
    
    // Resize canvas
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);
    
    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    
    // Clear the canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    // Tell it to use the program (pair of shaders)
    gl.useProgram(program);
    
    // Bind the attribute/buffer set we want
    gl.bindVertexArray(vao);

    // color
    gl.uniform4fv(colorLocation, color);
    
    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    
    // draw
    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 3;
    gl.drawArrays(primitiveType, offset, count);
}

main();