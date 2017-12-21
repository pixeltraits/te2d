module.exports = (grunt) => {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        banner: '"use strict";'
      },
      dist: {
        src: [
          'src/api/layer1/*.js',
          'src/api/layer2/Audio.js',
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
          'src/online/client/*.js'
        ],
        dest: 'build/te2d.js'
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

  grunt.registerTask('test', ['karma:unit']);
  grunt.registerTask('coverage', ['karma:coverage']);
  grunt.registerTask('build', ['concat']);
};
