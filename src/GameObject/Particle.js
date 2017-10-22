'use strict'

import MathTools from '../Tools/MathTools'
import GameObjectBehavior from './GameObjectBehavior'

export default class Particle extends GameObjectBehavior
{
	init(self, x, y, direction=0, speed=0, width=10, color='#ffffff', isSquare=false, decreasingSpeed=0.5)
	{
        this.fullCircle = Math.PI * 2
        self.x = x
        self.y = y
        self.direction = direction
        self.speed = speed
        self.decreasingSpeed = decreasingSpeed
        self.width = width
        self.height = width
        self.radius = width / 2
        self.color = color
        self.isSquare = isSquare
        self.isAffectedByStopWall = self.data.game.durations.stopWall === 0
        let rads = MathTools.rads(direction)
        self.dx = Math.cos(rads) * self.speed + self.decreasingSpeed
        self.dy = -Math.sin(rads) * self.speed + self.decreasingSpeed
	}
	
	update(self)
	{
        if (self.isAffectedByStopWall && self.data.game.durations.stopWall)
            return
        self.radius -= self.decreasingSpeed
        self.height = self.width = self.radius * 2
        if (self.radius <= 0)
            self.destroy()
        else
        {
            self.x += self.dx
            self.y += self.dy
        }
	}
	
	draw(self)
	{
        self.data.context.fillStyle = self.color
        if (self.isSquare)
        {
            (self._clearScreen = 1 < (self.width | 0) && 1 < (self.height | 0))
            && self.data.context.fillRect(self.x | 0, self.y | 0, self.width | 0, self.height | 0)
        }
        else if ((self._clearScreen = 1 < ((self.radius * 2) | 0)))
        {
            self.data.context.beginPath()
            self.data.context.arc((self.x + self.radius) | 0, (self.y + self.radius) | 0, self.radius, 0, this.fullCircle)
            self.data.context.fill()
        }
	}
}
