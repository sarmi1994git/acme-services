const { required, maxLength, minLength } = require('../validations/validations');
const Application = require('../models/Application');
const Role = require('../models/Role');


const createApplication = async (req, res) => {
	try {
		const { name, description, roles } = req.body;
		const validate = validateInputs({ name, description });
		if (validate.code === 0) {
			// verificar si rol ya ha sido creado
			const applicationdb = await Application.findOne({
				where: {name}
			});
			if (!applicationdb) {
				//crear aplicación
				const newApp = await Application.create({
					name,
					description
				},{
					fields: ['name', 'description']
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
					await newApp.setRoles(rolesBd);
				}
				res.status(201).json({
					code: 0,
					message: 'Aplicación creado con éxito',
					data: newApp
				});
			} else {
				res.status(400).json({
					code: 1,
					message: 'La aplicación ya existe'
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
			message: 'Error al crear aplicación'
		});
	}
	

}

const getApplications = async (req, res) => {
	try {
		const { page, size } = req.query;
		const { limit, offset } = getPagination(page, size);
		const applications = await Application.findAndCountAll({
			attributes: ['id', 'name', 'description'],
			order: [
				['id', 'DESC']
			],
			limit,
			offset,
			include: Role
		});
		const response = getPagingData(applications, page, limit);
		res.status(200).json(response);
	} catch(e) {
		console.log(e);
		res.status(500).json({
			code: 1,
			message: 'Error al obtener los datos'
		});
	}
}

const getApplicationById = async (req, res) => {
	try {
		const id = req.params.id;
		const application = await Application.findOne({
			where: {id},
			include: Role
		});
		if (application) {
			res.status(200).json(application);
		} else {
			res.status(404).json({
				code: 1,
				message: 'Aplicación no encontrado'
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

const updateApplication = async (req, res) => {
	try {
		const id = req.params.id;
		const { name, description, roles } = req.body;
		const application = await Application.findOne({
			where:{id}
		});
		if (application) {
			const updatedApp = await Application.update({
				name,
				description
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
				await application.setRoles(rolesBd);
			} else {
				await application.setRoles([]);
			}
			res.status(200).json({
				code: 0,
				message: 'Aplicación actualizado con éxito',
				data: { name, description }
			});
		} else {
			res.status(404).json({
				code: 1,
				message: 'Aplicación no encontrado'
			});
		}
	} catch(e) {
		console.log(e);
		res.status(500).json({
			code: 1,
			message: 'Error al actualizar aplicación'
		});
	}
}

const deleteApplication = async (req, res) => {
	try {
		const id = req.params.id;
		const deleteRowCount = await Application.destroy({
			where: {id}
		});
		res.status(204).json({
			code: 0,
			message: 'Aplicación eliminado con éxito'
		});
	} catch(e) {
		console.log(e);
		res.status(500).json({
			code: 1,
			message: 'Error al eliminar aplicación'
		});
	}
}


const validateInputs = (inputs) => {
	let response = { code: 0, message: "Campos correctos" };
	//Validar campo name
	if (!required(inputs.name)) {
		response.code = 1;
		response.message = "El nombre es requerido";
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
	const { count: totalItems, rows: applications } = data;
	const currentPage = page ? +page : 1;
	const totalPages = Math.ceil(totalItems / limit);
	return { totalItems, applications, totalPages, currentPage };
};

module.exports = {
	createApplication,
	getApplications,
	getApplicationById,
	updateApplication,
	deleteApplication
}