import MathTools from '../Tools/MathTools'
import Color from '../Tools/Color'
import Random from '../Tools/Random'
import GameObjectBehavior from './GameObjectBehavior'
import Pool from './Pool'

export default class Explosion extends GameObjectBehavior
{
	init(self, x, y, width=25, color='#ffffff', colorGap=30, isSquare=false, decreasingSpeed=0.5)
	{
        self.x = x
        self.y = y
        self.decreasingSpeed = decreasingSpeed
        self.width = width
        self.height = width
        self.radius = width / 2
        self.color = color
        self.isSquare = isSquare
        self.colorGap = colorGap
        self.rgb = Color.hexToRgb(color)
        for (let i = 0; i < 3; ++i)
            if (self.rgb[i] + self.colorGap > 255)
                self.rgb[i] = 255 - self.colorGap
            else if (self.rgb[i] - self.colorGap < 0)
                self.rgb[i] = self.colorGap
	}
	
	update(self)
	{
        self.radius -= self.decreasingSpeed
        self.height = self.width = self.radius * 2
        if (self.radius <= 0)
            self.destroy()
        else
        {
            let x = self.x + Random.range(-self.radius, self.radius)
            let y = self.y + Random.range(-self.radius, self.radius)
            let direction = MathTools.direction(self.x, self.y, x, y)
            let speed = MathTools.squareDistance(self.x, self.y, x, y) / (self.radius * self.radius) * 5
            let color = Color.rgbToHex(
                self.rgb[0] + Random.range(0, self.colorGap),
                self.rgb[1] + Random.range(0, self.colorGap),
                self.rgb[2] + Random.range(0, self.colorGap)
            )
            Pool.pools.particles.create(x, y, direction, speed, self.width, self.color, self.isSquare, self.decreaseSpeed)
        }
	}
	
	draw(self)
	{
        self.data.context.fillStyle = self.color
        if (self.isSquare)
            self.data.context.fillRect(self.x | 0, self.y | 0, self.width | 0, self.height | 0)
        else
        {
            self.data.context.beginPath()
            self.data.context.arc((self.x + self.radius) | 0, (self.y + self.radius) | 0, self.radius, 0, this.fullCircle)
            self.data.context.fill()
        }
	}
}
