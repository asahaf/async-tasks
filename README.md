# ASYNC TASKS [![Build Status](https://travis-ci.org/asahaf/async-tasks.svg?branch=master)](https://travis-ci.org/asahaf/async-tasks)

**async-tasks** let you run tasks asynchronously in a simple way with the ability to make dependencies between them.

## Install
```
$ npm install --save async-tasks
```

## Usage
```
var asyncTasks = require('async-tasks');

var tasks = asyncTasks();

tasks

.do(function (args, index, done) {
	setTimeout(function (){
		console.log('task 1 is done');
		done();
	}, 2000);
})

.do(function (args, index, done) {
	console.log('task 2 is done');
	done();
})

.wait()

.do(function (args, index, done) {
	console.log('task 3 is done after waiting for tasks 1 & 2 to finish');
	done();
})
//start tasks 1 & 2 asynchronously and wait till they finish then continue and run task 3
.start(function () {
	console.log('all tasks are done');
});

//task 1 is done
//task 2 is done
//task 3 is done after waiting for tasks 1 & 2 to finish
```

## API
### asyncTask.do(function, [args])
add a task to the tasks list
#### function
Type: function(args, index, done)

args: the passed argument on (asyncTask.do).

index: the function index (its order among tasks).

done: the function that needs to be called when the task is done

### asyncTask.wait([before], [after])
Cause the tasks added after wait() to wait till the tasks before it finish
#### before
Type: function

called on start waiting
#### after
Type: function

called on finish waiting.

Note: consecutive wait called are squashed into one wait

### asyncTask.start([function])
start added tasks asynchronously 
#### function
The callback function, which is called when all tasks are done

Type: function(error)

error: is the error returned running tasks if they encounter an error

## License
MIT © Ahmed AlSahaf

