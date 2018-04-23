const db = require('../db/weather');

module.exports.getStateWithMinTemperature = async () => {
	try {
		return await db.getStateWithMinTemperature();
	} catch (error) {
		console.error(error);
	}
};