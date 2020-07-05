import { generateTiles, pickStartTile, initRNG } from './engine/gameLogic';
import { initRender, render } from './renderer';

import './index.scss';

let gameState = {
    extensions: [],
    seed: undefined,
    world: new Map(),
    nodeRelations: new Map(),
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
    gameState.seed = initRNG();
    gameState.stack = generateTiles(82);
    gameState.world.set('0/0', pickStartTile(gameState.extensions));
    initRender(gameState);
}

initGame();
render(gameState);
