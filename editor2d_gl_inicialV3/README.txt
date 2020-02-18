Exemplo de editor de imagens bem simples usando OpenGL e nossa classe Image:
 - adicionado o método getPixel(), que acessa um pixel. Rápido, porém inseguro;
 - adicionado o método getPixelSafe(), que acessa um pixel. Seguro, porém mais lento;
 - adicionado o método setPixelSafe(). que define um pixel. Seguro, porém mais lento;
 - tratamento de eventos de mouse e alguns comandos simples de pintura.
 
Como compilar?
 - No Linux, basta usar o comando "./build.sh" no diretório do projeto.
   Pode ser preciso mudar o status de executável desse script. 
   Para isso, use o comando "chmod +x build.sh" antes de usar o comando
   "./build.sh" 
 
Requisitos para compilar esse exemplo:
 - ter biblioteca OpenGL instalada no seu compilador/ambiente. Geralmente ela já vem instalada;
 - ter biblioteca GLUT instalada no sistema ou configurada no projeto. Geralmente é preciso baixar
 a biblioteca da Internet. Divirta-m se fazendo isso.
 
Como instalar GLUT no Ubuntu?
 - Abra uma linha de comando. É possível usar o atalho Ctrl + Alt + T
 - Use o seguinte comando "sudo apt-get install freeglut3-dev". É preciso ter senha de administrador.
 
