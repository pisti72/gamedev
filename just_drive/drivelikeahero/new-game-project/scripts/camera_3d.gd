extends Camera3D

var max_roll_angle = 1  # Maximális oldalra dőlési szög (fokban)
var max_pitch_angle = 1  # Maximális előre-hátra dőlési szög (fokban)
var steering_sensitivity = 0.1  # Érzékenység a kanyarodáshoz
var acceleration_sensitivity = 0.1  # Érzékenység a gyorsításhoz/lassításhoz

var previous_velocity = Vector3.ZERO  # Az előző képkocka sebessége

func _process(delta):
	var car = get_parent()  # Feltételezzük, hogy a kamera a VehicleBody3D gyermeke
	var steering = car.steering  # Kormányzási szög (-1 balra, 1 jobbra)
	var current_velocity = car.linear_velocity  # Az aktuális sebesség
	
	# Gyorsulás kiszámítása
	var acceleration = (current_velocity - previous_velocity) / delta
	previous_velocity = current_velocity  # Frissítsd az előző sebességet

	# Oldalra dőlés (X tengely körül forgatás) - Kanyarodáshoz kötve
	var target_roll = -steering * max_roll_angle  # A kanyarodás irányával ellentétes irányba dől
	
	# rotation_degrees.x = lerp(rotation_degrees.x, target_roll, steering_sensitivity)

	# Előre-hátra dőlés (Z tengely körül forgatás) - Gyorsításhoz/lassításhoz kötve
	var target_pitch = acceleration.z * max_pitch_angle  # Gyorsításkor előre dől, lassításkor hátra
	rotation_degrees.z = lerp(rotation_degrees.z, target_roll, steering_sensitivity)
	rotation_degrees.x = lerp(rotation_degrees.x, target_pitch, acceleration_sensitivity)
