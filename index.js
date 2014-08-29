"use strict";

var onetime = require('onetime');

module.exports = function () {

    return (function () {

        var cb,
            tasks = [],
            preparedTasks = [],
            index = 0,
            active = 0,
            failed = false,
            count = 0,
            waiting = false;

        function AsyncTasks() {

            this.do = function (func, args) {

                if (typeof func !== 'function') {
                    throw new TypeError('First argument must be a function');
                }

                tasks.push({func: func, args: args});
                return this;
            };


            this.wait = function () {

                if (tasks.length > 0 && !tasks[tasks.length - 1].wait) {
                    tasks.push({wait: true});
                }

                return this;
            };


            this.start = function (callback) {

                if(waiting){
                    return this;
                }

                cb = callback || function () {};

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
                        cb(error);

                        preparedTasks.forEach(function (task) {
                            clearImmediate(task);
                        });

                        return;
                    }

                    if (count === tasks.length) {
                        cb();
                        return;
                    }

                    if (active === 0) {
                        waiting = false;
                        self.start(cb);
                    }
                }

                if(tasks.length === 0){
                    cb();
                    return;
                }

                while (!failed && index < tasks.length) {

                    task = tasks[index];

                    if (task.wait) {
                        index += 1;
                        count += 1;
                        waiting = true;
                        return;
                    }

                    preparedTasks.push(setImmediate(task.func, task.args, index, onetime(done, true)));

                    index += 1;
                    active += 1;

                }

                return this;
            };
        }

        return new AsyncTasks();

    })();
};