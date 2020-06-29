const {
    rng,
    generateTiles,
    pickStartTile,
    removeTileFromStack,
    canConnectNodes
} = require('./gameLogic');
const { visualizeTiles } = require('./visualize');

let world = new Map();
let edges = new Set();
let selectedTile = new Map();
let stack = new Map();
let nodesA = [];
let nodesB = [];
let canConnect = undefined;

function initGame() {
    stack = generateTiles(5);
    world.set(0, pickStartTile());
}

function attemptPlayTurn() {
    const { tile, updatedStack } = removeTileFromStack(stack);

    if (!tile) {
        console.log('No more tiles in the stack.');
        return;
    }

    selectedTile = tile;
    stack = updatedStack;

    const lastCardPlayed = world.size - 1;
    nodesA = [
        world.get(lastCardPlayed).get(10),
        world.get(lastCardPlayed).get(11),
        world.get(lastCardPlayed).get(12)
    ];
    nodesB = [selectedTile.get(0), selectedTile.get(1), selectedTile.get(2)];
}

function updateGameStateWithValidPlacement() {
    canConnect = canConnectNodes(nodesA, nodesB);

    console.log(
        `CAN CONNECT NODES ${nodesA
            .map(node => node.feature)
            .join(',')} to ${nodesB.map(node => node.feature).join(',')}:`,
        canConnect
    );

    if (canConnect) {
        world.set(world.size, selectedTile);

        const worldVisualization = visualizeTiles(world);
        console.log(`TILES IN WORLD (${world.size}):`, worldVisualization);
    }

    selectedTile = undefined;
    canConnect = undefined;
    nodesA = [];
    nodesB = [];
}

async function gameLoop() {
    console.log('===========');
    console.log(`NUMBER OF TILES IN STACK: ${stack.size}`);

    attemptPlayTurn();

    if (selectedTile) {
        const selectedTileVisualization = visualizeTiles(
            new Map([[0, selectedTile]])
        );
        console.log(`SELECTED TILE:`, selectedTileVisualization);
    }

    updateGameStateWithValidPlacement();
}

initGame();
console.log(`SEED:`, rng.seed);
console.log('===========');
const worldVisualization = visualizeTiles(world);
console.log(`TILES IN WORLD (${world.size}):`, worldVisualization);

gameLoop();
setInterval(gameLoop, 10000);
