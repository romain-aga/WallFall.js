import BaseWall from './BaseWall'

export default class Wall extends BaseWall
{
    init(self)
    {
        super.init(self, self.data.wallSprites[0][0], "#0310eb")
    }
}
