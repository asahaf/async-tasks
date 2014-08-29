var expect = require('chai').expect,
    asyncTasks = require('../');

describe('async-tasks', function () {


    describe('start()', function () {
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

    });



    describe('do()', function () {
        it('should add 3 async tasks then start them async', function (done) {
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
            it('should pass args to the func', function (done) {

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

            it('should pass index to the func', function (done) {

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

        it('should wait for the first 3 async tasks to finish before proceeding', function (done) {
            var result = 0,
                tasks = asyncTasks();

            tasks

            .do(function (num, index, done) {
                setTimeout(function () {
                    result += num;
                    done();
                }, 500);

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
                }, 500);

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

    } );

});

