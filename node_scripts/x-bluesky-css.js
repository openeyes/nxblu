'use strict';

const config = {
	src: './src/sass/x-bluesky/',
	dist: '/Users/toby/Sites/work/oe/idg/src/build/css/idg_bluesky.css'
};

const chalk = require('chalk');
const cyan = chalk.bold.cyan;
const red = chalk.bold.red;
const log = console.log;
const fs = require('fs');
const sass = require('sass');
const chokidar = require('chokidar');

log(cyan(`>>> idg bluesky CSS, will push CSS into build on iDG`));
log(sass.info);

/**
 * Process the scss files with Dart Sass
 * "Dart Sass is the primary implementation of Sass"
 * https://sass-lang.com/dart-sass
 */
const buildCSS = () => {
	log(cyan(`building: idg_bluesky.css`));
	try {
		const result = sass.compile(`${config.src}idg_bluesky.scss`,{
			style: 'compressed', // "expanded" or "compressed"
			loadPaths: ['src/sass/']
		});

		const distStream = fs.createWriteStream(`${config.dist}`);
		distStream.end(result.css);

	} catch (e) {
		log(red('sass error: ') + e.name + ': ' + e.message);
		log(red('location: ') + e.file + ': ' + e.line); // custom SASS errors
	}

	log(cyan(`...watching`));
};

// init
buildCSS();

// watch
chokidar.watch(`${config.src}**/*.scss`, {
	ignored: /(^|[\/\\])\../, // ignore dotfiles
	persistent: true
}).on('change', path => {
	log(`updated: ${path}`);
	buildCSS();
});

