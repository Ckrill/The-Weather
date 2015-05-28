module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        
        express: {
            prototype: {
                options: {
                    port: 1508,
                    hostname: "0.0.0.0",
                    bases: ['./build'],
                    livereload: true
                }
            }
        },
        uglify: {
//            options: {
//                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
//            },
            build: {
                expand: true,
                cwd: 'src/js/',
                src: ['*.js'],
                dest: 'build/js/',
                ext: '.min.js'
            }
        },
        cssmin: {
            minify: {
                expand: true,
                cwd: 'src/css/',
                src: ['*.css'],
                dest: 'build/css/',
                ext: '.min.css'
            },
            add_banner: {
//                options: {
//                    banner: '/* My minified css file */\n'
//                },
                files: {
                    'build/css/style.min.css': ['build/css/style.min.css']
                }
            }
        },
        copy: {
            markup: {
                files: [
                    {src: '*.{html,php}',
                     dest: 'build/'}
                ]
            },
            content: {
                files: [
                    {src: '*.xml',
                     dest: 'build/xml/'}
                ]
            }
        },
        open: {
            all: {
                // Gets the port from the connect configuration
                path: 'http://localhost:1508'
            }
        },
        watch: {
            sass: {
				files: ['src/sass/**/*.{scss,sass}','src/sass/**/*.{scss,sass}'],
				tasks: ['sass:dist'],
                options: {
                    livereload: true
                }
			},
//            css: {
//                files: ['src/css/**'],
//                tasks: ['cssmin'],
//                options: {
//                    livereload: true
//                }
//            },
            js: {
                files: ['src/js/**'],
                tasks: ['uglify'],
                options: {
                    livereload: true
                }
            },
            markup: {
                files: ['*.html', '*.php'],
                tasks: ['copy:markup'],
                options: {
                    livereload: true
                }
            },
            content: {
                files: ['*.xml'],
                tasks: ['copy:content']
            }
        },
        imagemin: {
            dynamic: {
                options: {
                    optimizationLevel: 7,
                    svgoPlugins: [{ removeViewBox: false }]
                },
                files: [{
                    expand: true,
                    cwd: 'src/img/',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: 'build/img/'
                }]
            }
        },
		sass: {
			options: {
				sourceMap: true,
				outputStyle: 'compressed'
			},
			dist: {
				files: {
					'build/css/styles.min.css': 'src/sass/styles.scss'
				}
			}
		}
    });


    // Default task(s).
//    grunt.registerTask('default', ['uglify', 'cssmin', 'copy', 'express:prototype', 'open', 'watch']);
    grunt.registerTask('default', ['uglify', 'sass', 'copy', 'watch']);
//    grunt.registerTask('default', ['copy', 'watch']);
//    grunt.registerTask('build', ['uglify', 'cssmin', 'copy', 'watch']);
    grunt.registerTask('build', ['uglify', 'cssmin', 'copy']);
    grunt.registerTask('image', ['imagemin']);


    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-express');
    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
//    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-sass');
};