const { TILE_TYPE_MAP } = require('./tileTypes');
const { visualizeTiles } = require('./visualize');
const RNG = require('./RNG');

const rng = new RNG();

let worldTiles = new Map();

/**
 *
 * @param {Map} availableTiles A list of tiles to pick from.
 * @returns {Map} The selected tile.
 */
function pickRandomTile(availableTiles) {
    const randomIndex = rng.range(0, availableTiles.size);
    return availableTiles.get(randomIndex);
}

/**
 *
 * @param {Number} numberToGenerate The number of tiles the function should return.
 * @returns {Map} A map of tiles.
 */
function generateTiles(numberToGenerate) {
    let newTiles = new Map();
    for (let i = 0; i < numberToGenerate; i++) {
        const newTile = pickRandomTile(TILE_TYPE_MAP);
        newTiles.set(i, new Map(newTile));
    }

    return newTiles;
}

const stackTiles = generateTiles(10);
const visualization = visualizeTiles(stackTiles);
console.log(visualization);
