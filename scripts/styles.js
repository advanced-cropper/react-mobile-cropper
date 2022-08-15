const path = require('path');
const fs = require('fs-extra');
const sass = require('sass');
const autoprefixer = require('autoprefixer');
const postcss = require('postcss');
const glob = require('glob');

async function copyStyleSources(source, dist) {
	const files = glob.sync(`**/*.scss`, { cwd: source });
	await Promise.all(
		files.map(async (file) => {
			await fs.ensureDir(path.dirname(`${dist}/${file}`));
			await fs.copyFile(`${source}/${file}`, `${dist}/${file}`);
		}),
	);
}

async function buildStyles(styles, dist) {
	await Promise.all(
		styles.map(async (style) => {
			const { css } = await sass.compileAsync(style);

			postcss([autoprefixer])
				.process(css)
				.then((result) => {
					result.warnings().forEach((warn) => {
						console.warn(warn.toString());
					});
					fs.writeFileSync(`${dist}/${path.basename(style, path.extname(style))}.css`, result.css);
				});
		}),
	);
}

async function run() {
	try {
		await Promise.all([
			copyStyleSources('./src', './dist'),
			buildStyles(['./src/style.scss', './src/style.basic.scss'], './dist'),
		]);
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
}

run();
