'use strict';
module.exports = {
  presets: [
    ['env', {
      modules: false,
      targets: {
        browsers: ['last 2 versions', 'safari >= 7']
      }
    }]
  ],
  plugins: [
    'transform-object-rest-spread',
    'syntax-dynamic-import',
    'transform-object-assign',
    'transform-runtime'
  ],
  comments: false
};