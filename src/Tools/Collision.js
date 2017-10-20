'use strict'

import MathTools from './MathTools'

export default class Collision
{
    static isInWall(w)
    {
        let width = self.width + w.width
        let height = self.height + w.height
        return w.x - self.width <= self.x && self.x <= w.x + w.width + self.width
            && w.y - self.height <= self.y && self.y <= w.y + w.height + self.height
            && w.x - width <= self.x
    }

    // http://stackoverflow.com/a/1879223/5813357
    static circleRect(circle, rect)
    {
        let radius = circle.width / 2
        let circleX = circle.x + radius
        let circleY = circle.y + radius
        let closestX = MathTools.clamp(circleX, rect.x, rect.x + rect.width)
        let closestY = MathTools.clamp(circleY, rect.y, rect.y + rect.height)

        // Calculate the distance between the circle's center and this closest point
        let distanceX = circleX - closestX
        let distanceY = circleY - closestY

        // If the distance is less than the circle's radius, an intersection occurs
        let distanceSquared = (distanceX * distanceX) + (distanceY * distanceY)
        return distanceSquared < (radius * radius)
    }

    static rectRect(rect1, rect2)
    {
        let minX = rect1.x < rect2.x ? rect1.x : rect2.x
        let minY = rect1.y < rect2.y ? rect1.y : rect2.y
        let maxX = rect1.x < rect2.x
            ? rect2.x + rect2.width
            : rect1.x + rect1.width
        let maxY = rect1.y < rect2.y
            ? rect2.y + rect2.height
            : rect1.y + rect1.height
        return maxX - minX < rect1.width + rect2.width
            && maxY - minY < rect1.height + rect2.height
    }

    static circleCircle(circle1, circle2)
    {
        let r = (circle1.width + circle2.width) / 2
        return r * r > MathTools.squareDistance(circle1.x, circle1.y, circle2.x, circle2.y)
    }
}