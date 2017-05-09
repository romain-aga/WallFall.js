import Game from './Game'

export default class WallFall
{
	constructor(data)
	{
		window.onkeyup = ev => this._onKeyUp(ev)
		this.data = data
		this.game = new Game(this.data)
	}
	
	run()
	{
		this.game.start()
	}

	_onKeyUp(event)
	{
		if (event.keyCode == 27)
			this.game.pause = ! this.game.pause
		if (event.keyCode == 13)
		{
			this.game.stop()
			this.game = new Game(this.data)
			this.run()
		}
	}
}
