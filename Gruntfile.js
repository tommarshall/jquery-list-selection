module.exports = function(grunt) {

  grunt.initConfig({

    // Import package manifest
    pkg: grunt.file.readJSON("list-selection.jquery.json"),

    // Banner definitions
    meta: {
      banner: "/*\n" +
        " *  <%= pkg.title || pkg.name %> - v<%= pkg.version %>\n" +
        " *  <%= pkg.description %>\n" +
        " *  <%= pkg.homepage %>\n" +
        " *\n" +
        " *  Made by <%= pkg.author.name %>\n" +
        " *  Under <%= pkg.licenses[0] %> License\n" +
        " */\n"
    },

    // Concat definitions
    concat: {
      dist: {
        src: ["src/list-selection.jquery.js"],
        dest: "dist/list-selection.jquery.js"
      },
      options: {
        banner: "<%= meta.banner %>"
      }
    },

    // Lint definitions
    jshint: {
      files: ["src/list-selection.jquery.js"],
      options: {
        jshintrc: ".jshintrc"
      }
    },

    // Minify definitions
    uglify: {
      my_target: {
        src: ["dist/list-selection.jquery.js"],
        dest: "dist/list-selection.jquery.min.js"
      },
      options: {
        banner: "<%= meta.banner %>"
      }
    },

    jasmine: {
      pivotal: {
        src: 'src/list-selection.jquery.js',
        options: {
          specs: 'spec/*Spec.js',
          helpers: [
            'spec/*Helper.js', 
            'lib/jquery-1.10.2.js', 
            'lib/jasmine-jquery-1.5.8.js'
          ]
        }
      }
    }

  });

  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks('grunt-contrib-jasmine');

  grunt.registerTask("default", ["jshint", "concat", "uglify"]);
  grunt.registerTask("travis", ["jshint"]);
};