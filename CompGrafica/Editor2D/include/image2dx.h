#ifndef IMAGE2D_CLASS_H__
#define IMAGE2D_CLASS_H__

//typedef unsigned char pixel; // tons de cinza
typedef unsigned int pixel; // cores
typedef pixel* pixel_row;

struct Point2
{
	Point2( int px=0, int py=0 )
		:x(px), y(py)
	{
	}

	bool operator ==(const Point2& p )const
	{
		return (x==p.x) && (y==p.y);
	}
	bool operator !=(const Point2& p )const
	{
		return (x!=p.x) || (y!=p.y);
	}

	int x;
	int y;
};

struct Line
{
	Point2 p1;
	Point2 p2;
};


class Image
{
public:

	Image();

	// NOVO
	Image( const Image& img );
	// NOVO
	Image& operator=( const Image& img );

	Image( pixel bg, int width, int height );
	
	~Image();
	

	void hline( pixel cor, int y, int x1, int x2 );
	/**
	 *  Desenha uma linha vertical
	 *
	 *    ________x________
	 *
	 *  y1        |
	 *            |
	 *            |
	 *  y2        |
	 *
	 *    __________________
	 */
	void vline( pixel cor, int x, int y1, int y2 );

	void drawRect( pixel cor, int x1, int y1, int x2, int y2 );
	void fillRect( pixel cor, int x1, int y1, int x2, int y2 );

	void lineMidPoint( pixel cor, int x1, int y1, int x2, int y2  );
	void lineDDA( pixel cor, int x1, int y1, int x2, int y2  );
	void lineBresenham( pixel cor, int x1, int y1, int x2, int y2  );

	void circleBresenham( pixel cor, int cx, int cy, int radius  );

	void ellipseMidpoint( pixel cor, int cx, int cy, int a, int b  );


	void clear( pixel bgColor =0 );
	void display() const;
	void setPixel( pixel cor, int i, int j );
	void setPixelSafe( pixel cor, int i, int j );
	pixel getPixel( int i, int j ) const;
	pixel getPixelSafe( int i, int j ) const;
	
	pixel* getPixels();
	const pixel* getPixels() const;
	
	int getWidth() const;
	int getHeight() const;
	int getPixelCount() const;
	
	pixel* operator[] (int i)
	{
		return pixels[i];
	}
	const pixel* operator[] (int i) const
	{
		return pixels[i];
	}

private:
	// NOVO
	void _allocate( int w, int h );
	// NOVO
	void _deallocate();

	pixel_row* pixels;
	pixel_row  buffer;
	int width;
	int height;
};

#endif

