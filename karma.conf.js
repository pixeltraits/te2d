module.exports = (config) => {
  config.set({
    frameworks: ['mocha'],
    files: [
      'src/spec/**/*.*'
    ],
    reporters: [
      'progress',
      'coverage'
    ],
    browsers: ['Chrome'],
    autoWatch: true,
    singleRun: true,
    plugins: [
      'karma-mocha',
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
