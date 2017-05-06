export default class Enum
{
    constructor(...keys)
    {
        this.keys = keys
        this.index = {}
        result = {}
        for (let i = 0; i < keys.length; ++i)
        {
            this[key[i]] = key[i]
            this[i] = key[i]
            this.index[key[i]] = i
        }
    }
}
