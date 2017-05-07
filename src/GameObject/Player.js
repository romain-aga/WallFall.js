import Enum from '../Tools/Enum'
import MathTools from '../Tools/MathTools'
import Data from '../Data'
import GameObjectBehavior from './GameObjectBehavior'
import Pool from './Pool'

export default class Player extends GameObjectBehavior
{
    init(self)
    {
        super.init(self)
        self.states = new Enum('normal', 'god', 'last', 'berserk', 'inverse')
        self.state = self.states.normal
        self.maxSpeed = 10
        self.x = Data.middle.x
        self.y = Data.middle.y
        self.sprites = []
        for (let i = 0; i < 5; ++i)
            self.sprites.push(self.data.sphereSprites[0][i])
        self.colors = [ "#7c1504", "#f6be0a", "#d20000", "#6b0e04","#ba7301" ]
        self.color = self.colors[0]
        self.sprite = self.sprites[0]
        self.width = self.sprite.width
        self.height = self.sprite.height
        self.offsetX = self.width / 2
        self.offsetY = self.height / 2
        self.god = 10
        self.berserk = 0
        self.inverse = 0
        self.lives = 3
        self.score = 0
        self.countdown = 50000
        self.i_particule = 0
    }

    update(self)
    {
        this._updateCoord(self)
        this._drawQueue(self)
	}
	
	destroy(self)
	{
        super.destroy(self)
	}

    _updateCoord(self)
    {
        let sens = 1 - (self.inverse > 0) * 2
        let mouseX = self.data.mouseX - self.offsetX
        let mouseY = self.data.mouseY - self.offsetY
        if (isNaN(mouseX) || isNaN(mouseY))
            return
        self.direction = MathTools.direction(self.x, self.y, mouseX, mouseY)
        self.speed = MathTools.distance(self.x, self.y, mouseX, mouseY)
        if (self.maxSpeed < self.speed)
            self.speed = self.maxSpeed
        let angle = MathTools.rads(self.direction)
        self.x += Math.cos(angle) * self.speed * sens
        self.y -= Math.sin(angle) * self.speed * sens
		if (self.x < self.data.bounds.x.min)
            self.x = self.data.bounds.x.min
        if (self.data.bounds.x.max - self.width < self.x)
            self.x = self.data.bounds.x.max - self.width
		if (self.y < self.data.bounds.y.min)
            self.y = self.data.bounds.y.min
        if (self.data.bounds.y.max - self.height < self.y)
            self.y = self.data.bounds.y.max - self.height
    }

    _drawQueue(self)
    {
        if (self.i_particule++ % 2 === 0 && self.speed)
            Pool.pools.particles.create(self.x, self.y, 0, 0, self.width, self.color)
    }
}