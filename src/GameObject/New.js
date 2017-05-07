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

export const spawnOrder = [
    Wall,
    ImmobileWall,
]

export const bonusOrbs = [
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
    ...spawnOrder,
    ...bonusOrbs
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
    for (let i = 0; i < bonusOrbs.length; ++i)
        bonusOrbs[i] = New[bonusOrbs[i].name]
}

export default New
