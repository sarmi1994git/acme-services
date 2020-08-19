const { required, maxLength, minLength } = require('../validations/validations');
const Role = require('../models/Role');


const createRole = async (req, res) => {
	try {
		const { name, description } = req.body;
		const validate = validateInputs({ name, description });
		if (validate.code === 0) {
			// verificar si rol ya ha sido creado
			const roledb = await Role.findOne({
				where: {name}
			});
			if (!roledb) {
				//crear rol
				const newRole = await Role.create({
					name,
					description
				},{
					fields: ['name', 'description']
				});
				res.status(201).json({
					code: 0,
					message: 'Rol creado con éxito',
					data: newRole
				});
			} else {
				res.status(400).json({
					code: 1,
					message: 'El rol ya existe'
				});
			}
		} else {
			res.status(400).json({
				code: 1,
				message: validate.message
			});
		}
	} catch(e) {
		console.log(e);
		res.status(500).json({
			code: 1,
			message: 'Error al crear rol'
		});
	}
	

}

const getRoles = async (req, res) => {
	try {
		const { page, size } = req.query;
		const { limit, offset } = getPagination(page, size);
		const roles = await Role.findAndCountAll({
			attributes: ['id', 'name', 'description'],
			order: [
				['id', 'DESC']
			],
			limit,
			offset
		});
		const response = getPagingData(roles, page, limit);
		res.status(200).json(response);
	} catch(e) {
		console.log(e);
		res.status(500).json({
			code: 1,
			message: 'Error al obtener los datos'
		});
	}
}

const getRoleById = async (req, res) => {
	try {
		const id = req.params.id;
		const role = await Role.findOne({
			where: {id}
		});
		if (role) {
			res.status(200).json(role);
		} else {
			res.status(404).json({
				code: 1,
				message: 'Rol no encontrado'
			});
		}
	} catch(e) {
		console.log(e);
		res.status(500).json({
			code: 1,
			message: 'Error al obtener datos'
		});
	}
}

const updateRole = async (req, res) => {
	try {
		const id = req.params.id;
		const { name, description } = req.body;
		const role = await Role.findOne({
			where:{id}
		});
		if (role) {
			const updatedRole = await Role.update({
				name,
				description
			}, {
				where: {id}
			});
			res.status(200).json({
				code: 0,
				message: 'Rol actualizado con éxito',
				data: { name, description }
			});
		} else {
			res.status(404).json({
				code: 1,
				message: 'Rol no encontrado'
			});
		}
	} catch(e) {
		console.log(e);
		res.status(500).json({
			code: 1,
			message: 'Error al actualizar rol'
		});
	}
}

const deleteRole = async (req, res) => {
	try {
		const id = req.params.id;
		const deleteRowCount = await Role.destroy({
			where: {id}
		});
		res.status(204).json({
			code: 0,
			message: 'Rol eliminado con éxito'
		});
	} catch(e) {
		console.log(e);
		res.status(500).json({
			code: 1,
			message: 'Error al eliminar rol'
		});
	}
}


const validateInputs = (inputs) => {
	let response = { code: 0, message: "Campos correctos" };
	//Validar campo name
	if (!required(inputs.name)) {
		response.code = 1;
		response.message = "El nombre es requerida";
		return response;
	}
	if (!minLength(3, inputs.name)) {
		response.code = 1;
		response.message = "El nombre debe tener más de 2 caracteres";
		return response;
	}
	if (!maxLength(100, inputs.name)) {
		response.code = 1;
		response.message = "El nombre debe tener 100 caracteres o menos";
		return response;
	}
	return response;
}

const getPagination = (page, size) => {
/*limit = size
  offset = (page - 1) * size*/
  const limit = size ? +size : 100;
  const offset = page ? (page -1) * limit : 0;
  return { limit, offset };
};

const getPagingData = (data, page, limit) => {
	const { count: totalItems, rows: roles } = data;
	const currentPage = page ? +page : 1;
	const totalPages = Math.ceil(totalItems / limit);
	return { totalItems, roles, totalPages, currentPage };
};

module.exports = {
	createRole,
	getRoles,
	getRoleById,
	updateRole,
	deleteRole
}