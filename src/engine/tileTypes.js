import { EMPTY_NODE, CITY, ROAD, MONASTERY, RIVER } from './nodeTypes';
import { isNumber } from '../util';

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
        if (isNumber(key)) {
            // Keep other properties on the node
            connections.set(key, { ...connection, feature: value });
        } else {
            connections.set(key, value);
        }
    });

    return connections;
}

const TILE_TYPE_MODIFIER_MAPS = {
    Spring: [
        ['name', 'Spring'],
        [1, RIVER],
        [6, RIVER]
    ],
    Lake: [
        ['name', 'Lake'],
        [1, RIVER],
        [6, RIVER]
    ],
    'Straight river': [
        ['name', 'Straight river'],
        [1, RIVER],
        [6, RIVER],
        [11, RIVER]
    ],
    'River turn': [
        ['name', 'River turn'],
        [1, RIVER],
        [6, RIVER],
        [7, RIVER]
    ],
    'River with bridge': [
        ['name', 'River with bridge'],
        [1, RIVER],
        [11, RIVER],
        [5, ROAD],
        [6, ROAD],
        [7, ROAD]
    ],
    'Road turn': [
        ['name', 'Road turn'],
        [1, ROAD],
        [6, ROAD],
        [7, ROAD]
    ],
    'Three-way crossroad': [
        ['name', 'Three-way crossroad'],
        [1, ROAD],
        [5, ROAD],
        [6, ROAD],
        [7, ROAD]
    ],
    'Four-way crossroad': [
        ['name', 'Four-way crossroad'],
        [1, ROAD],
        [5, ROAD],
        [6, ROAD],
        [7, ROAD],
        [11, ROAD]
    ],
    Monastery: [
        ['name', 'Monastery'],
        [6, MONASTERY]
    ],
    'Monastery with road': [
        ['name', 'Monastery with road'],
        [1, ROAD],
        [6, MONASTERY]
    ]
};

function generateTileTemplatesFromModifierMaps() {
    let tiles = [];
    for (const modifierMap in TILE_TYPE_MODIFIER_MAPS) {
        const tile = generateTileTemplate(TILE_TYPE_MODIFIER_MAPS[modifierMap]);
        tiles.push(tile);
    }

    return tiles;
}

export const START_TILE = generateTileTemplate([
    ['name', 'Start tile'],
    [1, ROAD],
    [6, ROAD],
    [11, ROAD],
    [4, CITY],
    [7, CITY],
    [9, CITY]
]);

const TILE_TYPES = [
    EMPTY_TILE, // For debug purposes
    ...generateTileTemplatesFromModifierMaps()
];

export const TILE_TYPE_NAMED_MAP = new Map(
    TILE_TYPES.map(tile => [tile.get('name'), tile])
);
export const TILE_TYPE_NUMBERED_MAP = new Map(
    TILE_TYPES.map((tile, index) => [index, tile])
);
