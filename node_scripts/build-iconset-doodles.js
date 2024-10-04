'use strict';
require('dotenv').config();

/**
 * Build Eyedraw doodles (raster PNG spritesheet)
 *
 * Eyedraw doodle icons are ancient, they are used by CSS at 100%
 * - PNG: 	dist/img/eyedraw-doodle-icons-32x32.png
 * - SCSS:  src/sass/spritesheet/_eyedraw-doodle-sprites.scss
 */

const chalk = require('chalk'); // make some nice stdout with chalk! ;)
const green = chalk.bold.green;
const red = chalk.bold.red;
const log = console.log;

// modules
const fs = require('fs');
const rm = require('fs/promises').rm;
const fg = require('fast-glob');
const Spritesmith = require('spritesmith');
const Jimp = require('jimp');

/**
 * 1) Remove the current PNG spritesheet
 * 2) Spritesmith will build an image and associated coordinate mapping
 * 3a) Jimp uses the image buffer to create the PNG spritesheet
 * 3b) Write out the updated SCSS file
 *
 * Cache breaker: file is suffixed with .env tag
 * CSS then is updated to reference this specific file
 */

const tag = process.env.VERSION_TAG;
if ( tag === "6.x" ){
	log(red(`!-!-! Must set the correct git tag, not: ${tag}`));
	return;
} else {
	log(green(tag));
}

const config = {
	iconPath: './src/icons-eyedraw/32x32/',
	glob: '**/*.png', // two folders: "new" and "old" folders
	png: `eyedraw-doodle-icons-32x32-${tag}.png`,
	scss: './src/sass/eyedraw-doodles/_doodle-spritesheet.scss'
}

/**
 * Use Jimp to optimise PNG and write it out, imagemin had dependency issues.
 * @param {image Buffer} buffer
 */
const spritePNG = ( buffer ) => {
	// create new PNG
	// https://www.npmjs.com/package/jimp
	Jimp.read(buffer)
	.then(image => {
		// Do stuff with the image...these settings seem to generate smallest file size
		image
		.filterType(Jimp.PNG_FILTER_NONE) // set the filter type for the saved PNG
		.deflateLevel(8) // set the deflate level for the saved PNG
		.deflateStrategy(0) // set the deflate for the saved PNG (0-3)
		.write(`./dist/img/${config.png}`); // write out

		log(green('>>> png created: ') + config.png);
		log(green('(needs copying over to iDG)'));
	})
	.catch(err => log(red('Jimp error: ') + err));
};

/**
 * sass template for sprites
 * @returns String;
 */
const sassTemplate = ( sprite ) => {
	// Allow for 2 subfolders: "new" and "old", fortunately these are both 3 characters!!
	const name = sprite[0].slice(config.iconPath.length + 4, -4);
	const { x, y } = sprite[1];
	// this needs to Sass, not CSS!
	return [
		`.icon-ed-${name} {`,
		`background-position: ${0 - x}px ${0 - y}px;`,
		`&.small { background-position: ${0 - x / 2}px ${0 - y / 2}px; }`,
		`}`,
		``
	].join('\n');
}

/**
 * Build the SCSS sprite position
 * The icons are 76px x 76px, but used by CSS at 50% and at 25% e.g. 38px & 19px
 * @param {Object} : Object mapping filename to {x, y, width, height} of image
 * @param {Object} : Object with metadata about spritesheet {width, height}
 */
const buildSCSS = ( coordinates, properties ) => {
	const comments = [
		'// --- Automatically generated SCSS file by SpriteSmith',
		'// --- Do NOT edit this file directly: see node_scripts/build-iconset-doodles.js ',
		'',
	].join('\n');

	// base CSS
	const base = [
		`.ed-i {`,
		`background: center / ${properties.width}px ${properties.height}px url("../img/${config.png}") no-repeat;`,
		`.small { background-size: ${properties.width / 2}px ${properties.height / 2}px }`,
		`}`,
		``
	].join('\n');

	// Build CSS classes from coordinate object
	const classes = Object.entries(coordinates).map(sprite => sassTemplate(sprite)).join('');

	// write out the file
	fs.writeFile(`${config.scss}`, "".concat(comments, base, classes), err => {
		if ( err ){
			log(red('scss error: ') + err);
		} else {
			log(green('>>> scss file created: ') + config.scss);
		}
	})
};

/**
 * OK lets go...
 * Remove PNG and initiate Spritesmith
 */
rm(config.png, { force: true })
.then(() => {
	log('Current .png trashed...');
	// https://github.com/twolfson/spritesmith
	Spritesmith.run({
		src: fg.sync(`${config.iconPath}${config.glob}`) // use fast-glob here to generate an Array
	}, function handleResult( err, result ){
		if ( err ){
			log(red('Spritesmith error: ') + err);
			return;
		}
		log(`Spritesmith pulling from... "${config.iconPath}"`);
		log('Rebuild nxblu CSS if successful and check on iDG that they look OK!\n');
		// build the PNG
		spritePNG(result.image); // Buffer representation of image
		buildSCSS(result.coordinates, result.properties);
	});
});