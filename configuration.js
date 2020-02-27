exports.config = {
     directConnect: true,
     capabilities: {
       browserName: 'chrome',
//       shardTestFiles: true,
//       //maxInstances: 2    
     },  
     params: {
       datasource: 'excel'
     },

     specs: ['01.HotelFlightBooking.spec.js'],
     SELENIUM_PROMISE_MANAGER:false,
    
     onPrepare: async ()=> {
      var AllureReporter = require('jasmine-allure-reporter');
      jasmine.getEnv().addReporter(new AllureReporter({
        resultsDir: 'allure-results'
      }));

      //initial browser setup
      browser.manage().window().maximize();
      await browser.waitForAngularEnabled(false);
    }    
    
 }