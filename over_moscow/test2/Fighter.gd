extends KinematicBody


# Declare member variables here. Examples:
# var a = 2
# var b = "text"
export var speed=.01
export var rot_speed = .02
var velocity = Vector3.LEFT * speed * 20
var heading = Vector3.LEFT

# Called when the node enters the scene tree for the first time.
func _ready():
	pass # Replace with function body.


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _physics_process(delta):
	
	var radius = 0
	if Input.is_action_pressed("move_right"):
		radius = -rot_speed
	if Input.is_action_pressed("move_left"):
		radius = rot_speed
	if Input.is_action_pressed("move_up"):
		var h = heading.rotated(Vector3.UP,rotation.y - PI/2)
		velocity = velocity.move_toward(h,speed)
	
	move_and_slide(velocity,Vector3.UP)
	rotate_y(radius)
