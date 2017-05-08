import BaseOrb from './BaseOrb'

export default class BaseBonusOrb extends BaseOrb
{
    init(self, spriteX, spriteY, color)
    {
        super.init(self, self.data.orbSprites[spriteX][spriteY], color, true)
        self.lifetime = 500
        self.data.sounds.orbSpawn.play()
    }

    update(self)
    {
        super.update(self)
        if (--self.lifetime <= 0)
            self.destroy()
    }

    bonus(self, player)
    {
    }

    destroy(self)
    {
        if (! self.taken)
            this.explosion(self)
        else
            self.data.sounds.orbBonus.play()
    }
}