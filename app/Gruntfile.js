module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.config.init({
        useminPrepare: {
            html: 'index.html',
            options: {
                dest: './dist'
            }
        },
        usemin: {
            html: ['./dist/index.html']
        },
        copy: {
            html: {
                src: './index.html', dest: './dist/index.html'
            },
            other: {
                files: [{
                        expand: true,
                        src: ['./beerList/*.*',
                            './editBeer/*.*',
                            './ingredients/*.*',
                            './login/*.*',
                            './profiles/*.*',
                            './public/*.*',
                            './directives/*.*',
                            './directives/*/*.*',
                            './menu/*.*',
                            './services/*.*',
                            './filters/*.*',
                            './squares.gif',
                            './favicon.ico',
                            './app.js',
                            './resources/*.svg'],
                        dest: './dist/',
                        filter: 'isFile'
                    }, {
                        expand: true,
                        flatten: true,
                        src: ['./bower_components/font-awesome/fonts/*'],
                        dest: './dist/fonts/',
                        filter: 'isFile'
                    }]
            }
        },
        shell: {
            deploy: {command: 'firebase deploy'}
        },
        clean: ['./dist']
    });

    grunt.registerTask('default', [
        'copy:html',
        'useminPrepare',
        'concat',
        'uglify',
        'cssmin',
        'usemin',
        'copy:other'
    ]);

    grunt.registerTask('deploy', [
        'copy:html',
        'useminPrepare',
        'concat',
        'uglify',
        'cssmin',
        'usemin',
        'copy:other',
        'shell:deploy'
    ]);
};