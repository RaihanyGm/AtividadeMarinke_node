const Tarefa = require('../models/tarefa');

exports.getAll = (page, limit) => Tarefa.findAll({
  order: [['id_crud', 'ASC']], limit, offset: (page - 1) * limit
});
exports.getById = (id) => Tarefa.findByPk(id);
exports.create = async (titulo, descricao) => {
  const tarefa = await Tarefa.create({ titulo, descricao });
  return tarefa.id_crud;
};
exports.update = async (id, titulo, descricao) => {
  const tarefa = await Tarefa.findByPk(id);
  if (!tarefa) return false;
  await tarefa.update({ titulo, descricao });
  return true;
};
exports.delete = async (id) => {
  const tarefa = await Tarefa.findByPk(id);
  if (!tarefa) return false;
  await tarefa.destroy();
  return true;
};
