import BaseWall from './BaseWall'

export default class StraightWall extends BaseWall
{
    init(self)
    {
        self.startX = undefined
        self.startY = undefined
        super.init(self, self.data.wallSprites[4][3], "#6163ba")
    }

    newCoords(self)
    {
        self.i_newCoord = 5
        if (self.startX === undefined)
        {
            super.newCoords(self)
            self.startX = self.x
            self.startY = self.y
        }
        else
        {
            self.x = self.startX
            self.y = self.startY
        }
    }
}
