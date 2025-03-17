extends VehicleBody3D

# A VehicleBody3D már tartalmazza az engine_force, steering és brake változókat
# Ezeket közvetlenül használhatod
const GAS = 300

func _ready():
	# Kerekek beállítása
	$FrontLeftWheel.use_as_steering = true
	$FrontLeftWheel.use_as_traction = false  # Ha nem előkerék-meghajtású
	$FrontLeftWheel.suspension_stiffness = 50
	$FrontLeftWheel.wheel_friction_slip = 10

	$FrontRightWheel.use_as_steering = true
	$FrontRightWheel.use_as_traction = false
	$FrontRightWheel.suspension_stiffness = 50
	$FrontRightWheel.wheel_friction_slip = 10

	$RearLeftWheel.use_as_steering = false
	$RearLeftWheel.use_as_traction = true
	$RearLeftWheel.suspension_stiffness = 50
	$RearLeftWheel.wheel_friction_slip = 10

	$RearRightWheel.use_as_steering = false
	$RearRightWheel.use_as_traction = true
	$RearRightWheel.suspension_stiffness = 50
	$RearRightWheel.wheel_friction_slip = 10

func _process(delta):
	# Bemenet kezelése
	if Input.is_action_pressed("ui_up"):
		engine_force = GAS  # A VehicleBody3D beépített változója
		brake = 0
	elif Input.is_action_pressed("ui_down"):
		engine_force = -GAS
		brake = 0  # A VehicleBody3D beépített változója
	else:
		engine_force = 0
		brake = 0

	if Input.is_action_pressed("ui_left"):
		steering = 0.8  # A VehicleBody3D beépített változója
	elif Input.is_action_pressed("ui_right"):
		steering = -0.8
	else:
		steering = 0
		
	if Input.is_action_just_released("ui_cancel"):
		get_tree().quit()
