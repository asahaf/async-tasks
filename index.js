'use strict';

var onetime = require('onetime');

module.exports = function () {

    return (function () {

        var cb,
            tasks = [],
            queue = [],
            index = 0,
            active = 0,
            failed = false,
            count = 0,
            waiting = false,
            busy = false;

        function AsyncTasks() {

            this.do = function (func, args) {

                if (typeof func !== 'function') {
                    throw new TypeError('First argument must be a function');
                }

                tasks.push({func: func, args: args});
                return this;
            };


            this.wait = function (before, after) {

                if (tasks.length > 0 && !tasks[tasks.length - 1].wait) {

                    before = before || function () {};
                    after = after || function () {};

                    if (typeof before !== 'function' || typeof after !== 'function'){
                        throw new TypeError('Wait callbacks must be functions, if supplied');
                    }

                    tasks.push({wait: true, before: before, after: after});
                }

                return this;
            };


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

    })();
};