extends Node3D

@export var grid_width: int = 11
@export var grid_depth: int = 11
@export var cell_size: float = 2.0
@export var floor_thickness: float = 0.2
@export var wall_height: float = 2.2

@export var floor_color: Color = Color(0.2, 0.2, 0.23, 1.0)
@export var wall_color: Color = Color(0.6, 0.62, 0.67, 1.0)


func _ready() -> void:
	add_to_group("dungeon_grid")
	_build_dungeon()


func _build_dungeon() -> void:
	for child: Node in get_children():
		if child.name.begins_with("Auto_"):
			child.queue_free()

	var floor_mesh := BoxMesh.new()
	floor_mesh.size = Vector3(cell_size, floor_thickness, cell_size)
	var floor_mat := StandardMaterial3D.new()
	floor_mat.albedo_color = floor_color
	floor_mesh.material = floor_mat

	var wall_mesh := BoxMesh.new()
	wall_mesh.size = Vector3(cell_size, wall_height, cell_size)
	var wall_mat := StandardMaterial3D.new()
	wall_mat.albedo_color = wall_color
	wall_mesh.material = wall_mat

	for x: int in range(grid_width):
		for z: int in range(grid_depth):
			var world_x: float = (x - (grid_width - 1) * 0.5) * cell_size
			var world_z: float = (z - (grid_depth - 1) * 0.5) * cell_size

			var floor_tile := MeshInstance3D.new()
			floor_tile.name = "Auto_Floor_%d_%d" % [x, z]
			floor_tile.mesh = floor_mesh
			floor_tile.position = Vector3(world_x, -floor_thickness * 0.5, world_z)
			add_child(floor_tile)

			if _is_wall_cell(x, z):
				var wall := MeshInstance3D.new()
				wall.name = "Auto_Wall_%d_%d" % [x, z]
				wall.mesh = wall_mesh
				wall.position = Vector3(world_x, wall_height * 0.5, world_z)
				add_child(wall)


func _is_wall_cell(x: int, z: int) -> bool:
	var border: bool = x == 0 or z == 0 or x == grid_width - 1 or z == grid_depth - 1
	if border:
		return true

	# Simple inner pattern to keep the space dungeon-like.
	if z == int(grid_depth * 0.5) and x > 2 and x < grid_width - 3 and x % 2 == 1:
		return true

	if x == int(grid_width * 0.5) and z > 2 and z < grid_depth - 3 and z % 2 == 0:
		return true

	return false


func is_world_position_walkable(world_pos: Vector3) -> bool:
	var cell: Vector2i = world_to_cell(world_pos)
	return is_cell_walkable(cell.x, cell.y)


func is_cell_walkable(x: int, z: int) -> bool:
	if not is_cell_inside(x, z):
		return false
	return not _is_wall_cell(x, z)


func is_cell_inside(x: int, z: int) -> bool:
	return x >= 0 and x < grid_width and z >= 0 and z < grid_depth


func world_to_cell(world_pos: Vector3) -> Vector2i:
	var local: Vector3 = to_local(world_pos)
	var half_w: float = (grid_width - 1) * 0.5
	var half_d: float = (grid_depth - 1) * 0.5
	var cell_x: int = int(round(local.x / cell_size + half_w))
	var cell_z: int = int(round(local.z / cell_size + half_d))
	return Vector2i(cell_x, cell_z)
