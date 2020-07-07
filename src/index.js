import {
    generateTiles,
    pickStartTile,
    initRNG,
    getInternalNodeRelationsWithTileIndex
} from './engine/gameLogic';
import { initRender, render } from './renderer';

import './index.scss';

let gameState = {
    extensions: [],
    seed: undefined,
    world: new Map(),
    nodeRelations: new Map(),
    nodeOverlay: new Set(),
    tileToPlace: new Map(),
    stack: new Map(),
    turn: 0,
    phase: 'pick-tile',
    players: [
        {
            name: 'Bob',
            color: 'red',
            meeples: 7
        },
        {
            name: 'John',
            color: 'blue',
            meeples: 7
        },
        {
            name: 'Jane',
            color: 'purple',
            meeples: 7
        },
        {
            name: 'Alberta',
            color: 'yellow',
            meeples: 7
        }
    ]
};

function initGame() {
    const startTilePosition = '0/0';
    const startTile = pickStartTile(gameState.extensions);

    gameState.seed = initRNG(11875250475179788);
    gameState.stack = generateTiles(82);
    gameState.nodeRelations = getInternalNodeRelationsWithTileIndex(
        startTilePosition,
        startTile
    );
    gameState.world.set(startTilePosition, startTile);
    initRender(gameState);
}

initGame();
render(gameState);
