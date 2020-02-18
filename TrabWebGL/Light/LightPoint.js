main();


function main(){

    const canvas = document.getElementById("webgl");
    const gl = canvas.getContext('webgl');

    if(!gl){
        console.log("Seu navegador esta antigo");
        return;
    }

    const vsSource = `
        attribute vec4 a_Position;
        attribute vec4 a_Normal;

        uniform mat4 u_ProjectionMatrix;
        uniform mat4 u_ModelMatrix;
        uniform mat4 u_ViewMatrix;
        uniform mat4 u_NormalMatrix;

        varying vec4 v_Position;
        varying vec3 v_Normal;

        void main(){
            v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));
            v_Position = u_ModelMatrix * a_Position;
            gl_Position = u_ProjectionMatrix * u_ViewMatrix *u_ModelMatrix * a_Position;
        }
    `;

    const fsSource = `
        precision mediump float;

        varying vec4 v_Position;
        varying vec3 v_Normal;
        varying vec4 v_Color;

        uniform vec4 u_Color;
        uniform vec3 u_LightColor;
        uniform vec3 u_LightPosition;
        uniform vec3 u_AmbientLight;

        void main(){
            vec3 lightDirection = normalize(u_LightColor - vec3(v_Position));
            float nDotL = max(dot(v_Normal, lightDirection), 0.0);
            vec3 diffuse = u_LightColor * u_Color.rgb * nDotL;
            vec3 ambient = u_AmbientLight * u_Color.rgb;
            gl_FragColor = vec4(diffuse + ambient, u_Color.a);
        }
    `;

    gl.clearColor(0.0,0.0,0.0,1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    var shaderProgram = initShaderProgram(gl, vsSource, fsSource);

    buffer =initBuffer(gl);

    const programInfo = {
        program: shaderProgram,
        attribLocation:{
            vertexPosition: gl.getAttribLocation(shaderProgram, 'a_Position'),
            vertexNormal: gl.getAttribLocation(shaderProgram, 'a_Normal'),
        },
        uniformLocation: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, 'u_ProjectionMatrix'),
            modelMatrix: gl.getUniformLocation(shaderProgram, 'u_ModelMatrix'),
            normalMatrix: gl.getUniformLocation(shaderProgram, 'u_NormalMatrix'),
            lightColor: gl.getUniformLocation(shaderProgram, 'u_LightColor'),
            lightPosition: gl.getUniformLocation(shaderProgram, 'u_LightPosition'),
            ambientLight: gl.getUniformLocation(shaderProgram, 'u_AmbientLight'),
            color: gl.getUniformLocation(shaderProgram, 'u_Color'),
            viewMatrix: gl.getUniformLocation(shaderProgram, 'u_ViewMatrix'),
        },
    }

    gl.useProgram(programInfo.program);

    var then =0;
    function render(now){
        now *= 0.001;
        const deltaTime = now - then;
        then = now;
        gl.uniform1f(programInfo.uniformLocation.uTime, now);
        drawScene(gl, programInfo, buffer, deltaTime);
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);


}

//Mover Camêra

var cameraPosition = [0.0, 0.0, 6.0]
window.onkeypress = function(event){
    if (event.key == "w") {
        cameraPosition[2] += 0.1
    }
    if (event.key == "s") {
        cameraPosition[2] -= 0.1
    }
    if (event.key == "d") {
        cameraPosition[0] -= 0.1
    }
    if (event.key == "a") {
        cameraPosition[0] += 0.1
    }
    if (event.key == "q") {
        cameraPosition[1] += 0.1
    }
    if (event.key == "e") {
        cameraPosition[1] -= 0.1
    }
}


var cubeRotation = 0.0;
function drawScene(gl, programInfo, buffer,deltaTime){
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

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

    const modelMatrix = mat4.create();

    mat4.translate(modelMatrix, modelMatrix, [0.0, 0.0, 0.0]);
    mat4.rotate(modelMatrix,
        modelMatrix,
        cubeRotation,
        [0,0,1]);
    mat4.rotate(modelMatrix,
        modelMatrix,
        cubeRotation * 0.7,
        [0,1,0]);

    const viewMatrix = mat4.create();
    mat4.translate(viewMatrix, viewMatrix, [-cameraPosition[0],-cameraPosition[1],-cameraPosition[2]]);

    const normalMatrix = mat4.create();
    mat4.invert(normalMatrix, modelMatrix);
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


    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer.indices);

    gl.uniformMatrix4fv(
        programInfo.uniformLocation.projectionMatrix,
        false,
        projectionMatrix
    );
    gl.uniformMatrix4fv(
        programInfo.uniformLocation.modelMatrix,
        false,
        modelMatrix
    );

    gl.uniformMatrix4fv(
        programInfo.uniformLocation.viewMatrix,
        false,
        viewMatrix
    );

    gl.uniformMatrix4fv(
        programInfo.uniformLocation.normalMatrix,
        false,
        normalMatrix
    );

    gl.uniform4fv(
        programInfo.uniformLocation.color,
        new Float32Array([0.8,0.2,0.2,1])
    );

    gl.uniform3fv(
        programInfo.uniformLocation.lightColor,
        new Float32Array([1.0,1.0,1.0])
    );
    
    gl.uniform3fv(
        programInfo.uniformLocation.lightPosition,
        new Float32Array([0,3,-6])
    );

    gl.uniform3fv(
        programInfo.uniformLocation.ambientLight,
        new Float32Array([0.2,0.2,0.2])
    );

    {
        const vertexCount = 36;
        const type = gl.UNSIGNED_SHORT;
        const offset = 0;
        gl.drawElements(gl.TRIANGLES,vertexCount,gl.UNSIGNED_SHORT,offset);
    }

    cubeRotation += deltaTime;
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
        indices: indexBuffer,
    };

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