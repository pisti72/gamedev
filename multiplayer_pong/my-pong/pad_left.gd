extends CharacterBody2D

@export var smoothing_factor: float = 0.1  # Simítási tényező (0-1 között)

func _process(delta):
	# Az egér kurzor pozíciójának lekérése
	var mouse_position = get_global_mouse_position()
	
	# Az ütő pozíciójának sima közelítése az egér pozíciójához
	# Az ütő mozgatása az egér pozíciója felé
	var direction = (mouse_position - position).normalized()
	# var distance = position.distance_to(mouse_position)
	position = position.lerp(mouse_position, smoothing_factor)
	
	# Mozgás és ütközés ellenőrzése
	velocity = (mouse_position - position) / delta  # A sebesség beállítása
	move_and_slide()  # Mozgás és ütközés kezelése
	
	# Ütközés ellenőrzése
	for i in get_slide_collision_count():
		var collision = get_slide_collision(i)
		if collision.get_collider() is RigidBody2D:
			# Alkalmazzunk egy erőt vagy impulzust a négyzetre
			var force = direction * 100  # Az erő nagysága (növeld, ha szükséges)
			collision.get_collider().apply_central_impulse(force)
