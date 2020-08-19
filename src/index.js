const app = require('./app');

async function main() {
	await app.listen(5000);
	console.log('server on port 5000')
}

main();