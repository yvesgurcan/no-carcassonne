import {
    generateTiles,
    pickStartTile,
    removeTileFromStack,
    canConnectNodes,
    initRNG
} from './engine/gameLogic';
import { visualizeTiles } from './engine/visualize';
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

function attemptPlayTurn() {
    const { tile, updatedStack } = removeTileFromStack(stack);

    if (!tile) {
        console.log('No more tiles in the stack.');
        return;
    }

    gameState.tileToPlace = tile;
    gameState.stack = updatedStack;

    const lastCardPlayed = world.size - 1;
    gameState.nodesA = [
        world.get(lastCardPlayed).get(10),
        world.get(lastCardPlayed).get(11),
        world.get(lastCardPlayed).get(12)
    ];
    gameState.nodesB = [
        tileToPlace.get(0),
        tileToPlace.get(1),
        tileToPlace.get(2)
    ];
}

function updateGameStateWithValidPlacement() {
    gameState.canConnect = canConnectNodes(nodesA, nodesB);

    console.log(
        `CAN CONNECT NODES ${gameState.nodesA
            .map(node => node.feature)
            .join(',')} to ${gameState.nodesB
            .map(node => node.feature)
            .join(',')}:`,
        gameState.canConnect
    );

    if (gameState.canConnect) {
        gameState.world.set(world.size, tileToPlace);

        const worldVisualization = visualizeTiles(world);
        console.log(`TILES IN WORLD (${world.size}):`, worldVisualization);
    }

    gameState.selectedTile = undefined;
    gameState.canConnect = undefined;
    gameState.nodesA = [];
    gameState.nodesB = [];
}

initGame();

render(gameState);
