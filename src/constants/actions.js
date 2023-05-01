const hands = [
    'Tiger',
    'Bird',
    'Horse',
];
const actions = [
    { name: 'Healed', type: 'hp', value: 10, mpCost: 10, sequence: [0, 1, 2], },
    { name: 'Attacked', type: 'attack', value: 25, mpCost: 25, sequence: [1, 1, 2], },
    { name: 'Defended', type: 'defend', value: 15, mpCost: 15, sequence: [2, 2, 2], },
    { name: 'Chakra', type: 'mp', value: 10, sequence: [2, 2, 1], },
];

export { hands, actions };
