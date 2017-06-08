'use strict'

export default class Color
{
    static rgbToHex(r, g, b)
    {
        let toHex = x => Color.chars[(x - (x % 16)) / 16] + Color.chars[x % 16]
        return "#" + toHex(r) + toHex(g) + toHex(b)
    }

    static hexToRgb(hex)
    {
        let components = [0, 0, 0]
        let iComponent = -1
        for (let i = 0; i < hex.length - 1; ++i)
        {
            iComponent += (i % 2 === 0)
            components[iComponent] *= 16
            components[iComponent] += Color.chars.indexOf(hex[i + 1])
        }
        return components
    }
}

Color.chars = "0123456789ABCDEF"
