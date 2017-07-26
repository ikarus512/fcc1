/* file: gulp.jscs.reporter.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 *
 * DESCRIPTION: Reporter for gulp-jscs
 * AUTHOR: ikarus512
 * CREATED: 2017/06/01
 *
 * MODIFICATION HISTORY
 *  2017/06/01, ikarus512. Initial version.
 *
 */

/*
 * This reporter is based on 'inline' reporter from gulp-jscs,
 * but with it, gulp returns non-zero error status in case of errors found.
*/

var util = require('util');

/**
 * @param {Errors[]} errorsCollection
 */

module.exports = function(errorsCollection) {
    var errorCount = 0, exitCode = 1;

    /**
     * Formatting every error set.
     */
    errorsCollection.forEach(function(errors) {
        var file = errors.getFilename();
        if (!errors.isEmpty()) {
            errors.getErrorList().forEach(function(error) {
                errorCount++;
                console.log(util.format('%s: line %d, col %d, %s',
                    file, error.line, error.column, error.message));
            });
        }
    });

    /**
     * In case of fails, force gulp to return non-zero status code.
     */
    if (errorCount) {
        exitCode = 1;
        console.log(errorCount + ' error' + (errorCount===1?'':'s') + ' (found by gulp-jscs).');
        process.nextTick(function() {
            process.exit(exitCode);
        });
        // throw Error('gulp jscs failed');
    }
};
