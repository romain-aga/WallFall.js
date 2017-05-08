export default class GameObject
{
	constructor(pool, data)
	{
		this._pool = pool
		this.data = data
		this.x = 0
		this.y = 0
		this.width = 0
		this.height = 0
		this.sprite = null
		this.color = '#ffffff'
		this.direction = 0
		this.speed = 0
		this.behavior = null
		this._rectToClean = {}
		this._precalcul = {}
		this._updateRectToClean()
		this._updatePrecalcul()
	}
	
	isInside()
	{
		return this.data.bounds.x.min <= this._precalcul.x_w
			&& this.x < this.data.bounds.x.max
			&& this.data.bounds.y.min <= this._precalcul.y_h
			&& this.y < this.data.bounds.y.max
	}

	isOnTheEdge()
	{
		return Math.abs(this._precalcul.x_w - this.data.bounds.x.min) < this.width
			|| Math.abs(this.x - this.data.bounds.x.max) < this.width
			|| Math.abs(this._precalcul.y_h - this.data.bounds.y.min) < this.height
			|| Math.abs(this.y - this.data.bounds.y.max) < this.height
	}

	init(behavior, ...args)
	{
		this.behavior = behavior
		this.behavior.init(this, ...args)
	}
	
	update()
	{
		this._updateRectToClean()
		this.behavior.update(this)
		this._cleanDrawing()
	}
	
	draw()
	{
		this._updatePrecalcul()
		if (this.isInside())
		{
			this.behavior.draw(this)
			 if (this.isOnTheEdge())
			 	this._drawCut()
		}
	}
	
	destroy()
	{
		this.behavior.destroy(this)
		this._cleanDrawing()
		this._pool.remove(this)
		this.behavior = null
	}
	
	_drawCut()
	{
		let x = this.x | 0
		let y = this.y | 0
		let w = this.width
		let h = this.height
		if (this.x < this.data.bounds.x.min)
			w = (this.data.bounds.x.min - this.x) | 0
		if (this.y < this.data.bounds.y.min)
			h = (this.data.bounds.y.min - this.y) | 0
		if (this.data.bounds.x.max <= this._precalcul.x_w)
		{
			x = this.data.bounds.x.max
			w = (this._precalcul.x_w - this.data.bounds.x.max) | 0
		}
		if (this.data.bounds.y.max <= this._precalcul.y_h)
		{
			y = this.data.bounds.y.max
			h = (this._precalcul.y_h - this.data.bounds.y.max) | 0
		}
		this.data.context.drawImage(this.data.backgroundCanvas, x, y, w, h, x, y, w, h)
	}

	_updateRectToClean()
	{
		if (this.behavior)
			this.behavior.updateRectToClean(this, this._rectToClean)
		else
		{
			this._rectToClean.x = (this.x - 1) | 0
			this._rectToClean.y = (this.y - 1) | 0
			this._rectToClean.w = (this.width + 2) | 0
			this._rectToClean.h = (this.height + 2) | 0
		}
	}

	_updatePrecalcul()
	{
		this._precalcul.x_w = this.x + this.width
		this._precalcul.y_h = this.y + this.height
	}

	_cleanDrawing()
	{
		this.data.context.drawImage(this.data.backgroundCanvas,
			this._rectToClean.x, this._rectToClean.y,
			this._rectToClean.w, this._rectToClean.h,
			this._rectToClean.x, this._rectToClean.y,
			this._rectToClean.w, this._rectToClean.h
		)
	}
}
