const {LockerCb, Locker} = require("./locker");

function example1(callback) {
    // Wrap array 1 with callback version
    const a1 = [];
    const lock = new LockerCb(a1);

    // Add value 1 to array 1, emulate slow operation
    lock.lock(function (index, release) {
        setTimeout(function () {
            index.push("value-1");
            release();
        }, 1000);
    });

    // Read array 1 after add first value
    lock.get(function (index) {
        console.log('a1 - First value added: ', index.join(', '));
    });

    // Add value 2 to array 1, emulate slow operation
    lock.lock(function(index, release) {
        setTimeout(function () {
            index.push("value-2");
            release();
        }, 1000);
    });

    // Read array 1 after add first value
    lock.get(function(index) {
        console.log('a1 - Second value added: ', index.join(', '));
        callback();
    });
}

async function example2() {
    // Wrap array 2 with async/await version
    const a2 = [];
    const lock = new Locker(a2);

    // Add value 1 to array 2, emulate slow operation
    let {value, release} = await lock.lock();
    setTimeout(() => {
        value.push("value-1");
        release();
    }, 1000);

    // Read array 2 after add first value
    value = await lock.get();
    console.log('a2 - First value added: ', value.join(', '));

    // Add value 2 to array 2, emulate slow operation
    ({value, release} = await lock.lock());
    setTimeout(function () {
        value.push("value-2");
        release();
    }, 1000);

    // Read array 2 after add second value
    value = await lock.get();
    console.log('a2 - Second value added: ', value.join(', '));
}

example1(() => example2());

