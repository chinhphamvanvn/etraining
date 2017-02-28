'use strict';

/**
 * Module dependencies.
 */
var app = require('./config/lib/app');
var server = app.start();
var cron = require('./config/lib/cron');
cron.start();
var update = require('./config/lib/update');
update.start();
