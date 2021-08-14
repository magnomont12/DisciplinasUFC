#include <GL/glut.h>

#include <cmath>
#include <iostream>
#include <algorithm>
#include <map>

#include "drawingTool.h"
#include "pixelTool.h"

// =================================================================================
// pré-declaração das funções que implementam a interação com o usuário
// =================================================================================
static void pintaCena(void); // desenho da cena
static void trataTeclado(unsigned char key, int x, int y); // eventos de teclado
static void trataMouseClick( int button, int state, int x, int y); // eventos de botões de mouse
static void trataMouseMove( int x, int y); // evento de mover o mouse

// =================================================================================
// macros, tipos e variáveis do programa
// =================================================================================
// tamanho de um "macropixel"
#define PIXEL_SIZE 16

// Mapeia uma tecla em uma ferramenta de desenho
typedef std::map<unsigned char, DrawingTool* > ToolMap;

// mapa associando teclas às ferramentas de desenho do editor
static ToolMap drawingTools;
// ferramenta atualmente selecionada no editor
static DrawingTool *tool = nullptr;

// imagem a ser renderizada
static Image img( 0xffFFffFF, 48, 32 );
// imagem temporária, para preview da imagem durante interação com o usuário
static Image preview;

// cor de frente e cor de fundo
pixel colorA = 0x000000FF;
pixel colorB = 0xFFFFFFFF;

// espelhamento horizontal da imagem
void flipH();
void flipV();
void noise();
void invert();
void multiply( float f );

int main( int argc, char** argv )
{
	glutInit( &argc, argv );
	glutInitWindowSize( img.getWidth()*PIXEL_SIZE, img.getHeight()*PIXEL_SIZE );
	glutInitWindowPosition(10,10);
	glutInitDisplayMode( GLUT_RGB | GLUT_DOUBLE | GLUT_DEPTH | GLUT_STENCIL );
	
	glutCreateWindow( "Editor de Imagens 2D - Pressione 'A' para Ajuda" );	
	glutDisplayFunc( pintaCena );	
	glutKeyboardFunc( trataTeclado );
	glutMouseFunc( trataMouseClick );
	glutMotionFunc( trataMouseMove );
	
	// Ferramentas de edição habilitadas no programa
	PenTool penTool;
	PixelTool pixelTool;
	LineTool lineTool;
	LineToolDDA lineToolDDA;
	GenericLineTool lineToolBresenham( &Image::lineBresenham );
	GenericPolygonTool poly( &Image::lineDDA );
	BresenhamCircleTool bc;
	EllipseTool et;
	BresenhamCircleTool circleBresenham;

	drawingTools[ '3' ] = &et;
	drawingTools[ '4' ] = &poly;
	drawingTools[ '5' ] = &circleBresenham;

	drawingTools[ '6' ] = &lineToolBresenham;
	drawingTools[ '7' ] = &pixelTool;
	drawingTools[ '8' ] = &penTool;
	drawingTools[ '9' ] = &lineTool;
	drawingTools[ '0' ] = &lineToolDDA;

	/*
	// TODO se alguém quiser, pode criar uma janela secundária para lidar com as ferramentas
	glutCreateWindow( "Ferramentas" );
	glutDisplayFunc( desenhaMinhaCena );
	glutKeyboardFunc( trataTeclado );
	glutMouseFunc( trataMouseClick );
	glutMotionFunc( trataMouseMove );
	*/
	
	// entra no laço principal
	glutMainLoop();

	int p1[2] = {20,32};
	int p2[2] = {13,-20};
	//Produto escala
	//20*13 + 32*(-20)
	int normal[2] = {0,1};

	int t = 0;
	//(0,1) * ((0,0) - (20,32))
	//(0,1) * ((13,-20) - (20,32))
	//T = (0,1) * (-20,-32)
	//  / (0,1) * (-7, 12)
	//0 - 32 / 12
	
	
	//(0,1) * ((0,0) - (13,-20))
	//(0,1) * ((20,32) - (13,-20))
	
	//(0,1) * (-13,20)
	//(0,1) * (7, + 52)
	//20/52

	//P(T) = (13,-20) + ((20,32) - (13,-20)) * 20/52
	//P(T) = (13,-20) + (7, 52) * 20/52
	//P(T) = (13, -20) + (3, 20)
	//P(T) = (16, 0)


	//Recorte 2:
	// (-1,0) * ((47, 0) -(64,16))
	//(-1,0) * ((20,32) - (64,16))

	//(-1, 0) * ( -17 , -16)
	//(-1, 0) * ( -44, 16)

	//T=17/44
	//P(T) = (64,16) + (20,32) - (64,16) * t
	//P(T) = (64, 16) + (-44, 16) * 17/44
	//P(T) = (64,16) + (-17, 6 )
	//P(T) = (47 , 24)


	return 0;
}

static void pintaCena()
{	
	// =======================================================
	// limpa os buffers com pretoto, talmente transparente
	glClearColor(0,0,0,0);
	glClear( GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT | GL_STENCIL_BUFFER_BIT );
	
	// =======================================================
	glLoadIdentity();

	// habilita a composição de cores por canal de opacidade
	glEnable(GL_BLEND);
	glBlendFunc( GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA );
	
	// exibe a imagem
	if( tool && tool->isMouseDown() )
	{
		preview.display();
	}
	else
	{
		img.display();
	}
	
	glutSwapBuffers();
	glutPostRedisplay(); // pede outro frame: ideal para jogos
}

void trataTeclado( unsigned char key, int x, int y)
{
	// verififica se já não há uma ferramenta associada	à tecla usando o padrão de projeto
	ToolMap::iterator it = drawingTools.find(key);
	if( it != drawingTools.end() )
	{
		tool = it->second;
		tool->reset();
		return;
	}else
	{
		tool = nullptr;
	}

	// tratamento "hard-coded"
	switch(key)
	{
	/*
	case '1':
	{
		static int cy = 0;
		//img.hline( 196, cy++, 0, img.getWidth()-1 );
		img.hline( 196, cy++, +100, -50 );
		break;
	}
	case '2':
	{
		static int cx = 0;
		img.vline( 64, cx++, -20, 40 );
		break;
	}
	case '4':
	{
		static int px = 0;
		img.drawRect( 64, px, px, img.getWidth()-px-1, img.getHeight()-px-1 );
		px++;
		break;
	}
	case '5':
	{
		img.fillRect( 64, -2000000000,-2000000000,+2000000000,+2000000000 );
		img.fillRect( 80, 1,1, img.getWidth()-2,+img.getHeight()-2 );


		img.fillRect( 96, -2000000000,-2000000000, img.getWidth()/4,+img.getHeight()/4 );
		img.fillRect( 96, +2000000000,-2000000000, img.getWidth()/4,+img.getHeight()/4 );

		img.fillRect( 96, -2000000000,+img.getHeight()/4, img.getWidth()/4,+img.getHeight() );
		img.fillRect( 96, +2000000000,+2000000000, img.getWidth()/4,+img.getHeight()/4 );


		img.fillRect( 128, img.getWidth()/4,-200000, 3*img.getWidth()/4,+20000);
		img.fillRect( 128, -20000,img.getHeight()/4,+200000, 3*img.getHeight()/4);

		break;
	}
	case '6':
	{
		img.lineMidPoint( 64, rand()%img.getWidth(), rand()%img.getHeight(),
							  rand()%img.getWidth(), rand()%img.getHeight()
							 );
		break;
	}*/
	case 'A': case 'a': 
		std::cout << std::endl << "Comandos do Editor:" << std::endl;
		std::cout << "\tW para limpar a imagem com branco" << std::endl;
		std::cout << "\tB para limpar a imagem com preto" << std::endl;
		std::cout << "\tN para uma imagem com ruído" << std::endl;
		std::cout << "\t+ e - para alterar a cor principal" << std::endl;
		std::cout << "\t8 para usar a caneta" << std::endl;
		break;
	case '-':
		colorA -= 1;
		break;
	case '+':
		colorA += 1;
		break;
	case 'h': case 'H':
		flipH();
		break;
	case 'r': case 'R':
	{
		Image rot( '@', img.getHeight(), img.getWidth() );


		for( int i=0; i<img.getHeight(); ++i )
			for( int j=0; j<img.getWidth(); ++j )
			{
				rot[j][i] = img[i][ img.getWidth() - 1 - j];
			}

		img = rot;

		glutReshapeWindow(img.getWidth()*PIXEL_SIZE, img.getHeight()*PIXEL_SIZE );
		break;
	}
	case 'v': case 'V':
		flipV();
		break;
	case 'w': case 'W': 
		img.clear( 0xFFFFFFFF );
		break;
	case 'b': case 'B':
		img.clear(0x000000FF);
		break;
	case 'n':  case 'N':
		noise();
		break;
	case 'i':  case 'I':
		invert();
		break;
	case 'z':  case 'Z':
		multiply(1.1f);
		break;
	case 'x':  case 'X':
		multiply(0.9f);
		break;
	// Tecla "ESC"
	case 27:
		exit(-1);
		break; 	
	}

	glutPostRedisplay();
}

int color = -1;

static void trataMouseClick( int button, int state, int x, int y)
{
	x/=PIXEL_SIZE, y/=PIXEL_SIZE;
	color = (button==0)?  colorA : colorB;
	img.setPixelSafe( color, x, y );
	
	if( state == GLUT_DOWN )
	{
		/*color = (button==0)?  colorA : colorB;
		img.setPixelSafe( color, x, y );
		*/

		if( tool )
		{
			tool->setColor(color);

			preview = img;
			if( tool->onMouseDown( preview, x, y ) )
			{
				img = preview;
			}
		}


	}else
	if( state == GLUT_UP )
	{
		color = -1;

		if( tool )
		{
			tool->onMouseUp( img, x, y );
		}
		glutPostRedisplay();
	}

}

static void trataMouseMove( int x, int y)
{
	x/=PIXEL_SIZE, y/=PIXEL_SIZE;

	if( tool )
	{
		preview = img;
		if( tool->onMouseMove( preview, x, y ) )
		{
			img = preview;
		}

		glutPostRedisplay();
	}


}

// =================================================================================
// implementação dos filtros
// =================================================================================
// espelhamento horizontal
void flipH()
{
	const int W = img.getWidth();
	const int halfW = img.getWidth()/2;

	for( int r=0 ; r<img.getHeight() ; ++r  )
	{
		for( int c=0 ; c<halfW ; ++c  )
		{
			std::swap( img[r][c], img[r][W-c-1] );
		}
	}
}

// espelhamento vertical
void flipV()
{
	const int H = img.getHeight();
	const int halfH = img.getHeight()/2;

	for( int r=0 ; r<halfH ; ++r  )
	{
		for( int c=0 ; c<img.getWidth() ; ++c  )
		{
			std::swap( img[r][c], img[H-r-1][c] );
		}
	}
}

// ruído
void noise()
{
	// novo: preenchimento da imagem com padrão aleatório e uma linha diagonal
	for( int i=0 ; i<img.getPixelCount() ; ++i  )
	{
		//img.getPixels()[i] = rand() & 0xFF;
		img.getPixels()[i] =   ((rand() & 0xFF) <<  0)
							|  ((rand() & 0xFF) <<  8)
							|  ((rand() & 0xFF) << 16)
							|  ((rand() & 0xFF) << 24);
	}
}

void invert()
{
	// novo: preenchimento da imagem com padrão aleatório e uma linha diagonal
	for( int i=0 ; i<img.getPixelCount() ; ++i  )
		img.getPixels()[i] = (~img.getPixels()[i]) | 0x000000FF; // sempre opaco
}

void multiply( float f )
{
	// novo: preenchimento da imagem com padrão aleatório e uma linha diagonal
	for( int i=0 ; i<img.getPixelCount() ; ++i  )
	{
		const pixel pi = img.getPixels()[i];
		float newRf = ((pi & 0xFF000000) >> 24)*f;
		float newGf = ((pi & 0x00FF0000) >> 16)*f;
		float newBf = ((pi & 0x0000FF00) >>  8)*f;
		float newAf = ((pi & 0x000000FF) >>  0)*f;

		pixel newR = std::max( (pixel)0, (pixel)std::min( (int)0xFF, (int)(newRf + 0.5f)) );
		pixel newG = std::max( (pixel)0, (pixel)std::min( (int)0xFF, (int)(newGf + 0.5f)) );
		pixel newB = std::max( (pixel)0, (pixel)std::min( (int)0xFF, (int)(newBf + 0.5f)) );
		//pixel newA = (pi & 0x000000FF);
		pixel newA = std::max( (pixel)0, (pixel)std::min( (int)0xFF, (int)(newAf + 0.5f)) );


		img.getPixels()[i] = (newR << 24) | (newG << 16) | (newB << 8) | newA;
	}
}
