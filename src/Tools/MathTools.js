export default class MathTools
{
    static degs(angleInRadians)
    {
        return angleInRadians * 180 / Math.PI
    }

    static rads(angleInDegrees)
    {
        return angleInDegrees * Math.PI / 180;
    }

    static sqpw(x)
    {
        return x * x
    }

    static squareDistance(x, y, x2, y2)
    {
        return (x - x2) * (x - x2) + (y - y2) * (y - y2)
    }

    static distance(x, y, x2, y2)
    {
        return Math.sqrt(MathTools.squareDistance(...arguments))
    }

    static direction(x, y, x2, y2)
    {
        if (y == y2)
            return (x <= x2 ? 0 : 180)
        if (x == x2)
            return (y < y2 ? 270 : 90)
        const dir = MathTools.degs(Math.acos(MathTools.sqpw(x - x2) / MathTools.squareDistance(x, y, x2, y2)))
        if (x < x2)
            return (y2 <= y ? dir : 360 - dir)
        return (y < y2 ? dir + 180 : 180 - dir)
    }

    static clamp(value, min, max)
    {
        return value < min
            ? min
            : (max < value ? max : value)
    }
}
