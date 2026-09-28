const { DataTypes } = require('sequelize');
const database = require('../config/database');

module.exports = database.define('Tarefa', {
  id_crud: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  titulo: { type: DataTypes.STRING(50), allowNull: false },
  descricao: { type: DataTypes.TEXT, allowNull: false }
}, { tableName: 'tarefas', timestamps: false });
