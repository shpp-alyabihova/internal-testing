const object = require('lodash/object');
const { connect, closeConnect } = require('./mongodb');
const config = require('config');

const DB_NAME = config.get('db.name');
const COLLECTION = config.get('school.collectionName');

module.exports.updateSchoolScore = async () => {
	const client = await connect();
	const db = client.db(DB_NAME);
	const cursor = await db.collection(COLLECTION).aggregate([
		{ $unwind: '$scores' },
		{ $match: { 'scores.type': 'homework' } },
		{ $group: { _id: '$_id', minscore: { $min: '$scores.score' } } }
	]).toArray();

	for (let coll of cursor) {
		await db.collection(COLLECTION).update({
			_id: coll._id,
		}, {
			$pull: {
				'scores': {
					type: 'homework',
					score: coll.minscore
				}
			}
		});
	}

	await closeConnect(client);
};

module.exports.getSuccessfulStudent = async () => {
	const client = await connect();
	const db = client.db(DB_NAME);
	const student = await db.collection(COLLECTION).aggregate([
		{ $unwind: '$scores' },
		{ $group: { _id: '$_id', avgscore: { $avg: '$scores.score' } } },
		{ $sort: { avgscore: -1 } },
		{ $limit: 2 }
	]).toArray();

	await closeConnect(client);
	return object.get(student, '[0]._id');
};