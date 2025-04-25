class SudokuSolver {
  /**
   * Valida o puzzle string.
   * @param {string} puzzleString
   * @returns {null|string} null se válido, string de erro se inválido
   */
  validate(puzzleString) {
    if (puzzleString === undefined) {
      return 'Required field missing';
    }
    if (typeof puzzleString !== 'string') {
      return 'Invalid characters in puzzle';
    }
    if (!/^[1-9.]*$/.test(puzzleString)) {
      return 'Invalid characters in puzzle';
    }
    if (puzzleString.length !== 81) {
      return 'Expected puzzle to be 81 characters long';
    }
    return null;
  }

  /**
   * Checa se o valor pode ser colocado na linha.
   */
  checkRowPlacement(puzzleString, row, column, value) {
    const board = this._stringToBoard(puzzleString);
    const rowIdx = row;
    for (let col = 0; col < 9; col++) {
      if (board[rowIdx][col] === value && col !== column) {
        return false;
      }
    }
    return true;
  }

  /**
   * Checa se o valor pode ser colocado na coluna.
   */
  checkColPlacement(puzzleString, row, column, value) {
    const board = this._stringToBoard(puzzleString);
    const colIdx = column;
    for (let r = 0; r < 9; r++) {
      if (board[r][colIdx] === value && r !== row) {
        return false;
      }
    }
    return true;
  }

  /**
   * Checa se o valor pode ser colocado na região 3x3.
   */
  checkRegionPlacement(puzzleString, row, column, value) {
    const board = this._stringToBoard(puzzleString);
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(column / 3) * 3;
    for (let r = startRow; r < startRow + 3; r++) {
      for (let c = startCol; c < startCol + 3; c++) {
        if (board[r][c] === value && (r !== row || c !== column)) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * Resolve o puzzle usando backtracking.
   * @param {string} puzzleString
   * @returns {string|false} solução ou false se não houver solução
   */
  solve(puzzleString) {
    const validationError = this.validate(puzzleString);
    if (validationError) return false;
    let board = this._stringToBoard(puzzleString);
    const solved = this._solveBoard(board);
    if (!solved) return false;
    return this._boardToString(board);
  }

  // Utilitários privados
  _stringToBoard(str) {
    const board = [];
    for (let i = 0; i < 9; i++) {
      board.push(str.slice(i * 9, (i + 1) * 9).split(''));
    }
    return board;
  }

  _boardToString(board) {
    return board.map(row => row.join('')).join('');
  }

  _isSafe(board, row, col, value) {
    // Checa linha
    for (let c = 0; c < 9; c++) {
      if (board[row][c] === value) return false;
    }
    // Checa coluna
    for (let r = 0; r < 9; r++) {
      if (board[r][col] === value) return false;
    }
    // Checa região
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let r = startRow; r < startRow + 3; r++) {
      for (let c = startCol; c < startCol + 3; c++) {
        if (board[r][c] === value) return false;
      }
    }
    return true;
  }

  _solveBoard(board) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === '.' || board[row][col] === undefined) {
          for (let num = 1; num <= 9; num++) {
            const value = num.toString();
            if (this._isSafe(board, row, col, value)) {
              board[row][col] = value;
              if (this._solveBoard(board)) {
                return true;
              }
              board[row][col] = '.';
            }
          }
          return false;
        }
      }
    }
    return true;
  }
}

module.exports = SudokuSolver;

