import Pools from '../Pools'
import Collision from '../../Tools/Collision'
import BaseWall from './BaseWall'

export default class OnslaughtWall extends BaseWall
{
    init(self)
    {
        self._detectionRect = {}
        super.init(self, self.data.wallSprites[1][2], "#2903fe")
        self.maxSpeed = self.speed * 2
        self.minSpeed = self.speed / 2
        self.speed = self.minSpeed
    }

    newCoords(self)
    {
        super.newCoords(self)
        if (self.minSpeed)
            self.speed = self.minSpeed
        this._updateDetectionRect(self)
    }

    changeSpeed(self)
    {
        this._updateDetectionRectCoords(self)
        Pools.Player.forEach(p => {
            self.speed = Collision.circleRect(p, self._detectionRect)
                ? self.maxSpeed
                : self.minSpeed
        })
    }

    _updateDetectionRect(self)
    {
        this._updateDetectionRectCoords(self)
        self._detectionRect.width = (self.direction % 2 === 0 ? self.data.width : self.width)
        self._detectionRect.height = (self.direction % 2 === 1 ? self.data.height : self.height)
    }

    _updateDetectionRectCoords(self)
    {
        self._detectionRect.x = self.x - (self.direction === 2 && self.data.width)
        self._detectionRect.y = self.y - (self.direction === 1 && self.data.height)
    }
}
