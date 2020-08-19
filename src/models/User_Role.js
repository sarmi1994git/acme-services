const Sequelize = require('sequelize');
const { sequelize } = require('../database/database');

const User_Role = sequelize.define('users_roles',{
	user_id: {
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

module.exports = User_Role;
