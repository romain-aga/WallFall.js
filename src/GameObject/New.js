import Pool from './Pool'
import Behaviors from './Behaviors'
import Player from './Player'
import Particle from './Particle'
import Explosion from './Explosion'

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
import BounceWall from './Wall/BounceWall'
import GameOverWall from './Wall/GameOverWall'
import HasteWall from './Wall/HasteWall'
import HideWall from './Wall/HideWall'
import HugWall from './Wall/HugWall'
import ImmobileWall from './Wall/ImmobileWall'
import PaintingWall from './Wall/PaintingWall'
import OnslaughtWall from './Wall/OnslaughtWall'
import ResizeWall from './Wall/ResizeWall'
import ReverseWall from './Wall/ReverseWall'
import ScoreWall from './Wall/ScoreWall'
import SlowWall from './Wall/SlowWall'
import SpeedWall from './Wall/SpeedWall'
import StalkerWall from './Wall/StalkerWall'
import StraightWall from './Wall/StraightWall'
import TimeWall from './Wall/TimeWall'
import TrackerWall from './Wall/TrackerWall'
import TurnBackWall from './Wall/TurnBackWall'
import TurtleWall from './Wall/TurtleWall'

const walls = [
    Wall,
    BounceWall,
    ImmobileWall,
    HideWall,
    OnslaughtWall,
    StalkerWall,
    TimeWall,
    ScoreWall,
    SpeedWall,
    PaintingWall,
    HugWall,
    TurnBackWall,
    StraightWall,
    ResizeWall,
    TurtleWall,
    SlowWall,
    HasteWall,
    TrackerWall,
    ReverseWall,
    GameOverWall,
]

const orbs = [
    BerserkOrb,
    DestroyerOrb,
    GodOrb,
    LifeOrb,
    ScoreOrb,
    SlowdownOrb,
    SpeedOrb,
    StopOrb,
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
        const instance = new b(data)
        const pool = Pool.pools && Pool.pools[instance.poolName]
            || Pool.newPool(instance.poolName, data)
        New[b.name] = (...args) => pool.new(instance, ...args)
        Behaviors[b.name] = instance
    })
    for (let i = 0; i < walls.length; ++i)
        spawnOrder[i] = New[walls[i].name]
    for (let i = 0; i < orbs.length; ++i)
        bonusOrbs[i] = New[orbs[i].name]
}

export default New
export { spawnOrder, bonusOrbs }
