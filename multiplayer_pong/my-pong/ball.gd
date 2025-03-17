extends RigidBody2D

@export var max_speed: float = 1000  # Maximális sebesség (pixel/másodperc)

func _ready():
	# Zárjuk le a forgást
	lock_rotation = true
	
	# Kapcsoljuk ki a gravitációt ehhez a testhez
	gravity_scale = 0
	
	# CCD bekapcsolása
	# continuous_cd = RigidBody2D.CCD_MODE_CAST_RAY
	
	# Állítsuk be a tömeget egy kisebb értékre
	mass = 0.5  # Próbálj ki kisebb értékeket is
	
	# Fizikai anyag beállítása (rugalmasság)
	var material = PhysicsMaterial.new()
	material.bounce = 1  # 100%-os visszapattanás
	material.friction = 0  # Nincs súrlódás
	physics_material_override = material
	
func _physics_process(delta):
	# Korlátozzuk a labda sebességét
	if linear_velocity.length() > max_speed:
		linear_velocity = linear_velocity.normalized() * max_speed
	# Csökkentsük a súrlódást
	#physics_material_override.friction = 0.1  # Alapértelmezett érték: 1
