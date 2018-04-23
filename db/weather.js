const object = require('lodash/object');
const { connect, closeConnect } = require('./mongodb');
const config = require('config');

const DB_NAME = config.get('db.name');
const COLLECTION = config.get('weather.collectionName');
const WIND_DIRECTION = config.get('weather.windDirection');

module.exports.getStateWithMinTemperature = async (windDirection = WIND_DIRECTION) => {
	const client = await connect();
	const db = client.db(DB_NAME);
	const selection = await db.collection(COLLECTION).aggregate([ {
		$match: {
			windDirection: {
				$gte: object.get(windDirection, 'min'),
				$lte: object.get(windDirection, 'max')
			}
		}
	}, {
		$group: {
			_id: '$state',
			temp: {
				$min: '$temperature'
			}
		}
	}]).toArray();
	await closeConnect(client);
	return object.get(selection, '[0]._id');
};

//.find({ windDirection: { $gte: object.get(windDirection, 'min'), $lte: object.get(windDirection, 'max') } }).sort({ temperature: 1 }).limit(1).toArray();