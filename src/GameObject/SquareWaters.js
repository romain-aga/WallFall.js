'use strict'

import ColorTools from '../Tools/ColorTools'
import WaterSpring from './WaterSpring'
import SquareWater from './SquareWater'

export default class SquareWaters
{
    constructor(x, y, corner, length, {
        color1 = '#0000FFFF',
        color2 = '#00FFFFFF',
        step = 10,
        alpha = 1,
        growValue = 1,
        shrinkValue = -5,
        springConstants = WaterSpring.constants
    } = {})
    {
        this.x = x
        this.y = y
        this.alpha = alpha
        this.maxSize = corner * length
        this.size = 0
        this.corner = corner
        this.growValue = growValue
        this.shrinkValue = shrinkValue
        this.growth = this.growValue
        this._length = length
        this.waters = []
        for (let i = 0; i < length; ++i)
            this.waters.push(new SquareWater(
                x, y, {
                    side: corner * 2 * (1 + i),
                    corner,
                    colors: color1,
                    alpha: alpha,
                    step: step,
                    springConstants
                }
            ))
        this.generateColorsRange(color1, color2)
        //this.waters.forEach(w => w.tilt = true)
        this.waters.reverse()
        this.waters.forEach((w, i) => this.waters[i + 1] && w.above(this.waters[i + 1]))
    }

    setCoords(x, y)
    {
        this.x = x
        this.y = y
        this.waters.forEach(w => w.setCoords(x, y))
    }

    update()
    {
        //if (this.size <= 0 && this.growth < 0)
        if (this.size < this.maxSize)
        {
            if (this.size + this.growValue <= this.maxSize)
                this.size += this.growValue
            else
                this.size = this.maxSize
        }
        //if (this.maxSize  <= this.size && 0 < this.growth)
        if (this.maxSize < this.size)
        {
            if (this.maxSize <= this.size + this.shrinkValue)
                this.size += this.shrinkValue
            else
                this.size = this.maxSize
        }
        //if (this.size !== this.maxSize)
        //    this.size += this.growth

        this._updateWaterSize()
        
        this.waters.forEach(w => w.update())
    }

    draw(context)
    {
        this.waters.forEach(w => w.draw(context))
    }

    _updateWaterSize()
    {
        if (this.size === 0)
            this.waters.forEach((w, i) => {
                w.offset = -this.corner
                w.alpha = 0
            })
        else
            this.waters.forEach((w, i) => {
                const waveOffset = this.size - this.corner * (this.waters.length - i)
                w.tilt = false
                if (0 <= waveOffset)
                    w.offset = 0
                else if (waveOffset <= -this.corner)
                    w.offset = -this.corner
                else
                {
                    w.offset = waveOffset
                    w.tilt = this.size !== this.maxSize
                }
                w.alpha = (1 - w.offset / -this.corner) * this.alpha
            })
    }

    generateColorsRange(color1, color2)
    {
        color1 = ColorTools.toRgba(color1)
        color2 = ColorTools.toRgba(color2)
        const colorStep = {
            r: color2.r - color1.r,
            g: color2.g - color1.g,
            b: color2.b - color1.b,
            a: color2.a - color1.a
        }
        for (let i = 0; i < this._length; ++i)
        {
            const mult = i / this._length
            const mult1 = (i + 1) / this._length
            this.waters[i].colors = [
                ColorTools.rgbaToRgbaString(
                    color1.r + colorStep.r * mult,
                    color1.g + colorStep.g * mult,
                    color1.b + colorStep.b * mult,
                    (color1.a + colorStep.a * mult)// * (i + 1.0) / (this._length + 1)
                ),
                ColorTools.rgbaToRgbaString(
                    color1.r + colorStep.r * mult1,
                    color1.g + colorStep.g * mult1,
                    color1.b + colorStep.b * mult1,
                    (color1.a + colorStep.a * mult1)// * (i + 1.0) / (this._length + 1)
                )
            ]
        }
    }
}
