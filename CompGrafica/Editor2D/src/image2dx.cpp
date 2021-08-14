#include "image2dx.h"

// NOVO: o include do OpenGL está aqui pois não precisamos saber como ela é pintada
#include <GL/gl.h>
#include <iostream>
#include <cstdio>
#include <cstdlib>
#include <cstring>
#include <cmath>

// =========================================================================================
// Classe Imagem
// =========================================================================================
Image::Image(void)
	: pixels(0), buffer(0), width(0), height(0)
{
}
// =========================================================================================
Image::Image( const Image& img )
	: pixels(0), buffer(0), width(0), height(0)
{
	// NOVO reusa o operador de cópia
	*this = img;
}
// =========================================================================================
Image::Image( pixel bg, int w, int h )
	: pixels(0), buffer(0), width(0), height(0)
{
	_allocate(w,h);
	
	clear(bg);
}
// =========================================================================================
Image& Image::operator=( const Image& img )
{
	if( this != &img )
	{
		_allocate( img.width, img.height );

		std::memcpy( buffer, img.buffer, sizeof(pixel)*width*height );
	}

	return *this;

}
// =========================================================================================
Image::~Image(void)
{
	_deallocate();
}
// =========================================================================================
void Image::_allocate( int w, int h )
{
	if( w == width && h == height )
		return;

	_deallocate();

	// alocacao
	width = w, height = h;
	pixels = new pixel_row[ height ];
	buffer = new pixel[ width*height ];

	pixel* it = buffer;
	for( int i=0; i<height ; ++i, it+=w )
	{
		//pixels[i] = &buffer[ i*width ];
		pixels[i] = it;
	}
}
// =========================================================================================
void Image::_deallocate(void)
{
	if( pixels )
	{
		delete [] buffer;
		delete [] pixels;

		pixels = 0;
		width = height = 0;
	}
}
// =========================================================================================
void Image::hline( pixel cor, int y, int x1, int x2 )
{
	if( y < 0 || y >= height )
		return;

	const int minX = std::max( std::min(x1,x2),         0 );
	if( minX >= width )
		return;

	const int maxX = std::min( std::max(x1,x2), width - 1 );
	if( maxX < 0 )
			return;

#if 0

	for( int x = minX; x <= maxX ; ++x )
	{
		setPixel(cor, x, y);
	}
#else
	pixel* it     = pixels[y] + minX;
	pixel* theEnd = pixels[y] + maxX;

	do{
		*it++ = cor;
	}while( it < theEnd  );

#endif
}
// =========================================================================================
void Image::vline( pixel cor, int x, int y1, int y2 )
{
	if( x < 0 || x >= width )
		return;

	const int minY = std::max( std::min(y1,y2),          0 );
	if( minY >= height  )
		return;

	const int maxY = std::min( std::max(y1,y2), height - 1 );
	if( maxY < 0  )
		return;

	for( int y = minY; y <= maxY ; ++y )
	{
		setPixel(cor, x, y);
	}
}
// =========================================================================================
void Image::drawRect( pixel cor, int x1, int y1, int x2, int y2 )
{
	const int minX = std::min( x1, x2 );
	const int minY = std::min( y1, y2 );
	const int maxX = std::max( x1, x2 );
	const int maxY = std::max( y1, y2 );

	hline( cor, minY, minX, maxX );
	hline( cor, maxY, minX, maxX );

	vline( cor, minX, minY, maxY );
	vline( cor, maxX, minY, maxY );

}
// =========================================================================================
void Image::fillRect( pixel cor, int x1, int y1, int x2, int y2 )
{
	int minX = std::min( x1, x2 );
	int minY = std::min( y1, y2 );
	int maxX = std::max( x1, x2 );
	int maxY = std::max( y1, y2 );

	if( maxX < 0 || maxY <0 || minX >= width || minY >= height )
		return;

	minX = std::max( minX, 0 );
	minY = std::max( minY, 0 );
	maxX = std::min( maxX, width-1 );
	maxY = std::min( maxY, height-1 );


	for( int y =minY ; y<=maxY; ++y )
		hline( cor, y, minX, maxX );

}
// =========================================================================================
void Image::clear( pixel bg )
{
#if	0
	const int pixelCount = width*height;

	for( int i=0; i<pixelCount ; i++ )
		buffer[i] = bg;

#else
	pixel* theEnd = buffer + width*height;
	pixel* it     = buffer;

	while( it != theEnd )
	{
		*it++ = bg;
	}
#endif
}
// =========================================================================================
int Image::getWidth(void) const
{
	return width;
}
// =========================================================================================
int Image::getHeight(void) const
{
	return height;
}
// =========================================================================================
int Image::getPixelCount(void) const
{
	return width*height;
}
// =========================================================================================
pixel* Image::getPixels(void)
{
	return buffer;
}
// =========================================================================================
const pixel* Image::getPixels(void) const
{
	return buffer;
}
// =========================================================================================	
void Image::display() const
{
	const float pw = 2.0f / (float) width;
	const float ph = 2.0f / (float) height;
	// coordenada Y do pixel na tela
	float py = 1.0f -ph;
	
	// itera por linha
	glBegin(GL_QUADS);
		for( int y=0 ; y<height ; ++y, py-=ph )
		{
			float px = -1.0;
				
			// varre cada pixel daquela linha
			for( int x=0 ; x<width ; ++x, px+=pw )
			{
			#if 0
				unsigned char uc = (unsigned char) pixels[y][x];
				const float gray = uc/255.0f;
			
					glColor3f( gray, gray, gray );
			#else
					pixel uc = pixels[y][x]; // 0x000000AA
					// AABBGGRR --> RRGGBBAA
					uc =   ( (uc & 0xFF000000) >> 24 )
						 | ( (uc & 0x00FF0000) >>  8 )
						 | ( (uc & 0x0000FF00) <<  8 )
						 | ( (uc & 0x000000FF) << 24 );





					// AABBGGRR
					glColor4ubv( (const GLubyte *) &uc );
			#endif
				
					glVertex2f( px   , py    );
					glVertex2f( px+pw, py    );
					glVertex2f( px+pw, py+ph );
					glVertex2f( px   , py+ph );			
			}
		}
	glEnd();
	
	// grade:
	glColor3f(0,0,0);
	glBegin(GL_LINES);
		py = 1.0f;
		for( int y=0 ; y<=height ; ++y, py-=ph )
		{
			glVertex2f(-1, py );
			glVertex2f(+1, py );
		}
		float px = 1.0f;
		for( int x=0 ; x<=width ; ++x, px-=pw )
		{
			glVertex2f( px,-1 );
			glVertex2f( px,+1 );
		}
	
	glEnd();
}
// =========================================================================================
void Image::setPixel( pixel cor, int i, int j )
{
	pixels[j][i] = cor;
}
// =========================================================================================
void Image::setPixelSafe( pixel cor, int i, int j )
{
	if( i >-1 && i<width && j>-1 && j<height )
		pixels[j][i] = cor;
}
// =========================================================================================
pixel Image::getPixel( int i, int j ) const
{
	return pixels[j][i];
}
// =========================================================================================
pixel Image::getPixelSafe( int i, int j ) const
{
	if( i >-1 && i<width && j>-1 && j<height )
		return pixels[j][i];
	
	return (pixel)0;
}
// =========================================================================================
void Image::lineMidPoint( pixel cor, int x1, int y1, int x2, int y2  )
{
	if(abs(x1 - x2) <= 1 && abs(y1-y2) <= 1)
	{
		Image::setPixelSafe(cor, x1,y1);
		Image::setPixelSafe(cor, x2,y2);
	}
	else
	{
		int mediaX = (x1+x2)/2;
		int mediaY = (y1+y2)/2;
		Image::lineMidPoint(cor, x1,y1,mediaX,mediaY);
		Image::lineMidPoint(cor,mediaX,mediaY,x2,y2);
	}
	
}
// =========================================================================================
void Image::lineDDA( pixel cor, int x1, int y1, int x2, int y2  )
{
	float deltaMax = std::max(abs(x2-x1), abs(y2-y1));
	for(float i=0;i<=deltaMax;i++)
	{
		float t = i/deltaMax;
		float pX = x1+(x2-x1)*t;
		float pY = y1+(y2-y1)*t;
		Image::setPixelSafe(cor,pX,pY);
	}
}
// =========================================================================================
void Image::lineBresenham( pixel cor, int x1, int y1, int x2, int y2  )
{
	//float D = (y2-y1)/(x2-x1);
	int a= y2 -y1;
	int b = x1-x2;
	int c = x2*y1 - x1*y2;

	int x = x1, y = y1;

	if(x2 >= x1 && y2 >= y1 && (x2-x1)>=(y2-y1) )
	{
		Image::setPixelSafe(cor,x,y);
		
		for(int i = x1; i < x2; i++)
		{
			x++;
			int _y = (a * x) + (b * y) + c;
			int _y1 = (a * x) + (b * (y + 1)) + c;

			if(_y1 > _y)
				y++;
			
			Image::setPixelSafe(cor,x,y);
		}
	}
}
// =========================================================================================
void Image::circleBresenham( pixel cor, int cx, int cy, int r  )
{
	int dM = 3 - 2*r;
	for (int x=r, y=0; x>=y; y++){
		setPixelSafe(cor, cx+x, cy+y);
		setPixelSafe(cor, cx+x, cy-y);
		setPixelSafe(cor, cx-x, cy+y);
		setPixelSafe(cor, cx-x, cy-y);

		setPixelSafe(cor, cx+y, cy+x);
		setPixelSafe(cor, cx+y, cy-x);
		setPixelSafe(cor, cx-y, cy+x);
		setPixelSafe(cor, cx-y, cy-x);

		if( dM < 0){
			dM += 4*y +6;
		}else
		{
			dM += 4*(y-x) +10;
			x--;
		}
		
	}
}
// =========================================================================================
void Image::ellipseMidpoint( pixel cor, int cx, int cy, int a, int b  )
{
	int rx2 = a*a;
    int ry2 = b*b;
    int tworx2 = 2* rx2;
    int twory2 = 2*ry2;
    int p;
    int x = 0;
    int y = b;
    int px = 0;
    int py = tworx2 * y;

	setPixelSafe(cor, cx + x, cy + y);
    setPixelSafe(cor, cx + x, cy - y);
    setPixelSafe(cor, cx - x, cy + y);
    setPixelSafe(cor, cx - x, cy - y);
    
    p = round(ry2 - (rx2*b) + (0.25 * rx2));
    
    while (px < py) {
        x++;
        px += twory2;
        
        if (p <= 0) {
            p+= ry2 + px;
        } else {
            y--;
            py -= tworx2;
            p += ry2 + px - py;
        }
        
        setPixelSafe(cor, cx + x, cy + y);
        setPixelSafe(cor, cx + x, cy - y);
        setPixelSafe(cor, cx - x, cy + y);
        setPixelSafe(cor, cx - x, cy - y);
    }
    
    // regiao 2
    
    p = round(ry2 * (x+0.5) * (x+0.5) + rx2 * (y-1) * (y-1) - rx2 * ry2);
    
    while (y > 0) {
        y--;
        py -= tworx2;
        if (p >= 0) {
            p += rx2 - py;
        } else {
            x++;
            px += twory2;
            p += rx2 - py + px;
        }
        
        setPixelSafe(cor, cx + x, cy + y);
        setPixelSafe(cor, cx + x, cy - y);
        setPixelSafe(cor, cx - x, cy + y);
        setPixelSafe(cor, cx - x, cy - y);
    }
}
// =========================================================================================
