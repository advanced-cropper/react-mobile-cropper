import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import replace from '@rollup/plugin-replace';
import { visualizer } from 'rollup-plugin-visualizer';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

const bundles = [
	{
		format: 'es',
		bundle: true,
		file: pkg.module,
	},
	{
		format: 'cjs',
		bundle: true,
		file: pkg.main,
	},
	{
		format: 'iife',
		bundle: false,
		file: pkg.unpkg,
	},
];

export default bundles.map(({ format, bundle, file }) => ({
	input: 'src/index.ts',
	output: {
		file,
		format,
		name: !bundle ? 'ReactMobileCropper' : undefined,
		globals: {
			react: 'React',
			'react-advanced-cropper': 'ReactAdvancedCropper',
		},
		sourcemap: true,
	},
	external: bundle ? [/node_modules/] : ['react', 'react-advanced-cropper'],
	plugins: [
		resolve(),
		commonjs(),
		typescript({ tsconfig: './tsconfig.json' }),
		!bundle &&
			terser({
				format: {
					comments: false,
				},
				module: format === 'es',
			}),
		visualizer({
			gzipSize: true,
		}),
		!bundle &&
			replace({
				'process.env.NODE_ENV': 'production',
			}),
	],
}));
