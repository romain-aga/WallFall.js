import Pool from './Pool'
import Player from './Player'
import Sphere from './Sphere'
import Wall from './Wall'
import ImmobileWall from './ImmobileWall'
import Particle from './Particle'
import Explosion from './Explosion'

export const spawnOrder = [
    Wall,
    ImmobileWall,
]

const behaviors = [
    Particle,
    Explosion,
    Sphere,
    Player,
    ...spawnOrder
]

const New = { init }

function init(data)
{
    behaviors.forEach(b =>
    {
        const instance = new b()
        const pool = Pool.pools && Pool.pools[instance.poolName]
            || Pool.newPool(instance.poolName, data)
        New[b.name] = (...args) => pool.new(instance, ...args)
    })
    for (let i = 0; i < spawnOrder.length; ++i)
        spawnOrder[i] = New[spawnOrder[i].name]
}

export default New
