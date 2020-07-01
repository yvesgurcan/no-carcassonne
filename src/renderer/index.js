import { CITY, ROAD, MONASTERY, RIVER } from '../engine/nodeTypes';
import { removeTileFromStack, rotateTile } from '../engine/gameLogic';
import { isNumber } from '../util';

const TILE_SIZE = 60;

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
        if (isNumber(key)) {
            const offset = key * 20;
            const tile = drawTile(value, `world${key}`);
            tile.style.marginLeft = offset;
            tile.style.marginTop = offset;
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
    world.onclick = () => {
        if (gameState.tileToPlace) {
            const tileToPlace = getElement('tile-to-place');
            tileToPlace.innerHTML = null;
            stack.style.pointerEvents = null;
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
