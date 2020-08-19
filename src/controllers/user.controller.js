const { required, maxLength, minLength, isNumber, validEmail } = require('../validations/validations');
const User = require('../models/User');
const Role = require('../models/Role');
const Op = require('sequelize').Op;

const createUser = async (req, res) => {
	try {
		const { identification, firstname, lastname, email, roles } = req.body;
		const validate = validateInputs({ identification, firstname, lastname, email });
		if (validate.code === 0) {
			const userdb = await User.findOne({
				where:{
					[Op.or]: [{identification}, {email}]
				}
			});
			if (!userdb) {
				const newUser = await User.create({
					identification,
					firstname,
					lastname,
					email
				}, {
					fields: ['identification', 'firstname', 'lastname', 'email']
				});
				//insertar roles, relacion muchos a muchos
				if(roles) {
					const rolesBd = [];
					for(i = 0; i < roles.length; i++) {
						const rolebd = await Role.findOne({
							where: {id: roles[i].id}
						});
						rolesBd.push(rolebd);
					}
					await newUser.setRoles(rolesBd);
				}
				res.status(201).json({
					code: 0,
					message: 'Usuario creado con éxito',
					data: newUser
				});
			} else {
				res.status(400).json({
					code: 1,
					message: 'Identificación o email ya existe'
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
			message: 'Error al crear usuario'
		});
	}
}

const getUsers = async (req, res) => {
	try {
		const { page, size } = req.query;
		const { limit, offset } = getPagination(page, size);
		const users = await User.findAndCountAll({
			attributes: ['id', 'identification', 'firstname', 'lastname', 'email'],
			order: [
				['id', 'DESC']
			],
			limit,
			offset,
			include: Role
		});
		const response = getPagingData(users, page, limit);
		res.status(200).json(response);
	} catch(e) {
		console.log(e);
		res.status(500).json({
			code: 1,
			message: 'Error al obtener los datos'
		});
	}
}

const getUserById = async (req, res) => {
	try {
		const id = req.params.id;
		const user = await User.findOne({
			where:{id},
			attributes: ['id', 'identification', 'firstname', 'lastname', 'email'],
			include: Role
		});
		if (user) {
			res.status(200).json(user);
		} else {
			res.status(404).json({
				code: 1,
				message: 'Usuario no encontrado'
			});
		}

	} catch(e) {
		console.log(e);
		res.status(500).json({
			code: 1,
			message: 'Error al obtener los datos'
		});
	}
}

const updateUser = async (req, res) => {
	try {
		const id = req.params.id;
		const { identification, firstname, lastname, email, roles} = req.body;
		const validate = validateInputs({ identification, firstname, lastname, email });
		if (validate.code === 0) {
			const user = await User.findOne({
				where: {id}
			});
			if (user) {
				const updatedUser = await User.update({
					identification,
					firstname,
					lastname,
					email
				}, {
					where: {id}
				});
				//insertar roles, relacion muchos a muchos
				if(roles) {
					const rolesBd = [];
					for(i = 0; i < roles.length; i++) {
						const rolebd = await Role.findOne({
							where: {id: roles[i].id}
						});
						rolesBd.push(rolebd);
					}
					await user.setRoles(rolesBd);
				} else {
					await user.setRoles([]);
				}
				res.status(200).json({
					code: 0,
					message: 'Usuario actualizado con éxito',
					data: { identification, firstname, lastname, email}
				});
			} else {
				res.status(404).json({
					code: 1,
					message: 'Usuario no encontrado'
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
			message: 'Error al actualizar los datos'
		});
	}
}

const deleteUser = async (req, res) => {
	try {
		const id = req.params.id;
		const deleteRowCount = await User.destroy({
			where: {id}
		});
		res.status(204).json({
			code: 0,
			message: 'Usuario eliminado con éxito'
		});
	} catch(e) {
		console.log(e);
		res.status(500).json({
			code: 1,
			message: 'Error al eliminar los datos'
		});
	}
}

const validateInputs = (inputs) => {
	let response = { code: 0, message: "Campos correctos" };
	//Validar campo identification
	if (!required(inputs.identification)) {
		response.code = 1;
		response.message = "La identificación es requerida";
		return response;
	}
	if (!minLength(10, inputs.identification)) {
		response.code = 1;
		response.message = "La identificación debe tener al menos 10 caracteres";
		return response;
	}
	if (!maxLength(15, inputs.identification)) {
		response.code = 1;
		response.message = "La identificación debe tener 15 caracteres o menos";
		return response;
	}
	//Validar de campo firstname (requerido, minLength y maxLength)
	if (!required(inputs.firstname)) {
		response.code = 1;
		response.message = "El nombre es requerido";
		return response;
	}
	if (!minLength(3, inputs.firstname)) {
		response.code = 1;
		response.message = "El nombre debe tener más de 2 caracteres";
		return response;
	}
	if (!maxLength(25, inputs.firstname)) {
		response.code = 1;
		response.message = "El nombre debe tener 25 caracteres o menos";
		return response;
	}
	//Validar de campo lastname (requerido, minLength y maxLength)
	if (!required(inputs.lastname)) {
		response.code = 1;
		response.message = "El apellido es requerido";
		return response;
	}
	if (!minLength(3, inputs.lastname)) {
		response.code = 1;
		response.message = "El apellido debe tener más de 2 caracteres";
		return response;
	}
	if (!maxLength(25, inputs.lastname)) {
		response.code = 1;
		response.message = "El apellido debe tener 25 caracteres o menos";
		return response;
	}
	
	//Validar de campo email (requerido, validEmail)
	if (!required(inputs.email)) {
		response.code = 1;
		response.message = "El email es requerido";
		return response;
	}
	if (!validEmail(inputs.email)) {
		response.code = 1;
		response.message = "Dirección de email inválida";
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
	const { count: totalItems, rows: users } = data;
	const currentPage = page ? +page : 1;
	const totalPages = Math.ceil(totalItems / limit);
	return { totalItems, users, totalPages, currentPage };
};

module.exports = {
	createUser,
	getUsers,
	getUserById,
	updateUser,
	deleteUser
}
