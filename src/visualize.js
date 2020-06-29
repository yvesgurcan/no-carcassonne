/**
 *
 * @param {Object} nodeData
 * @param {String} nodeData.feature See node types.
 * @param {Number} nodeIndex A number which represents where the node is situated on the tile it belongs to.
 * @returns {String} A human-friendly visualization of the node.
 */
function visualizeNode(nodeData, nodeIndex) {
    const feature = nodeData.feature.charAt(0);
    switch (nodeIndex) {
        default: {
            return feature;
        }
        case 0:
        case 10:
            return `\n| ${feature} `;
        case 2:
        case 12:
            return ` ${feature} |`;
        case 3:
        case 8:
            return `\n|${feature}  `;
        case 5: {
            return `\n|${feature}  `;
        }
        case 4:
        case 9:
            return `   ${feature}|`;

        case 7: {
            return `  ${feature}|`;
        }
    }
}

/**
 *
 * @param {Map} tiles A list of tiles to visualize.
 * @returns {String} A human-friendly representation of the tiles.
 */
function visualizeTiles(tiles) {
    const tileVisualization = [];
    tiles.forEach(tile => {
        const nodeVisualization = [];
        tile.forEach((value, key) => {
            // Only numbered properties are nodes
            if (String(key).match(/^\d+$/)) {
                nodeVisualization.push(visualizeNode(value, key));
            }
        });

        tileVisualization.push(
            `\n*-------*${nodeVisualization.join('')}\n*-------*`
        );

        return nodeVisualization;
    });

    return tileVisualization.join('');
}

module.exports = {
    visualizeTiles
};
