module.exports = (grunt) => {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    includes: {
      js: {
        files: [
          {
            cwd: '.',
            src: 'node_modules/js-uuid/js-uuid.js',
            dest: 'src/lib/js-uuid.js'
          },
          {
            cwd: '.',
            src: 'node_modules/box2d-es6/box2d.js',
            dest: 'src/lib/box2d.js'
          }
        ]
      }
    },
    concat: {
      options: {
        banner: '"use strict";'
      },
      dist: {
        src: [
          'src/api/layer1/*.js',
          'src/api/layer2/Audio.js',
          'src/api/layer2/Animation.js',
          'src/api/layer2/Bitmap.js',
          'src/api/layer2/Text.js',
          'src/api/layer2/Geometry.js',
          'src/api/layer2/Box.js',
          'src/api/layer2/Circle.js',
          'src/api/layer2/Polygon.js',
          'src/api/layer3/*.js',
          'src/api/layer4/*.js',
          'src/api/layer5/*.js',
          'src/config/**/*.js',
          'src/online/client/*.js',
          'src/Game.js'
        ],
        dest: 'build/js/lib/te2d.js'
      }
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        reporters: ['progress']
      },
      coverage: {
        configFile: 'karma.conf.js',
        reporters: ['coverage']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-includes');

  grunt.registerTask('test', ['karma:unit']);
  grunt.registerTask('coverage', ['karma:coverage']);
  grunt.registerTask('build', ['includes']);
};
