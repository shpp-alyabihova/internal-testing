const array = require('lodash/array');
const object = require('lodash/object');
const sharp = require('sharp');
const util = require('util');
const fs = require('fs');
const config = require('config');
const asyncFs = ['writeFile', 'readFile', 'stat', 'mkdir', 'readdir']
	.reduce((obj, funcName) => (object.set(obj, funcName, util.promisify(fs[funcName]))), {});


const FILE_PATH = config.get('images.path');
const OUTPUT_DIR = config.get('images.outputDir');
const SIZES = config.get('images.sizes');

module.exports.resizeImages = async (filePath = FILE_PATH) => {
	const filesList = await getFiles(filePath);
	const imageList = array.flattenDeep(filesList).filter(fileName => fileName.toLowerCase().endsWith('.jpg'));
	await ensureDir(OUTPUT_DIR);
	await Promise.all(imageList.map(image => resizeImageToMultipleSize(image)));
};

async function ensureDir(dirPath) {
	try {
		await asyncFs.stat(dirPath);
	} catch (error) {
		if (object.get(error, 'code') === 'ENOENT') {
			await createDirTree(dirPath);
		}
	}
}

async function createDirTree(dirPath) {
	const dirNodes = dirPath.split('/').filter(node => !node.startsWith('.'));
	return dirNodes.reduce(async (prevPromise, node) => {
		const path = await prevPromise;
		await asyncFs.mkdir(`${path}/${node}`).catch(error => console.error(error));
		return Promise.resolve(`${path}/${node}`);
	}, Promise.resolve('.'));
}

async function resizeImageToMultipleSize(image) {
	const fileBuff = await asyncFs.readFile(image);
	await Promise.all(SIZES.map(async size => {
		try {
			const resizedImage = await resize(fileBuff, size);
			await asyncFs.writeFile(`${OUTPUT_DIR}/${size}x${size}_${array.last(image.split('/'))}`, resizedImage);
		} catch (error) {
			console.error(error);
		}
	}));
}

async function resize(buff, size) {
	return sharp(buff)
		.resize(size, size)
		.withoutEnlargement(true)
		.toBuffer();
}

async function getFiles(sourcePath) {
	const stats = await asyncFs.stat(sourcePath);
	if (stats.isFile()) {
		return array.concat(sourcePath);
	} else if (stats.isDirectory()){
		return getFileList(sourcePath);
	}
	return [];
}


async function getFileList(dirPath) {
	const fileList = await asyncFs.readdir(dirPath);
	return await Promise.all(fileList.map(filePath => getFiles(`${dirPath}/${filePath}`)));
}
