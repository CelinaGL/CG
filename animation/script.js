"use strict";

var vertexShaderSource = `#version 300 es
in vec2 a_position;

uniform vec2 u_resolution;

void main() {
  vec2 zeroToOne = a_position / u_resolution;
  vec2 zeroToTwo = zeroToOne * 2.0;
  vec2 clipSpace = zeroToTwo - 1.0;

  gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
}
`;

var fragmentShaderSource = `#version 300 es
precision highp float;
uniform vec4 u_color;

out vec4 outColor;

void main() {
  outColor = u_color;
}
`;

function main() {
  // Get A WebGL context
  /** @type {HTMLCanvasElement} */
  var canvas = document.querySelector("#canvas");
  var gl = canvas.getContext("webgl2");
  if (!gl) {
    return;
  }

  //create buttons for the modes
  // const b_dvd = document.querySelector("#dvd");
  // const b_ex = document.querySelector("#ex");
  // var dvd = false;
  // var ex = false;

  var program = webglUtils.createProgramFromSources(gl, [vertexShaderSource, fragmentShaderSource]);

  var positionAttributeLocation = gl.getAttribLocation(program, "a_position");

  var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
  var colorLocation = gl.getUniformLocation(program, "u_color");

  var positionBuffer = gl.createBuffer();

  var vao = gl.createVertexArray();

  gl.bindVertexArray(vao);

  gl.enableVertexAttribArray(positionAttributeLocation);

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  var size = 2;          // 2 components per iteration
  var type = gl.FLOAT;   // the data is 32bit floats
  var normalize = false; // don't normalize the data
  var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
  var offset = 0;        // start at the beginning of the buffer
  gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);
  
  var translation = [0, 0];
  var width = 100;
  var height = 30;
  var color = [Math.random(), Math.random(), Math.random(), 1];
  var marginw = false;
  var marginh = false;

  requestAnimationFrame(drawScene);

  function changeColor() {
    color = [Math.random(), Math.random(), Math.random(), 1];
  }

  function drawScene(count) {
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(program);

    gl.bindVertexArray(vao);

    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    setRectangle(gl, translation[0], translation[1], width, height);

    // Set a random color
    gl.uniform4fv(colorLocation, color);

    // Draw the rectangle
    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 6;
    gl.drawArrays(primitiveType, offset, count);

    //"DVD" mode
    if(translation[0] >= gl.canvas.width - width)  {
      marginw = true;
      changeColor();
    }
    if(translation[0] == 0) {marginw = false;
      changeColor();
    }

    if(!marginw) {
      translation[0] += 2;
    } else {
      translation[0] -= 2;
    }
    
    if(translation[1] >= gl.canvas.height - height) {
      marginh = true;
      changeColor();
    }
    if(translation[1] == 0) {
      marginh = false;
      changeColor();
    }

    if(!marginh) {
      translation[1] += 2;
    } else {
      translation[1] -= 2;
    }
    
    requestAnimationFrame(drawScene);
  }

  // function dvd() {
  
  // }

  // function eixo_x() {

  // }
}

// Fill the buffer with the values that define a rectangle.
function setRectangle(gl, x, y, width, height) {
  var x1 = x;
  var x2 = x + width;
  var y1 = y;
  var y2 = y + height;
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
     x1, y1,
     x2, y1,
     x1, y2,
     x1, y2,
     x2, y1,
     x2, y2,
  ]), gl.STATIC_DRAW);
}


main();
