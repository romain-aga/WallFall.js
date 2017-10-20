'use strict'

export default class Settings
{
    constructor(defaultSettings)
    {
        this.default = defaultSettings
        this.load()
    }

    save()
    {
        localStorage.setItem(this.constructor.name, JSON.stringify(this.current))
    }

    load()
    {
        let loaded = localStorage.getItem(this.constructor.name)
        if (loaded)
            loaded = JSON.parse(loaded)
        this.current = loaded || { ...this.default }
    }
}