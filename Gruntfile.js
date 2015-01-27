module.exports = function(grunt) {

  // ===========================================================================
  // CONFIGURE GRUNT ===========================================================
  // ===========================================================================
  grunt.initConfig({

    // get the configuration info from package.json ----------------------------
    // this way we can use things like name and version (pkg.name)
    pkg: grunt.file.readJSON('package.json'),

    // all of our configuration will go here

    // configure jshint to validate js files -----------------------------------
    jshint: {
      options: {
        reporter: require('jshint-stylish') // use jshint-stylish to make our errors look and read good
      },

    // when this task is run, lint the Gruntfile and all js files in src
      build: ['Grunfile.js', 'js/*.js', '!js/main.js']
    },

    // configure uglify to minify js files -------------------------------------
    uglify: {
      options: {
        banner: '/*\n <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n'
      },
      build: {
        files: {
          'dist/js/initial.min.js': ['bower_components/jquery/**/*.min.js', 'bower_components/spinjs/spin.js', 'js/initial.js'],
          'dist/js/main.min.js': ['bower_components/**/*.min.js', 'js/*.js', '!js/initial.js', '!bower_components/jquery/*']
        }
      }
    },

    // configure cssmin to minify css files ------------------------------------
    cssmin: {
      options: {
        banner: '/*\n <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n'
      },
      build: {
        files: {
          'dist/css/initial.min.css': ['css/initial.css'],
          'dist/css/style.min.css': ['bower_components/**/*.min.css', 'css/*.css', '!css/initial.css']
        }
      }
    },

    jade: {
      compile: {
        options: {
          data: {
            debug: false,
            timestamp: "<%= new Date().getTime() %>"
          }
        },
        files: {
          "index.html": ["index.jade"]
        }
      }
    },

    watch: {
      css: {
        files: [
          'css/*.css'
        ],
        tasks: ['cssmin']
      },
      js: {
        files: [
          'js/*.js'
        ],
        tasks: ['jshint','uglify']
      },
      jade: {
        files: [
          'index.jade',
          'includes/**/*.jade'
        ],
        tasks: ['jade']
      }
    }

  });

  grunt.registerTask('default', ['jshint', 'uglify', 'cssmin', 'jade']);
  grunt.registerTask('dev', ['watch']);

  // ===========================================================================
  // LOAD GRUNT PLUGINS ========================================================
  // ===========================================================================
  // we can only load these if they are in our package.json
  // make sure you have run npm install so our app can find these
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jade');

};