/* file: removeFacebookAppendedHash.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

/**
 * @namespace a_other
 * @desc non-angular functions
 * @memberOf clients.Modules
 */

/**
 * @classdesc Remove Facebook appended hash
 * @class
 * @name removeFacebookAppendedHash
 * @memberOf clients.Modules.a_other
 */
$(document).ready(function() {
    if (window.location.hash && window.location.hash === '#_=_') {
        if (window.history && history.pushState) {
            window.history.pushState('', document.title, window.location.pathname);
        } else {
            // Prevent scrolling by storing the page's current scroll offset
            var scroll = {
                top: document.body.scrollTop,
                left: document.body.scrollLeft
            };
            window.location.hash = '';
            // Restore the scroll offset, should be flicker free
            document.body.scrollTop = scroll.top;
            document.body.scrollLeft = scroll.left;
        }
    }
});
