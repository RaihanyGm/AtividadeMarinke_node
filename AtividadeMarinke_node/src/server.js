const app = require('./app');
const database = require('./config/database');
require('./models/tarefa');

database.sync().then(() => {
  app.listen(process.env.PORT || 3001, () => console.log('Servidor rodando'));
}).catch((error) => {
  console.error('Erro ao iniciar banco de dados:', error);
  process.exitCode = 1;
});
