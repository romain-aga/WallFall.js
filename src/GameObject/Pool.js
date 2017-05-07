import Pools from './Pools'
import GameObject from './GameObject'

export default class Pool
{
    static newPool(name, data)
    {
        if (! Pool.pools)
            Pool.pools = Pools
        if (! Pool.pools[name])
            Pool.pools[name] = new Pool(data)
        else
            Pool.pools[name].length = 0
        return Pool.pools[name]
    }

    constructor(data)
    {
        this.data = data
        this.objects = []
        this.length = 0
    }

    new(behavior, ...args)
    {
        if (this.objects.length <= this.length)
            this.objects.push(new GameObject(this, this.data))
        const obj = this.objects[this.length++]
        obj.init(behavior, ...args)
        return obj
    }

    remove(obj)
    {
        let index = this.objects.indexOf(obj)
        this.objects[index] = this.objects[--this.length]
        this.objects[this.length] = obj
    }

    forEach(fn)
    {
        for (let i = 0; i < this.length; ++i)
            fn(this.objects[i])
    }

    find(fn)
    {
        for (let i = 0; i < this.length; ++i)
            if (fn(this.objects[i]))
                return true
        return false
    }
}
