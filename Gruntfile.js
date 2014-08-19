/**
 * Created by rsamec on 27.7.2014.
 */

module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        complexity: {
            generic: {
                src: ['src/**/*.js'],
                options: {
                    breakOnErrors:false,
                    errorsOnly: false,
                    cyclometric: 6,       // default is 3
                    halstead: 16,         // default is 8
                    maintainability: 100  // default is 100
                }
            }
        },
        jshint: {
            all: [
                'Gruntfile.js',
                'src/**/*.js'
                //'test/**/*.js'
            ],
            options: {
                jshintrc: '.jshintrc',
                force:false
            }
        },
        mochacli: {
            all: ['test/**/*.js'],
            options: {
                reporter: 'spec',
                ui: 'bdd'
            }
        },
        watch: {
            js: {
                files: ['**/*.js', '!node_modules/**/*.js'],
                tasks: ['default'],
                options: {
                    nospawn: true
                }
            }
        },
        typedoc: {
            build: {
                options: {
                    module: 'commonjs',
                    out: './docs',
                    name: 'Business rules',
                    target: 'es5'
                },
                src: ['./src/**/*']
            }
        },
        typescript: {
           test:{
                src: ['test/models/**/*.ts'],
                dest: '',
                options: {
                    module: 'commonjs',
                    target: 'es5',
                    declaration: false,
                    comments:true
                }
            }
        },
        uglify: {
            options: {
                // the banner is inserted at the top of the output
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                    'dist/vacationApproval/vacationApproval.min.js': ['<%= typescript.base.dest %>'],
                    'dist/vacationApproval/node-vacationApproval.min.js': ['dist/vacationApproval/node-vacationApproval.js']

                }
            }
        }
     });

    var businessRules = ['vacationApproval', 'invoice'];
    for(var i = 0; i < businessRules.length; i++) {
        var bRule = businessRules[i];
        var destFile = 'dist/' + bRule + '/business-rules.js';
        var commonjsFile = 'dist/' + bRule + '/node-business-rules.js';

        grunt.config(['typescript', bRule], {
            src: ['src/models/' + bRule + '/BusinessRules.ts'],
            dest: destFile,
            options: {
                target: 'es5',
                declaration: true,
                comments: true
            }
        });

        grunt.config(['concat', bRule], {
            dest: commonjsFile,
            src: [destFile, 'src/models/' + bRule + '/commonjs.js']
        });

        grunt.config(['copy', bRule], {
                files: [
                    {
                        filter: 'isFile', flatten: true, expand: true,
                        dest: 'dist/' + bRule + '/i18n',
                        src: ['src/models/' + bRule + '/locales/*']
                    },
                    {
                        filter: 'isFile', flatten: true, expand: true,
                        dest: 'dist/' + bRule,
                        src: ['src/models/' + bRule + '/README.md' ]
                    }
                ]
            }
        );


//        grunt.config(['uglify', bRule], {
//            files: {
//                commonjsFile: [destFile, 'src/models/' + bRule + '/commonjs.js']
//            }
//        });

        grunt.registerTask('dist' + bRule , ['typescript:' + bRule,'concat:' + bRule,'copy:' + bRule]);
    }


    grunt.loadNpmTasks('grunt-complexity');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-mocha-cli');
    grunt.loadNpmTasks('grunt-typedoc');
    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');


    grunt.registerTask('test', ['typescript:test', 'mochacli', 'watch']);
    grunt.registerTask('ci', ['complexity', 'jshint', 'mochacli']);
    grunt.registerTask('default', ['test']);
    grunt.registerTask('document', ['typedoc']);
};
