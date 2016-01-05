/*
This file in the main entry point for defining grunt tasks and using grunt plugins.
Click here to learn more. http://go.microsoft.com/fwlink/?LinkID=513275&clcid=0x409
*/
module.exports = function (grunt) {
    // load Grunt plugins from NPM
    grunt.loadNpmTasks('grunt-bowercopy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // configure plugins
    grunt.initConfig({
        uglify: {
            my_target: {
                files: { 'wwwroot/app.js': ['Scripts/app.js', 'Scripts/**/*.js'] }
            }
        },

        watch: {
            scripts: {
                files: ['Scripts/**/*.js'],
                tasks: ['uglify']
            }
        },
        bowercopy: {
            options: {
                runBower: true,
                destPrefix: 'wwwroot/lib'
            },
            libs: {
                files: {
                    'bootstrap': 'bootstrap/dist/css',
                    'fonts': 'bootstrap/dist/fonts',
                    'bootstrap.js': 'bootstrap/dist/js',
                    'angular': 'angular',
                    'angular-bootstrap': 'angular-bootstrap',
                    'angular-datepicker': 'angular-datepicker/dist',
                    'nvd3': 'nvd3/build',
                    'jquery': 'jquery/dist',
                    'angular-messages': 'angular-messages',
                    'angular-animate': 'angular-animate',
                    'angular-cookies': 'angular-cookies',
                    'angular-resource': 'angular-resource',
                    'angular-route': 'angular-route',
                    'angular-sanitize': 'angular-sanitize',
                    'angular-touch': 'angular-touch',
                    'lodash': 'lodash',
                    'd3': 'd3'
                    //'auth0.js': 'auth0.js/build',
                    //'a0-angular-storage': 'a0-angular-storage/dist',
                    //'angular-jwt': 'angular-jwt/dist',
                    //'auth0-angular': 'auth0-angular/build'
                }
            }
        }

    });

    // define tasks
    grunt.registerTask('default', ['bowercopy:libs', 'uglify', 'watch']);
};
