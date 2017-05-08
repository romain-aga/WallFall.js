import Pool from './Pool'
import Player from './Player'
import Orb from './Orb/Orb'
import BerserkOrb from './Orb/BerserkOrb'
import DestroyerOrb from './Orb/DestroyerOrb'
import GodOrb from './Orb/GodOrb'
import LifeOrb from './Orb/LifeOrb'
import ScoreOrb from './Orb/ScoreOrb'
import SlowdownOrb from './Orb/SlowdownOrb'
import SpeedOrb from './Orb/SpeedOrb'
import StopOrb from './Orb/StopOrb'
import TimeOrb from './Orb/TimeOrb'
import Wall from './Wall/Wall'
import ImmobileWall from './Wall/ImmobileWall'
import Particle from './Particle'
import Explosion from './Explosion'

const walls = [
    Wall,
    ImmobileWall,
]

const orbs = [
    BerserkOrb,
    DestroyerOrb,
    GodOrb,
    LifeOrb,
    ScoreOrb,
    //SlowdownOrb,
    SpeedOrb,
    //StopOrb,
    TimeOrb,
]

const behaviors = [
    Particle,
    Explosion,
    Orb,
    Player,
    ...walls,
    ...orbs
]

const New = { init }
const spawnOrder = [ ...walls ]
const bonusOrbs = [ ...orbs ]

function init(data)
{
    if (Pool.pools)
        Object.keys(Pool.pools).forEach(k => Pool.pools[k].length = 0)
    behaviors.forEach(b =>
    {
        const instance = new b()
        const pool = Pool.pools && Pool.pools[instance.poolName]
            || Pool.newPool(instance.poolName, data)
        New[b.name] = (...args) => pool.new(instance, ...args)
    })
    for (let i = 0; i < walls.length; ++i)
        spawnOrder[i] = New[walls[i].name]
    for (let i = 0; i < orbs.length; ++i)
        bonusOrbs[i] = New[orbs[i].name]
}

export default New
export { spawnOrder, bonusOrbs }
