const webpack = require('webpack');
const path = require('path');

module.exports = {
	entry: './src/index.js',
	target: 'node',
	node: {
		__filename: true,
		__dirname: true
	},
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'index.js'
	},
	plugins: [
		new webpack.IgnorePlugin({ resourceRegExp: /\.(css|less)$/ })
	],
	optimization: {
		minimize: false
	},
	devtool: 'source-map'
};