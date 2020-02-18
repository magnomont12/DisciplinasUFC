
#include "drawingTool.h"
#include<iostream>


DrawingTool::DrawingTool()
	: downX(-1), downY(-1), lastX(-1), lastY(-1), color(0x88), mouseDown(false)
{

}
DrawingTool::~DrawingTool()
{

}
// =================================================================================
pixel DrawingTool::getColor() const
{
	return color;
}
// =================================================================================
void DrawingTool::setColor(pixel color)
{
	this->color = color;
}
// =================================================================================
void DrawingTool::reset()
{
	mouseDown = false;
}
// =================================================================================
bool DrawingTool::isMouseDown() const
{
	return mouseDown;
}
// =================================================================================
bool DrawingTool::_onMouseDown( Image& img, int pixelX, int pixelY )
{
	return true;
}

// =================================================================================
bool DrawingTool::_onMouseMove( Image& img, int pixelX, int pixelY )
{
	return false;
}
// =================================================================================
bool DrawingTool::onMouseDown( Image& img, int pixelX, int pixelY )
{
	mouseDown = true;

	downX = lastX = pixelX, downY = lastY = pixelY;
	return _onMouseDown( img, pixelX, pixelY  ) ;
}
// =================================================================================
void DrawingTool::onMouseUp( Image& img, int pixelX, int pixelY )
{
	if( !mouseDown ) return;

	//img.setPixelSafe( 0xCC, pixelX, pixelY ); // teste
	_onMouseUp( img, pixelX, pixelY  );

	mouseDown = false;
	lastX = pixelX, lastY = pixelY;
}
// =================================================================================
bool DrawingTool::onMouseMove( Image& img, int pixelX, int pixelY )
{
	if( !mouseDown )
		return false;

	//img.setPixelSafe( 0xCC, pixelX, pixelY );
	bool mustDraw = _onMouseMove( img, pixelX, pixelY  ) ;

	//
	lastX = pixelX, lastY = pixelY;

	return mustDraw;
}
// =================================================================================
