import Tileset from './Tools/Tileset'

export default class Data
{
	static getCanvasContext()
	{
		if ((Data.canvas = document.getElementById(Data.canvasName))
			&& (Data.context = Data.canvas.getContext('2d')))
		{
			Data.canvas.onmousemove = Data.onMouseMove
			Data.canvas.width = Data.width
			Data.canvas.height = Data.height
			return true
		}
		alert(! Data.canvas
			? "Impossible de récupérer le canvas"
			: "Impossible de récupérer le context du canvas"
		)
		return false
	}

	static loadResources()
	{
		Data.tileset = new Tileset("data/assets.png")
		Data.wallSprites = null;
		Data.sphereSprites = null;
		Data.tileset.tileset.onload
			= () => {
			Data.wallSprites = Data.tileset.getTiles(40, 40, 0, 0)
			Data.sphereSprites = Data.tileset.getTiles(25, 25, 200, 0)
		}
	}

	static onMouseMove(event)
	{
		let rect = Data.canvas.getBoundingClientRect();
		Data.mouseX = event.pageX - window.pageXOffset - rect.left;
		Data.mouseY = event.pageY - window.pageYOffset - rect.top;
	}
}

Data.canvasName = "WallFallCanvas"
Data.width = 700
Data.height = 700