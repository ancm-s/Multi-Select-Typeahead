module.exports = function(karma){
  karma.set({

    // the angular framework needs to go before mocha / jasmine
    frameworks: ['angular', 'jasmine-jquery','jasmine', 'mocha'],

    files: [
      "build/multiple-select.js",
      "test/multi-select-autocomplete_spec.js"
    ],

    browsers: ['Chrome'],

    singleRun: true,
    autoWatch: false
  });
};
