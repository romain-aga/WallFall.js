import Pool from './Pool'
import Player from './Player'
import Sphere from './Sphere'
import Wall from './Wall'
import ImmobileWall from './ImmobileWall'
import Particle from './Particle'
import Explosion from './Explosion'

const behaviors = [
    Particle,
    Explosion,
    Sphere,
    ImmobileWall,
    Wall,
    Player,
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
}

export default New
