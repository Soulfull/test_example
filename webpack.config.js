var webpack      = require('webpack');
var path         = require('path');
var precss       = require('precss');
var autoprefixer = require('autoprefixer');

module.exports = {
	entry: {
			app: ['./src/js/main.js']
		},
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: 'bundle.js'
	},
	module: {
		loaders: [
			{test: /\.raw$/, loader: 'raw-loader'},
			{test: /\.css$/, loader: 'style-loader!css-loader!postcss-loader'}
		]
	},
	postcss: function () {
		return [precss, autoprefixer];
	},
	plugins: [
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false
			}
		})
	]
};