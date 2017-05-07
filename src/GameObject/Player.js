import Enum from '../Tools/Enum'
import MathTools from '../Tools/MathTools'
import Data from '../Data'
import GameObjectBehavior from './GameObjectBehavior'
import Pool from './Pool'
import New from './New'

export default class Player extends GameObjectBehavior
{
    init(self)
    {
        super.init(self)
        self.maxSpeed = 10
        self.x = self.data.middle.x
        self.y = self.data.middle.y
        if (! self.sprites)
        {
            self.specialStates = [ 'god', 'berserk', 'inverse' ]
            self.states = new Enum('normal', 'last', ...self.specialStates)
            self.sprites = []
            for (let i = 0; i < 5; ++i)
                self.sprites.push(self.data.orbSprites[0][i])
            self.colors = [ "#7c1504", "#d20000", "#f6be0a", "#6b0e04","#ba7301" ]
            self.stateValues = {}
        }
        self.specialStates.forEach(k => self.stateValues[k] = 0)
        self.state = self.states.normal
        self.color = self.colors[0]
        self.sprite = self.sprites[0]
        self.width = self.sprite.width
        self.height = self.sprite.height
        self.halfWidth = self.width / 2
        self.halfHeight = self.height / 2
        self.stateValues.god = 10
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
        this._updateState(self)
        this._drawQueue(self)
	}
	
	destroy(self)
	{
        super.destroy(self)
	}

    _updateState(self)
    {
        self.state = self.lives === 1
            ? self.states.last
            : self.states.normal
        for (let i = self.specialStates.length - 1; 0 <= i; --i)
        {
            let state = self.specialStates[i]
            if (0 < self.stateValues[state])
            {
                self.stateValues[state] -= 1
                self.state = state
                break
            }
        }
        let index = self.states.index[self.state]
        self.sprite = self.sprites[index]
        self.color = self.colors[index]
    }

    _updateCoord(self)
    {
        let sens = 1 - (self.inverse > 0) * 2
        let mouseX = self.data.mouseX - self.halfWidth
        let mouseY = self.data.mouseY - self.halfHeight
        if (isNaN(mouseX) || isNaN(mouseY))
            return
        self.direction = MathTools.direction(self.x, self.y, mouseX, mouseY)
        self.speed = MathTools.squareDistance(self.x, self.y, mouseX, mouseY) / 2500 * self.maxSpeed
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
            New.Particle(self.x, self.y, 0, 0, self.width, self.color)
    }
}