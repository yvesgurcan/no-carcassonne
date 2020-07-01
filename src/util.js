export function isNumber(primitive) {
    return String(primitive).match(/^\d+$/);
}

export function isCoordinates(primitive) {
    return String(primitive).match(/^(-)?\d+\/(-)?\d+$/);
}
