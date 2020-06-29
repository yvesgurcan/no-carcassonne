const { TILE_TYPE_MAP } = require('./tileTypes');
const RNG = require('./RNG');

const rng = new RNG();

/**
 *
 * @param {Map} stack A list of tiles to pick from.
 * @returns {Object} The selected tile and the index of that tile in the stack.
 */
function pickRandomTile(stack) {
    const index = rng.range(0, stack.size);
    return { tile: stack.get(index), index };
}

/**
 *
 * @param {Number} numberToGenerate The number of tiles the function should return.
 * @returns {Map} A map of tiles.
 */
function generateTiles(numberToGenerate) {
    let newTiles = new Map();
    for (let i = 0; i < numberToGenerate; i++) {
        const { tile } = pickRandomTile(TILE_TYPE_MAP);
        newTiles.set(i, new Map(tile));
    }

    return newTiles;
}

/**
 *
 * @param {Map} stack A list of tiles to remove the tile from.
 * @returns {Object} The removed tile and the updated list of tiles.
 */
function removeTileFromStack(stack) {
    const lastTile = stack.size - 1;
    const tile = stack.get(lastTile);
    const updatedStack = new Map(stack);
    updatedStack.delete(lastTile);

    return { tile, updatedStack };
}

function compareTiles(tileA, tile) {}

module.exports = {
    rng,
    generateTiles,
    removeTileFromStack
};
