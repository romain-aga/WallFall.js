import Random from '../../Tools/Random'
import Collision from '../../Tools/Collision'
import MathTools from '../../Tools/MathTools'
import GameObjectBehavior from '../GameObjectBehavior'
import Pools from '../Pools'
import New from '../New'

export default class BaseWall extends GameObjectBehavior
{
	constructor()
	{
		super('Wall')
	}

	init(self, sprite, color)
	{
		self.sprite = sprite
		self.width = self.sprite.width
		self.height = self.sprite.height
		self.color = color
		//self.data.sounds.levelUp.play()
		self.i_particle = 0
		self.i_newCoord = 0
		self.speed = 2.82
		self.coordOffset = 80
		self.offsetExplosion = -10
		self.explosionCoords = {}
		this.newCoords(self)
	}

	newCoords(self)
	{
		BaseWall._bounds = BaseWall._bounds || [
			self.data.bounds.x.min - self.width * 2 - self.coordOffset,
			self.data.bounds.y.max + self.width + self.coordOffset,
			self.data.bounds.x.max + self.width + self.coordOffset,
			self.data.bounds.y.min - self.width * 2 - self.coordOffset
		]
		self.i_newCoord = 5
		let findNewCoords = true
		let tries = 10
		while (findNewCoords && 0 < tries--)
		{
			self.direction = Random.range(0, 3)
			let random = Random.random() * (self.data.width - self.width)
			self.x = (self.direction % 2 === 0) && BaseWall._bounds[self.direction]
				|| self.data.bounds.x.min + random
			self.y = (self.direction % 2 !== 0) && BaseWall._bounds[self.direction]
				|| self.data.bounds.y.min + random
			findNewCoords = Pools.Wall.find(
				w => w !== self
					&& w.x < self.x + self.width && self.x - self.width < w.x
					&& w.y < self.y + self.height && self.y - self.height < w.y
				)
		}
	}

	penalties(self, player)
	{
		player.lives--
		player.stateValues.god = 10
	}

	update(self)
	{
		let rad = MathTools.rads(self.direction * 90)
		let cos = Math.cos(rad)
		let sin = Math.sin(rad)
		let distanceRespawn = self.data.width / 2 + self.width
		if (self.direction === 0 && self.data.bounds.x.max < self.x
			|| self.direction === 1 && self.y < self.data.bounds.y.min - self.width
			|| self.direction === 2 && self.x < self.data.bounds.x.min - self.width
			|| self.direction === 3 && self.data.bounds.y.max < self.y
		)
			this.newCoords(self)
		else
		{
			self.x += cos * self.speed
			self.y -= sin * self.speed
		}
		this.special(self)
		this.collision(self)
		this.particles(self)
	}

	special(self)
	{

	}

	explosion(self, particleSpeed)
	{
		New.Explosion(self.x, self.y, self.width, self.color, true, particleSpeed)
	}

	particles(self)
	{
		if (! self.speed)
			return
		if (self.i_particle++ % 8 === 0)
		{
			let direction = 0
			let speed = 0
			let decreaseSpeed = 0.5
			if (self.i_newCoord)
			{
				self.i_newCoord--
				direction = self.direction * 90
				speed = self.speed * 5
				decreaseSpeed = 1
			}
			New.Particle(self.x, self.y, direction, speed, self.width, self.color, true, decreaseSpeed)
		}
	}

	collision(self)
	{
		Pools.Player.forEach(
            p => p.state !== p.states.god && Collision.circleRect(p, self)
				&& (
					p.state === p.states.berserk
					? self.destroy()
					: this.penalties(self, p)
				)
        )
	}

	destroy(self)
	{
		self.data.sounds.wallExplosion.play()
		super.destroy(self)
	}
}
/*	
		image = "bloc1"
	couleur = "#0310eb"
	son_colli = mixer.Sound(K.path_son_effet + "scifi002.ogg")
	son_colli.set_volume(K.vol_effet)
	son_explo = mixer.Sound(K.path_son_effet + "scifi017.ogg")
	son_explo.set_volume(K.vol_effet)
	coord_start = 80
	coord_explo_start = -10
	sprite = pygame.image.load(K.path_img_bloc + image + ".png").convert(32, pygame.HWSURFACE | pygame.SRCALPHA)
	increase_speed = K.d_time

	def __init__(__, boss, x=None, y=None, dir=None, loaded=False):
		son = mixer.Sound(K.path_son_effet + "1up.ogg")
		son.set_volume(K.vol_effet)
		if not loaded: son.play()
		__.i_special = 0
		__.boss = boss
		__.boss.MUR.append(__)
		__.particule = 0
		__.speed = 0
		__.i_start = 0
		__.direction = dir
		__.x, __.y = x, y
		__.ystart, __.xstart = __.y, __.x
		if __.x == None or __.y == None or __.direction == None:
			__.new_coords()
		__.get_speed()
		__.caract()
		__.image_sprite = __.image[:]
		#__.sprite = pygame.image.load(K.path_img_bloc + __.image_sprite + ".png").convert(32, pygame.HWSURFACE | pygame.SRCALPHA)
		__.W, __.H = __.sprite.get_size()
		__.w, __.h = __.W, __.H
		__.sprite_cache = __.sprite_camoufle = False
		if K.draw_explo and not loaded: __.__explosion__()

	def caract(__): pass

	def get_speed(__):
		__.speed = int(10 * K.d_time)
		if __.speed < 1: __.speed = 1

	def bouge(__):
		if __.direction == 1:
			if __.y > -20: __.y -= __.speed
			else: __.new_coords()
		elif __.direction == 2:
			if __.x > -20: __.x -= __.speed
			else: __.new_coords()
		elif __.direction == 3:
			if __.y < __.boss.size + 20: __.y += __.speed
			else: __.new_coords()
		else:
			if __.x < __.boss.size + 20: __.x += __.speed
			else: __.new_coords()

		__.special()
		__.collision()

	def draw(__):
		rect = pygame.Rect((__.x, __.y), (__.w, __.h))
		rect.center = (__.x, __.y)
		K.screen.blit(__.sprite, rect)

	def special(__):
		__.i_special += 1
		if K.ratio_d_time <= __.i_special:
			__.i_special = 0
			if __.boss.camoufle_mur > 0:
				if not __.sprite_camoufle:
					__.sprite_camoufle = True
					__.image_sprite = Mur_camoufle.image[:]
					__.sprite = pygame.image.load(K.path_img_bloc + __.image_sprite + ".png").convert(32, pygame.HWSURFACE | pygame.SRCALPHA)
			elif __.sprite_camoufle:
					__.sprite_camoufle = False
					__.image_sprite = __.image[:]
					__.sprite = pygame.image.load(K.path_img_bloc + __.image_sprite + ".png").convert(32, pygame.HWSURFACE | pygame.SRCALPHA)
	
			if __.boss.cache_mur > 0:
				if not __.sprite_cache:
					__.sprite_cache = True
					__.w, __.h = __.w/2, __.h/2
					__.sprite = pygame.transform.scale(__.sprite, (__.w, __.h))
			else:
				if __.sprite_cache:
					__.sprite_cache = False
					__.w, __.h = __.W, __.H
					__.sprite = pygame.image.load(K.path_img_bloc + __.image_sprite + ".png").convert(32, pygame.HWSURFACE | pygame.SRCALPHA)
				if K.draw_queue: __.__particule__()

	def __explosion__(__, destroy=False):
		if destroy: x, y = __.x, __.y
		else: x, y = __.xstart, __.ystart
		if K.draw_explo:
			if __.boss.camoufle_mur > 0:
				Explosion(__.boss, x, y, 20, Mur_camoufle.couleur, dr = K.d_time/2, carre = True)
			else:
				Explosion(__.boss, x, y, 20, __.couleur, dr = K.d_time/2, carre = True)
		
	def __particule__(__):
		if __.speed:
			if not __.particule:
				if __.boss.camoufle_mur > 0: Particule(__.boss, __.x, __.y, 0, 0, 20, Mur_camoufle.couleur, K.d_time*2, True)
				else: Particule(__.boss, __.x, __.y, 0, 0, 20, __.couleur, K.d_time*2, True)
				if 0 < __.i_start:
					__.particule_start()
					__.i_start -= 1
			__.particule += 1
			if __.particule >= 5 + 2 * (K.ratio_d_time - 1): __.particule = 0
	
	def particule_start(__):
		if K.draw_queue and __.speed:
			if __.boss.camoufle_mur > 0:
				Particule(__.boss, __.x, __.y, __.direction * 90, __.speed * 5, 20, Mur_camoufle.couleur, K.d_time * 1.5, True)
			else:
				Particule(__.boss, __.x, __.y, __.direction * 90, __.speed * 5, 20, __.couleur, K.d_time * 1.5, True)

	def new_coords(__):
		bool = True
		while bool:
			__.direction = randrange(4)
			if __.direction == 1:
				__.y = __.boss.size + __.coord_start
				__.x = randrange(20,__.boss.size - 20)
				__.xstart, __.ystart = __.x, __.y - __.coord_start + __.coord_explo_start
			elif __.direction == 2:
				__.x = __.boss.size + __.coord_start
				__.y = randrange(20,__.boss.size - 20)
				__.ystart, __.xstart = __.y, __.x - __.coord_start + __.coord_explo_start
			elif __.direction == 3:
				__.y = -__.coord_start
				__.x = randrange(20,__.boss.size - 20)
				__.xstart, __.ystart = __.x, __.y + __.coord_start - __.coord_explo_start
			else:
				__.x = -__.coord_start
				__.y = randrange(20,__.boss.size - 20)
				__.ystart, __.xstart = __.y, __.x + __.coord_start - __.coord_explo_start
			__.i_start = 3
			bool = False
			for i in __.boss.MUR:
				if i != __ and i.x < __.x + 40 and i.x > __.x - 40 and  i.y < __.y + 40 and i.y > __.y - 40:
					bool = True
					break


	def malus(__, obj):
		obj.vie -= 1
		obj.god = 10

	def collision(__):
		for obj in __.boss.Players:
			if not obj.god or obj.berserk:
				if obj.y < __.y +32 and obj.y > __.y - 32 and obj.x < __.x +32 and obj.x > __.x - 32:
					if not obj.berserk:
						__.malus(obj)
						if K.draw_explo: Explosion(__.boss, obj.x, obj.y, r=25, couleur=obj.couleurs[2])
						__.son_colli.play()
					else:
						obj.berserk = 0
						if K.draw_explo: Explosion(__.boss, obj.x, obj.y, r=25, couleur=obj.couleurs[3])
						__.destroy()

	def destroy(__):
		__.boss.MUR.remove(__)
		__.son_explo.play()
		if K.draw_explo: __.__explosion__(True)
*/

