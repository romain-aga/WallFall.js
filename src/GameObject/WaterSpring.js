'use strict'

import MathTools from '../Tools/MathTools'

// tension: A low spring constant will cause large waves that oscillate slowly.
//     a high spring constant will create small waves that oscillate quickly (like jiggling Jello)
// dampening: It should be fairly small if you want your waves to oscillate.
//     A high dampening factor will make the water look thick like molasses,
//     while a low value will allow the waves to oscillate for a long time.
// spread: It controls how fast the waves spread. [0 : 0.5] with larger values spread waves faster
const waterSpringConstants = {
    tension: 0.05,
    dampening: 0.025,
    spreadNeighbours: 0.25,
    spreadUp: 0.0125,
    spreadDown: 0.0
}

export default class WaterSpring
{
    constructor(parent, x, y, direction)
    {
        this.deltas = {
            up: 0,
            down: 0,
            left: 0,
            right: 0
        }
        this.x = this.x_start = x
        this.y = this.y_start = y
        this.parent = parent
        this.speed = 0
        this.distance = 0
        this.direction = direction
        this.constants = this.parent.constants
    }

    get direction()
    {
        return this._direction
    }

    set direction(direction)
    {
        this._direction = direction
        this._radDirection = MathTools.rads(direction) 
        this.cos = Math.cos(this._radDirection)
        this.sin = Math.sin(this._radDirection)
    }

    update()
    {
        if (Math.abs(this.distance) < 0.01)
            this.distance = 0
        if (Math.abs(this.speed) < 0.001)
            this.speed = 0
        let accel = -this.constants.tension * this.distance
        accel -= this.speed * this.constants.dampening
        this.speed += accel
        this.distance += this.speed
        const distance = this.distance * this.parent.alpha + this.parent.offset
        this.x = this.x_start + this.cos * distance
        this.y = this.y_start - this.sin * distance
    }
}

WaterSpring.constants = waterSpringConstants