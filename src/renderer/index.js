import { CITY, ROAD, MONASTERY, RIVER } from '../engine/nodeTypes';
import {
    removeTileFromStack,
    rotateTile,
    canConnectNodes
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

function drawNode(index, node, canvas) {
    switch (node.feature) {
        default: {
            return;
        }
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

    switch (index) {
        default: {
            // Don't draw
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

export function initRender(gameState) {
    const seed = getElement('seed');
    seed.innerHTML = gameState.seed;

    const stack = getElement('stack');
    stack.onclick = () => {
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
        gameState.phase = 'pick-tile';
        gameState.turn++;
        render(gameState);
    };

    document.onkeypress = ({ code }) => {
        switch (code) {
            case 'Enter': {
                switch (gameState.phase) {
                    case 'pick-tile': {
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
                        drawTileToPlace(gameState.tileToPlace, tileToPlace);
                        render(gameState);

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

                tileToPlace.style.left = `${left}px`;
                tileToPlace.style.top = `${top}px`;
                break;
            }
            case 'place-meeple': {
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

                const hoveredTileId = hoveredTileElement.id.replace(
                    'world',
                    ''
                );

                const hoveredTile = gameState.world.get(hoveredTileId);

                const nodeX = snapToNode(pageX - left);
                const nodeY = snapToNode(pageY - top);

                const nodeIndex = NODE_ID_MAP.get(`${nodeX}/${nodeY}`);

                const hoveredNode = hoveredTile.get(nodeIndex);

                // TODO: Traverse node relations to get all the connected nodes
                const hoveredNodeRelations = gameState.nodeRelations.get(
                    `${hoveredTileId}/${nodeIndex}`
                );

                console.log({ hoveredTile, hoveredNode, hoveredNodeRelations });

                break;
            }
        }
    };

    world.onclick = ({ pageX, pageY }) => {
        if (gameState.phase === 'place-tile') {
            const x = snapToGrid(pageX - LEFT_PADDING_OFFSET) / TILE_SIZE;
            const y = snapToGrid(pageY - TOP_PADDING_OFFSET) / TILE_SIZE;

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

            const nodesA = [];
            const nodesB = [];
            let indexNodesA = [];
            let indexNodesB = [];
            let adjacentTilePosition = { x: 0, y: 0 };

            for (let [direction, tile] of adjacentTiles) {
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
                    const nodeRelationA = `${x}/${y}/${nodeIndex}`;
                    const nodeRelationB = `${adjacentTilePosition.x}/${adjacentTilePosition.y}/${indexNodesB[index]}`;

                    const existingNodeRelationA =
                        gameState.nodeRelations.get(nodeRelationA) || [];

                    gameState.nodeRelations.set(nodeRelationA, [
                        ...existingNodeRelationA,
                        nodeRelationB
                    ]);

                    const existingNodeRelationB =
                        gameState.nodeRelations.get(nodeRelationB) || [];

                    gameState.nodeRelations.set(nodeRelationB, [
                        ...existingNodeRelationB,
                        nodeRelationA
                    ]);
                });
            }

            const tileToPlace = getElement('tile-to-place');
            tileToPlace.innerHTML = null;
            stack.style.pointerEvents = null;

            const rotate = getElement('rotate');
            rotate.style.display = 'none';

            gameState.world.set(`${x}/${y}`, gameState.tileToPlace);

            gameState.tileToPlace = new Map();
            gameState.phase = 'place-meeple';

            render(gameState);
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

    window.gameState = gameState;
}
