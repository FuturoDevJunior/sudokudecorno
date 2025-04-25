const chai = require('chai');
const assert = chai.assert;
const Solver = require('../controllers/sudoku-solver.js');
const fs = require('fs');
let solver = new Solver();

// Importa puzzles e soluções
const puzzlesAndSolutions = [
  [
    '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
    '135762984946381257728459613694517832812936745357824196473298561581673429269145378'
  ],
  [
    '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3',
    '568913724342687519197254386685479231219538467734162895926345178473891652851726943'
  ],
  [
    '..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1',
    '218396745753284196496157832531672984649831257827549613962415378185763429374928561'
  ],
  [
    '.7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6',
    '473891265851726394926345817568913472342687951197254638734162589685479123219538746'
  ],
  [
    '82..4..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51',
    '827549163531672894649831527496157382218396475753284916962415738185763249374928651'
  ]
];

suite('Unit Tests', () => {
  // 1. Puzzle string válida (81 caracteres)
  test('Logic handles a valid puzzle string of 81 characters', () => {
    const puzzle = puzzlesAndSolutions[0][0];
    assert.isNull(solver.validate(puzzle));
  });

  // 2. Puzzle string com caracteres inválidos
  test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', () => {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37X';
    assert.equal(solver.validate(puzzle), 'Invalid characters in puzzle');
  });

  // 3. Puzzle string com tamanho inválido
  test('Logic handles a puzzle string that is not 81 characters in length', () => {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.';
    assert.equal(solver.validate(puzzle), 'Expected puzzle to be 81 characters long');
  });

  // 4. Validação de linha válida
  test('Logic handles a valid row placement', () => {
    const puzzle = puzzlesAndSolutions[0][0];
    // Coloca 3 na posição A2 (linha 0, coluna 1)
    assert.isTrue(solver.checkRowPlacement(puzzle, 0, 1, '3'));
  });

  // 5. Validação de linha inválida
  test('Logic handles an invalid row placement', () => {
    const puzzle = puzzlesAndSolutions[0][0];
    // Coloca 1 na posição A2 (linha 0, coluna 1), já existe 1 na linha
    assert.isFalse(solver.checkRowPlacement(puzzle, 0, 1, '1'));
  });

  // 6. Validação de coluna válida
  test('Logic handles a valid column placement', () => {
    const puzzle = puzzlesAndSolutions[0][0];
    // Coloca 6 na posição B1 (linha 1, coluna 0) - 6 não existe na coluna
    assert.isTrue(solver.checkColPlacement(puzzle, 1, 0, '6'));
  });

  // 7. Validação de coluna inválida
  test('Logic handles an invalid column placement', () => {
    const puzzle = puzzlesAndSolutions[0][0];
    // Coloca 1 na posição B1 (linha 1, coluna 0), já existe 1 na coluna
    assert.isFalse(solver.checkColPlacement(puzzle, 1, 0, '1'));
  });

  // 8. Validação de região válida
  test('Logic handles a valid region (3x3 grid) placement', () => {
    const puzzle = puzzlesAndSolutions[0][0];
    // Coloca 3 na posição B2 (linha 1, coluna 1)
    assert.isTrue(solver.checkRegionPlacement(puzzle, 1, 1, '3'));
  });

  // 9. Validação de região inválida
  test('Logic handles an invalid region (3x3 grid) placement', () => {
    const puzzle = puzzlesAndSolutions[0][0];
    // Coloca 1 na posição B2 (linha 1, coluna 1), já existe 1 na região
    assert.isFalse(solver.checkRegionPlacement(puzzle, 1, 1, '1'));
  });

  // 10. Puzzle válido passa no solver
  test('Valid puzzle strings pass the solver', () => {
    const puzzle = puzzlesAndSolutions[0][0];
    const solution = puzzlesAndSolutions[0][1];
    assert.equal(solver.solve(puzzle), solution);
  });

  // 11. Puzzle inválido falha no solver
  test('Invalid puzzle strings fail the solver', () => {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37X';
    assert.isFalse(solver.solve(puzzle));
  });

  // 12. Solver retorna solução esperada para puzzle incompleto
  test('Solver returns the expected solution for an incomplete puzzle', () => {
    const puzzle = puzzlesAndSolutions[1][0];
    const solution = puzzlesAndSolutions[1][1];
    assert.equal(solver.solve(puzzle), solution);
  });
});
