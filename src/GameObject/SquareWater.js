'use strict'

import MathTools from '../Tools/MathTools'
import WaterSpring from './WaterSpring'
import Water from './Water'

export default class SquareWater extends Water
{
    constructor(x, y, options = {})
    {
        super(x, y, options)
    }
    
    _init(x, y, {
        side = 300,
        step = 5,
        colors = ['cyan', 'blue'],
        alpha = 1,
        corner = 30,
        angle = 0,
        springConstants = WaterSpring.constants
    })
    {
        this.aboveWater = null
        this.alpha = alpha
        this.colors = colors
        this.colorAngle = 0
        this.colorPhase = 0
        this.constants = Object.assign(WaterSpring.constants, springConstants)
        this.side = side
        this.corner = corner
        this.x = x
        this.y = y
        this.springs = []
        this.gradientPhases = [this.gradientPhase1, this.gradientPhase2]
        const halfSide = (side - corner * 2) / 2
        for (let iSide = 0; iSide < 4; ++iSide)
        {
            let stepCos = Math.cos(MathTools.rads(angle - iSide * 90))
            let stepSin = Math.sin(MathTools.rads(angle - iSide * 90))
            let sideCos = Math.cos(MathTools.rads(angle + (1 - iSide) * 90))
            let sideSin = Math.sin(MathTools.rads(angle + (1 - iSide) * 90))
            for (let iStep = 0; iStep * step < halfSide * 2; ++iStep)
                this.springs.push(new WaterSpring(
                    this,
                    x + stepCos * (iStep * step - halfSide) + sideCos * side / 2,
                    y - stepSin * (iStep * step - halfSide) - sideSin * side / 2,
                    angle + (1 - iSide) * 90
                ))
            let xCenter = x + (stepCos + sideCos) * (side / 2 - corner)
            let yCenter = y - (stepSin + sideSin) * (side / 2 - corner)
            for (let iStep = 0; iStep * step < 90; ++iStep)
            {
                const springAngle = angle + (1 - iSide) * 90 - iStep * step
                this.springs.push(new WaterSpring(
                    this,
                    xCenter + Math.cos(MathTools.rads(springAngle)) * corner,
                    yCenter - Math.sin(MathTools.rads(springAngle)) * corner,
                    springAngle
                ))
            }
        }
    }

    draw(context)
    {
        if (this.alpha)
        {
            const colorAngle = MathTools.rads(this.colorAngle)
            const colorCos = Math.cos(colorAngle)
            const colorSin = Math.sin(colorAngle)
            
            context.globalAlpha = this.alpha
            const side = (this.side + this.offset)
            let gradient = context.createLinearGradient(
                this.x - colorCos * side,
                this.y + colorSin * side,
                this.x + colorCos * side,
                this.y - colorSin * side
            )
            
            context.fillStyle = gradient
            context.beginPath()
            this.springs.forEach(s => context.lineTo(s.x, s.y))
            context.closePath()
            context.fill()

            context.globalAlpha = this.alpha / 2.0
            gradient = context.createRadialGradient(this.x, this.y, 0, this.x, this.y, side)
            this.gradientColors(gradient, this.colors[0], this.colors[1])
            context.fillStyle = gradient
            context.fill()
        }
        this.colorAngle = (this.colorAngle + 5) % 360
        if (this.colorAngle === 0)
            this.colorPhase = ++this.colorPhase % this.gradientPhases.length
    }

    gradientColors(gradient, color1, color2)
    {
        this.gradientPhases[this.colorPhase]
            .call(this, gradient, color1, color2, this.colorAngle / 360.0)
    }

    gradientPhase1(gradient, color1, color2, value)
    {
        gradient.addColorStop(0, color2)
        gradient.addColorStop(value, color1)
        gradient.addColorStop(1, color2)
    }

    gradientPhase2(gradient, color1, color2, value)
    {
        gradient.addColorStop(0, color1)
        gradient.addColorStop(value, color2)
        gradient.addColorStop(1, color1)
    }
}
