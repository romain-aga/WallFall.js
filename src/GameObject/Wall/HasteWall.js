import BaseWall from './BaseWall'

export default class HasteWall extends BaseWall
{
    init(self)
    {
        super.init(self, self.data.wallSprites[2][2], "#24b6fc")
    }

    newCoords(self)
    {
        super.newCoords(self)
        self.speed = 0
    }

    particles(self)
    {
        let temp = self.speed
        if (temp < 2)
            self.speed = 2
        super.particles(self)
        self.speed = temp
    }

    update(self)
    {
        self.speed += self.data.frameTime * 2
        super.update(self)
    }
}
