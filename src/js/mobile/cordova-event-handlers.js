/* file: cordova-event-handlers.js */
/*!
 * Copyright 2017 ikarus512
 * https://github.com/ikarus512/fcc1.git
 */

(function() {
    'use strict';

    if (window.cordova) {
        // Here if cordova

        document.addEventListener('deviceready', function devicereadyListener() {

            $(document).ready(function onDocumentReady() {

                // Android button event handlers

                // document.addEventListener('backbutton', function(event) {
                //   event.preventDefault();
                //   if (confirm('Exit?')) navigator.app.exitApp();
                // }, false);

                if (window.navigator.appVersion.search(/Android/i) >= 0) {
                    navigator.app.overrideButton('menubutton', true);
                }
                document.addEventListener('menubutton', function menubuttonListener(event) {
                    event.preventDefault();
                    $('#myNavbar').toggleClass('in');
                }, false);

            });

        }, false);

    }

}());
