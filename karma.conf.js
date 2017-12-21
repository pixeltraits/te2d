module.exports = (config) => {
  config.set({
    frameworks: ['jasmine'],
    files: [
      'build/te2d.js',
      'build/Box2D.js',
      'spec/**/*.*'
    ],
    reporters: [
      'progress',
      'coverage'
    ],
    browsers: ['Chrome'],
    autoWatch: true,
    singleRun: true,
    plugins: [
      'karma-jasmine',
      'karma-coverage',
      'karma-chrome-launcher'
    ],
    preprocessors: {
      'build/te2d.js': ['coverage']
    },
    coverageReporter: {
      type: 'html',
      dir: 'build/coverage/',
      instrumenterOptions: {
        istanbul: {
          noCompact: true
        }
      }
    },
    port: 9876
  });
};
