const { rng, generateTiles, removeTileFromStack } = require('./gameLogic');
const { visualizeTiles } = require('./visualize');
const { START_TILE } = require('./tileTypes');

let world = new Map();
let edges = new Set();
let selectedTile = new Map();

let stack = generateTiles(5);

world.set(0, START_TILE);

const { tile, updatedStack } = removeTileFromStack(stack);

selectedTile = tile;

const stackVisualization = visualizeTiles(stack);
const worldVisualization = visualizeTiles(world);
const selectedTileVisualization = visualizeTiles([selectedTile]);
const updatedStackVisualization = visualizeTiles(updatedStack);

console.log(`SEED:`, rng.seed);
console.log(`TILES IN STACK (${stack.size}):`, stackVisualization);
console.log(`TILES IN WORLD (${world.size}):`, worldVisualization);
console.log(`SELECTED TILE:`, selectedTileVisualization);
console.log(
    `TILES IN UPDATED STACK (${updatedStack.size}):`,
    updatedStackVisualization
);
