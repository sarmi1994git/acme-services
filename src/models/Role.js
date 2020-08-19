const Sequelize = require('sequelize');
const { sequelize } = require('../database/database');

const Role = sequelize.define('roles', {
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

module.exports = Role;