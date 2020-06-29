const { EMPTY_NODE, ROAD } = require('./nodeTypes');

/**
 * @returns {Map} A tile with the default feature.
 */
function generateEmptyTile() {
    let tile = new Map();
    const connections = new Array(13).fill({ ...EMPTY_NODE });
    connections.forEach((connection, index) => {
        tile.set(index, connection);
    });
    return tile;
}

const EMPTY_TILE = generateEmptyTile();

/**
 *
 * @param {Map} map A list of nodes with specific features to generate the tile.
 * @returns {Map} A list of all the nodes that make the tile, including nodes using the default feature.
 */
function generateTileFromMap(map) {
    const connections = new Map(EMPTY_TILE);
    map.forEach((feature, index) => {
        const connection = connections.get(index);
        connections.set(index, { ...connection, feature });
    });

    return connections;
}

const FOUR_WAY_CROSSROAD_MAP = new Map([
    ['name', 'Four-way crossroad'],
    [1, ROAD],
    [5, ROAD],
    [6, ROAD],
    [7, ROAD],
    [11, ROAD]
]);

const FOUR_WAY_CROSSROAD = generateTileFromMap(FOUR_WAY_CROSSROAD_MAP);

const THREE_WAY_CROSSROAD_MAP = new Map([
    ['name', 'Three-way crossroad'],
    [1, ROAD],
    [5, ROAD],
    [6, ROAD],
    [7, ROAD]
]);

const THREE_WAY_CROSSROAD = generateTileFromMap(THREE_WAY_CROSSROAD_MAP);

const TILE_TYPES = [FOUR_WAY_CROSSROAD, THREE_WAY_CROSSROAD];
const TILE_TYPE_SET = new Set(TILE_TYPES);
const TILE_TYPE_MAP = new Map(TILE_TYPES.map((tile, index) => [index, tile]));

module.exports = {
    TILE_TYPE_SET,
    TILE_TYPE_MAP
};
