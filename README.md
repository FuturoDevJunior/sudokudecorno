# Sudoku Solver API 🚀

![Node.js](https://img.shields.io/badge/Node.js-18.x-green?logo=node.js)
![Express](https://img.shields.io/badge/Express.js-4.x-blue?logo=express)
![Mocha](https://img.shields.io/badge/Mocha-Testing-red?logo=mocha)
![Chai](https://img.shields.io/badge/Chai-Assertions-yellow?logo=chai)
![SOLID](https://img.shields.io/badge/SOLID-Principles-brightgreen)
![Coverage](https://img.shields.io/badge/Tests-100%25-success)

## Visão Geral

API completa para resolução e validação de Sudoku, seguindo princípios de Clean Code, SOLID e com cobertura total de testes unitários e funcionais. Ideal para aprendizado, QA e integração em sistemas maiores.

---

## Funcionalidades
- **Resolver Sudoku:** POST `/api/solve` com puzzle string (81 caracteres).
- **Validar Jogada:** POST `/api/check` com puzzle, coordinate (A1-I9) e value (1-9).
- **Mensagens de erro claras** para todos os fluxos inválidos.
- **Cobertura de testes 100%** (unitários e funcionais).

---

## Como Rodar Localmente

```bash
# Instale as dependências
npm install

# Crie um arquivo .env com:
NODE_ENV=test

# Inicie o servidor
npm start

# Acesse em http://localhost:3000/
```

---

## Como Rodar os Testes

```bash
npm test
```
Todos os testes unitários e funcionais serão executados automaticamente.

---

## Estrutura de Pastas
```
controllers/         # Lógica central do Sudoku
routes/              # Endpoints da API
public/              # Frontend (se aplicável)
tests/               # Testes unitários e funcionais
views/               # Templates (se aplicável)
server.js            # Inicialização do servidor
```

---

## Tecnologias & Qualidade
- **Node.js** + **Express**
- **Mocha** + **Chai** para testes
- **Princípios SOLID** e **Clean Code**
- **Cobertura total de fluxos e erros**
- **Código modular, comentado e fácil de manter**

---

## Diferenciais
- 100% dos testes passando (unitários e funcionais)
- Mensagens de erro exatas e padronizadas
- Pronto para deploy e integração
- Estrutura escalável e de fácil extensão

---

## Créditos & Links Úteis
- [FreeCodeCamp - Quality Assurance Projects](https://www.freecodecamp.org/learn/quality-assurance/quality-assurance-projects/sudoku-solver)
- [Documentação do Express](https://expressjs.com/)
- [Documentação do Mocha](https://mochajs.org/)
- [Documentação do Chai](https://www.chaijs.com/)

---

> Projeto desenvolvido com excelência, precisão e foco em qualidade!
