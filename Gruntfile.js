'use strict';
var LIVERELOAD_PORT = 35729;
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {
    require('matchdep').filterAll('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        paths: {
            src: {
                js: 'flickrSearch/**/*.js'
            },
            dest: {
                js: 'flickrSearch/dist/js/main.js',
                jsMin: 'flickrSearch/min-safe/main.min.js'
            }
        },
        watch: {
            options: {
                nospawn: true,
                livereload: true
            },
            css: {
                options: {
                    livereload: LIVERELOAD_PORT
                },
                files: [
                    'flickrSearch/static/css/**/*.css',
                    'flickrSearch/static/pingendo/**/*.css'
                ],
                tasks: ['cssmin']
            },
            services: {
                options: {
                    livereload: LIVERELOAD_PORT
                },
                files: [
                    'flickrSearch/services/*.js'
                ],
                tasks: ['uglify:services']
            },
            controllers: {
                options: {
                    livereload: LIVERELOAD_PORT
                },
                files: [
                    'flickrSearch/view/flickr_grid/flickr_grid_controller.js'
                ],
                tasks: ['uglify:controllers']
            },
            directives: {
                options: {
                    livereload: LIVERELOAD_PORT
                },
                files: [
                    'flickrSearch/directives/*.js'
                ],
                tasks: ['uglify:directives']
            }
        },
        nodemon: {
            dev: {
                script: 'node-server.js',
                options: {
                    nodeArgs: ['--nolazy',  '--harmony'],
                    env: {
                        PORT: '3000'
                    },
                    cwd: __dirname,
                    ignore: ['node_modules/**'],
                    watch: ['server']
                }
            }
        },
        ngAnnotate: {
            options: {
                singleQuotes: true
            },
            flickrSearch: {
                files: {
                    'flickrSearch/min-safe/directives/ng-no-sticky-footer.js': ['flickrSearch/directives/ng-no-sticky-footer.js'],
                    'flickrSearch/min-safe/directives/ng-text-truncate.js': ['flickrSearch/directives/ng-text-truncate.js'],
                    'flickrSearch/min-safe/services/flickr-services.js': ['flickrSearch/services/flickr-services.js'],
                    'flickrSearch/min-safe/controllers/flickr_grid_controller.js': ['flickrSearch/views/flickr_grid/flickr_grid_controller.js'],
                    'flickrSearch/min-safe/flickrSearch.js': ['flickrSearch/flickrSearch.js']
                }
            }
        },
        concat: {
            js: {
                options: {
                    separator: ';'
                },
                src: '<%= paths.src.js %>',
                dest: '<%= paths.dest.js %>'
            }
        },
        uglify: {
            js: {
                options: {
                    compress : {
                        warnings: false
                    },
                    mangle: true,
                    sourceMap: true
                },
                files: {
                    //'flickrSearch/dist/js/dependencies.min.js': [ 'flickrSearch/bower_components/jquery/dist/jquery.min.js',
                    //    'flickrSearch/bower_components/angular-animate/angular-animate.min.js',
                    //    'flickrSearch/bower_components/angular-route/angular-route.min.js',
                    //    'flickrSearch/bower_components/angular-resource/angular-resource.min.js',
                    //    'flickrSearch/bower_components/angular-ui-router/release/angular-ui-router.min.js',
                    //    'flickrSearch/bower_components/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.concat.min.js',
                    //    'flickrSearch/bower_components/ng-scrollbars/dist/scrollbars.min.js' ],
                    'flickrSearch/dist/js/services.min.js': [ 'flickrSearch/min-safe/services/*.js' ],
                    'flickrSearch/dist/js/controllers.min.js': [ 'flickrSearch/min-safe/controllers/*.js' ],
                    'flickrSearch/dist/js/directives.min.js': [ 'flickrSearch/min-safe/directives/*.js' ],
                    'flickrSearch/dist/flickrSearch.min.js': [ 'flickrSearch/min-safe/flickrSearch.js' ]
                }
            },
            services: {
                options: {
                    sourceMap: true
                },
                files: {
                    'flickrSearch/dist/js/services.min.js': [ 'flickrSearch/min-safe/services/*.js' ]
                }
            },
            controllers: {
                options: {
                    sourceMap: true
                },
                files: {
                    'flickrSearch/dist/js/controllers.min.js': [ 'flickrSearch/min-safe/controllers/flickr_grid_controller.js' ]
                }
            },
            directives: {
                options: {
                    sourceMap: true
                },
                files: {
                    'flickrSearch/dist/js/directives.min.js': [ 'flickrSearch/min-safe/directives/*.js' ]
                }
            }
        },
        cssmin: {
            target: {
                files: {
                    'flickrSearch/dist/css/main.min.css': ['flickrSearch/static/css/*.css']
                }
            }
        },
        concurrent: {
            dev: {
                tasks: ['nodemon', 'ngAnnotate', 'uglify:js', 'cssmin', 'open', 'watch' ],
                options: {
                    logConcurrentOutput: true
                }
            },
            prod: {
                tasks: ['forever:server1:start', 'watch' ],
                options: {
                    logConcurrentOutput: true
                }
            }
        },
        bower: {
            install: {
                options: {
                    targetDir: './flickrSearch/bower_components'
                }
            }
        },
        open: {
            server: {
                path: 'http://localhost:3000'
            }
        },
        forever: {
            server1: {
                options: {
                    index: 'node-server.js',
                    logDir: 'logs'
                }
            }
        }
    });

    grunt.registerTask('default', function (target) {
        grunt.task.run([ 'ngAnnotate','uglify:js', 'cssmin' ]);
    })
    .registerTask('run-dev', function (target) {
        grunt.task.run([ 'concurrent:dev' ]);
    })
    .registerTask('run-prod', function (target) {
        grunt.task.run([ 'concurrent:prod' ]);
    })
    .registerTask('stop', function (target) {
        grunt.task.run([ 'forever:server1:stop' ]);
    })
    .registerTask('restart', function (target) {
        grunt.task.run([ 'forever:server1:start' ]);
    });
};