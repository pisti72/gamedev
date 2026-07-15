extends Node3D

@onready var game_root: Node3D = $Game
@onready var player: Node = $Game/Player
@onready var menu_layer: CanvasLayer = $MainMenu
@onready var start_button: Button = $MainMenu/CenterContainer/PanelContainer/VBoxContainer/StartButton
@onready var quit_button: Button = $MainMenu/CenterContainer/PanelContainer/VBoxContainer/QuitButton

var _in_menu: bool = true


func _ready() -> void:
	start_button.pressed.connect(_on_start_pressed)
	quit_button.pressed.connect(_on_quit_pressed)
	_show_menu(true)


func _unhandled_input(event: InputEvent) -> void:
	if not (event is InputEventKey) or not event.pressed or event.echo:
		return

	if event.keycode == KEY_ESCAPE:
		if _in_menu:
			get_tree().quit()
		else:
			_show_menu(true)
		return

	if not _in_menu:
		return

	if event.keycode == KEY_ENTER or event.keycode == KEY_KP_ENTER:
		if quit_button.has_focus():
			_on_quit_pressed()
		else:
			_on_start_pressed()
		return

	if event.keycode == KEY_UP:
		if quit_button.has_focus():
			start_button.grab_focus()
		else:
			quit_button.grab_focus()
		return

	if event.keycode == KEY_DOWN:
		if start_button.has_focus():
			quit_button.grab_focus()
		else:
			start_button.grab_focus()


func _on_start_pressed() -> void:
	_show_menu(false)


func _on_quit_pressed() -> void:
	get_tree().quit()


func _show_menu(show: bool) -> void:
	_in_menu = show
	menu_layer.visible = show
	game_root.visible = not show

	if show:
		if player.has_method("set_gameplay_active"):
			player.call("set_gameplay_active", false)
		Input.set_mouse_mode(Input.MOUSE_MODE_VISIBLE)
		start_button.grab_focus()
	else:
		if player.has_method("set_gameplay_active"):
			player.call("set_gameplay_active", true)
		Input.set_mouse_mode(Input.MOUSE_MODE_CAPTURED)
