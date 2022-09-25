extends Spatial

# https://www.youtube.com/watch?v=UFxLqT-PLEE

var ingame : bool = true


# Called when the node enters the scene tree for the first time.
func _ready():
	$Button.hide()


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	#$Camera.look_at($Player.translation, Vector3.UP)
	if (Input.is_action_pressed("ui_cancel")):
		get_tree().quit()
	$Player/Explosion.look_at($Camera.translation, Vector3.UP)
	if(not $Player.is_live() and ingame):
		print("button")
		ingame = false
		$Exploded.start()


func _on_Exploded_timeout():
	$Button.show()


func _on_Button_pressed():
	get_tree().change_scene("res://Hangar.tscn")
