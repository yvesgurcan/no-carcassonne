import { CITY, ROAD, MONASTERY, RIVER } from '../engine/nodeTypes';
import {
    removeTileFromStack,
    rotateTile,
    canConnectNodes
} from '../engine/gameLogic';
import { isNumber, isCoordinates } from '../util';

const TILE_SIZE = 60;

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

function snapTileToPlaceToGrid(coordinate) {
    return Math.floor(coordinate / TILE_SIZE) * TILE_SIZE;
}

export function initRender(gameState) {
    const seed = getElement('seed');
    seed.innerHTML = gameState.seed;

    const stack = getElement('stack');
    stack.onclick = () => {
        const { tile, updatedStack } = removeTileFromStack(gameState.stack);
        gameState.stack = updatedStack;
        gameState.tileToPlace = tile;

        stack.style.pointerEvents = 'none';

        const tileToPlace = getElement('tile-to-place');
        drawTileToPlace(gameState.tileToPlace, tileToPlace);
        render(gameState);
    };

    const world = getElement('world');
    world.onclick = ({ pageX, pageY }) => {
        if (gameState.tileToPlace.size !== 0) {
            const x =
                snapTileToPlaceToGrid(pageX - LEFT_PADDING_OFFSET) / TILE_SIZE;
            const y =
                snapTileToPlaceToGrid(pageY - TOP_PADDING_OFFSET) / TILE_SIZE;

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

            for (let [direction, tile] of adjacentTiles) {
                let nodesA = [];
                let nodesB = [];
                switch (direction) {
                    case 'W': {
                        nodesA = [
                            gameState.tileToPlace.get(3),
                            gameState.tileToPlace.get(5),
                            gameState.tileToPlace.get(8)
                        ];
                        nodesB = [tile.get(4), tile.get(7), tile.get(9)];

                        break;
                    }
                    case 'E': {
                        nodesA = [
                            gameState.tileToPlace.get(4),
                            gameState.tileToPlace.get(7),
                            gameState.tileToPlace.get(9)
                        ];
                        nodesB = [tile.get(3), tile.get(5), tile.get(8)];

                        break;
                    }
                    case 'N': {
                        nodesA = [
                            gameState.tileToPlace.get(10),
                            gameState.tileToPlace.get(11),
                            gameState.tileToPlace.get(12)
                        ];
                        nodesB = [tile.get(0), tile.get(1), tile.get(2)];

                        break;
                    }
                    case 'S': {
                        nodesA = [
                            gameState.tileToPlace.get(0),
                            gameState.tileToPlace.get(1),
                            gameState.tileToPlace.get(2)
                        ];
                        nodesB = [tile.get(10), tile.get(11), tile.get(12)];

                        break;
                    }
                }

                const canConnect = canConnectNodes(nodesA, nodesB);
                if (!canConnect) {
                    return;
                }
            }

            const tileToPlace = getElement('tile-to-place');
            tileToPlace.innerHTML = null;
            stack.style.pointerEvents = null;
            gameState.world.set(`${x}/${y}`, gameState.tileToPlace);
            gameState.tileToPlace = new Map();
            console.log(gameState.world);
            render(gameState);
        }
    };
}

export function render(gameState) {
    if (gameState.stack.size === 0) {
        const stack = getElement('stack');
        stack.style.display = 'none';
    }

    if (gameState.tileToPlace.size !== 0) {
        const world = getElement('world');
        world.onmousemove = ({ pageX, pageY }) => {
            const tileToPlace = getElement('tile-to-place');
            const left = snapTileToPlaceToGrid(pageX);
            const top = snapTileToPlaceToGrid(pageY);

            if (left / TILE_SIZE < 0) {
                return;
            }

            if (top / TILE_SIZE <= 0) {
                return;
            }

            tileToPlace.style.left = `${left}px`;
            tileToPlace.style.top = `${top}px`;
        };

        document.onkeypress = ({ code }) => {
            switch (code) {
                case 'KeyR': {
                    if (gameState.tileToPlace) {
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
    }

    const tilesInStack = getElement('tiles-in-stack');
    tilesInStack.innerHTML = gameState.stack.size;

    const world = getElement('world');
    world.innerHTML = null;
    drawWorldTiles(gameState.world, world);
}
