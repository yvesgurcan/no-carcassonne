const { TILE_TYPE_MAP, START_TILE } = require('./tileTypes');
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
 * @returns {Map} First tile
 */

function pickStartTile() {
    return START_TILE;
}

/**
 *
 * @param {Map} stack A list of tiles to remove the tile from.
 * @returns {Object} The removed tile and the updated list of tiles.
 */
function removeTileFromStack(stack) {
    if (stack.size === 0) {
        return { tile: undefined, updatedStack: stack };
    }

    const lastTile = stack.size - 1;
    const tile = stack.get(lastTile);
    const updatedStack = new Map(stack);
    updatedStack.delete(lastTile);

    return { tile, updatedStack };
}

/**
 *
 * @param {Array} nodesA A list of nodes.
 * @param {Array} nodesB A list of nodes.
 * @returns {Boolean}
 */
function canConnectNodes(nodesA, nodesB) {
    if (nodesA.length !== 3 || nodesB.length !== 3) {
        return false;
    }

    for (let i = 0; i < 3; i++) {
        const featureA = nodesA[i].feature;
        const featureB = nodesB[i].feature;

        if (featureA !== featureB) {
            return false;
        }
    }

    return true;
}

function createEdges(edges, nodesA, nodesB) {
    return;
}

module.exports = {
    rng,
    generateTiles,
    pickStartTile,
    removeTileFromStack,
    canConnectNodes
};
