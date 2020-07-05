export function isNumber(primitive) {
    return String(primitive).match(/^\d+$/);
}

export function isCoordinates(primitive) {
    return String(primitive).match(/^(-)?\d+\/(-)?\d+$/);
}

export function isWorldElement(primitive) {
    return String(primitive).match(/^world(-)?\d+\/(-)?\d+$/);
}
