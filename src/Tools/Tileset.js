import ImageHelper from './ImageHelper'

export default class Tileset
{
	constructor(src)
	{
		this.tileset = new Image()
		this.tileset.src = src
		this.tileset.setAttribute('crossOrigin', 'anonymous')
	}
	
	getTiles(tileWidth, tileHeight, offsetX, offsetY)
	{
		offsetX = offsetX || 0
		offsetY = offsetY || 0
		let width = this.tileset.width - offsetX
		let height = this.tileset.height - offsetY
		let tiles = []
		for (var x = 0; x * tileWidth < width; ++x)
		{
			let column = [];
			for (let y = 0; y * tileHeight < height; ++y)
				column.push(
					ImageHelper.imageToTile(
						this.tileset,
						offsetX + x * tileWidth,
						offsetY + y * tileHeight,
						tileWidth,
						tileHeight
					))
			tiles.push(column)
		}
		return tiles
	}
}