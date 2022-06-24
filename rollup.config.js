import path from 'path';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import { visualizer } from 'rollup-plugin-visualizer';
import url from '@rollup/plugin-url';
import external from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import autoprefixer from 'autoprefixer';
import { terser } from 'rollup-plugin-terser';
import scss from 'rollup-plugin-scss';
import pkg from './package.json';

const files = {
	es: pkg.main,
	cjs: pkg.module,
	iife: pkg.browser,
};

export default ['es', 'cjs', 'iife'].map((format) => ({
	input: 'src/index.ts',
	output: {
		file: files[format],
		format,
		name: format === 'iife' ? 'ReactMobileCropper' : undefined,
		globals: {
			react: 'React',
		},
		sourcemap: true,
	},
	plugins: [
		external(),
		scss({
			output: 'dist/style.css',
		}),
		postcss({
			plugins: [autoprefixer],
			extract: path.resolve('dist/style.css'),
		}),
		url(),
		resolve(),
		commonjs(),
		typescript({ tsconfig: './tsconfig.json' }),
		visualizer({
			gzipSize: true,
		}),
	],
}));
