'use strict'

export default class Enum
{
    constructor(...keys)
    {
        this.keys = keys
        this.index = {}
        for (let i = 0; i < keys.length; ++i)
        {
            this[keys[i]] = keys[i]
            this[i] = keys[i]
            this.index[keys[i]] = i
        }
    }
}
