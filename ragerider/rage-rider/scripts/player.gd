extends Node3D

@export var cell_size: float = 2.0
@export var move_duration: float = 0.18
@export var mouse_sensitivity: float = 0.0025
@export var look_limit_degrees: float = 80.0
@export var eye_height: float = 1.7
@export var use_classic_turn_mode: bool = false
@export var turn_step_degrees: float = 90.0
@export var turn_duration: float = 0.12
@export var dungeon_path: NodePath

@onready var pivot: Node3D = $Pivot

var _yaw: float = 0.0
var _pitch: float = 0.0
var _dungeon: Node = null

var _is_moving: bool = false
var _move_elapsed: float = 0.0
var _move_from: Vector3
var _move_to: Vector3

var _is_turning: bool = false
var _turn_elapsed: float = 0.0
var _turn_from: float = 0.0
var _turn_to: float = 0.0
var _gameplay_active: bool = true


func _ready() -> void:
	pivot.position.y = eye_height
	_yaw = rotation.y
	_dungeon = _resolve_dungeon()
	global_position = _snap_to_grid(global_position)


func _unhandled_input(event: InputEvent) -> void:
	if event is InputEventMouseMotion and Input.get_mouse_mode() == Input.MOUSE_MODE_CAPTURED:
		if not use_classic_turn_mode:
			_yaw -= event.relative.x * mouse_sensitivity
		_pitch -= event.relative.y * mouse_sensitivity
		_pitch = clamp(_pitch, deg_to_rad(-look_limit_degrees), deg_to_rad(look_limit_degrees))

		rotation.y = _yaw
		pivot.rotation.x = _pitch
		return

	if use_classic_turn_mode and event is InputEventKey and event.pressed and not event.echo:
		if event.keycode == KEY_Q or event.keycode == KEY_LEFT:
			_request_turn(-1)
			return
		if event.keycode == KEY_E or event.keycode == KEY_RIGHT:
			_request_turn(1)
			return

	if event is InputEventKey and event.pressed and not event.echo and _gameplay_active:
		var move_dir: Vector3 = _direction_from_keycode(event.keycode)
		if move_dir != Vector3.ZERO:
			if _is_moving:
				_finish_move_immediately()
			_try_start_move(move_dir)
			return

	if event is InputEventMouseButton and event.pressed and event.button_index == MOUSE_BUTTON_LEFT:
		if _gameplay_active and Input.get_mouse_mode() != Input.MOUSE_MODE_CAPTURED:
			Input.set_mouse_mode(Input.MOUSE_MODE_CAPTURED)


func _physics_process(delta: float) -> void:
	if not _gameplay_active:
		return

	_update_turn(delta)

	if _is_moving:
		_move_elapsed += delta
		var t: float = clamp(_move_elapsed / move_duration, 0.0, 1.0)
		var smooth_t: float = t * t * (3.0 - 2.0 * t)
		global_position = _move_from.lerp(_move_to, smooth_t)

		if t >= 1.0:
			global_position = _move_to
			_is_moving = false
		return


func _start_move(dir: Vector3) -> void:
	_move_from = global_position
	_move_to = _snap_to_grid(_move_from + dir * cell_size)
	_move_to.y = _move_from.y

	_move_elapsed = 0.0
	_is_moving = true


func _finish_move_immediately() -> void:
	if not _is_moving:
		return

	global_position = _move_to
	_move_elapsed = 0.0
	_is_moving = false


func _try_start_move(dir: Vector3) -> bool:
	if dir == Vector3.ZERO:
		return false

	var target: Vector3 = _snap_to_grid(global_position + dir * cell_size)
	target.y = global_position.y
	if not _is_walkable(target):
		return false

	_start_move(dir)
	return true


func _direction_from_keycode(keycode: Key) -> Vector3:
	var forward: Vector3 = _to_cardinal((-global_transform.basis.z).normalized())
	var right: Vector3 = _to_cardinal(global_transform.basis.x.normalized())

	if keycode == KEY_W:
		return forward
	if keycode == KEY_S:
		return -forward
	if keycode == KEY_D:
		return right
	if keycode == KEY_A:
		return -right

	return Vector3.ZERO


func _request_turn(step: int) -> void:
	if step == 0 or _is_turning:
		return

	_is_turning = true
	_turn_elapsed = 0.0
	_turn_from = _yaw
	_turn_to = _yaw + deg_to_rad(turn_step_degrees * float(step))


func _update_turn(delta: float) -> void:
	if not _is_turning:
		return

	_turn_elapsed += delta
	var t: float = clamp(_turn_elapsed / turn_duration, 0.0, 1.0)
	var smooth_t: float = t * t * (3.0 - 2.0 * t)
	_yaw = lerp_angle(_turn_from, _turn_to, smooth_t)
	rotation.y = _yaw

	if t >= 1.0:
		_yaw = _turn_to
		rotation.y = _yaw
		_is_turning = false


func _resolve_dungeon() -> Node:
	if dungeon_path != NodePath():
		var configured: Node = get_node_or_null(dungeon_path)
		if configured != null:
			return configured

	var dungeon_group: Array[Node] = get_tree().get_nodes_in_group("dungeon_grid")
	if dungeon_group.is_empty():
		return null
	return dungeon_group[0]


func _is_walkable(target_world_pos: Vector3) -> bool:
	if _dungeon != null and _dungeon.has_method("is_world_position_walkable"):
		return _dungeon.call("is_world_position_walkable", target_world_pos)
	return true


func _snap_to_grid(world_pos: Vector3) -> Vector3:
	var grid_pos: Vector3 = world_pos
	grid_pos.x = round(grid_pos.x / cell_size) * cell_size
	grid_pos.z = round(grid_pos.z / cell_size) * cell_size
	return grid_pos


func _to_cardinal(v: Vector3) -> Vector3:
	var flat: Vector2 = Vector2(v.x, v.z)
	if flat.length_squared() <= 0.0001:
		return Vector3.ZERO

	if abs(flat.x) > abs(flat.y):
		return Vector3(sign(flat.x), 0.0, 0.0)
	return Vector3(0.0, 0.0, sign(flat.y))


func set_gameplay_active(active: bool) -> void:
	_gameplay_active = active
	if not _gameplay_active:
		_is_moving = false
		_is_turning = false
		global_position = _snap_to_grid(global_position)
