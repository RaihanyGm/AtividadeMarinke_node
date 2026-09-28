# CRUD de tarefas

Aplicação Node.js com interface web, API Express, Sequelize e banco de dados relacional SQLite. O banco é criado automaticamente ao iniciar. Também é possível usar MySQL.

## Executar

Requer Node.js e npm.

```bash
npm install
npm start
```

Acesse **http://localhost:3001** para criar, listar, editar e excluir tarefas. Por padrão, os dados ficam no arquivo `tarefas.sqlite`, ignorado pelo Git.

Opcionalmente, crie um arquivo `.env` a partir de `.env.example` para configurar porta e banco. Para MySQL, crie previamente o banco indicado em `DB_NAME`; o Sequelize cria a tabela `tarefas` automaticamente.

## API

| Método | Rota | Operação |
| --- | --- | --- |
| GET | `/api/tarefa?page=1&limit=10` | Listar tarefas com paginação |
| GET | `/api/tarefa/:id_crud` | Buscar por ID |
| POST | `/api/tarefa` | Criar |
| PUT | `/api/tarefa/:id_crud` | Atualizar |
| DELETE | `/api/tarefa/:id_crud` | Excluir |

POST e PUT recebem JSON com `titulo` (1 a 50 caracteres) e `descricao` (texto obrigatório). IDs inválidos retornam 400; tarefas inexistentes retornam 404.

## Testes e cobertura

```bash
npm test
```

Os testes Jest + Supertest usam SQLite em memória e exercitam as cinco operações HTTP, paginação, validações, ausência de registros e falhas. O comando exige cobertura global superior a 90% e gera o relatório HTML em `coverage/lcov-report/index.html`.
