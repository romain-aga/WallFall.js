import Game from './Game'

export default class WallFall
{
	constructor(data)
	{
		this.data = data
		this.current = new Game(this.data)
	}
	
	run()
	{
		this.current.start()
	}
}