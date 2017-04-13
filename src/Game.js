import Tileset from './Tools/Tileset'

export default class Game
{
	constructor(data)
	{
		this.data = data
		this.context = data.context
		this.music = new Audio("data/sounds/musics/game/03 - SyncroSonic.ogg")
		this.tileset = new Tileset("data/assets.png")
		this.tiles = null;
		this.tileset.tileset.onload = () => this.tiles = this.tileset.getTiles(40, 40, 0, 0)
	}
	
	start()
	{
		//this.music.play();
		setInterval(() => this.draw(), 50)
	}
	
	draw()
	{
		if (this.tiles === null)
			return
		this.context.fillStyle = "black"
		this.context.fillRect(0, 0, 700, 700)
		this.context.fill()
		let tile = this.tiles[0][0]
		this.context.drawImage(tile, 350, 350)
	}
}