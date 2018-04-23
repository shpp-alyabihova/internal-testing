const db = require('../db/school');

module.exports.updateSchoolScore = async () => {
	try {
		await db.updateSchoolScore();
	} catch (error) {
		console.error(error);
	}
};

module.exports.getSuccessfulStudent = async () => {
	try {
		return await db.getSuccessfulStudent();
	} catch (error) {
		console.error(error);
	}
};
