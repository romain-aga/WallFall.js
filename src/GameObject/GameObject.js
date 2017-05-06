export default class GameObject
{
	constructor(data)
	{
		this.data = data
		this.x = 0
		this.y = 0
		this.width = 0
		this.height = 0
		this.sprite = null
		this.direction = 0
		this.speed = 0
		this.behavior = null
	}
	
	init(behavior)
	{
		this.behavior = behavior
		this.behavior.init(this)
	}
	
	update()
	{
		this.behavior.update(this)
	}
	
	draw()
	{
		this.behavior.draw(this)
	}
	
	destroy()
	{
		this.behavior.destroy(this)
		this.behavior = null
	}
}
	