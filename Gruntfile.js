module.exports = function(grunt) {

	require('load-grunt-tasks')(grunt);
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-clean');

	grunt.config.init({
	  useminPrepare: {
	      html: 'app/index.html',
	      options: {
	        dest: 'dist/app'
	      }
	  },
	  usemin:{
	  	html:['dist/app/index.html']
	  },
	  copy:{
	    html: {
	    	src: './app/index.html', dest: 'dist/app/index.html'
	    },
        other: {
            files: [{
                expand: true,
                src: ['./app/beerList/*.html',
                      './app/editBeer/*.html',
                      './app/ingredients/*.html',
                      './app/login/*.html',
                      './app/login/*.png',
                      './app/profiles/*.html',
                      './app/public/*.html',
                      './app/stock/*.html'],
                dest: 'dist/',
                filter: 'isFile'
            }, {
                expand: true,
                flatten: true,
                src: ['./app/bower_components/font-awesome/fonts/*',
                      './app/bower_components/bootstrap/fonts/*'],
                dest: 'dist/app/fonts/',
                filter: 'isFile'
            }]
        }
	  },
      shell: {
          deploy: {command: 'firebase deploy'}
      },
      clean: ['dist']
	});

	grunt.registerTask('default',[
		'copy:html',
		'useminPrepare',
		'concat',
		'uglify',
        'cssmin',
		'usemin',
        'copy:other'
    ]);

	grunt.registerTask('deploy',[
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