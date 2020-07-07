import {
    GRASS,
    CITY,
    ROAD,
    CROSSROAD,
    MONASTERY,
    RIVER
} from '../engine/nodeTypes';
import {
    removeTileFromStack,
    rotateTile,
    canConnectNodes,
    getInternalNodeRelationsWithTileIndex,
    traverseConnectedNodes
} from '../engine/gameLogic';
import { isNumber, isCoordinates, isWorldElement } from '../util';

const TILE_SIZE = 60;

const NODE_SIZE = TILE_SIZE / 3;

const NODE_ID_MAP = new Map([
    [`0/0`, 0],
    [`20/0`, 1],
    [`40/0`, 2],
    [`??/??`, 3],
    [`??/??`, 4],
    [`0/20`, 5],
    [`20/20`, 6],
    [`40/20`, 7],
    [`??/??`, 8],
    [`??/??`, 9],
    [`0/40`, 10],
    [`20/40`, 11],
    [`40/40`, 12]
]);

const LEFT_PADDING_OFFSET = 240;
const TOP_PADDING_OFFSET = 240;

function getElement(id) {
    const element = document.getElementById(id);

    if (!element) {
        throw new Error(`Element '#${id}' not found.`);
    }

    return element;
}

function createElement(type, id) {
    const element = document.createElement(type);
    element.id = id;

    return element;
}

function getOffset(offsetMultiplier) {
    const offsetBase = TILE_SIZE / 3;
    return offsetBase * offsetMultiplier;
}

function drawOverlay(pageX, pageY) {
    const left = snapToGrid(pageX);
    const top = snapToGrid(pageY);

    if (left / TILE_SIZE < 0) {
        return;
    }

    if (top / TILE_SIZE <= 0) {
        return;
    }

    const hoveredElements = document.elementsFromPoint(left, top);
    const hoveredTileElement = hoveredElements.find(element =>
        isWorldElement(element.id)
    );

    if (!hoveredTileElement) {
        return;
    }

    const hoveredTileId = hoveredTileElement.id.replace('world', '');

    const nodeX = snapToNode(pageX - left);
    const nodeY = snapToNode(pageY - top);

    const nodeIndex = NODE_ID_MAP.get(`${nodeX}/${nodeY}`);

    const connectedNodes = traverseConnectedNodes(
        `${hoveredTileId}/${nodeIndex}`,
        gameState.nodeRelations
    );

    gameState.nodeOverlay = connectedNodes;

    render(gameState);
}

function drawNode(nodeIndex, node, canvas) {
    switch (node.feature) {
        default: {
            canvas.fillStyle = 'rgb(200, 0, 0)';
            break;
        }
        case GRASS: {
            return;
        }
        case CROSSROAD:
        case ROAD: {
            canvas.fillStyle = 'rgb(200, 180, 90)';
            break;
        }
        case CITY: {
            canvas.fillStyle = 'rgb(120, 80, 40)';
            break;
        }
        case MONASTERY: {
            canvas.fillStyle = 'rgb(140, 160, 170)';
            break;
        }
        case RIVER: {
            canvas.fillStyle = 'rgb(40, 60, 230)';
            break;
        }
    }

    switch (nodeIndex) {
        default: {
            return;
        }
        case 0: {
            canvas.beginPath();
            canvas.moveTo(getOffset(0), getOffset(0));
            canvas.lineTo(getOffset(1), getOffset(1));
            canvas.lineTo(getOffset(1), getOffset(0));
            canvas.fill();
            return;
        }
        case 1: {
            canvas.fillRect(
                getOffset(1),
                getOffset(0),
                getOffset(1),
                getOffset(1)
            );
            return;
        }
        case 2: {
            canvas.beginPath();
            canvas.moveTo(getOffset(2), getOffset(0));
            canvas.lineTo(getOffset(2), getOffset(1));
            canvas.lineTo(getOffset(3), getOffset(0));
            canvas.fill();
            return;
        }
        case 3: {
            canvas.beginPath();
            canvas.moveTo(getOffset(0), getOffset(0));
            canvas.lineTo(getOffset(0), getOffset(1));
            canvas.lineTo(getOffset(1), getOffset(1));
            canvas.fill();
            return;
        }
        case 4: {
            canvas.beginPath();
            canvas.moveTo(getOffset(3), getOffset(0));
            canvas.lineTo(getOffset(2), getOffset(1));
            canvas.lineTo(getOffset(3), getOffset(1));
            canvas.fill();
            return;
        }
        case 5: {
            canvas.fillRect(
                getOffset(0),
                getOffset(1),
                getOffset(1),
                getOffset(1)
            );
            return;
        }
        case 6: {
            canvas.fillRect(
                getOffset(1),
                getOffset(1),
                getOffset(1),
                getOffset(1)
            );
            return;
        }
        case 7: {
            canvas.fillRect(
                getOffset(2),
                getOffset(1),
                getOffset(1),
                getOffset(1)
            );
            return;
        }
        case 8: {
            canvas.beginPath();
            canvas.moveTo(getOffset(0), getOffset(2));
            canvas.lineTo(getOffset(1), getOffset(2));
            canvas.lineTo(getOffset(0), getOffset(3));
            canvas.fill();
            return;
        }
        case 9: {
            canvas.beginPath();
            canvas.moveTo(getOffset(2), getOffset(2));
            canvas.lineTo(getOffset(3), getOffset(2));
            canvas.lineTo(getOffset(3), getOffset(3));
            canvas.fill();
            return;
        }
        case 10: {
            canvas.beginPath();
            canvas.moveTo(getOffset(0), getOffset(3));
            canvas.lineTo(getOffset(1), getOffset(3));
            canvas.lineTo(getOffset(1), getOffset(2));
            canvas.fill();
            return;
        }
        case 11: {
            canvas.fillRect(
                getOffset(1),
                getOffset(2),
                getOffset(1),
                getOffset(1)
            );
            return;
        }
        case 12: {
            canvas.beginPath();
            canvas.moveTo(getOffset(2), getOffset(2));
            canvas.lineTo(getOffset(2), getOffset(3));
            canvas.lineTo(getOffset(3), getOffset(3));
            canvas.fill();
            return;
        }
    }
}

function drawTile(tile, id) {
    const element = createElement('canvas', id);
    element.style.backgroundColor = 'green';
    element.style.width = `${TILE_SIZE}px`;
    element.style.height = `${TILE_SIZE}px`;
    element.width = TILE_SIZE;
    element.height = TILE_SIZE;
    const canvas = element.getContext('2d');

    tile.forEach((value, key) => {
        if (isNumber(key)) {
            drawNode(key, value, canvas);
        }
    });
    return element;
}

function drawWorldTiles(worldState, container) {
    worldState.forEach((value, key) => {
        if (isCoordinates(key)) {
            const [x, y] = key.split('/').map(fragment => Number(fragment));
            const offsetX = x * TILE_SIZE;
            const offsetY = y * TILE_SIZE;
            const tile = drawTile(value, `world${key}`);
            tile.style.position = 'absolute';
            tile.style.marginLeft = `${offsetX}px`;
            tile.style.marginTop = `${offsetY}px`;
            container.append(tile);
        }
    });
}

function drawTileToPlace(tileToPlace, container) {
    const tile = drawTile(tileToPlace, `tile-to-place0`);
    container.append(tile);
}

function snapToGrid(coordinate) {
    return Math.floor(coordinate / TILE_SIZE) * TILE_SIZE;
}

function snapToNode(coordinate) {
    return Math.floor(coordinate / NODE_SIZE) * NODE_SIZE;
}

// TODO
function canPlaceTileInWorld(tile) {
    return true;
}

/**
 *
 * @param {Number} pageX X coordinates of the cursor to place the tile
 * @param {Number} pageY Y coordinates of the cursor to place the tile
 * @param {Object} gameState State of the game
 */

function placeTile(pageX, pageY, gameState) {
    const x = snapToGrid(pageX - LEFT_PADDING_OFFSET) / TILE_SIZE;
    const y = snapToGrid(pageY - TOP_PADDING_OFFSET) / TILE_SIZE;

    const hasTileAlready = gameState.world.get(`${x}/${y}`);
    if (hasTileAlready) {
        return;
    }

    const westCoordinates = `${x - 1}/${y}`;
    const westTile = gameState.world.get(westCoordinates);
    const eastCoordinates = `${x + 1}/${y}`;
    const eastTile = gameState.world.get(eastCoordinates);
    const northCoordinates = `${x}/${y + 1}`;
    const northTile = gameState.world.get(northCoordinates);
    const southCoordinates = `${x}/${y - 1}`;
    const southTile = gameState.world.get(southCoordinates);

    const adjacentTiles = new Map();

    if (westTile) {
        adjacentTiles.set(`W`, westTile);
    }

    if (eastTile) {
        adjacentTiles.set(`E`, eastTile);
    }

    if (northTile) {
        adjacentTiles.set(`N`, northTile);
    }

    if (southTile) {
        adjacentTiles.set(`S`, southTile);
    }

    if (adjacentTiles.size === 0) {
        return;
    }

    let newNodeRelations = new Map();
    for (let [direction, tile] of adjacentTiles) {
        const nodesA = [];
        const nodesB = [];
        let indexNodesA = [];
        let indexNodesB = [];
        let adjacentTilePosition = { x: 0, y: 0 };

        switch (direction) {
            case 'W': {
                indexNodesA = [3, 5, 8];
                indexNodesB = [4, 7, 9];
                adjacentTilePosition = { x: x - 1, y };
                break;
            }
            case 'E': {
                indexNodesA = [4, 7, 9];
                indexNodesB = [3, 5, 8];
                adjacentTilePosition = { x: x + 1, y };
                break;
            }
            case 'N': {
                indexNodesA = [10, 11, 12];
                indexNodesB = [0, 1, 2];
                adjacentTilePosition = { x, y: y + 1 };
                break;
            }
            case 'S': {
                indexNodesA = [0, 1, 2];
                indexNodesB = [10, 11, 12];
                adjacentTilePosition = { x, y: y - 1 };
                break;
            }
        }

        for (let i = 0; i < indexNodesA.length; i++) {
            nodesA.push(gameState.tileToPlace.get(indexNodesA[i]));
        }

        for (let i = 0; i < indexNodesB.length; i++) {
            nodesB.push(tile.get(indexNodesB[i]));
        }

        const canConnect = canConnectNodes(nodesA, nodesB);
        if (!canConnect) {
            return;
        }

        indexNodesA.forEach((nodeIndex, index) => {
            const nodeRelationsA = `${x}/${y}/${nodeIndex}`;
            const nodeRelationsB = `${adjacentTilePosition.x}/${adjacentTilePosition.y}/${indexNodesB[index]}`;

            const existingNodeRelationsA =
                gameState.nodeRelations.get(nodeRelationsA) || [];

            newNodeRelations.set(nodeRelationsA, [
                ...existingNodeRelationsA,
                nodeRelationsB
            ]);

            const existingNodeRelationsB =
                gameState.nodeRelations.get(nodeRelationsB) || [];

            newNodeRelations.set(nodeRelationsB, [
                ...existingNodeRelationsB,
                nodeRelationsA
            ]);
        });
    }

    const tileToPlace = getElement('tile-to-place');
    tileToPlace.innerHTML = null;
    tileToPlace.style.display = 'none';
    stack.style.pointerEvents = null;

    const rotate = getElement('rotate');
    rotate.style.display = 'none';

    const internalNodeRelations = getInternalNodeRelationsWithTileIndex(
        `${x}/${y}`,
        gameState.tileToPlace
    );

    internalNodeRelations.forEach((value, key) => {
        const existingNode = newNodeRelations.get(key);
        if (existingNode) {
            newNodeRelations.set(key, [...existingNode, ...value]);
        } else {
            newNodeRelations.set(key, value);
        }
    });

    gameState.nodeRelations = new Map([
        ...gameState.nodeRelations,
        ...newNodeRelations
    ]);

    gameState.world.set(`${x}/${y}`, gameState.tileToPlace);

    gameState.tileToPlace = new Map();
    gameState.phase = 'place-meeple';

    render(gameState);
}

export function initRender(gameState) {
    const seed = getElement('seed');
    seed.innerHTML = gameState.seed;

    const stack = getElement('stack');
    stack.onclick = () => {
        gameState.nodeOverlay = new Set();

        let canPlaceTile = false;
        let tile = undefined;
        let updatedStack = undefined;
        while (!canPlaceTile) {
            ({ tile, updatedStack } = removeTileFromStack(gameState.stack));
            canPlaceTile = canPlaceTileInWorld(tile);

            gameState.stack = updatedStack;

            if (updatedStack.size === 0) {
                break;
            }
        }

        if (!canPlaceTile) {
            gameState.phase = 'endgame';
            render(gameState);
            return;
        }

        gameState.tileToPlace = tile;
        gameState.phase = 'place-tile';

        const tileToPlace = getElement('tile-to-place');
        tileToPlace.style.display = null;
        drawTileToPlace(gameState.tileToPlace, tileToPlace);
        render(gameState);
    };

    const rotate = getElement('rotate');
    rotate.style.display = 'none';
    rotate.onclick = () => {
        const updatedTileToPlace = rotateTile(gameState.tileToPlace);
        gameState.tileToPlace = updatedTileToPlace;

        const tileToPlace = getElement('tile-to-place');
        tileToPlace.innerHTML = null;
        drawTileToPlace(updatedTileToPlace, tileToPlace);
    };

    const endTurn = getElement('end-turn');
    endTurn.onclick = () => {
        gameState.nodeOverlay = new Set();
        gameState.phase = 'pick-tile';
        gameState.turn++;
        render(gameState);
    };

    document.onkeypress = ({ code }) => {
        switch (code) {
            case 'Enter': {
                switch (gameState.phase) {
                    case 'pick-tile': {
                        gameState.nodeOverlay = new Set();

                        let canPlaceTile = false;
                        let tile = undefined;
                        let updatedStack = undefined;
                        while (!canPlaceTile) {
                            ({ tile, updatedStack } = removeTileFromStack(
                                gameState.stack
                            ));
                            canPlaceTile = canPlaceTileInWorld(tile);

                            gameState.stack = updatedStack;

                            if (updatedStack.size === 0) {
                                break;
                            }
                        }

                        if (!canPlaceTile) {
                            gameState.phase = 'endgame';
                            render(gameState);
                            return;
                        }

                        gameState.tileToPlace = tile;
                        gameState.phase = 'place-tile';

                        const tileToPlace = getElement('tile-to-place');
                        tileToPlace.style.display = null;

                        drawTileToPlace(gameState.tileToPlace, tileToPlace);
                        render(gameState);

                        break;
                    }

                    case 'place-tile': {
                        const tileToPlace = getElement('tile-to-place');
                        const {
                            left,
                            top
                        } = tileToPlace.getBoundingClientRect();
                        placeTile(left + 1, top + 1, gameState);
                        break;
                    }

                    case 'place-meeple': {
                        gameState.phase = 'pick-tile';
                        gameState.turn++;
                        render(gameState);
                    }
                }

                break;
            }
            case 'KeyR': {
                if (gameState.phase === 'place-tile') {
                    const updatedTileToPlace = rotateTile(
                        gameState.tileToPlace
                    );
                    gameState.tileToPlace = updatedTileToPlace;

                    const tileToPlace = getElement('tile-to-place');
                    tileToPlace.innerHTML = null;
                    drawTileToPlace(updatedTileToPlace, tileToPlace);
                }
            }
        }
    };

    const world = getElement('world');
    world.onmousemove = ({ pageX, pageY }) => {
        switch (gameState.phase) {
            case 'pick-tile': {
                drawOverlay(pageX, pageY);
                break;
            }
            case 'place-tile': {
                const tileToPlace = getElement('tile-to-place');
                const left = snapToGrid(pageX);
                const top = snapToGrid(pageY);

                if (left / TILE_SIZE < 0) {
                    return;
                }

                if (top / TILE_SIZE <= 0) {
                    return;
                }

                tileToPlace.style.left = `${left - 1}px`;
                tileToPlace.style.top = `${top - 1}px`;
                break;
            }
            case 'place-meeple': {
                drawOverlay(pageX, pageY);
                break;
            }
        }
    };

    world.onclick = ({ pageX, pageY }) => {
        if (gameState.phase === 'place-tile') {
            placeTile(pageX, pageY, gameState);
        }
    };
}

export function render(gameState) {
    const turnCount = getElement('turn-count');
    turnCount.innerHTML = gameState.turn;

    const currentPlayer =
        gameState.players[gameState.turn % gameState.players.length];

    const turnPlayer = getElement('turn-player');
    turnPlayer.innerHTML = currentPlayer.name;
    turnPlayer.style.color = currentPlayer.color;

    const phase = getElement('phase');
    phase.innerHTML = gameState.phase;

    switch (gameState.phase) {
        case 'pick-tile': {
            const stack = getElement('stack');
            stack.style.display = null;

            const placeMeeples = getElement('place-meeple');
            placeMeeples.style.display = 'none';

            const endTurn = getElement('end-turn');
            endTurn.style.display = 'none';

            const tilesInStack = getElement('tiles-in-stack');
            tilesInStack.innerHTML = gameState.stack.size;

            break;
        }

        case 'place-tile': {
            const stack = getElement('stack');
            stack.style.display = 'none';

            const rotate = getElement('rotate');
            rotate.style.display = null;

            break;
        }

        case 'place-meeple': {
            const placeMeeples = getElement('place-meeple');
            placeMeeples.style.display = null;

            const endTurn = getElement('end-turn');
            endTurn.style.display = null;

            const meeplesLeft = getElement('meeples-left');
            meeplesLeft.innerHTML = currentPlayer.meeples;

            break;
        }

        case 'endgame': {
            const stack = getElement('stack');
            stack.style.display = 'none';

            break;
        }
    }

    const world = getElement('world');
    world.innerHTML = null;
    drawWorldTiles(gameState.world, world);

    const worldOverlay = getElement('world-overlay');
    worldOverlay.innerHTML = null;
    if (gameState.nodeOverlay.size > 0) {
        gameState.nodeOverlay.forEach(nodeCoordinates => {
            // TODO: Check if node is a crossroad; if so, don't allow user to select it
            const [x, y, nodeIndex] = nodeCoordinates
                .split('/')
                .map(fragment => Number(fragment));
            const offsetX = x * TILE_SIZE;
            const offsetY = y * TILE_SIZE;

            const element = createElement('canvas', `node${nodeCoordinates}`);
            element.style.width = `${TILE_SIZE}px`;
            element.style.height = `${TILE_SIZE}px`;
            element.width = TILE_SIZE;
            element.height = TILE_SIZE;

            element.style.position = 'absolute';
            element.style.marginLeft = `${offsetX}px`;
            element.style.marginTop = `${offsetY}px`;
            element.style.zIndex = 1;

            const canvas = element.getContext('2d');
            drawNode(nodeIndex, {}, canvas);
            worldOverlay.append(element);
        });
    }

    window.gameState = gameState;
}
