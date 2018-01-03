var path = require('path');
var webpack = require('webpack');

module.exports = {
	entry: './public/jsx/entry.js',
	output: {
		path: path.resolve(__dirname + '/public/js'),
		filename: 'bundle.js',
	},
	
	module: {
		loaders: [
			{
				test: /.jsx?$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
				query: {
					presets: ['es2015', 'react']
				}
			}
		]
	},
	
	watch: true
}