import Tileset from './Tools/Tileset'

export default class Data
{
	static init(onInitialized)
	{
		window.onresize = Data._onWindowResize
		Data._initGameInformation()
		Data._loadTiles(onInitialized)
		Data._loadSounds()
		Data._loadMusics()
		return Data._getCanvasContext()
	}

	static _initGameInformation()
	{
		Data.information = {
			score: 0,
			time: 0,
			level: 1
		}
	}

	static _getCanvasContext()
	{
		if ((Data.canvas = document.getElementById(Data.canvasName))
			&& (Data.context = Data.canvas.getContext('2d')))
		{
			Data.canvas.onmousemove = Data._onMouseMove
			Data._createBackground()
			Data._onWindowResize()
			return true
		}
		alert(! Data.canvas
			? "Impossible de récupérer le canvas"
			: "Impossible de récupérer le context du canvas"
		)
		return false
	}

	static _createBackground()
	{
		Data.backgroundCanvas = document.createElement('canvas');
		Data.background = Data.backgroundCanvas.getContext('2d');
	}

	static _resizeBackground()
	{
		Data.backgroundCanvas.width = Data.canvas.width
		Data.backgroundCanvas.height = Data.canvas.height
	}

	static _onWindowResize()
	{
		let oldBounds = Data.bounds
		Data._setScreenConstants(window.innerWidth, window.innerHeight)
		Data._resizeBackground()
		if (Data.onWindowResize)
			Data.onWindowResize(Data.bounds.x.min - oldBounds.x.min, Data.bounds.y.min - oldBounds.y.min)
	}

	static _setScreenConstants(width, height)
	{
		Data.borders = {
			x: (width - Data.width) / 2,
			y: (height - Data.height) / 2
		}
		Data.bounds = {
			x: { min: Data.borders.x, max: Data.width + Data.borders.x },
			y: { min: Data.borders.y, max: Data.height + Data.borders.y }
		}
		Data.middle = {
			x: Data.bounds.x.min + (Data.bounds.x.max - Data.bounds.x.min) / 2,
        	y: Data.bounds.y.min + (Data.bounds.y.max - Data.bounds.y.min) / 2
		}
		Data.canvas.width = width
		Data.canvas.height = height
	}

	static _onMouseMove(event)
	{
		let rect = Data.canvas.getBoundingClientRect();
		Data.mouseX = event.pageX - window.pageXOffset - rect.left;
		Data.mouseY = event.pageY - window.pageYOffset - rect.top;
	}

	static _loadTiles(onInitialized)
	{
		Data.tileset = new Tileset("data/assets.png")
		Data.wallSprites = null;
		Data.sphereSprites = null;
		Data.tileset.tileset.onload
			= () => {
			Data.wallSprites = Data.tileset.getTiles(40, 40, 0, 0)
			Data.sphereSprites = Data.tileset.getTiles(25, 25, 200, 0)
			onInitialized(Data)
		}
	}

	static _loadSounds()
	{
		const path = "data/sounds/effects/"
		Data.sounds = {
			levelUp: new Audio(path + "level-up.ogg"),
			gameOver: new Audio(path + "game-over.ogg"),
			getReady: new Audio(path + "get-ready.ogg"),
			wallCollision: new Audio(path + "wall-collision.ogg"),
			wallExplosion: new Audio(path + "wall-explosion.ogg"),
			newSphere: new Audio(path + "new-sphere.ogg"),
		}
	}

	static _loadMusics()
	{
		const path = "data/sounds/musics/"
		Data.musics = {}
		Data.musics.game = [
			new Audio(path + "game/SyncroSonic.ogg"),
			new Audio(path + "game/beyond black hole (220v).ogg")
		]
		Data.musics.menu = new Audio(path + "menu/Check the Map !!.ogg")
	}
}

Data.onWindowResize = null
Data.canvasName = "WallFallCanvas"
Data.width = 700
Data.height = 700
