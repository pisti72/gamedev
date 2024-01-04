extends Node2D


# Called when the node enters the scene tree for the first time.
func _ready():
	pass # Replace with function body.


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	if Input.is_action_just_pressed("c4_pressed"):
		$c4.play()
	if Input.is_action_just_pressed("d4_pressed"):
		$d4.play()
	if Input.is_action_just_pressed("ui_cancel"):
		get_tree().quit()
