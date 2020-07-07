import {
    EMPTY_NODE,
    CITY,
    ROAD,
    CROSSROAD,
    MONASTERY,
    RIVER
} from './nodeTypes';
import { isNumber } from '../util';

const NEIGHBOR_NODES_MAP = new Map([
    [0, [1, 3]],
    [1, [0, 2, 6]],
    [2, [1, 4]],
    [3, [0, 5]],
    [4, [2, 7]],
    [5, [3, 6, 8]],
    [6, [1, 5, 7, 11]],
    [7, [4, 6, 9]],
    [8, [5, 10]],
    [9, [7, 12]],
    [10, [8, 11]],
    [11, [6, 10, 12]],
    [12, [9, 11]]
]);

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

function generateTileNodeRelation(nodeIndex, tile) {
    const nodeRelations = [];
    const node = tile.get(nodeIndex);
    const neighborNodeIndexes = NEIGHBOR_NODES_MAP.get(nodeIndex);

    neighborNodeIndexes.forEach(neighborNodeIndex => {
        const neighborNode = tile.get(neighborNodeIndex);
        if (node.feature === neighborNode.feature) {
            nodeRelations.push(neighborNodeIndex);
        }
    });

    return nodeRelations;
}

/**
 *
 * @param {Array} tileData A list of nodes with specific features to generate the tile.
 * @returns {Map} A list of all the nodes that make the tile, including nodes using the default feature.
 */
function generateTileTemplate(tileData) {
    const tile = new Map(EMPTY_TILE);
    tileData.forEach(([key, value]) => {
        const connection = tile.get(key);

        // Only numbered properties are nodes
        if (isNumber(key)) {
            // Keep other properties on the node
            tile.set(key, { ...connection, feature: value });
        } else {
            tile.set(key, value);
        }
    });

    const nodeRelations = new Map();
    tile.forEach((value, key) => {
        // Only numbered properties are nodes
        if (isNumber(key)) {
            // Keep other properties on the node
            nodeRelations.set(key, generateTileNodeRelation(key, tile));
        }
    });

    tile.set('nodeRelations', nodeRelations);
    return tile;
}

function generateTileTemplatesFromModifierMaps() {
    let tiles = [];
    for (const modifierMap in TILE_TYPE_MODIFIER_MAPS) {
        const tile = generateTileTemplate(TILE_TYPE_MODIFIER_MAPS[modifierMap]);
        tile.set('name', modifierMap);
        tiles.push(tile);
    }

    return tiles;
}

const TILE_TYPE_MODIFIER_MAPS = {
    Spring: [
        [1, RIVER],
        [6, RIVER]
    ],
    Lake: [
        [1, RIVER],
        [6, RIVER]
    ],
    'Straight river': [
        [1, RIVER],
        [6, RIVER],
        [11, RIVER]
    ],
    'River turn': [
        [1, RIVER],
        [6, RIVER],
        [7, RIVER]
    ],
    'River with bridge': [
        [1, RIVER],
        [11, RIVER],
        [5, ROAD],
        [6, ROAD],
        [7, ROAD]
    ],
    'River with city': [
        [1, RIVER],
        [6, RIVER],
        [11, RIVER],
        [4, CITY],
        [7, CITY],
        [9, CITY]
    ],
    'River with bridge and city': [
        [1, RIVER],
        [11, RIVER],
        [5, ROAD],
        [6, ROAD],
        [4, CITY],
        [7, CITY],
        [9, CITY]
    ],
    'Straight road': [
        [1, ROAD],
        [6, ROAD],
        [11, ROAD]
    ],
    'Road turn': [
        [1, ROAD],
        [6, ROAD],
        [7, ROAD]
    ],
    'Three-way crossroad': [
        [1, ROAD],
        [5, ROAD],
        [6, CROSSROAD],
        [7, ROAD]
    ],
    'Four-way crossroad': [
        [1, ROAD],
        [5, ROAD],
        [6, CROSSROAD],
        [7, ROAD],
        [11, ROAD]
    ],
    'Side city': [
        [0, CITY],
        [1, CITY],
        [2, CITY]
    ],
    'Twin side city': [
        [0, CITY],
        [1, CITY],
        [2, CITY],
        [10, CITY],
        [11, CITY],
        [12, CITY]
    ],
    'City corner': [
        [0, CITY],
        [1, CITY],
        [2, CITY],
        [3, CITY],
        [5, CITY],
        [8, CITY]
    ],
    'City corner with road': [
        [0, CITY],
        [1, CITY],
        [2, CITY],
        [3, CITY],
        [5, CITY],
        [8, CITY],
        [11, ROAD],
        [6, ROAD],
        [7, ROAD]
    ],
    'City entryway': [
        [1, ROAD],
        [3, CITY],
        [4, CITY],
        [5, CITY],
        [6, CITY],
        [7, CITY],
        [8, CITY],
        [9, CITY],
        [10, CITY],
        [11, CITY],
        [12, CITY]
    ],
    'City fortification': [
        [3, CITY],
        [4, CITY],
        [5, CITY],
        [6, CITY],
        [7, CITY],
        [8, CITY],
        [9, CITY],
        [10, CITY],
        [11, CITY],
        [12, CITY]
    ],
    'Accordion city': [
        [3, CITY],
        [4, CITY],
        [5, CITY],
        [6, CITY],
        [7, CITY],
        [8, CITY],
        [9, CITY]
    ],
    'Inner city': [
        [0, CITY],
        [1, CITY],
        [2, CITY],
        [3, CITY],
        [4, CITY],
        [5, CITY],
        [6, CITY],
        [7, CITY],
        [8, CITY],
        [9, CITY],
        [10, CITY],
        [11, CITY],
        [12, CITY]
    ],
    Monastery: [[6, MONASTERY]],
    'Monastery with road': [
        [1, ROAD],
        [6, MONASTERY]
    ]
};

export const START_TILE = generateTileTemplate([
    ['name', 'Start tile'],
    [1, ROAD],
    [6, ROAD],
    [11, ROAD],
    [4, CITY],
    [7, CITY],
    [9, CITY]
]);

const TILE_TYPES = [...generateTileTemplatesFromModifierMaps()];

export const TILE_TYPE_NAMED_MAP = new Map(
    TILE_TYPES.map(tile => [tile.get('name'), tile])
);
export const TILE_TYPE_NUMBERED_MAP = new Map(
    TILE_TYPES.map((tile, index) => [index, tile])
);
