export default class MathTools
{
    static degs(angleInRadians)
    {
        return a * 180 / Math.PI
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
        return Math.sqrt(squareDistance(...arguments))
    }

    static direction(x, y, x2, y2)
    {
        if (y == y2)
            return (x <= x2 ? 0 : 180)
        if (x == x2)
            return (y < y2 ? 270 : 90)
        dir = degs(Math.acos(sqpw(x - x2)  / (sqpw(x - x2) + sqpw(y - y2))))
        if (x < x2)
            return (y2 <= y ? dir : 360 - dir)
        return (y < y2 ? dir + 180 : 180 - dir)
    }
}
