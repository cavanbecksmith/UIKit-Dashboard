module.exports = {	
	watch:false,
	devtool: 'inline-source-map',
	output:{
	},
	module:{
		loaders:[ 
				{ test: /\.js$/, 	loader: "babel-loader" },
			]
	}
};