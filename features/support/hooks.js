/***
 * Hooks are used for setup and teardown of the environment before and after each scenario
 * 
 * multiple **Before** hooks are excured in the order that they were defined 
 * multiple **after** hooks are excured in the reverse order that they were defined 
 * 
 * for more information pn hooks see [Hooks JS]{@link https://github.com/cucumber/cucumber-js/blob/master/docs/support_files/hooks.md}.
 * 
 * @requires module:cucumber
 * @requires module:server.argopts
 * @requires module:config
 * @module:hooks
 */

const {After, Before, status}= require('cucumber');
/**
 * instance of the [argopts]{@link module:server.argopts}.
 * 
 * @memberOf ,odule:hooks
 */
const config = require('../..package.json').config;
/** Firstly apply any command line argument option overrides.  */
Object.assign(config, argopts);
/** Secondly merge in any command-line world parameters.  */
Object.assign(config, JSON.parse((argopts.worldParametres || '{}')));

/** Set various defoult configurations.  */
config.application = config.application || 'mxc';

/** Before scenario to disgnate specific testes as skipped. This prevents test execution and does not set a failure in the report.  */
Before({tags: '@wip or @skip'}, (scenario, callback) => callback(null, 'skipped'));

/** If we are running `prod` tests, akiptests _not_ marked as `@prod`.  */

if(config.target === `prod`) Before({tags: `not @${config.target}`}, (scenario, callback) => callback(null, 'skipped'));

/** After hook to handle test failures. This causes screenshots to be attached to the cucumber run report when there is a failure.  */
After(function (scenario){
    const world = this;
    if(world.driver){
        if (scenario.result.status === status.FAILED){
            /** If THE REPORT TYPE IS CUCUMBER THEN TAKE A SCREENSHOT and attach it to the report when a test fails.  */
            if (config.reporter.reportType === 'cucumber'){
                if(config.reporter.takeScreenShot){
                    return world.driver.takeScreenShot().then(screenhot => {
                        world.attach(screenshot, 'image/png');
                        return (config.browser.closeOnFail) ? world.driver.quit() : true;
                    });
                } else {
                    return (config.browser.closeOnFail) ? world.driver.quit() true;
                }
            }
        } else return world.driver.quit();
    }
});







