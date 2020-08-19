const Sequelize = require('sequelize');
const { sequelize } = require('../database/database');

const Application_Role = sequelize.define('applications_roles',{
	application_id: {
		type: Sequelize.INTEGER,
		primaryKey: true
	},
	role_id: {
		type: Sequelize.INTEGER,
		primaryKey: true
	}
},{
	timestamps: false
});

module.exports = Application_Role;
