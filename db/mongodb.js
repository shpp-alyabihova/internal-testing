const mongodb = require('mongodb');
const util = require('util');
const config = require('config');
const mongoClient = util.promisify(mongodb.MongoClient);

const DATABASE_URI = config.get('db.uri');
const OPTIONS = config.get('db.options');

module.exports.connect = (uri = DATABASE_URI, options = OPTIONS) => mongoClient
	.connect(uri, options)
	.catch(error => console.error(error));

module.exports.closeConnect = (client) => client.close();
