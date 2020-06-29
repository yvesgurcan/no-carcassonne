const Alea = require('alea');

let instance = null;

/**
 * @property {*} [seed] A primitive used as a base to generate random numbers.
 */
class RNG {
    /**
     *
     * @param {*} [seed] A primitive used as a base to generate random numbers.
     * @returns {instanceof RNG} Singleton.
     */
    constructor(seed) {
        if (!instance) {
            this.init(seed);
            instance = this;
            return this;
        } else {
            return instance;
        }
    }

    /**
     * Initialize the random number generator with a seed.
     * @param {*} [seed] A primitive used as a base to generate random numbers. The same seed will return the same sequence of numbers. If no seed is provided, a random number will be used as a base.
     * @returns {instanceof RNG} Singleton.
     */
    init(seed) {
        if (!this.rng) {
            this.seed = seed === undefined ? this.newSeed : seed;
            this.rng = new Alea(this.seed);
            return this;
        } else {
            throw new Error('RNG already initialized.');
        }
    }

    /**
     * Initialize the random number generator without a seed.
     * @returns {instanceof RNG} Singleton.
     */
    initUnseeded() {
        if (!this.rng) {
            this.rng = new Alea();
            return this;
        } else {
            throw new Error('RNG already initialized.');
        }
    }

    /**
     * @returns {Number} A randomly generated seed.
     */
    get newSeed() {
        return Math.random();
    }

    /**
     * @returns {Number} The next new random number.
     */
    get next() {
        return this.rng();
    }

    /**
     *
     * @param {Number} min The lower boundary of the range.
     * @param {Number} max The upper boundary of the range.
     * @returns {Number} A number greater than or equal to min and less than or equal to max.
     */
    range(min = 0, max = 100) {
        if (min > max) {
            throw new Error(`Min "${min}" greater than max "${max}".`);
        }

        return Math.floor(this.rng() * (max - min)) + min;
    }
}

module.exports = RNG;
