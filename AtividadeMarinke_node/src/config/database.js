require('dotenv').config();
const path = require('path');
const { Sequelize } = require('sequelize');

const mysql = process.env.DB_DIALECT === 'mysql';
module.exports = mysql
  ? new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      dialect: 'mysql', logging: false
    })
  : new Sequelize({
      dialect: 'sqlite',
      storage: process.env.DB_PATH || path.join(__dirname, '../../tarefas.sqlite'),
      logging: false
    });
