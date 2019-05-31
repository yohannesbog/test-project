const {until, promise} = require('selenium-webdriver');
const get = require('lodash/get');
const chai = require('chai');
const expect = chai.use(require('chai-as-promised')).expect;
chai.use(require('chai-as-promised')).should();
const moment = require('moment');
const uuid = require('uuid');

/**
 * Framework configerations.
 * @property {striing} application - the application being tested.
 *  @property {target} target - the application environment tests are targeting.
 *  @property {striing} environment - the frameworl environment tests are being being run on.
 *  @property {striing} browser - browser name and options.
 *  @property {striing} browser.name - the flavour of browser being used for tests.
 *  @property {object} reporter - options passed to the [cucumber HTML Reporter]{@link https://npmjs.com/package/cucumber-html-reporter} output generator.
 *  @property {boolean} [reporter.launchReporter=true] - Whether to open sthe report output in thedefault browser or not.
 *  @property {boolean} [reporter.storeScreenshots=false] - Whether to save screenshots or not.
 *  @property {string} [reporter.name= - 'Test results for  <config.application> Project'] the report name at the top senter of thereport.Includes  the[`config.application] {@link module:config.application} (from above) being tested.
 *  @property {string} [reporter.brandTitle= 'QA Automation testing framework'] - the branding at the top left of the report.
 *  @property {object} [reporter.metadata] - an object of `'Heading':'content'`paires displayed in the collapse *metadata* section of the report.
 *  @property {string} [reporter.theme='bootstrap'] - the named layout used for the report
 *  @typedef {object} config.
 *  @module config.
 * 
 */

 /**
  * Provides standard methods for page manupliation. all page objects should use base page methods instead of accesing selenium directly
  * 
  * @requires module:selenium-webdriver
  * @requires module:lodash/get
  * @requires modules:chai
  * @requires modules:chai-as-promissed
  * @requires module:moment
  * @requires module:config
  * @module baseObjects
  * 
  */

  module.exports = {
      /***
       *  resolve a step after performing any necessary conditional checks
       * 
       * @param {object} world - the custo [cucumberWorld] {@link https://github.com/cucumber/cucumber-js/blob/master/docs/support/files/world.md} instance
       * @param {*} resut the result of the original promise, passed through as-is
       * @return {promise} a resolved promise
       * 
       */
      resolveStep: (world, result) => promise.resolve(result),

      /***
       *  reject a step after performing any necessary conditional checks
       * 
       * @param {object} world - the custo [cucumberWorld] {@link https://github.com/cucumber/cucumber-js/blob/master/docs/support/files/world.md} instance
       * @param {skippedError} error the error generated in the step
       * @return {promise} a rejected promise
       * 
       */

       rejectStep: (world, error) => {
           if (error.name === 'skippedError') {
               world.attach(error.message);
               return Promise.resolve('skipped');
            }
            return Promise.reject(error);
       },

       /***
       * command the browser to to navigate to specific page
       * 
       * @param {object} world - the custo [cucumberWorld] {@link https://github.com/cucumber/cucumber-js/blob/master/docs/support/files/world.md} instance
       * @param {string}  url the application page to visit
       * @param {string} [title=''] title an optional string used to validate the page title after navigating to the page
       * @param {objetc} wait - an optional element to wait on before checking the page title
       * @return {promise} [chai as promised] {@link https://github.com/domenic/chai-as-promised} assertion that the page being visited has the expected title.
       */
      navigateToPage: (world, url, title='', wait='') => world.driver.get(url).then(() => {
            if (wait !== '') {
                module.exports.waitToBeVisible(world, await `The page element was not located after navigateing to the url ${url} `);
            
            }
            if (totle !== '') {
                world.driver.getTitle().should.become(title, 'the page title is not correct');
            }
            }),

     /***
       * verify the page url contains an expected string
       * 
       * @param {object} world - the custo [cucumberWorld] {@link https://github.com/cucumber/cucumber-js/blob/master/docs/support/files/world.md} instance
       * @param {string}  url the application page to visit
       * @return {promise} [chai as promised] {@link https://github.com/domenic/chai-as-promised} assertion that the page being visited has the expected title.
       */       

       verifyPageUrl: (world, url) => world.driver.getCurrentUrl().should.eventually.contain(url, 'The page url is not corretc'),

       /***
       * wait for specific number of seconds. should not be heavily used
       * 
       * @param {object} world - the custo [cucumberWorld] {@link https://github.com/cucumber/cucumber-js/blob/master/docs/support/files/world.md} instance
       * @param {string}  url the application page to visit
       * @param {number} seconds - the number of seconds to wait
       * @return {promise}  a promise that will be resolved when the specific seconds has passed
       */

       waitSeconds: (world, seconds) => world.driver.sleep(1000 * secods),

       /***
       * clear an input field, then enter text in to the field 
       * 
       * @param {object} world - the custo [cucumberWorld] {@link https://github.com/cucumber/cucumber-js/blob/master/docs/support/files/world.md} instance
       * @param {method}  locator the {@link webdriver} method that identifies the input box to enter text into
       * @param {string} text -the text to put in the input field
       * @param {boolean} [ignore=false] set this parameter to true if the field should not be cleared (date field ) or the value is reformated after entry. example: phone number 1234567892 becoms (123) 456 7892
       * @return {promise} [chai as promised] {@link https://github.com/domenic/chai-as-promised} assertion that the page being visited has the expected title.
       */

    enterText: (world, locator, text, ignore=false) => (text==='')
       ? promise.reject('couldnot find the information')
       : module.exports.waitToBeVisible(world, locator, `could not locate the input field: ${locator}`).then((input) => {
             if (!ignore) {
               input.clear().then(() => input.getAttribute('value').should.become('', `could not clear the input fiel: ${locator}`));
           }
            input.sendKeys(text).then(() => {
             if (!ignore) {
             input.getAttribute('value').should.become(text, `could not enter the text in the field: ${text}`);
             } 
            });
        }
    ),

    /***
       * wait an element to be displayed on the page
       * 
       * @param {object} world - the custo [cucumberWorld] {@link https://github.com/cucumber/cucumber-js/blob/master/docs/support/files/world.md} instance
       * @param {method}  locator the {@link webdriver} method that identifies the input box to enter text into
       * @param {string} [message=''] -the custome error message meant to show the true nature of the error as opposed to missing elemet
       * @param {int} [locateWaite=1500] the number of miliseconds to wait for the element to be located
       * @param {int} [visibleWaite=1500] the number of miliseconds to wait for the element to be vissible
       * 
       * @return {webelemet} the[selenium web element] {@link https://seleniumhq.github.i/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver_exports_webelemt.html you were waiting to be visible.
       */

  waitToBeVisible: (world, locator, message = '', locateWait = 1500, visibleWait = 1500) => world.driver.wait(
      until.elementLocated(locator), locateWait
  ).then( (located) => world.driver.wait(
      until.elementIsVisible(located), visibleWait
  )).then(
      (visible) => visible,
      (error) => promise.reject(Error( message !== '' ? mesage : error))
  ),


  /***
       * verify that all elements are visible on the page
       * 
       * @param {object} world - the custo [cucumberWorld] {@link https://github.com/cucumber/cucumber-js/blob/master/docs/support/files/world.md} instance
       * @param {object/Arrey<webElement>}  elements the {@link webdriver} method that locates the elements
    
       * @return {promise} assert that every element is visible on the page
       */
    verifyElements: (world, elements) => {
        for(const key in elements) {
            if(elements.hasOwnProperty(key)) {
                module.exports.waitToBeVisible(world, elements[key]).then(() => {}, (error) => {
                    return promise.reject(key + ' element  is not visible on the page\n' + error);
                });
            }
        }
    },
    
     /***
       * wait untill all elements for a locator are not visible on the page
       * 
       * @param {object} world - the custo [cucumberWorld] {@link https://github.com/cucumber/cucumber-js/blob/master/docs/support/files/world.md} instance
       * @param {string} [message=''] -the custome error message meant to show the true nature of the error as opposed to missing elemet
       * @param {int} [timeout=1500] timeout(ms)
       * @param {striing} error message when fails
       *
       * @return {webelemet} the[selenium web element] {@link https://seleniumhq.github.i/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver_exports_webelemt.html you were waiting to be visible.
       *  @return {promise} assert that every element is visible on the page
       */

 waitToBeHiden: (world, targets, timeout = 1500, error = null) => module.exports.waitToBeHiden(world, targets, '', 2000, 2000).then(() => 
    world.driver.findElements(targets).then((elements) => 
        elements.map(element => 
            world.driver.wait(until.elementIsNotVisible(element), timeout,
            error? 'Timeout: the element is still visible after ' + 'seconds': error))),
            () => promise.resolve()),



     /***
       * wait untill all elements for a locator are not visible on the page
       * 
       * @param {object} world - the custo [cucumberWorld] {@link https://github.com/cucumber/cucumber-js/blob/master/docs/support/files/world.md} instance
       * @param {method} locator -the {@link webdriver} method that identifies the element to be located
       * @param {string} [message=''] -the custome error message meant to show the true nature of the error as opposed to missing elemet
       * @param {int} [locateWaite=1500] the number of miliseconds to wait for the element to be located
       * 
       * 
       * @return {webelemet} the[selenium web element] {@link https://seleniumhq.github.i/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver_exports_webelemt.html you were waiting to be visible.
       */

       waitToBeLocated: (world, locator, message = '', locateWait= 19000) => world.driver.wait(
           until.elementLocated(locator), locateWait
       ).then(
           (located) => located,
           (error) => promise.reject(Error( message !== '' ? message: error))
       ),

       /***
       * This is used for all mouse clicks
       * 
       * @param {object} world - the custo [cucumberWorld] {@link https://github.com/cucumber/cucumber-js/blob/master/docs/support/files/world.md} instance
       * @param {method} locator -the {@link webdriver} method that identifies the element to be located
       * @return {webelemet\boolean} [waitToBeVisible=false] the[selenium web element] {@link https://seleniumhq.github.i/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver_exports_webelemt.html you were waiting to be visible.
       * @param {string} [message=''] -the custome error message meant to show the true nature of the error as opposed to missing elemet
       * @return {promise} [chai as promised] {@link https://github.com/domenic/chai-as-promised} assertion that the page being visited has the expected title.
       */

       clickElement: (world, locator, waitToBeVisible = false, mesage = '') => {
           const which = (waitToBeVisible) ? waitToBeVisible : locator;
           return module.exports.waitToBeVisible(world, which, message).then(() => {
               world.driver.findElement(locator).click();
           });
     
       },

         /***
       * find all elements matching a selector, then compare the text of each element until a match is found. when a match is found click the element.
       * 
       * @param {object} world - the custo [cucumberWorld] {@link https://github.com/cucumber/cucumber-js/blob/master/docs/support/files/world.md} instance
       * @param {method} locator -the {@link webdriver} method that identifies the element to be located
       * @param {string} label - the text of the element to be clicked
       *  @param {Boolean} ignoredCase - whether to ignore the list item case
       * @param {string} [message=''] -the custome error message meant to show the true nature of the error as opposed to missing elemet
       * @return {webelemet\promise} [waitToBeVisible=false] the[selenium web element] {@link https://seleniumhq.github.i/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver_exports_webelemt.html that was clicked or [chai as promised] {@link https://github.com/domenic/chai-as-promised} assertion that there was no matching element.
        */
       clickListItem: (world, locator, label, message = '', ignoredCase = true) => module.exports.waitToBeVisible(world, locator, message).then(() => {
           const generic = `unable to locate a clickable element '${label}'`;
           return module.exports.pickOne(world, locator, label, ignoredCase).then(
               (picked) => {
                   picked.click();
                   return picked;
               },
               () => promise.reject(Error(message !== '' ? message : generick))
           );
       }),
     
        /***
       * find the text of element and compare it to a string
       * 
       * @param {object} world - the custo [cucumberWorld] {@link https://github.com/cucumber/cucumber-js/blob/master/docs/support/files/world.md} instance
       * @param {method} locator -the {@link webdriver} method that identifies the element to be located
       * @param {string} text - the text EXPECTED
       * @return {promise} [chai as promised] {@link https://github.com/domenic/chai-as-promised} assertion that the page being visited has the expected title.
        */

        expectText: (world, locator, text) => module.exports.waitToBeVisible(world, locator).then((element) => {
            element.getText().should.become(text, 'The text did not match');
        }),

         /***
       * find the text of AN element and verify it contains a string
       * 
       * @param {object} world - the custo [cucumberWorld] {@link https://github.com/cucumber/cucumber-js/blob/master/docs/support/files/world.md} instance
       * @param {method} locator -the {@link webdriver} method that identifies the element to be located
       * @param {string} text - the text to compare it to 
       * @return {promise} [chai as promised] {@link https://github.com/domenic/chai-as-promised} assertion that the page being visited has the expected title.
        */

        expectTextContains: (world, locator, text) => module.exports.waitToBeVisible(world, locator).then((element) => {
            element.getText().should.eventually.contains(text, 'The text did not contaon the phrase');
        }),

         /***
       * find all of the elements matching a locator, then compare the text of each element to a table list provided by a feature file
       * 
       * @param {object} world - the custo [cucumberWorld] {@link https://github.com/cucumber/cucumber-js/blob/master/docs/support/files/world.md} instance
       * @param {method} locator -the {@link webdriver} method that identifies the element to be located
       * @param {object} table - the table provided by the feature file
       * @return {promise} [chai as promised] {@link https://github.com/domenic/chai-as-promised} assertion that the page being visited has the expected title.
        */

        verifyFeatureTableContains: (world, locator, table) => module.exports.waitToBeVisible(world, locator).then(() => {
            const live = [];
            world.driver.findElements(locator).then((list) => list.map((item) => item.getText().then((text) => {
                live.push(text);
            }))).then(() => {
                expect(live, 'Lists do not match').to.have.ordered.members(table.rows().map((item) => item[0]));
            });
        }),

         /***
       * find all the elements matching a locator
       * 
       * @param {object} world - the custo [cucumberWorld] {@link https://github.com/cucumber/cucumber-js/blob/master/docs/support/files/world.md} instance
       * @param {method} locator -the {@link webdriver} method that identifies the element to be located
       * @param {array} values - an array of strings to verify against the locator array of strings
       * @param {string} message - an error message to display if the compare fails
       * @return {promise} [chai as promised] {@link https://github.com/domenic/chai-as-promised} assertion that the page being visited has the expected title.
        */

        compareListContains: (world, locator, values, message= '') => module.exports.waitToBeVisible(world, locator).then(() => {
            const live = [];
            world.driver.findElements(locator).then((list) => list.map((item) => item.getText().then((text) => {
                live.push(text);
            }))).then(() => {
                expect(live, message != '' ? message : 'Lists do not match').to.have.ordered.members(values);
            });
        })


           /***
       * find an element from a given list that match the text provided and return that element
       * 
       * @param {object} world - the custo [cucumberWorld] {@link https://github.com/cucumber/cucumber-js/blob/master/docs/support/files/world.md} instance
       * @param {method} locator -the {@link webdriver} method that identifies the element to be located
       * @param {string} label - the element text to match
       * @param {Boolean} ignoredCase - whether to ignore the list item case
       * @return {webelemet\promise} [waitToBeVisible=false] the[selenium web element] {@link https://seleniumhq.github.i/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver_exports_webelemt.html that was clicked or [chai as promised] {@link https://github.com/domenic/chai-as-promised} assertion that there was no matching element.
        */
        
        pickOne: (world, locator, label, ignoredCase = true) => world.driver.findElement(() => promise.filter(
            world.driver.findElements(locator),
            (listItem) => world.driver.wait(until.elementIsVisible(listItem)).then( (item) => {
                return item.getText().then((text) => ignoredCase ? text.trim().toLowerCase() : text.trim() ===label);

            })
            ).then((promised) => (promised.length > 0) ?
            promised :
            expect(promised, `could not find element '${label}'`).to.have.length.above(0)
            )),

               /***
       * CONVERT A STRING TO CAMEL STILE STRING
       * 
       * @param {string} str - The string to be comverted to camelCase
       * @param {string} the string converted in to camelCase
        */

        toCamelCase: (str) => {
            return str.toLowerCase()
            .replace( '+', 'plus')
            .replace( /\W/g, '')
            .replace( /\s+(.)/g, function($1) {return $1.toUpperCase(); })
            .replace( /\s/g, '');
        },

           /***
       * Receive data from the file specified
       * 
       * @param {object} world - the custo [cucumberWorld] {@link https://github.com/cucumber/cucumber-js/blob/master/docs/support/files/world.md} instance
       * @param {string} filename -the core portion of the file name used to retrive data
       * @param {string} keyNme - the name of the data value to retrive
       * @param {Boolean} ignoredCase - whether to ignore the list item case
       * @param {string|string} the data being requested
        */
        
        getDataValues: (world, fileName, keyName) => {
            const application = world.config.application;
            const data = require(`../sharedObjects/${application}/${application}${fileName.replace(/\s/g,'')}Data`)(world);
            return get(data, keyName, '');
    
        },

           /***
       * get text of teh element 
       * 
       * @param {object} world - the custo [cucumberWorld] {@link https://github.com/cucumber/cucumber-js/blob/master/docs/support/files/world.md} instance
       * @param {method} element -the {@link webdriver} method that identifies the element to be located
       * @param {string} label - the element text to match
       * @param {Boolean} array of elements texts.
       * 
        */
        
        getText: (world, element) => world.driver.findElement(element).then((elements) => {
            return element.getAttribute('value').then((value) => 
            element.getText().then((text) => value === null ? text : value));

        }),

       
            /***
       * get texts of a set of elements
       * 
       * @param {object} world - the custo [cucumberWorld] {@link https://github.com/cucumber/cucumber-js/blob/master/docs/support/files/world.md} instance
       * @param {method|Array<WebElement>}elements -the {@link webdriver} method that locates the elements whose texts are checked.
       * @param {promise} array of elements texts.
       * 
        */

        getTexts: (world, elements) => world.driver.findElements(elements).then((elements) => {
            const texts = [];
            elements.map(element => {
                element.getAttribute('value'.then(value => 
                    element.getText().then(text => {
                        texts.push(text === null ? value : text);
                    })));
            });
            return texts;
        }),

      /***
       * Helper method to find the number of elements matching a locator and return the count
       * 
       * @param {object} world - the custo [cucumberWorld] {@link https://github.com/cucumber/cucumber-js/blob/master/docs/support/files/world.md} instance
       * @param {method} locator - the locator to identify all of the elements on the page
       * @param {string}  - the size of the array elements matching the locator
       * 
        */

        getElementCount: (world, locator) => world.driver.findElements(locator).then((elements) => {
            return elements.length;
        }),


         /***
       * Scroll the page so that element is visible on the view
       * 
       * @param {object} world - the custo [cucumberWorld] {@link https://github.com/cucumber/cucumber-js/blob/master/docs/support/files/world.md} instance
       * @param {method} locator -the {@link webdriver} method locates the elements whose texts are being checked
       * @param {promise}  - Promise resolution that the browser javascript excuter has changed the scrool position of the page
       * 
        */


        scrollIntoView: (world, locator) => world.driver.findElement(locator).then((element) => {
            world.driver.executeScript('arguments[0].scrollIntoView(true);', element);
        }),

         /***
       * Switch to any tab on the browser. if the index is less than 0, the first tab will be selected. if the index is greaterthe number of tabs, the lasttab will be selecte
       * 
       * @param {object} world - the custo [cucumberWorld] {@link https://github.com/cucumber/cucumber-js/blob/master/docs/support/files/world.md} instance
       * @param {number} index - tab index
       * @param {promise}  - Promise resolution that the browser tab has been changed to the indexed tab
       * 
        */

        switchTab: (world, index) => world.driver.getAllWindowHandles().then((handles) => {
            world.driver.switchTo().window(handles[index < handles.length ? (index > 0 ? index : 0) : handles.length - 1]);
        }),

          /***
       * Switch to the next opened browser tab
       * 
       * @param {object} world - the custo [cucumberWorld] {@link https://github.com/cucumber/cucumber-js/blob/master/docs/support/files/world.md} instance
       * 
       * @param {promise}  - Promise resolution that the the tab has switched to the subsequent tab of the browser
       * 
        */

       switchToNextTab: (world) => world.driver.getAllWindowHandles().then((handles) => world.driver.getAllWindowHandle().then((handle) => {
           const index = handles.indexOf(handle);
        world.driver.switchTo().window(handles[(index +1) < handles.length ? index + 1 : handles.length-1]);
    })),


    /***
       * open in new tab
       * 
       * @param {object} world - the custo [cucumberWorld] {@link https://github.com/cucumber/cucumber-js/blob/master/docs/support/files/world.md} instance
       * @param {string} url -the specified url to visit.note that this must be formatted properly with https and www in the string
       * @param {string} [title =''] title  - optional title field if you want to asset the page title is correct after navigating to the page
       * @param {promise}promise resolution that new tab has benen opened to the specified url
       * 
        */

        openInNewTab: (world, url, title='') => world.driver.executeScript('window.open()').then(() => {
            module.exports.switchToNextTab(world);
            module.exports.navigateToPage(world, url, title);
            module.exports.verifyPageUrl(world, url);
        }),


     /***
       * create a random ... email address that is intended to be unique
       * 
       * @param {string}  a string formatted in to an email address with a random number
       * 
        */

        randomEmail:() => {
            let string = '';
            const characters = '0123456789';

            for (let i = 0; i< 7; i++) {
                string += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            retrun `qa+auto${string}@pps.com`;
        },

        /***
       * create a random string of numbers
       * @param {string}  a string formatted in to an email address with a random number
       * 
        */

       randomNumber:(size) => {
        let random = '';
        const characters = '0123456789';

        for (let i = 0; i< size; i++) {
            random += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        retrun random;
    },

     /***
       * Create a time stamp formated as a string, optionaly it can be dash separated if you pass the function true
       * 
       * @param {boolean} separator -flag used to format the string with dashs
       * @param {string} A string representing the current date and time
       * 
        */

        currentDateTime: (separator=false) => {
            if (separator) {
                retrun require('moment')().format('YYYY-MM-DD-HH-mm');
            } else {
                return require('moment')().format('YYYYMMDDHHmm');
            }
        },

      /***
       * Clear an input field . Do not use this pon date fields or anything with values that persist after clearing
       * 
       * @param {method} locator the {@link WebDriver} method that locates the elements whose textes are being checked
       * @param {boolean} separator -flag used to format the string with dashs
       * @param {promise} promise resolution that the field has been cleared
       * 
        */  

        clearField: (world, locator) => module.exports.waitToBeVisible(world, locator, `could not locate the input field: ${locator}`).then((field) => {
            field.clear().then(() => field.getAttribute('value').should.become('', `could not locate the input field: ${locator}`));
        }),


       /***
       * hover over an element and verify if the expected element is visible
       * 
       * @param {objgit pullect} world the custome [Cucumber world] {@link https://github.com/cucumber/cucumber-js/blob/master/docs/support_files/world.md} instance
       * @param {!(By|function)} hoover -felement locator that will be hovered on
       * @param {!(By|function)} elementClick -expect element that will be visible after hoovering

       * @param {promise} promise assert that expected element is visible when hover the mouse over the element
       * 
        */   

        hoverOverElementAndClick: (world, hover, elementClick) => world.driver.findElement(hover).then(element => 
            world.driver.actions().mouseMove(element).perform().then(() => module.exports.clickElement(world, elementClick))),

     /***
       * get random string
       * 
       * @param {number}  length - length of the string
       * 

       * @return {string} a string
       * 
        */         

        randString: (length) => {
            const init = `${uuid.v4()}${uuid.v1()}`.toUpperCase().replace( /-/g, '');
            const randStr = [];
            for(let i =0; i< length; i++) {
                randStr.push(init[Math.floor(Math.random() * 10000) % init.length]);

            }
            retrun randStr.join('');
        }
  }