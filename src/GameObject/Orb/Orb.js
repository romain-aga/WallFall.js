'use strict'

import BaseOrb from './BaseOrb'

export default class Orb extends BaseOrb
{
    constructor()
    {
        super()
        this.score = 10
        this.time = 1000
        this.secondsForBonus = 5
        this.timeSeconds = this.time / 1000
    }

    init(self)
    {
        super.init(self, self.data.orbSprites[1][0], "#ff8e00")
        self.previousCountdown = null
        self.previousAdditionnalSeconds = this.timeSeconds
    }

    bonus(self, player)
    {
        self.data.game.levelStep++
        player.score += this.score
        player.time += this.time
        if (self.previousCountdown != null)
        {
            let diff = this.secondsForBonus - self.previousCountdown + player.countdown
            if (0 < diff)
            {
                let ratio = diff / this.secondsForBonus
                player.score += ratio * this.score
                player.time += ratio * this.time / 2
                self.previousAdditionnalSeconds = (this.time + ratio * this.time) / 1000
            }
        }
        self.previousCountdown = player.countdown + self.previousAdditionnalSeconds
    }
}
