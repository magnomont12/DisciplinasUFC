
 main();

function main(){

    const canvas = document.querySelector("#glCanvas");
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

    if(!gl){
        console.log("Seu navegador esta antigo");
        return;
    }

    const vsSource = `
        attribute vec4 aVertexPosition;
        attribute vec3 aVertexNormal;
        attribute vec2 aTextureCoord;
        attribute vec2 uv;
        attribute vec2 uv2;

        uniform mat4 uNormalMatrix;
        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;
        
        varying highp vec2 vTextureCoord;
        varying highp vec3 vLighting;

        varying highp vec4 vPosition;
        varying highp vec3 vNormal;
        varying highp vec2 vUv;
        varying highp vec2 vUv2;

        void main(void) {

          vNormal = aVertexNormal;
          vUv = aTextureCoord;
          vUv2 = uv2;
          vPosition = aVertexPosition;

          gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
          vTextureCoord = aTextureCoord;

          highp vec3 ambientLight = vec3(0.3,0.3,0.3);
          highp vec3 directionalLightColor = vec3(1,1,1);
          highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));

          highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);
          highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
          vLighting = ambientLight + (directionalLightColor * directional);
        }
    `;

  // Fragment shader program

  const fsSource = `
        precision highp float;
        precision highp int;

        varying highp vec2 vTextureCoord;
        varying highp vec3 vLighting;

        uniform float time;

        varying highp vec4 vPosition;
        varying highp vec3 vNormal;
        varying highp vec2 vUv;
        varying highp vec2 vUv2;

        uniform sampler2D uSampler;

        float PI = 3.14159265359;
        float PI2 = 6.28318530718;

        float map(float n, float nMin, float nMax){
            return (n-nMin) / (nMax - nMin);
        }
        float mapClamp(float n, float nMin, float nMax) {
            return n < nMin ? 0. : n > nMax ? 1. : (n - nMin) / (nMax - nMin);
        }
        float gain(float x, float p) {
            return (x < .5 ? .5 * pow(abs(2. * x), p) : 1. - .5 * pow(abs(2. * (1. - x)), p));
        }
        vec2 gain(vec2 v, float p) {
            return vec2(gain(v.x, p), gain(v.y, p));
        }
        vec3 gain(vec3 v, float p) {
            return vec3(gain(v.x, p), gain(v.y, p), gain(v.z, p));
        }

        float min4(float a, float b, float c, float d) {
            return min(min(a, b), min(c, d));
        }
        vec2 scale(vec2 v, float s) {
            return v * s - (s - 1.) / 2.;
        }
        
        void main(void) {
            highp vec4 texelColor = texture2D(uSampler, vTextureCoord);
            vec2 st = vUv.xy;
            vec3 color = vec3(0.0);

            float x = smoothstep(.2, .8, 0.0);
            st = scale(st, mix(.7, .1, x));
            st += mix(0., .4, x);

            vec2 margin = vec2(-.090);
            float s = 1.5;
            vec2 bl = smoothstep(margin - s/2., margin +s /2., st);
            vec2 tr = smoothstep(margin - s/2., margin + s/2., 1.0 - st);

            vec3 pct = vec3(min4(bl.x, bl.y, tr.x, tr.y));
            float p = bl.x * bl.y * tr.x *tr.y;
            pct = mix(pct, vec3(p), vec3(8., 7., 9.));

            pct = gain(pct, 4.);

            float t = 5.800;
            t += time;
            t+= PI2;
            color = sin(pct * PI + t);

            color = color.rgb + color.bbb - color.ggg *3.;

            gl_FragColor = vec4(color,1.0-color.b*color.r*color.g);
        }
    `;

    gl.clearColor(0.0,0.0,0.0,1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
	

    var shaderProgram = initShaderProgram(gl, vsSource, fsSource);

    buffer =initBuffer(gl);

    const programInfo = {
        program: shaderProgram,
        attribLocation:{
            vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
            vertexNormal: gl.getAttribLocation(shaderProgram, 'aVertexNormal'),
            textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
            //vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
        },
        uniformLocation: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
            normalMatrix: gl.getUniformLocation(shaderProgram, 'uNormalMatrix'),
            uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
            uTime: gl.getUniformLocation(shaderProgram, 'time'),
        },
    };

    gl.useProgram(programInfo.program);

    const texture = loadTexture(gl, 'testando.png');
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(programInfo.uniformLocation.uSampler,0);

    var then =0;
    function render(now){
        now *= 0.001;
        const deltaTime = now - then;
        then = now;
        gl.uniform1f(programInfo.uniformLocation.uTime, now);
        drawScene(gl, programInfo, buffer, deltaTime, texture);
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);

}

function initBuffer(gl){

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    const positions = [
        // Front face
        -1.0, -1.0,  1.0,
         1.0, -1.0,  1.0,
         1.0,  1.0,  1.0,
        -1.0,  1.0,  1.0,
        
        // Back face
        -1.0, -1.0, -1.0,
         1.0, -1.0, -1.0,
         1.0,  1.0, -1.0,
        -1.0,  1.0, -1.0,
        
        // Top face
        -1.0,  1.0, -1.0,
        -1.0,  1.0,  1.0,
         1.0,  1.0,  1.0,
         1.0,  1.0, -1.0,
        
        // Bottom face
        -1.0, -1.0, -1.0,
         1.0, -1.0, -1.0,
         1.0, -1.0,  1.0,
        -1.0, -1.0,  1.0,
        
        // Right face
         1.0, -1.0, -1.0,
         1.0,  1.0, -1.0,
         1.0,  1.0,  1.0,
         1.0, -1.0,  1.0,
        
        // Left face
        -1.0, -1.0, -1.0,
        -1.0, -1.0,  1.0,
        -1.0,  1.0,  1.0,
        -1.0,  1.0, -1.0,
      ];


    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    /*const faceColors = [
      [1.0,  1.0,  1.0,  1.0],    // Front face: white
      [1.0,  0.0,  0.0,  1.0],    // Back face: red
      [0.0,  1.0,  0.0,  1.0],    // Top face: green
      [0.0,  0.0,  1.0,  1.0],    // Bottom face: blue
      [1.0,  1.0,  0.0,  1.0],    // Right face: yellow
      [1.0,  0.0,  1.0,  1.0],    // Left face: purple
    ];

    var colors = [];
    for(var j=0; j<faceColors.length;j++){
        const c = faceColors[j];
        colors = colors.concat(c,c,c,c);
    }

    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER,colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,
        new Float32Array(colors),
        gl.STATIC_DRAW);*/
    const textureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);

    const textureCoordinates = [
        // Front
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,
        // Back
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,
        // Top
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,
        // Bottom
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,
        // Right
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,
        // Left
        0.0,  0.0,
        1.0,  0.0,
        1.0,  1.0,
        0.0,  1.0,
      ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates),
                  gl.STATIC_DRAW);
    
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    const indices = [
        0,  1,  2,      0,  2,  3,    // front
        4,  5,  6,      4,  6,  7,    // back
        8,  9,  10,     8,  10, 11,   // top
        12, 13, 14,     12, 14, 15,   // bottom
        16, 17, 18,     16, 18, 19,   // right
        20, 21, 22,     20, 22, 23,   // left
    ];

    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(indices),
        gl.STATIC_DRAW);


    const normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    const vertexNormals = [
        // Front
         0.0,  0.0,  1.0,
         0.0,  0.0,  1.0,
         0.0,  0.0,  1.0,
         0.0,  0.0,  1.0,
    
        // Back
         0.0,  0.0, -1.0,
         0.0,  0.0, -1.0,
         0.0,  0.0, -1.0,
         0.0,  0.0, -1.0,
    
        // Top
         0.0,  1.0,  0.0,
         0.0,  1.0,  0.0,
         0.0,  1.0,  0.0,
         0.0,  1.0,  0.0,
    
        // Bottom
         0.0, -1.0,  0.0,
         0.0, -1.0,  0.0,
         0.0, -1.0,  0.0,
         0.0, -1.0,  0.0,
    
        // Right
         1.0,  0.0,  0.0,
         1.0,  0.0,  0.0,
         1.0,  0.0,  0.0,
         1.0,  0.0,  0.0,
    
        // Left
        -1.0,  0.0,  0.0,
        -1.0,  0.0,  0.0,
        -1.0,  0.0,  0.0,
        -1.0,  0.0,  0.0
      ];

      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals),
                    gl.STATIC_DRAW);


        return{
            position: positionBuffer,
            normal : normalBuffer,
            //color: colorBuffer,
            indices: indexBuffer,
            textureCoord: textureCoordBuffer,
        };
}



var cubeRotation = 0.0;
function drawScene(gl, programInfo, buffer,deltaTime,texture){
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //gl.useProgram(programInfo.program);

    const fieldOfView = 45 * Math.PI / 180;
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();

    mat4.perspective(
        projectionMatrix,
        fieldOfView,
        aspect,
        zNear,
        zFar,
    );

    const modelViewMatrix = mat4.create();

    mat4.translate(modelViewMatrix, modelViewMatrix, [-0.0, 0.0, -6.0]);
    mat4.rotate(modelViewMatrix,
        modelViewMatrix,
        cubeRotation,
        [0,0,1]);
    
    mat4.rotate(modelViewMatrix,
        modelViewMatrix,
        cubeRotation * 0.7,
        [0,1,0]);
    const normalMatrix = mat4.create();
    mat4.invert(normalMatrix, normalMatrix);
    mat4.transpose(normalMatrix, normalMatrix);

    {
        const numComponents = 3
        const type = gl.FLOAT;
        const normalize = false;
        const stride =0;
        const offset =0;

        gl.bindBuffer(gl.ARRAY_BUFFER, buffer.position);
        gl.vertexAttribPointer(
            programInfo.attribLocation.vertexPosition,
            numComponents,
            type,
            normalize,
            stride,
            offset
        );
        gl.enableVertexAttribArray(
            programInfo.attribLocation.vertexPosition
        );
    }
    /*{
        const numComponents = 4
        const type = gl.FLOAT;
        const normalize = false;
        const stride =0;
        const offset =0;
        gl.bindBuffer(gl.ARRAY_BUFFER,buffer.color);
        gl.vertexAttribPointer(
            programInfo.attribLocation.vertexColor,
            numComponents,
            type,
            normalize,
            stride,
            offset
        );
        gl.enableVertexAttribArray(
            programInfo.attribLocation.vertexColor
        );
    }*/
    {
        const num=2;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;

        gl.bindBuffer(gl.ARRAY_BUFFER, buffer.textureCoord);
        gl.vertexAttribPointer(programInfo.attribLocation.textureCoord, num, type, normalize, stride, offset);
        gl.enableVertexAttribArray(programInfo.attribLocation.textureCoord);
    }

    {
        const numComponents = 3;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer.normal);
        gl.vertexAttribPointer(programInfo.attribLocation.vertexNormal, numComponents,
                               type, normalize, stride, offset);
        gl.enableVertexAttribArray(programInfo.attribLocation.vertexNormal);
    }

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(programInfo.uniformLocation.uSampler,0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer.indices);

    gl.uniformMatrix4fv(
        programInfo.uniformLocation.projectionMatrix,
        false,
        projectionMatrix
    );
    gl.uniformMatrix4fv(
        programInfo.uniformLocation.modelViewMatrix,
        false,
        modelViewMatrix
    );
    gl.uniformMatrix4fv(
                        programInfo.uniformLocation.normalMatrix,
                        false,
                        normalMatrix
    );

    {
        const vertexCount = 36;
        const type = gl.UNSIGNED_SHORT;
        const offset = 0;
        gl.drawElements(gl.TRIANGLES,vertexCount,gl.UNSIGNED_SHORT,offset);
    }


    cubeRotation += deltaTime;
}

function initShaderProgram(gl, vsSource, fsSource){
    const vertexShader = loadShader(gl,gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl,gl.FRAGMENT_SHADER, fsSource);

    //Criar programa de shader
    const shaderProgram = gl.createProgram();

    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);


    if(!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)){
        console.log("Falha ao compilar os shaders")
        return;
    }

    return shaderProgram;
}

function loadShader(gl, type, source){
    
    var shader = gl.createShader(type, source)
    //Enviar o codigo de shader ao objeto
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
        console.log("Deu ruim na compilação dos haders")
        gl.deleteShader(shader);
        return
    }

    return shader;
}


function loadTexture(gl, url){

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 1;
    const height =1;
    const border = 0;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    const pixel = new Uint8Array([0,0,255,255]);
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                  width, height, border, srcFormat,
                  srcType, pixel);
    const image = new Image();
    image.onload = function(){
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image);

        if(isPowerOf2(image.width) && isPowerOf2(image.height)){
            gl.generateMipmap(gl.TEXTURE_2D);
        }
        else{
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        }
    };
    image.src = url;

    return texture;
}

function isPowerOf2(value){
    return (value & (value -1)) ==0;
}