import Enum from '../Tools/Enum'
import MathTools from '../Tools/MathTools'
import Data from '../Data'
import GameObjectBehavior from './GameObjectBehavior'

export default class Player extends GameObjectBehavior
{
    init(self)
    {
        super.init(self)
        self.states = new Enum('normal', 'god', 'last', 'berserk', 'inverse')
        self.state = self.states.normal
        self.maxSpeed = 0.282
        self.x = this.data.width / 2
        self.y = this.data.height / 2
        self.god = 10
        self.berserk = 0
        self.inverse = 0
        self.lives = 3
        self.score = 0
        self.countdown = 50000
        self.sprites = []
        for (let i = 0; i < 5; ++i)
            self.sprites.push(this.data.sphereSprites[0][i])
        self.sprite = self.sprites[0]
    }

    update(self)
    {
        sens = 1 - (self.inverse > 0) * 2
        self.direction = MathTools.direction(self.x, self.y, self.data.mouseX, self.data.mouseY)
        speed = MathTools.distance(self.x, self.y, self.data.mouseX, self.data.mouseY)
        if (self.speed < 0)
            self.speed = 0
        else if (self.speed < self.maxSpeed)
            self.speed += 0.05
        if (self.speed <= speed)
            speed = self.speed

        let angle = MathTools.rads(self.direction)
        let temp = self.x + cos(angle) * speed * sens
		if (0 <= temp && temp <= self.data.width - 25)
            self.x = temp
		temp = self.y - sin(angle) * speed * sens
		if (0 <= temp && temp <= self.data.height - 25)
            self.y = temp
	}
	
	destroy(self)
	{
        super.destroy(self)
	}
}