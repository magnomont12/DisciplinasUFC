/*
 * drawingTool.h
 *
 *  Created on: 5 de out de 2017
 *      Author: gilvan
 */

#ifndef INCLUDE_DRAWINGTOOL_H_
#define INCLUDE_DRAWINGTOOL_H_

#include "image2dx.h"

/**
 * Interface para uma ferramenta de desenho.
 */
class DrawingTool
{
public:

	DrawingTool();

	virtual ~DrawingTool();

	/// Reinicia o estado da ferramenta. Invocado sempre que o usuário altern
	virtual void reset();
	bool isMouseDown() const;

	/** Opera sobre uma imagem de preview, iniciando a edição pela ferramenta
	 *
	 * @return True, indicando que o resultado deve ser aplicado à imagem em edição.
	 *         A maioria das ferramentas vai retornar [false], mas uma "caneta", por exemplo,
	 *         já altera diretamente na imagem em edição.
	 */
	bool onMouseDown( Image& img, int pixelX, int pixelY );
	/** Opera diretamente sobre a imagem em edição.
	 */
	void onMouseUp( Image& img, int pixelX, int pixelY );
	/** Opera sobre uma imagem de preview, realizando a edição pela ferramenta enquanto
	 *  o ponteiro do mouse se move.
	 *
	 * @return True, indicando que o resultado deve ser aplicado à imagem em edição.
	 *         A maioria das ferramentas vai retornar [false].
	 */
	bool onMouseMove( Image& img, int pixelX, int pixelY );

	pixel getColor() const;
	void setColor(pixel color);

protected:

	/// Deve ser sobrescrito pela ferramenta, se necessário
	virtual bool _onMouseDown( Image& img, int pixelX, int pixelY );
	/// Deve ser sobrescrito pela ferramenta de edição
	virtual void _onMouseUp( Image& img, int pixelX, int pixelY ) = 0;
	/// Deve ser sobrescrito pela ferramenta, se necessário
	virtual bool _onMouseMove( Image& img, int pixelX, int pixelY );

	/// Onde o usuário pressionou o mouse ao iniciar o movimento
	int downX, downY;
	/** Última posição onde o mouse esteve.
	 *  Começa aonde o usuário pressionou o mouse ao iniciar o movimento
	 */
	int lastX, lastY;

	pixel color;
	bool mouseDown;
};

#endif /* INCLUDE_DRAWINGTOOL_H_ */
