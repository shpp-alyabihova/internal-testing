const config = require('config');
const object = require('lodash/object');
const school = require('./modules/school');
const weather = require('./modules/weather');
const resizer = require('./modules/image-resizer');

const OUTPUT_DIR = config.get('images.outputDir');
const IMAGE_RESIZE_TEST_NAME = config.get('images.testName');
const WEATHER_TEST_NAME = config.get('weather.testName');
const SCHOOL_TEST_NAME = config.get('school.testName');

async function init() {
	const result = {};

	await resizer.resizeImages();
	object.set(result, IMAGE_RESIZE_TEST_NAME, OUTPUT_DIR);
	object.set(result, WEATHER_TEST_NAME, await weather.getStateWithMinTemperature());
	await school.updateSchoolScore();
	object.set(result, SCHOOL_TEST_NAME, await school.getSuccessfulStudent());

	return { result };
}

init()
	.then(result => console.log(result))
	.catch(error => console.error(error));



