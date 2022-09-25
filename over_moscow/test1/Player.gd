extends Area


# Declare member variables here. Examples:

var speed = 2
var live = true
# var b = "text"


# Called when the node enters the scene tree for the first time.
func _ready():
	$Explosion.hide()
	$Explosion.stop()
	live = true
	$Fighter.show()


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	if (live) :
		if(Input.is_action_pressed("ui_left")):
			rotate_y(.1)
		elif(Input.is_action_pressed("ui_right")):
			rotate_y(-.1)
		var velocity = Vector3.FORWARD
		velocity = velocity.rotated(Vector3.UP, rotation.y)
		translation += velocity * speed * delta


func _on_Wall_right_area_entered(area):
	live = false
	$Explosion_snd.play()
	$Explosion.frame = 0
	$Explosion.show()
	$Explosion.play()
	$Fighter.hide()
	# get_tree().change_scene("res://GameOver.tscn")

func is_live() -> bool:
	return live
