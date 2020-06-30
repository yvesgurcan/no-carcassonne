import {
    generateTiles,
    pickStartTile,
    removeTileFromStack,
    canConnectNodes,
    initRNG
} from './engine/gameLogic';
import { visualizeTiles } from './engine/visualize';
import { render } from './renderer';

import './index.scss';

let gameState = {
    extensions: ['Random start tile'],
    seed: undefined,
    world: new Map(),
    edges: new Set(),
    selectedTile: new Map(),
    stack: new Map(),
    nodesA: [],
    nodesB: [],
    canConnect: undefined
};

function initGame() {
    gameState.seed = initRNG();
    gameState.stack = generateTiles(5);
    gameState.world.set(0, pickStartTile(gameState.extensions));
}

function attemptPlayTurn() {
    const { tile, updatedStack } = removeTileFromStack(stack);

    if (!tile) {
        console.log('No more tiles in the stack.');
        return;
    }

    gameState.selectedTile = tile;
    gameState.stack = updatedStack;

    const lastCardPlayed = world.size - 1;
    gameState.nodesA = [
        world.get(lastCardPlayed).get(10),
        world.get(lastCardPlayed).get(11),
        world.get(lastCardPlayed).get(12)
    ];
    gameState.nodesB = [
        selectedTile.get(0),
        selectedTile.get(1),
        selectedTile.get(2)
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
        gameState.world.set(world.size, selectedTile);

        const worldVisualization = visualizeTiles(world);
        console.log(`TILES IN WORLD (${world.size}):`, worldVisualization);
    }

    gameState.selectedTile = undefined;
    gameState.canConnect = undefined;
    gameState.nodesA = [];
    gameState.nodesB = [];
}

async function gameLoop() {
    console.log('===========');
    console.log(`NUMBER OF TILES IN STACK: ${gameState.stack.size}`);

    attemptPlayTurn();

    if (gameState.selectedTile) {
        const selectedTileVisualization = visualizeTiles(
            new Map([[0, gameState.selectedTile]])
        );
        console.log(`SELECTED TILE:`, selectedTileVisualization);
    }

    updateGameStateWithValidPlacement();
}

initGame();

/*
const worldVisualization = visualizeTiles(world);
console.log(`TILES IN WORLD (${world.size}):`, worldVisualization);

gameLoop();
setInterval(gameLoop, 10000);
*/

render(gameState);
