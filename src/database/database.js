const Sequelize = require('sequelize');

const sequelize = new Sequelize(
	'acme',
	'postgres',
	'P@stGres220622#',
	{
		host: '45.79.56.138',
		dialect: 'postgres',
		pool: {
			max: 5,
			min: 0,
			require: 30000,
			idle: 10000
		},
		logging: false
	}
);

module.exports = { sequelize };