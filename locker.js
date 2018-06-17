// Tools for create mutation lock for a given value

/** Value wrapper with mutation lock using callbacks */
class LockerCb {
    /**
     * Called from get method
     * @callback locker~getCallback
     * @param {*} value
     */

    /**
     * Called from lock method
     * @callback locker~getCallback
     * @param {*} value
     * @param {function} release - call to release lock
     */

    /**
     * Create a lock wrapper
     * @param {*} value
     * @memberof Locker
     */
    constructor(value) {
        var _lock

        /**
         * Wait while value is unlocked and callback. Don't lock value.
         * @param {locker~getCallback} callback
         */
        this.get = function (callback) {                
            if (typeof callback !== "function") {
                return;
            }
            if (!_lock) {
                callback(value);
                return;
            }
            _lock = _lock.then(() => callback(value));
        }
     
        /**
         * Wait while value is unlocked and callback. Lock value while release called 
         * @param {locker~lockCallback} callback
         */
        this.lock = function (callback) {
            if (typeof callback !== "function") {
                return;
            }
            const locker = () => new Promise((release) => callback(value, release));
            _lock = _lock ? _lock.then(locker) : locker();
        }
    }
}

/** Value wrapper with mutation lock using async/await */
class Locker {
    /**
     * value and release function
     * @typedef {Object} locker~lockResult
     * @property {*} value
     * @property {function} release - function to release value
     */
    
    /**
     * Create lock wrapper
     * @param {*} value 
     */
    constructor(value) {
        this.locker = new LockerCb(value);
    }

    /**
     * Wait while value is unlocked and return it. Don't lock value.
     * @return {*} value
     */
    async get() {
        return new Promise((resolve) => this.locker.get((value) => resolve(value)));
    }

    /**
     * Wait while value is unlocked and return it. Lock value while release called 
     * @returns {locker~lockResult}
     */
    async lock() {
        return new Promise((resolve) => {
            this.locker.lock((value, release) => {
                resolve({value, release});
            });
        });
    }
}

module.exports = {LockerCb, Locker};
