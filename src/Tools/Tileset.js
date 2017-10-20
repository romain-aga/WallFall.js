import ImageHelper from './ImageHelper'

export default class Tileset
{
	constructor(src)
	{
		this.tileset = new Image()
		this.tileset.src = src
		this.tileset.setAttribute('crossOrigin', 'anonymous')
	}
	
	getTiles(tileWidth, tileHeight, offsetX, offsetY, onload = () => {})
	{
		offsetX = offsetX || 0
		offsetY = offsetY || 0
		let width = this.tileset.width - offsetX
		let height = this.tileset.height - offsetY
		let tiles = []
		let loadedTiles = 0
		const totalTiles = ((width / tileWidth) | 0) * ((height / tileHeight) | 0)
		const tileOnload = () => ++loadedTiles === totalTiles && onload()
		for (var x = 0; x * tileWidth < width; ++x)
		{
			let column = [];
			for (let y = 0; y * tileHeight < height; ++y)
				column.push(
					this._createTile(
						offsetX + x * tileWidth,
						offsetY + y * tileHeight,
						tileWidth,
						tileHeight,
						tileOnload
					))
			tiles.push(column)
		}
		return tiles
	}

	_createTile(x, y, width, height, onload)
	{
		const tile = ImageHelper.imageToTile(this.tileset, x, y, width,	height)
		if (tile.complete)
			onload()
		else
			tile.onload = onload
		return tile
	}
}