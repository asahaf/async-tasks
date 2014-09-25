'use strict';

var onetime = require('onetime');


/**
 * Create new async-tasks object
 *
 * @api public
 */
module.exports = function () {

    var cb,
        tasks = [],
        queue = [],
        index = 0,
        active = 0,
        failed = false,
        count = 0,
        waiting = false,
        busy = false;

    /**
     * The returned async-tasks object
     *
     */
    function AsyncTasks() {


        /**
         * Add new async task to the tasks list
         *
         * @param {Function} func - task function with takes 3 args func(args, index, done). args (any) is the passed agrument, index (number) is the task index, and done (function) is a function needs to be called when the task is done.
         * @param {Any} [args] - agruments pass to the supplied task function when invoke.
         * @throw {TypeError} if func is not a function.
         * @api public
         */
        this.do = function (func, args) {

            if (typeof func !== 'function') {
                throw new TypeError('First argument must be a function');
            }

            tasks.push({func: func, args: args});
            return this;
        };


        /**
         * Wait for the async tasks before it to finish then proceed
         *
         * @param {Function} [before] - optional callback function, which is called on start waiting.
         * @param {Function} [after] - optional callback function, which is called on finish waiting.
         * @throw {TypeError} if before or after is not a function.
         * @api public
         */
        this.wait = function (before, after) {

            if (tasks.length > 0 && !tasks[tasks.length - 1].wait) {

                before = before || function () {};
                after = after || function () {};

                if (typeof before !== 'function' || typeof after !== 'function') {
                    throw new TypeError('Wait callbacks must be functions, if supplied');
                }

                tasks.push({wait: true, before: before, after: after});
            }

            return this;
        };


        /**
         * Start tasks async
         *
         * @param {Function} [callback] - callback is a function called when all tasks are done.
         * @throw {TypeError} if the callback is not a function.
         * @api public
         */
        this.start = function (callback) {

            if (waiting || busy || failed) {
                return this;
            }

            busy = true;

            cb = callback || function () {};

            if (typeof cb !== 'function') {
                throw new TypeError('Callback must be a function, if supplied');
            }

            var self = this,
                task;

            function done(error) {

                count += 1;
                active -= 1;

                if (failed) {
                    return;
                }

                if (error !== undefined && error !== null) {
                    failed = true;
                    busy = false;
                    waiting = false;
                    cb(error);

                    return;
                }

                if (count === tasks.length) {
                    cb();
                    waiting = false;
                    busy = false;
                    return;
                }

                if (active === 0) {

                    tasks[index].after();
                    index += 1;
                    count += 1;
                    waiting = false;
                    self.start(cb);
                }
            }

            if (count === tasks.length) {
                cb();
                return this;
            }

            while (!failed && index < tasks.length) {

                task = tasks[index];

                if (task.wait) {
                    tasks[index].before();
                    waiting = true;
                    busy = false;
                    return this;
                }

                queue.push(setImmediate(task.func, task.args, index, onetime(done, true)));

                index += 1;
                active += 1;

            }

            return this;
        };
    }

    return new AsyncTasks();

};