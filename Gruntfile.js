module.exports = function (grunt) {
    // load all grunt tasks matching the `grunt-*` pattern
    require('load-grunt-tasks')(grunt, {
        pattern: ['grunt-*', '!grunt-template-jasmine-istanbul']
    });

    // Project configuration.
    grunt.initConfig({
        // pkg: grunt.file.readJSON('package.json'),
        appConfig: grunt.file.readJSON('package.json'),

        clean: {
            app: ["Public/app.js", "Public/app.min.js"],
            dev: ["Public/app.dev.js"],
            templates: ["Public/templates.js"]
        },

        closureCompiler: {
            options: {
                compilerFile: 'node_modules/closure-compiler/node_modules/google-closure-compiler/compiler.jar',
                checkModified: true,
                compilerOpts: {
                    language_in: 'ECMASCRIPT5',
                    compilation_level: 'SIMPLE_OPTIMIZATIONS'
                },
                execOpts: {
                    maxBuffer: 999999 * 1024
                }
            },

            minify: {
                files: [{
                    expand: true,
                    src: ['Public/app.js'],
                    ext: '.min.js'
                }
                ]
            }
        },

        'angular-builder': {
            options: {
                mainModule: 'assessmentApp',
                externalModules: [],
				debugBuild: {
					rebaseDebugUrls: [{ match: 'Public/', replaceWith: '' }]
				}
            },
            app: {
                src: ['Public/App/**/*.js', 'Public/templates.js'],
                dest: 'Public/app.js'
            },
            dev: {
                src: 'Public/App/**/*.js',
                dest: 'Public/app.dev.js'
            }
        },

        jshint: {
            all: {
                src: ['Public/App/**/*.js'],
                options: {
                    '-W004': true,
                    '-W041': true,
                    '-W065': true,
                    '-W014': true,
                    bitwise: true,
                    latedef: true,
                    curly: true,
                    undef: true,
                    unused: true,
                    trailing: true,
                    strict: true,
                    maxdepth: 4,
                    jquery: true,
                    predef: ['angular'],
                    quotmark: 'single',
                    globals: {
                        
                    }
                }
            }
        },
        ngtemplates: {
            app: {
                cwd: 'Public',
                src: 'App/**/*.html',
                dest: 'Public/templates.js',
                options: {
                    bootstrap: function (module, script) {
                        return "angular.module('assessmentApp').run(['$templateCache', function($templateCache) {" + script + "}]);";
                    },
                    htmlmin: { collapseWhitespace: true, collapseBooleanAttributes: true, keepClosingSlash: true }
                }
            }
        },

        'css-include-combine': {
            all: {
                // include's on CSS will use this PATH as it's relative 
                // path. This also is applied to resources url's.
                relativeDir: 'Public/App/',
                // your main file (see example above)
                main: 'Public/Css/app.dev.css',
                // the generated file
                out: 'Public/Css/app.css'
            }
        },

        jasmine: {
            unit: {
                src: 'Public/app.js',
                options: {
                    vendor: [
						'Public/tests/vendor/jasmine-2.0.0/jasmine-html.js',
						'Public/tests/vendor/jquery/jquery-1.11.2.min.js',
						'Public/Scripts/angular.js',
						'Public/tests/vendor/angular/angular-mocks.js'
                    ],
                    specs: 'Public/tests/spec/**/*.js',
                    template: require('grunt-template-jasmine-istanbul'),
                    templateOptions: {
                        coverage: 'coverage/coverage.json',
                        report: 'coverage'
                    }
                }
            }
        },

		notify: {
			completed: {
				options: {
					message: 'Compile completed!'
				}
			}
		},
		
		bom2 : {
			main: { src: [ "Public/Css/app.css" ] }
		}
		
    });

    grunt.registerTask('compile', ['jshint', 'clean:app', 'clean:dev', 'clean:templates', 'ngtemplates', 'angular-builder:app', 'angular-builder:dev:debug', 'css-include-combine', 'bom2', 'closureCompiler', 'jasmine:unit', 'notify:completed']);
};
