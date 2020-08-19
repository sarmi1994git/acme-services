const Sequelize = require('sequelize');
const { sequelize } = require('../database/database');
const Role = require('./Role');
const Application_Role = require('./Application_Role');

const Application = sequelize.define('applications', {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true
	},
	name: {
		type: Sequelize.STRING
	},
	description: {
		type: Sequelize.STRING
	}
}, {
	timestamps: false
});

Application.belongsToMany(Role, {through: Application_Role, foreignKey: 'application_id', onDelete: 'CASCADE'});
Role.belongsToMany(Application, {through: Application_Role, foreignKey: 'role_id', onDelete: 'CASCADE'});

module.exports = Application;