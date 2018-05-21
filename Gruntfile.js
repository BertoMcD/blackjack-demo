module.exports = function( grunt ) {
	grunt.initConfig({
		clean: {
			dev: ['dev/*'],
			prod: ['prod/*']
		},

		copy: {
			dev: {
				expand: true,
				cwd: 'src',
				src: ['**', '!**/{scss,ts}/**'],
				dest: 'dev'
			},
			prod: {
				expand: true,
				cwd: 'src',
				src: ['**', '!**/{scss,ts}/**'],
				dest: 'prod'
			}
		},

		sass: {
			dev: {
				options: {
					require: 'sass-globbing'
				},
				files: {
					'dev/css/main.css' : 'src/scss/main.scss'
				}
			},
			prod: {
				options: {
					style: 'compressed',
					sourcemap: 'none',
					require: 'sass-globbing'
				},
				files: {
					'prod/css/main.css' : 'src/scss/main.scss'
				}
			}
		},

		postcss: {
			dev: {
				options: {
					map: true,
					processors: [
						require('autoprefixer')({browsers: 'last 2 versions'})
					],
					failOnError: true
				},
				src: 'dev/css/*.css'
			},
			prod: {
				options: {
					map: false,
					processors: [
						require('autoprefixer')({browsers: 'last 2 versions'})
					]
				},
				src: 'prod/css/*.css'
			}
		},

		ts: {
			dev: {
				src: ['src/ts/**/*.ts'],
				outDir: 'dev/js',
				options: {
					rootDir: 'src/ts/',
					module: 'amd'
				}
			},
			prod: {
				src: ['src/ts/**/*.ts'],
				outDir: 'prod/js',
				options: {
					rootDir: 'src/ts/',
					module: 'amd'
				}
			}
		},

		connect: {
			dev: {
				options: {
					port: 8000,
					base: 'dev',
					open: true,
					middleware: function (connect, options, middlewares) {
						middlewares.unshift(require('connect-livereload')());
						return middlewares;
					}
				}
			},
			prod: {
				options: {
					port: 8000,
					base: 'prod',
					open: true,
					keepalive: true
				}
			}
		},

		watch: {
			dev: {
				files: ['src/**'],
				tasks: ['clean:dev', 'copy:dev', 'sass:dev', 'postcss:dev', 'ts:dev'],
				options: {
					livereload: true
				}
			}
		}

	});

	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-postcss');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-ts');

	grunt.registerTask('default', ['clean:prod', 'copy:prod', 'sass:prod', 'postcss:prod', 'ts:prod']);
	grunt.registerTask('build', ['clean:prod', 'copy:prod', 'sass:prod', 'postcss:prod', 'ts:prod']);
	grunt.registerTask('serve', ['clean:prod', 'copy:prod', 'sass:prod', 'postcss:prod', 'ts:prod', 'connect:prod']);
	grunt.registerTask('local', ['clean:dev', 'copy:dev', 'sass:dev', 'postcss:dev', 'ts:dev', 'connect:dev', 'watch']);
};
