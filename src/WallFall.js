class WallFall
{
	constructor(data)
	{
		this.data = data
		this.current = new Game(this.data)
	}
	
	run()
	{
		/*function draw()
		{
			this.current.draw()
		}*/
		this.current.start()
		//setInterval(draw, 50)
	}
}