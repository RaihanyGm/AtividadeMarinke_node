const tarefaService = require('../services/tarefaService');
const response = require('../utils/response');

const validId = (id) => /^[1-9]\d*$/.test(id) && Number.isSafeInteger(Number(id));
const validBody = ({ titulo, descricao } = {}) =>
  typeof titulo === 'string' && titulo.trim().length > 0 && titulo.length <= 50 &&
  typeof descricao === 'string' && descricao.trim().length > 0;

exports.getAllTarefa = async (req, res) => {
  const { page = '1', limit = '10' } = req.query;
  if (!validId(page) || !validId(limit)) {
    return response.error(res, 400, 'Paginação inválida. Use números maiores que 0.');
  }
  try {
    const tarefas = await tarefaService.getAll(Number(page), Number(limit));
    return response.success(res, 200, 'Tarefas listadas com sucesso', tarefas);
  } catch (error) {
    return response.error(res, 500, 'Erro interno ao buscar tarefas');
  }
};

exports.getByIdTarefa = async (req, res) => {
  if (!validId(req.params.id_crud)) return response.error(res, 400, 'ID inválido');
  try {
    const tarefa = await tarefaService.getById(req.params.id_crud);
    if (!tarefa) return response.error(res, 404, 'Tarefa não encontrada');
    return response.success(res, 200, 'Tarefa encontrada', tarefa);
  } catch (error) {
    return response.error(res, 500, 'Erro interno ao buscar tarefa');
  }
};

exports.createTarefa = async (req, res) => {
  if (!validBody(req.body)) return response.error(res, 400, 'Título e descrição são obrigatórios (título: até 50 caracteres)');
  try {
    const id = await tarefaService.create(req.body.titulo.trim(), req.body.descricao.trim());
    return response.success(res, 201, 'Tarefa criada com sucesso', { id });
  } catch (error) {
    return response.error(res, 500, 'Erro ao criar tarefa');
  }
};

exports.updateTarefa = async (req, res) => {
  if (!validId(req.params.id_crud)) return response.error(res, 400, 'ID inválido');
  if (!validBody(req.body)) return response.error(res, 400, 'Título e descrição são obrigatórios (título: até 50 caracteres)');
  try {
    const updated = await tarefaService.update(req.params.id_crud, req.body.titulo.trim(), req.body.descricao.trim());
    if (!updated) return response.error(res, 404, 'Tarefa não encontrada');
    return response.success(res, 200, 'Tarefa atualizada com sucesso');
  } catch (error) {
    return response.error(res, 500, 'Erro ao atualizar tarefa');
  }
};

exports.deleteTarefa = async (req, res) => {
  if (!validId(req.params.id_crud)) return response.error(res, 400, 'ID inválido');
  try {
    const deleted = await tarefaService.delete(req.params.id_crud);
    if (!deleted) return response.error(res, 404, 'Tarefa não encontrada');
    return response.success(res, 200, 'Tarefa deletada com sucesso');
  } catch (error) {
    return response.error(res, 500, 'Erro ao deletar tarefa');
  }
};
