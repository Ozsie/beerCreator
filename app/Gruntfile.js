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
                        src: ['./beerList/*.html',
                            './editBeer/*.html',
                            './ingredients/*.html',
                            './login/*.html',
                            './login/*.png',
                            './profiles/*.html',
                            './public/*.html',
                            './stock/*.html',
                            './squares.gif'],
                        dest: './dist/',
                        filter: 'isFile'
                    }, {
                        expand: true,
                        flatten: true,
                        src: ['./bower_components/font-awesome/fonts/*',
                            './bower_components/bootstrap/fonts/*'],
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