const Sequelize = require('sequelize');
const { sequelize } = require('../database/database');
const Role = require('./Role');
const User_Role = require('./User_Role');

const User = sequelize.define('users', {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true
	},
	identification: {
		type: Sequelize.STRING
	},
	firstname: {
		type: Sequelize.STRING
	},
	lastname: {
		type: Sequelize.STRING
	},
	email: {
		type: Sequelize.STRING
	}
}, {
	timestamps: false
});

//esto añade funciones adicionales como
//user.addImage, user.getImages ... etc
User.belongsToMany(Role, {through: User_Role, foreignKey: 'user_id', onDelete: 'CASCADE'});
Role.belongsToMany(User, {through: User_Role, foreignKey: 'role_id', onDelete: 'CASCADE'});

module.exports = User;