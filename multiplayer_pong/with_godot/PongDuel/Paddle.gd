extends KinematicBody


# Declare member variables here. Examples:
# var a = 2
# var b = "text"
var velocity = Vector3.ZERO
export var speed = .1
export var loss = .97

# Called when the node enters the scene tree for the first time.
func _ready():
	pass # Replace with function body.


# Called every frame. 'delta' is the elapsed time since the previous frame.
#func _process(delta):
#	pass
func _physics_process(delta):
	if Input.is_action_pressed("ui_up"):
		velocity += Vector3.FORWARD * speed
	if Input.is_action_pressed("ui_down"):
		velocity += Vector3.BACK * speed
	if Input.is_action_pressed("ui_left"):
		velocity += Vector3.LEFT * speed
	if Input.is_action_pressed("ui_right"):
		velocity += Vector3.RIGHT * speed
	velocity = move_and_slide(velocity,Vector3.UP)
	velocity *= loss
