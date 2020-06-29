/**
 *
 * @param {Object} node
 * @param {String} node.feature See node types.
 * @param {Number} index A number which represents where the node is situated on the tile it belongs to.
 * @returns {String} A human-friendly visualization of the node.
 */
function visualizeNode(node, index) {
    const feature = node.feature.charAt(0);
    switch (index) {
        default: {
            // only numbered properties are nodes
            if (String(index).match(/^\d+$/)) {
                return feature;
            }

            return '';
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
 * @param {Map} tiles
 * @returns {String} A human-friendly representation of the tiles.
 */
function visualizeTiles(tiles) {
    const tileVisualization = [];
    tiles.forEach(connections => {
        const nodeVisualization = [];
        connections.forEach((node, index) => {
            nodeVisualization.push(visualizeNode(node, index));
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
