module.exports = function(grunt) {
    'use strict';

    grunt.initConfig({
        uglify: {
            options: {
                banner: '/*! Copyright Aaron Marasco <%= grunt.template.today("yyyy") %>, MIT License  */\n'
            },
            dist: {
                files: {
                    'dragndrop.min.js': ['dragndrop.js']
                }
            }
        },
        qunit: {
            files: ['test/**/*.html']
        },
        jshint: {
            files: ['Gruntfile.js', 'dragndrop.js' ],
            options: {
                // options here to override JSHint defaults
                bitwise: true,
                camelcase: true,
                curly: true,
                eqeqeq: true,
                es3: true,
                immed: true,
                indent: 4,
                latedef: 'nofunc',
                quotmark: 'single',
                undef: true,
                unused: 'nofunc',
                strict: true,
                trailing: true,
                globals: {
                    module: true,
                    window: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-qunit');

    grunt.registerTask('test', ['jshint' ]);
    grunt.registerTask('default', ['jshint', 'uglify']);

};