'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body;
      // Validação de campos obrigatórios
      if (!puzzle || !coordinate || !value) {
        return res.json({ error: 'Required field(s) missing' });
      }
      // Validação de caracteres e tamanho
      const validationError = solver.validate(puzzle);
      if (validationError) {
        return res.json({ error: validationError });
      }
      // Validação do value
      if (!/^[1-9]$/.test(value)) {
        return res.json({ error: 'Invalid value' });
      }
      // Validação do coordinate
      if (!/^[A-I][1-9]$/i.test(coordinate)) {
        return res.json({ error: 'Invalid coordinate' });
      }
      const row = coordinate[0].toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0);
      const col = parseInt(coordinate[1], 10) - 1;
      // Checa se já está preenchido
      const board = puzzle.split('');
      if (board[row * 9 + col] === value) {
        return res.json({ valid: true });
      }
      let conflict = [];
      if (!solver.checkRowPlacement(puzzle, row, col, value)) conflict.push('row');
      if (!solver.checkColPlacement(puzzle, row, col, value)) conflict.push('column');
      if (!solver.checkRegionPlacement(puzzle, row, col, value)) conflict.push('region');
      if (conflict.length === 0) {
        return res.json({ valid: true });
      } else {
        return res.json({ valid: false, conflict });
      }
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body;
      if (!puzzle) {
        return res.json({ error: 'Required field missing' });
      }
      const validationError = solver.validate(puzzle);
      if (validationError) {
        return res.json({ error: validationError });
      }
      const solution = solver.solve(puzzle);
      if (!solution) {
        return res.json({ error: 'Puzzle cannot be solved' });
      }
      return res.json({ solution });
    });
};
