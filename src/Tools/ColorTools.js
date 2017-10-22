'use strict'

export default class ColorTools
{
    static objRgbaToHex({ r, g, b, a })
    {
        return ColorTools.rgbaToHex(r, g, b, a)
    }

    static rgbaToHex(r, g, b, a)
    {
        const toHex = x => ColorTools._chars[(x - (x % 16)) / 16] + ColorTools._chars[x % 16]
        return "#" + toHex(r) + toHex(g) + toHex(b)
            + (a === undefined ? '' : toHex(Math.round(a * 255)))
    }
    
    static hexToRgba(hex)
    {
		hex = hex.toUpperCase()
        const components = [0, 0, 0, 0]
        let componentLength = (hex.length - 1) / 3
        if (componentLength != (componentLength | 0))
            componentLength = (hex.length - 1) / 4
        for (let i = 1; i < hex.length; ++i)
        {
            const index = ((i - 1) / componentLength) | 0
            components[index] += components[index] * 15 + ColorTools._chars.indexOf(hex[i])
        }
        return {
            r: components[0],
            g: components[1],
            b: components[2],
            a: components[3] / 255.0
        }
    }

    static objRgbaToRgbaString({ r, g, b, a}, alpha)
    {
        return ColorTools.rgbaToRgbaString(r, g, b, (a !== undefined ? a : alpha))
    }

    static rgbaToRgbaString(r, g, b, a = 1)
    {
        return `rgba(${r | 0}, ${g | 0}, ${b | 0}, ${a})`
    }

    static hexToRgbaString(hex, alpha)
    {
        const rgba = ColorTools.hexToRgba(hex)
        if (alpha !== undefined)
            rgba.a = alpha
        return ColorTools.objRgbaToRgbaString(rgba)
    }

    static  rgbaStringToRgba(rgbaString)
    {
        const match = ColorTools._rgbaRegex.exec(rgbaString)
        return match
            && {
                r: +match[1],
                g: +match[2],
                b: +match[3],
                a: match[4] && +match[4]
            }
    }

    static rgbaStringToHex(rgbaString)
    {
        const rgba = ColorTools.rgbaStringToRgba(rgbaString)
        return rgba && ColorTools.objRgbaToHex(rgba)
    }

    static toHex(color)
    {
        if (3 <= arguments.length)
            return ColorTools.rgbaToHex(...arguments)
        if (color instanceof Object)
            return ColorTools.objRgbaToHex(color)
        if (color && color[0] === '#')
            return color
        return ColorTools.rgbaStringToHex(color)
    }

    static toRgba(color)
    {
        if (3 <= arguments.length)
            return {
                r: arguments[0],
                g: arguments[1],
                b: arguments[2],
                a: arguments[3]
            }
        if (color instanceof Object)
            return color
        if (color && color[0] === '#')
            return ColorTools.hexToRgba(color)
        return ColorTools.rgbaStringToRgba(color)
    }

    static toRgbaString(color)
    {
        if (3 <= arguments.length)
            return ColorTools.rgbaToRgbaString(...arguments)
        if (color instanceof Object)
            return ColorTools.objRgbaToRgbaString(color)
        if (color)
        {
            if (color[0] === '#')
                return ColorTools.hexToRgbaString(color)
            if (color.toLowerCase().startsWith('rgba('))
                return color
        }
        return null
    }
}

ColorTools._chars = "0123456789ABCDEF"
ColorTools._rgbaRegex = /rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*(\d(?:\.?\d*))\s*)?\)/i
