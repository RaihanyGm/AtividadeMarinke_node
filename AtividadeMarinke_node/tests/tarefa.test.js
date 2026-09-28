process.env.DB_PATH = ':memory:';
const request = require('supertest');
const database = require('../src/config/database');
const app = require('../src/app');
const service = require('../src/services/tarefaService');

beforeEach(async () => { await database.sync({ force: true }); });
afterAll(async () => { await database.close(); });

const task = { titulo: 'Estudar', descricao: 'Revisar Sequelize' };

test('interface é servida pela aplicação', async () => {
  const res = await request(app).get('/');
  expect(res.status).toBe(200);
  expect(res.text).toContain('Minhas tarefas');
});

test('CRUD completo persiste, lista, busca, atualiza e exclui uma tarefa', async () => {
  const created = await request(app).post('/api/tarefa').send(task);
  expect(created.status).toBe(201);
  const id = created.body.dados.id;
  expect(id).toEqual(expect.any(Number));

  const listed = await request(app).get('/api/tarefa');
  expect(listed.status).toBe(200);
  expect(listed.body.dados).toEqual([{ id_crud: id, ...task }]);

  const fetched = await request(app).get('/api/tarefa/' + id);
  expect(fetched.body.dados).toEqual({ id_crud: id, ...task });

  const changed = await request(app).put('/api/tarefa/' + id).send({ titulo: 'Concluído', descricao: 'Feito' });
  expect(changed.status).toBe(200);
  expect((await request(app).get('/api/tarefa/' + id)).body.dados.titulo).toBe('Concluído');

  expect((await request(app).delete('/api/tarefa/' + id)).status).toBe(200);
  expect((await request(app).get('/api/tarefa/' + id)).status).toBe(404);
});

test('paginação devolve fatias ordenadas e recusa valores inválidos', async () => {
  await request(app).post('/api/tarefa').send(task);
  await request(app).post('/api/tarefa').send({ ...task, titulo: 'Outra' });
  const page = await request(app).get('/api/tarefa?page=2&limit=1');
  expect(page.body.dados.map(t => t.titulo)).toEqual(['Outra']);
  for (const query of ['page=0', 'limit=-1', 'page=1.5', 'page=abc']) {
    expect((await request(app).get('/api/tarefa?' + query)).status).toBe(400);
  }
});

test('IDs inválidos e inexistentes recebem 400 e 404', async () => {
  for (const method of ['get', 'put', 'delete']) {
    expect((await request(app)[method]('/api/tarefa/abc').send(task)).status).toBe(400);
    expect((await request(app)[method]('/api/tarefa/1').send(task)).status).toBe(404);
  }
});

test('criação e atualização rejeitam dados incompletos e título longo', async () => {
  const created = await request(app).post('/api/tarefa').send(task);
  const id = created.body.dados.id;
  for (const invalid of [{ titulo: '', descricao: 'x' }, { titulo: 'x' }, { titulo: 'x'.repeat(51), descricao: 'ok' }, { titulo: 123, descricao: 'ok' }]) {
    expect((await request(app).post('/api/tarefa').send(invalid)).status).toBe(400);
    expect((await request(app).put('/api/tarefa/' + id).send(invalid)).status).toBe(400);
  }
  expect((await request(app).get('/api/tarefa/' + id)).body.dados).toMatchObject(task);
});

test('falhas do serviço retornam 500 sem divulgar detalhes internos', async () => {
  for (const [method, url, serviceMethod] of [
    ['get', '/api/tarefa', 'getAll'],
    ['get', '/api/tarefa/1', 'getById'],
    ['post', '/api/tarefa', 'create'],
    ['put', '/api/tarefa/1', 'update'],
    ['delete', '/api/tarefa/1', 'delete']
  ]) {
    const mock = jest.spyOn(service, serviceMethod).mockRejectedValueOnce(new Error('detalhe privado'));
    const res = await request(app)[method](url).send(task);
    expect(res.status).toBe(500);
    expect(JSON.stringify(res.body)).not.toContain('detalhe privado');
    mock.mockRestore();
  }
});
