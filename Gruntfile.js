var fs = require('fs');
var childProcess = require('child_process');

module.exports = function( grunt ){
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.loadTasks('./tasks');

  var config = {
    pkg: grunt.file.readJSON('package.json')

  , watch: {
      jshint: {
        // Concat jshint.all
        files: [],
        tasks: ['jshint'],
        options: { spawn: false }
      }
    }

  , jshint: {
      // define the files to lint
      all: ['*.js', 'js/*.js', 'js/**/*.js'],
      options: {
        ignores: ['node_modules', 'jam/**', 'bower_components/**', 'js/vendor/*.js'],
        laxcomma: true,
        sub: true,
        globals: {
          jQuery: true,
          console: true,
          module: true
        }
      }
    }

  , connect: {
      server: {
        options: {
          port: 8081
        }
      }
    }

  , mkdir: {
      build: {
        dir: [
          './build', './build/js'
        ]
      }
    }

  , copy: {
      build: {
        files: [
          { expand: true, src: ['./css/*'], dest: './build' }
        , { expand: true, src: ['./img/*'], dest: './build' }
        , { expand: true, src: ['*.html'], dest: './build' }
        ]
      }
    }

  , rmscripts: {
      build: {
        src: [ 'build/*.html' ]
      }
    }

  , addscripts: {
      build: {
        scripts: [ '/js/bundle.js' ]
      , src: [ './build/*.html' ]
      }
    }

  , concat: {
      build: {
        // TODO: get this dynamically with jsdom
        src: [
          
        ]

      , dest: './build/js/bundle.js'
      }
    }

  , uglify: {
      options: { /*mangle: false*/ }
    , build: {
        files: {
          'build/js/bundle.js': [ 'build/js/bundle.js' ]
        }
      }
    }
  };

  config.watch.jshint.files = config.watch.jshint.files.concat(
    config.jshint.all
  );

  grunt.initConfig( config );

  grunt.registerTask( 'default', [
    'jshint'
  , 'connect'
  , 'watch'
  ]);

  grunt.registerTask( 'build', [
    'jshint'
  , 'mkdir:build'
  , 'copy:build'
  , 'concat:build'
  , 'uglify:build'
  , 'rmscripts:build'
  , 'addscripts:build'
  ]);
};
