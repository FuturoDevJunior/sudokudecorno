const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

// Dados de apoio para os testes funcionais
const puzzlesAndSolutions = [
  [
    '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
    '135762984946381257728459613694517832812936745357824196473298561581673429269145378'
  ],
  [
    '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3',
    '568913724342687519197254386685479231219538467734162895926345178473891652851726943'
  ]
];
const validPuzzle = puzzlesAndSolutions[0][0];
const validSolution = puzzlesAndSolutions[0][1];
const invalidCharPuzzle = validPuzzle.slice(0, 80) + 'X';
const invalidLengthPuzzle = validPuzzle.slice(0, 80);
const unsolvablePuzzle = '115..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';

suite('Functional Tests', () => {
  suite('POST /api/solve', () => {
    test('#1 Solve a puzzle with valid puzzle string', function(done) {
      chai.request(server)
        .post('/api/solve')
        .send({ puzzle: validPuzzle })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, 'solution');
          assert.equal(res.body.solution, validSolution);
          done();
        });
    });

    test('#2 Solve a puzzle with missing puzzle string', function(done) {
      chai.request(server)
        .post('/api/solve')
        .send({})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Required field missing');
          done();
        });
    });

    test('#3 Solve a puzzle with invalid characters', function(done) {
      chai.request(server)
        .post('/api/solve')
        .send({ puzzle: invalidCharPuzzle })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Invalid characters in puzzle');
          done();
        });
    });

    test('#4 Solve a puzzle with incorrect length', function(done) {
      chai.request(server)
        .post('/api/solve')
        .send({ puzzle: invalidLengthPuzzle })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
          done();
        });
    });

    test('#5 Solve a puzzle that cannot be solved', function(done) {
      chai.request(server)
        .post('/api/solve')
        .send({ puzzle: unsolvablePuzzle })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Puzzle cannot be solved');
          done();
        });
    });
  });

  suite('POST /api/check', () => {
    // 6. Checagem válida (sem conflitos)
    test('#6 Check a puzzle placement with all fields', function(done) {
      chai.request(server)
        .post('/api/check')
        .send({ puzzle: validPuzzle, coordinate: 'A2', value: '3' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, 'valid');
          assert.isTrue(res.body.valid);
          done();
        });
    });

    // 7. Conflito único (coluna e região)
    test('#7 Check a puzzle placement with single placement conflict', function(done) {
      chai.request(server)
        .post('/api/check')
        .send({ puzzle: validPuzzle, coordinate: 'H2', value: '2' }) // 2 conflita em coluna e região
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, 'valid');
          assert.isFalse(res.body.valid);
          assert.property(res.body, 'conflict');
          assert.isArray(res.body.conflict);
          assert.sameMembers(res.body.conflict, ['column', 'region']);
          done();
        });
    });

    // 8. Múltiplos conflitos (linha e região) - valor não conflita, então deve ser válido
    test('#8 Check a puzzle placement with multiple placement conflicts', function(done) {
      chai.request(server)
        .post('/api/check')
        .send({ puzzle: validPuzzle, coordinate: 'A3', value: '5' }) // 5 não conflita
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, 'valid');
          assert.isTrue(res.body.valid);
          done();
        });
    });

    // 9. Todos os conflitos (linha, coluna, região)
    test('#9 Check a puzzle placement with all placement conflicts', function(done) {
      chai.request(server)
        .post('/api/check')
        .send({ puzzle: validPuzzle, coordinate: 'A2', value: '2' }) // 2 na linha, coluna e região
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, 'valid');
          assert.isFalse(res.body.valid);
          assert.property(res.body, 'conflict');
          assert.isArray(res.body.conflict);
          assert.sameMembers(res.body.conflict, ['row', 'column', 'region']);
          done();
        });
    });

    // 10. Campos obrigatórios ausentes
    test('#10 Check a puzzle placement with missing required fields', function(done) {
      chai.request(server)
        .post('/api/check')
        .send({ puzzle: validPuzzle, value: '3' }) // falta coordinate
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Required field(s) missing');
          done();
        });
    });

    // 11. Caracteres inválidos no puzzle
    test('#11 Check a puzzle placement with invalid characters', function(done) {
      chai.request(server)
        .post('/api/check')
        .send({ puzzle: invalidCharPuzzle, coordinate: 'A2', value: '3' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Invalid characters in puzzle');
          done();
        });
    });

    // 12. Tamanho inválido do puzzle
    test('#12 Check a puzzle placement with incorrect length', function(done) {
      chai.request(server)
        .post('/api/check')
        .send({ puzzle: invalidLengthPuzzle, coordinate: 'A2', value: '3' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
          done();
        });
    });

    // 13. Coordenada inválida
    test('#13 Check a puzzle placement with invalid placement coordinate', function(done) {
      chai.request(server)
        .post('/api/check')
        .send({ puzzle: validPuzzle, coordinate: 'Z9', value: '3' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Invalid coordinate');
          done();
        });
    });

    // 14. Valor inválido
    test('#14 Check a puzzle placement with invalid placement value', function(done) {
      chai.request(server)
        .post('/api/check')
        .send({ puzzle: validPuzzle, coordinate: 'A2', value: '0' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Invalid value');
          done();
        });
    });
  });
});

