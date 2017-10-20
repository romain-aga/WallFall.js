'use strict'

export default class Random
{
	static range(min, max)
	{
		return Math.floor((Math.random() * (max + 1 - min)) + min)
	}
	
	static random()
	{
		return Math.random()
	}
}