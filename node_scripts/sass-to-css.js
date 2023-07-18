'use strict';
require('dotenv').config();

/**
 * Build CSS files for OpenEyes
 * Production:
 * 1) style_openeyes.css (dark/light theme)
 * 2) style_block-browser-print.css ( media=print)
 * 2) style_oe_print.3.css (Print, only used for PDF creation)
 * 3) style_eyedraw_doodles.css (Eyedraw doodle icon sprite sheet, only required for Eyedraw editting)
 *
 * iDG copies are prefixed with VERSION_TAG numbers, to allow testing
 * of different TAGs within iDG
 *
 * Check node arguments to see what CSS file to build. Default is 1.
 */
let buildMode = "style_openeyes";

/**
 * Create a tagged file for iDG UIX testing
 */
let versionTagFile = true;

/**
 * Get git tag version, this is the version CSS is aiming to release
 * next into the master branch (i.e. it's under development on iDG current)
 */
const tag = process.env.VERSION_TAG;

const nodeArg = process.argv[2];
if( nodeArg !== undefined ){
	if(nodeArg === "print") buildMode = "style_oe_print.3";
	if(nodeArg === "eyedraw") {
		versionTagFile = false;
		buildMode = "style_eyedraw_doodles";
	}
	if(nodeArg === "blocker") {
		versionTagFile = false;
		buildMode = "style_block-browser-print";
	}
}

const config = {
	src: './src/sass/',
	dist: './dist/css/',
	idg: '../idg/src/build/nxblu/dist/css/'
};



const chalk = require('chalk');
const cyan = chalk.bold.cyan;
const red = chalk.bold.red;
const log = console.log;
const fs = require('fs');
const sass = require('sass');
const chokidar = require('chokidar');

log(cyan(`>>> Building: ${buildMode}.css`));
log(sass.info);
log(chalk.bgYellow(`--- git tag version = ${tag} ---`));

// build a dateStamp for the CSS, useful for debugging deployments
const nowDate = new Date(Date.now());
const dateStamp = `/* ${tag} - ${nowDate} */ \n`;

// Legals required on the CSS files.
const headerLegals = [
	'/**',
	'*  (C) OpenEyes Foundation, 2018 ',
	'*  This file is part of OpenEyes. ',
	'*',
	'* OpenEyes is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.',
	'* OpenEyes is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.',
	'* You should have received a copy of the GNU Affero General Public License along with OpenEyes in a file titled COPYING. If not, see www.gnu.org/licenses.',
	'*',
	'* @link www.openeyes.org.uk',
	'* @author OpenEyes info@openeyes.org.uk',
	'* @copyright Copyright (C) 2018, OpenEyes Foundation',
	'* @license www.gnu.org/licenses/agpl-3.0.html The GNU Affero General Public License V3.0',
	'*/',
	'', '' ].join('\n');

/**
 * Process the scss files with Dart Sass
 * "Dart Sass is the primary implementation of Sass"
 * https://sass-lang.com/dart-sass
 */
const dartSass = ( style ) => {
	log(cyan(`Build: ${style}`));

	const tagFile = `${versionTagFile ? tag+'_' : ''}`;

	const cssOutput = `${config.dist + style}.css`;
	const cssIDG = `${config.idg}${tagFile}${style}.css`;

	try {
		/**
		 * Dart-Sass recommends using RenderSync as it is faster.
		 * Create compressed version for Production and a TAG prefixed
		 * version for iDG to use
		 */
		const result = sass.compile(`${config.src}${style}.scss`,{
			style: 'compressed', // "expanded" or "compressed"
			loadPaths: ['src/sass/']
		});

		/**
		 * Output CSS with headerLegals, datetime stamp
		 */
		log(cyan(`CSS: `) + `${cssOutput}`);
		const distStream = fs.createWriteStream(`${cssOutput}`);
		distStream.write(headerLegals);
		distStream.write(dateStamp);
		distStream.end(result.css);

		/**
		 * TAG prefixed file version for iDG development area
		 */
		log(cyan(`iDG copy: `) + `${tagFile}${style}`);
		const idgStream = fs.createWriteStream(`${cssIDG}`);
		idgStream.write(headerLegals);
		idgStream.write(dateStamp);
		idgStream.end(result.css);

	} catch (e) {
		log(red('sass error: ') + e.name + ': ' + e.message);
		log(red('location: ') + e.file + ': ' + e.line); // custom SASS errors
	}
};

/**
 * Build required CSS file (production & iDG tagged copy)
 */
const buildCSS = () => {
	dartSass(buildMode);
	log(cyan(`... watching ... `));
}

buildCSS();

chokidar.watch(`${config.src}**/*.scss`, {
	ignored: /(^|[\/\\])\../, // ignore dotfiles
	persistent: true
}).on('change', path => {
	log(`updated: ${path}`);
	buildCSS();
});










