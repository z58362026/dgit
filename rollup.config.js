const resolve = require('@rollup/plugin-node-resolve').default;
const commonjs = require('@rollup/plugin-commonjs');
const json = require('@rollup/plugin-json');

module.exports = {
    input: 'src/cli.js',
    output: {
        file: 'dist/cli.js',
        format: 'cjs',
        banner: '#!/usr/bin/env node',
        sourcemap: true,
    },
    plugins: [resolve({ preferBuiltins: true }), commonjs(), json()],
};
