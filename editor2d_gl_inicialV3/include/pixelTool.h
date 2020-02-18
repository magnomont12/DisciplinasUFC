/*
 * drawingTool.h
 *
 *  Created on: 5 de out de 2017
 *      Author: gilvan
 */

#ifndef INCLUDE_PIXELTOOL_H_
#define INCLUDE_PIXELTOOL_H_

#include "drawingTool.h"
#include "vector"

class PixelTool : public DrawingTool
{
public:

	PixelTool()
		: DrawingTool()
	{
	}

	virtual ~PixelTool()
	{
	}

protected:

	virtual bool _onMouseDown( Image& img, int pixelX, int pixelY ) override
	{
		img.setPixelSafe( color,pixelX, pixelY );
		return false;
	}
	virtual void _onMouseUp( Image& img, int pixelX, int pixelY ) override
	{
		img.setPixelSafe( color, pixelX, pixelY );
	}
	virtual  bool _onMouseMove( Image& img, int pixelX, int pixelY ) override
	{
		img.setPixelSafe( color, pixelX, pixelY );
		return false;
	}
};

///
class PenTool : public DrawingTool
{
public:

	PenTool()
		: DrawingTool()
	{
	}

	virtual ~PenTool()
	{
	}

protected:

	virtual bool _onMouseDown( Image& img, int pixelX, int pixelY ) override
	{
		img.setPixelSafe( color,pixelX, pixelY );
		return true;
	}
	virtual void _onMouseUp( Image& img, int pixelX, int pixelY ) override
	{

	}
	virtual  bool _onMouseMove( Image& img, int pixelX, int pixelY ) override
	{
		img.setPixelSafe( color, pixelX, pixelY );
		return true;
	}
};


class LineTool : public DrawingTool
{
public:

	LineTool ()
		: DrawingTool ()
	{
	}

	virtual ~LineTool ()
	{
	}

protected:

	virtual bool _onMouseDown( Image& img, int pixelX, int pixelY ) override
	{
		img.lineMidPoint(color, downX, downY, pixelX, pixelY );
		return false;
	}
	virtual void _onMouseUp( Image& img, int pixelX, int pixelY ) override
	{
		img.lineMidPoint(color, downX, downY, pixelX, pixelY );
	}
	virtual  bool _onMouseMove( Image& img, int pixelX, int pixelY ) override
	{
		img.lineMidPoint(color, downX, downY, pixelX, pixelY );
		return false;
	}
};

class LineToolDDA : public DrawingTool
{
public:

	LineToolDDA ()
		: DrawingTool ()
	{
	}

	virtual ~LineToolDDA ()
	{
	}

protected:

	virtual bool _onMouseDown( Image& img, int pixelX, int pixelY ) override
	{
		img.lineDDA(color, downX, downY, pixelX, pixelY );
		return false;
	}
	virtual void _onMouseUp( Image& img, int pixelX, int pixelY ) override
	{
		img.lineDDA(color, downX, downY, pixelX, pixelY );
	}
	virtual  bool _onMouseMove( Image& img, int pixelX, int pixelY ) override
	{
		img.lineDDA(color, downX, downY, pixelX, pixelY );
		return false;
	}
};

/**
 * @brief Ferramenta genérica para desenhar segmentos de reta.
 *
 */
class GenericLineTool : public DrawingTool
{
public:
	/**
	 * Nessa definição, temos um ponteiro para um método da classe Image.
	 * Perceba que a assinatura do método é idêntica aos métodos de desenho de segmentos de reta:
	 *  - os tipos de retorno desses métodos são todos "void";
	 *  - os argumentos são do mesmo tipo e aparecem na mesma sequência.
	 *
	 *
	 */
	typedef void (Image::*LineDrawingMethodPointer)( pixel cor, int x1, int y1, int x2, int y2  );

	/** O ponteiro para o método de desenho deve ser recebido no construtor.
	 *  Veja o seguinte exemplo:
	 * @code
	 *	   GenericLineTool breLine( &Image::lineBresenham ); // usa o algoritmo de Bresenham
	 *	   GenericLineTool ddaLine( &Image::lineDDA ); // usa o algoritmo DDA
	 * @endcode
	 */
	GenericLineTool( LineDrawingMethodPointer mptr)
		: DrawingTool(), lineDrawingMethod(mptr)
	{
	}
	virtual ~GenericLineTool()
	{
	}
protected:

	virtual bool _onMouseDown( Image& img, int pixelX, int pixelY ) override
	{
		(img.*lineDrawingMethod)(color, downX, downY, pixelX, pixelY );
		return false;
	}
	virtual void _onMouseUp( Image& img, int pixelX, int pixelY ) override
	{
		(img.*lineDrawingMethod)(color, downX, downY, pixelX, pixelY );
	}
	virtual  bool _onMouseMove( Image& img, int pixelX, int pixelY ) override
	{
		(img.*lineDrawingMethod)(color, downX, downY, pixelX, pixelY );
		return false;
	}

	/// Ponteiro para um método de desenho de linhas da classe Image
	LineDrawingMethodPointer lineDrawingMethod;
};

class GenericPolygonTool : public GenericLineTool
{
public:

	GenericPolygonTool( LineDrawingMethodPointer mptr)
		: GenericLineTool(mptr), _points()
	{
	}
protected:

	void _redraw( Image& img, bool closed= false )
	{
		if( _points.empty() )
			return;
		if( _points.size() == 1 )
		{
			img.setPixelSafe( color, _points[0].x, _points[0].y  );
		}else
		{
			for( size_t i=0; i<(_points.size()-1) ; ++i )
			{
				const Point2& p1 = _points[i  ];
				const Point2& p2 = _points[i+1];
				(img.*lineDrawingMethod)(color, p1.x, p1.y, p2.x, p2.y );
			}
		}

		// pontos de controle
		if( !closed )
		{
			for( const auto& p : _points )
			{
				img.setPixelSafe( color^0xCC, p.x, p.y  );
			}
		}
	}

	virtual bool _onMouseDown( Image& img, int pixelX, int pixelY ) override
	{
		Point2 p(pixelX, pixelY);
		if( _points.empty() || p != _points.back() )
		{
			_points.push_back( p );
		}

		_redraw(img);

		return false;
	}
	virtual void _onMouseUp( Image& img, int pixelX, int pixelY ) override
	{
		if( _points.empty() )
			return;



		_points.back() = Point2(pixelX, pixelY);
		bool closed = (_points.size() > 2) && (_points.front() == _points.back());
		_redraw(img, closed);

		// fecha o polígono
		//Scanline
		if( closed )
		{
			std::cout<< "Poligno  Fechou"<<_points.size()-1;

			int maxY = 0;
			int minY = 0x0FFFFFF;
			std::vector<int> arestas;
			std::vector<Point2> pontos;

			for(auto p: _points){
				maxY = std::max(p.y,maxY);
				minY = std::min(p.y,minY);
			}

			for(int y=minY;y<=maxY;y++){
				for(int i=0; i<(_points.size()-1); i++){
					Point2 p1 = _points[i+0];
					Point2 p2 = _points[i+1];

				 if((y>=std::max(p1.y,p2.y) || y<std::min(p1.y,p2.y))){
					 if(p1.y == p2.y){
						img.lineBresenham(0xFF0000FF, p1.x,p1.y,p2.x,p2.y);
					}	
						continue;
					}
					
					if(p1.x == p2.x){
						img.setPixelSafe(0xFF0000FF,p1.x,y);
						arestas.push_back(p1.x);
					}
					else{
						int x =  p1.x + float((y-p1.y)*(p2.x - p1.x)) / float((p2.y - p1.y));     
						img.setPixelSafe(0xFF0000FF, x, y);
						arestas.push_back(x);
					}
				}
				if (arestas.size()>0){
					std::sort(arestas.begin(), arestas.end());
					for (int i=0; i<(arestas.size()); i++){
						pontos.push_back(Point2(arestas[i],y));
					}
				}
			arestas.clear();
			}

			if (pontos.size()>0){
				for (int i=0; i<pontos.size()-1; i+=2){
					img.lineBresenham(0xFF0000FF, pontos[i].x,pontos[i].y,pontos[i+1].x,pontos[i+1].y);
				}
			}
			
			_points.clear();
		}
	}
	virtual  bool _onMouseMove( Image& img, int pixelX, int pixelY ) override
	{
		if( !_points.empty() )
		{
			_points.back() = Point2(pixelX, pixelY);
			_redraw(img);
		}

		return false;
	}

	std::vector< Point2 > _points;
};

class BresenhamCircleTool : public DrawingTool
{
public:

	BresenhamCircleTool ()
		: DrawingTool ()
	{
	}

protected:

	virtual bool _onMouseDown( Image& img, int pixelX, int pixelY ) override
	{
		img.circleBresenham(color, downX, downY, 0 );
		return false;
	}
	virtual void _onMouseUp( Image& img, int pixelX, int pixelY ) override
	{
		float dx = downX - pixelX;
		float dy = downY - pixelY;
		int radius = (std::sqrt( dx*dx + dy*dy ));
		img.circleBresenham(color, downX, downY, radius );
	}
	virtual  bool _onMouseMove( Image& img, int pixelX, int pixelY ) override
	{
		_onMouseUp(img, pixelX, pixelY);
		return false;
	}
};


class EllipseTool : public DrawingTool
{
public:

	EllipseTool ()
		: DrawingTool ()
	{
	}

protected:

	virtual bool _onMouseDown( Image& img, int pixelX, int pixelY ) override
	{
		img.ellipseMidpoint(color, downX, downY, 0,0 );
		return false;
	}
	virtual void _onMouseUp( Image& img, int pixelX, int pixelY ) override
	{
		float a = std::abs(downX - pixelX);
		float b = std::abs(downY - pixelY);
		img.ellipseMidpoint(color, downX, downY, a, b );
	}
	virtual  bool _onMouseMove( Image& img, int pixelX, int pixelY ) override
	{
		_onMouseUp(img, pixelX, pixelY);
		return false;
	}
};


#endif /* INCLUDE_PIXELTOOL_H_ */
