'use strict'

export default class ImageHelper
{
	// https://davidwalsh.name/convert-canvas-image
	static imageToCanvas(image)
	{
		let canvas = document.createElement("canvas")
		canvas.width = image.width
		canvas.height = image.height
		canvas.getContext("2d").drawImage(image, 0, 0)
		return canvas
	}
	
	// https://davidwalsh.name/convert-canvas-image
	static canvasToImage(canvas)
	{
		let image = new Image()
		image.src = canvas.toDataURL("image/png")
		image.setAttribute('crossOrigin', 'anonymous')
		return image
	}
	
	// Doesn't work
	static imageDataToImage(data)
	{
		var canvas = document.createElement("canvas")
		canvas.width = data.width
		canvas.height = data.height
		canvas.getContext("2d").putImageData(data, 0, 0)
		return ImageHelper.canvasToImage(canvas)
	}
	
	static imageToTile(image, offsetX, offsetY, width, height)
	{
		let canvas = document.createElement("canvas")
		canvas.width = width
		canvas.height = height
		canvas.getContext("2d").drawImage(image,
			offsetX, offsetY, width, height,
			0, 0, width, height
		)
		return ImageHelper.canvasToImage(canvas)
	}
}
