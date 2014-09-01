var expect = require('chai').expect,
    asyncTasks = require('../');

describe('async-tasks', function () {


    describe('functions', function () {

        it('create task object', function () {
            var tasks = asyncTasks();
        });

        it('push a new task to aysnc object', function() {
            var tasks = asyncTasks();

            tasks.do(function (args, index, done) {});
        });

        it('call wait', function () {
            var tasks = asyncTasks();

            tasks

            .do(function (args, index, done) {})

            .wait();
        });

        it('start async task', function () {
            var tasks = asyncTasks();

            tasks.start();

        });
    });


    describe('start()', function () {

        it('start with a single task', function (done) {
            var result = 0,
                args = 5;
                tasks = asyncTasks();


            tasks

            .do(function (args, index, done) {

                result = args;
                done();

            }, args)

            .start(function (error) {
                expect(result).to.equal(args);
                done();
            });

        });

        it('start without any task', function (done) {
            var tasks = asyncTasks();

            tasks.start(function (error) {
                done();
            });

        });

        it('start with only waits', function (done) {
            var tasks = asyncTasks();

            tasks

            .wait()

            .wait()

            .start(function (error) {
                done();
            });

        });

        it('call start multiple times', function (done) {
            var result = 0,
                args = 5,
                tasks = asyncTasks();

            tasks

            .do(function (args, index, done){
                result = args;
                done();
            }, args)

            .wait()

            .start(function (error) {
                expect(result).to.equal(args);
                done();
            })

            .start(function (error) {

            });

        });

    });


    describe('do()', function () {
        it('add 3 async tasks then start them async', function (done) {
            var tasks = asyncTasks();

            tasks

            .do(function (num, index, done) {
                done();
            })

            .do(function (num, index, done) {
                done();
            })

            .do(function (num, index, done) {
                done();
            })

            .start(function (error) {
                done();
            });

        });

        describe('passing args and index to task\'s function', function () {
            it('pass args to the func', function (done) {

                var result = 0,
                    args = 5,
                    tasks = asyncTasks();

                tasks

                .do(function (num, index, done) {
                    result = num;
                    done();
                }, args)

                .start(function (error) {
                    expect(result).to.equal(args);
                    done();
                });

            });

            it('pass index to the func', function (done) {

                var result = -1,
                    tasks = asyncTasks();

                tasks

                .do(function (num, index, done) {
                    expect(index).to.equal(0);
                    done();
                })

                .do(function (num, index, done) {
                    expect(index).to.equal(1);
                    done();
                })

                .do(function (num, index, done) {
                    expect(index).to.equal(2);
                    done();
                })

                .do(function (num, index, done) {
                    expect(index).to.equal(3);
                    done();
                })

                .wait()

                .do(function (num, index, done) {
                    expect(index).to.equal(5);
                    done();
                })

                .start(function (error) {
                    done();
                });

            });

        });


    });


    describe('wait()', function () {

        this.timeout(3000);

        it('add 3 async tasks and wait to finish then continue doing the rest', function (done) {
            var result = 0,
                tasks = asyncTasks();

            tasks

            .do(function (num, index, done) {
                setTimeout(function () {
                    result += num;
                    done();
                }, 250);

            }, 1)

            .do(function (num, index, done) {
                result += num;
                done();
            }, 2)

            .do(function (num, index, done) {
                setTimeout(function () {
                   result += num;
                   done();
                }, 200);

            }, 3)

            .wait()

            .do(function (num, index, done) {
                expect(result).to.equal(6);
                result += num;
                done();
            }, 4)

            .start(function (error) {
                expect(result).to.equal(10);
                done();
            });

        });

        it('consecutive wait() calls ', function (done) {
            var result = 0,
                tasks = asyncTasks();

            tasks

            .do(function (num, index, done) {
                setTimeout(function () {
                    result += num;
                    done();
                }, 250);

            }, 1)

            .do(function (num, index, done) {
                result += num;
                done();
            }, 2)

            .do(function (num, index, done) {
                setTimeout(function () {
                   result += num;
                   done();
                }, 200);

            }, 3)

            .wait()

            .wait()

            .wait()

            .do(function (num, index, done) {
                expect(result).to.equal(6);
                result += num;
                done();
            }, 4)

            .start(function (error) {
                expect(result).to.equal(10);
                done();
            });

        });

        it('test tasks list ends with wait()', function (done) {
            var result = 0,
                tasks = asyncTasks();

            tasks

            .do(function (num, index, done) {
                setTimeout(function () {
                    result += num;
                    done();
                }, 250);

            }, 1)

            .do(function (num, index, done) {
                result += num;
                done();
            }, 2)

            .do(function (num, index, done) {
                setTimeout(function () {
                   result += num;
                   done();
                }, 200);

            }, 3)

            .wait()

            .start(function (error) {
                expect(result).to.equal(6);
                done();
            });

        });


        describe('Testing before and after wait callbacks', function () {

            this.timeout(3000);

            it('call before wait callback', function (done) {
                var beforeCallback = false,
                    tasks = asyncTasks();

                tasks

                .do(function (num, index, done) {
                    setTimeout(function () {
                        done();
                    }, 250);

                })

                .wait(function () {
                    beforeCallback = true;
                })

                .do(function (num, index, done) {
                    done();
                })

                .start(function (error) {
                    expect(beforeCallback).to.equal(true);
                    done();
                });


            });

            it('call after wait callback', function (done) {

                var waitCalled = false,
                    tasks = asyncTasks();

                tasks

                .do(function (num, index, done) {
                    setTimeout(function () {
                        done();
                    }, 250);

                }, 1)

                .wait(null , function () {
                    waitCalled = true;
                })

                .do(function (num, index, done) {
                    done();
                }, 4)

                .start(function (error) {
                    expect(waitCalled).to.equal(true);
                    done();
                });


            });

            it('call before wait callback and wait then call after wait callback when finish waiting', function (done) {

                var beforeCallback = false,
                    afterCallback = false,
                    tasks = asyncTasks();

                tasks

                .do(function (num, index, done) {
                    setTimeout(function () {
                        done();
                    }, 250);

                })

                .wait(function (){

                    beforeCallback = true;

                } , function () {

                    expect(beforeCallback).to.equal(true);
                    expect(afterCallback).to.equal(false);

                    afterCallback = true;

                })

                .do(function (num, index, done) {
                    done();
                })

                .start(function (error) {
                    expect(beforeCallback).to.equal(true);
                    expect(afterCallback).to.equal(true);
                    done();
                });

            });

            it('set different before and after wait callbacks for multiple waits', function (done) {

                var beforeCallbackResult1 = 0,
                    afterCallbackResult1 = 0,
                    beforeCallbackResult2 = 0,
                    afterCallbackResult2 = 0,
                    tasks = asyncTasks();

                tasks

                .do(function (num, index, done) {
                    setTimeout(function () {
                        done();
                    }, 250);

                })

                .wait(function (){

                    beforeCallbackResult1 = 1;

                    expect(beforeCallbackResult1).to.equal(1);
                    expect(afterCallbackResult1).to.equal(0);
                    expect(beforeCallbackResult2).to.equal(0);
                    expect(afterCallbackResult2).to.equal(0);

                } , function () {

                    afterCallbackResult1 = 2;

                    expect(beforeCallbackResult1).to.equal(1);
                    expect(afterCallbackResult1).to.equal(2);
                    expect(beforeCallbackResult2).to.equal(0);
                    expect(afterCallbackResult2).to.equal(0);
                })

                .do(function (num, index, done) {
                    setTimeout(function () {
                        done();
                    }, 250);
                })

                .wait(function (){

                    beforeCallbackResult2 = 3;
                    expect(beforeCallbackResult1).to.equal(1);
                    expect(afterCallbackResult1).to.equal(2);
                    expect(beforeCallbackResult2).to.equal(3);
                    expect(afterCallbackResult2).to.equal(0);

                } , function () {

                    afterCallbackResult2 = 4;
                    expect(beforeCallbackResult1).to.equal(1);
                    expect(afterCallbackResult1).to.equal(2);
                    expect(beforeCallbackResult2).to.equal(3);
                    expect(afterCallbackResult2).to.equal(4);

                })

                .start(function (error) {
                    expect(beforeCallbackResult1).to.equal(1);
                    expect(afterCallbackResult1).to.equal(2);
                    expect(beforeCallbackResult2).to.equal(3);
                    expect(afterCallbackResult2).to.equal(4);
                    done();
                });

            });

        });

    });


    describe('errors handling', function () {

        it('passing non function object as a task (should throw a TypeError)', function () {
            var tasks = asyncTasks(),
                func = function () {tasks.do({}); };

            expect(func).to.throw(TypeError);

        });

        it('passing non function object as a start callback (should throw a TypeError)', function () {
            var tasks = asyncTasks(),
                func = function () {tasks.start({}); };

            expect(func).to.throw(TypeError);

        });

        it('passing non function objects as wait callbacks (should throw a TypeError)', function () {
            var tasks = asyncTasks(),
                func = function () {tasks.wait({},{}); };

            tasks.do(function(args, index, done){});

            expect(func).to.throw(TypeError);

        });


        it('respond with an error object on callback, when an error happens', function (done) {
            var value = 0;
                tasks = asyncTasks();

            tasks

            .do(function (num, index, done) {
                done({error: 'Error'});
            })

            .start(function (error) {
                expect(error).to.exist;
                done();
            });

        });

        it('call done callback multiple times (should throw an Error)', function () {

            var tasks = asyncTasks();

            tasks

            .do(function (num, index, done) {

                var func = function () {
                    done();
                    done();
                };

                expect(func).to.throw(Error);

            })

            .start(function (error) {});

        });

    });

});

