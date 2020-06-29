const { EMPTY_NODE, CITY, ROAD, MONASTERY } = require('./nodeTypes');

/**
 * @returns {Map} A tile where all nodes are populated with the default feature.
 */
function generateEmptyTileTemplate() {
    let tile = new Map();
    const connections = new Array(13).fill({ ...EMPTY_NODE });
    tile.set('name', 'Empty tile');
    connections.forEach((connection, index) => {
        tile.set(index, connection);
    });
    return tile;
}

const EMPTY_TILE = generateEmptyTileTemplate();

/**
 *
 * @param {Array} tileData A list of nodes with specific features to generate the tile.
 * @returns {Map} A list of all the nodes that make the tile, including nodes using the default feature.
 */
function generateTileTemplate(tileData) {
    const connections = new Map(EMPTY_TILE);
    tileData.map(([key, value]) => {
        const connection = connections.get(key);

        // Only numbered properties are nodes
        if (String(key).match(/^\d+$/)) {
            // Keep other properties on the node
            connections.set(key, { ...connection, feature: value });
        } else {
            connections.set(key, value);
        }
    });

    return connections;
}

const START_TILE_MAP = [
    ['name', 'Start tile'],
    [1, ROAD],
    [6, ROAD],
    [11, ROAD],
    [7, CITY]
];

const THREE_WAY_CROSSROAD_MAP = [
    ['name', 'Three-way crossroad'],
    [1, ROAD],
    [5, ROAD],
    [6, ROAD],
    [7, ROAD]
];

const FOUR_WAY_CROSSROAD_MAP = [
    ['name', 'Four-way crossroad'],
    [1, ROAD],
    [5, ROAD],
    [6, ROAD],
    [7, ROAD],
    [11, ROAD]
];

const MONASTERY_WITHOUT_ROAD_MAP = [
    ['name', 'Monastery'],
    [6, MONASTERY]
];

const MONASTERY_WITH_ROAD_MAP = [
    ['name', 'Monastery with road'],
    [1, ROAD],
    [6, MONASTERY]
];

const START_TILE = generateTileTemplate(START_TILE_MAP);
const THREE_WAY_CROSSROAD = generateTileTemplate(THREE_WAY_CROSSROAD_MAP);
const FOUR_WAY_CROSSROAD = generateTileTemplate(FOUR_WAY_CROSSROAD_MAP);
const MONASTERY_WITHOUT_ROAD = generateTileTemplate(MONASTERY_WITHOUT_ROAD_MAP);
const MONASTERY_WITH_ROAD = generateTileTemplate(MONASTERY_WITH_ROAD_MAP);

const TILE_TYPES = [
    EMPTY_TILE, // For debug purposes
    FOUR_WAY_CROSSROAD,
    THREE_WAY_CROSSROAD,
    MONASTERY_WITHOUT_ROAD,
    MONASTERY_WITH_ROAD
];
const TILE_TYPE_SET = new Set(TILE_TYPES);
const TILE_TYPE_MAP = new Map(TILE_TYPES.map((tile, index) => [index, tile]));

module.exports = {
    START_TILE,
    TILE_TYPE_SET,
    TILE_TYPE_MAP
};
