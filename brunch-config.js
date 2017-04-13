// See http://brunch.io for documentation.
module.exports = {
	server: {
		port: 12345
	},
	paths: {
		public: './deploy',
		watched: ['./src']
	},
	files: {
		javascripts: {
			joinTo: {
				'vendor.js': /^(?!src)/, // Files that are not in `app` dir.
				'WallFall.js': /^src/
			}
		},
		stylesheets: {
			joinTo: 'WallFall.css'
		}
	},
	// conventions: {
		// assets: /.*\.(html|png)$/
	// },
	plugins: {
		babel: {
			babelrc: true
		}
	}
}
