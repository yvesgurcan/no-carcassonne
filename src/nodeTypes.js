const GRASS = 'G';

const EMPTY_NODE = { feature: GRASS, owner: undefined };

module.exports = {
    EMPTY_NODE,
    GRASS, // Default feature
    BLANK: 'B',
    CITY: 'C',
    ROAD: 'R',
    MONASTERY: 'M',
    RIVER: 'S', // 'S' for 'Stream'
    GARDEN: 'G'
};
