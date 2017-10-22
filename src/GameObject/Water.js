'use strict'

import MathTools from '../Tools/MathTools'
import WaterSpring from './WaterSpring'

export default class Water
{
    constructor(x, y, options = {})
    {
        this._init(x, y, options)
    }

    _init(x, y, {
        length = 300,
        alpha = 1,
        arc = 0,
        step = 5,
        depth = 500,
        colors = ['cyan', 'blue'],
        angle = 0,
        springConstants = WaterSpring.constants
    })
    {
        //this.tilt = true
        this.aboveWater = null
        this.alpha = alpha
        this.colors = colors
        this.colorAngle = 0
        this.colorPhase = 0
        this.x = x
        this.y = y
        this.offset = 0
        this.depth = depth
        this.springs = []
        this.cos = Math.cos(MathTools.rads(angle))
        this.sin = Math.sin(MathTools.rads(angle))
        this.cosDepth = Math.cos(MathTools.rads(angle - 90)) * this.depth
        this.sinDepth = Math.sin(MathTools.rads(angle - 90)) * this.depth
        this.isArc = !!arc
        this.width = (this.isArc ? 0 : length / step)
        this.constants = Object.assign(WaterSpring.constants, springConstants)
        if (arc)
            for (let i = 0; i * step <= arc; ++i)
                this.springs.push(new WaterSpring(
                    this,
                    x + Math.cos(MathTools.rads(angle + i * step)) * depth,
                    y - Math.sin(MathTools.rads(angle + i * step)) * depth,
                    angle + i * step))
        else
            for (let i = 0; i * step <= length; ++i)
                this.springs.push(new WaterSpring(this, x + this.cos * i * step,
                    y - this.sin * i * step, angle + 90))
    }

    setCoords(x, y)
    {
        const deltaX = x - this.x
        const deltaY = y - this.y
        this.springs.forEach(s => {
            s.x_start += deltaX
            s.y_start += deltaY
            s.x += deltaX
            s.y += deltaY
        })
        this.x = x
        this.y = y
    }

    above(water)
    {
        water.aboveWater = this
    }

    below(water)
    {
        this.aboveWater = water
    }

    _updateSpringsDeltasAndSpeed()
    {
        this.springs.forEach((current, index) => {
            const length = this.springs.length
            const previous = this.springs[(length + index - 1) % length]
            const next = this.springs[(index + 1) % length]
            current.deltas.left = current.constants.spreadNeighbours
                * (current.distance - previous.distance)
            previous.speed += current.deltas.left
            
            current.deltas.right = current.constants.spreadNeighbours
                * (current.distance - next.distance)
            next.speed += current.deltas.right
        })
    }

    update()
    {
        if (this.alpha === 0)
        {
            this.springs.forEach(s => {
                s.distance = 0
                s.speed = 0
            })
            return
        }
        if (this.tilt && Math.random() * 100 < 10)
            this.springs[(Math.random() * this.springs.length) | 0].speed = -50 + Math.random() * 100
        const length = this.springs.length
        this.springs.forEach(s => s.update())
        for (let i = 0; i < 8; ++i)
        {
            this._updateSpringsDeltasAndSpeed()
            this.springs.forEach((s, index) => {
                const previous = this.springs[(length + index - 1) % length]
                const next = this.springs[(index + 1) % length]
                previous.distance += s.deltas.left
                next.distance += s.deltas.right
                if (i == 7 && this.aboveWater)
                {
                    const aboveSpring = this.aboveWater.springs[index]
                    aboveSpring.speed += s.speed * s.constants.spreadUp
                    s.speed += aboveSpring.speed * aboveSpring.constants.spreadDown
                    aboveSpring.distance += s.distance * s.constants.spreadUp
                    s.distance += aboveSpring.distance * s.constants.spreadDown
                }
            })
        }
    }

    draw(context)
    {
        if (this.alpha === 0)
            return
        context.globalAlpha = this.alpha
        let gradient = context.createLinearGradient(
            this.x, this.y,
            this.x + this.cosDepth, this.y - this.sinDepth
        )
        gradient.addColorStop(0, this.colors[0]);
        gradient.addColorStop(1, this.colors[1]);

        context.fillStyle = gradient;
        context.beginPath()
        if (this.isArc)
            context.moveTo(this.x, this.y)
        else
            context.moveTo(this.x + this.cosDepth, this.y - this.sinDepth)
        this.springs.forEach(s => context.lineTo(s.x, s.y))
        if (!this.isArc)
            context.lineTo(
                this.springs[this.springs.length - 1].x + this.cosDepth,
                this.y - this.sinDepth
            )
        context.closePath()
        context.fill()
    }
}
