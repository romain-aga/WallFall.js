import BaseSphere from './BaseSphere'

export default class Sphere extends BaseSphere
{
    init(self)
    {
        super.init(self, self.data.sphereSprites[1][0], "#ff8e00")
    }

    bonus(self)
    {
        self.data.information.level += 1
        self.data.information.score += 10
    }
}
