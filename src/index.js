import { generateTiles, pickStartTile, initRNG } from './engine/gameLogic';
import { initRender, render } from './renderer';

import './index.scss';

let gameState = {
    extensions: [],
    seed: undefined,
    world: new Map(),
    edges: new Set(),
    tileToPlace: new Map(),
    stack: new Map(),
    nodesA: [],
    nodesB: [],
    canConnect: undefined
};

function initGame() {
    gameState.seed = initRNG();
    gameState.stack = generateTiles(82);
    gameState.world.set('0/0', pickStartTile(gameState.extensions));
    initRender(gameState);
}

initGame();
render(gameState);
