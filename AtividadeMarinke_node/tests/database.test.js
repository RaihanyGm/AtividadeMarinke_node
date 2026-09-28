test('configura Sequelize para MySQL usando as variáveis de ambiente', () => {
  const old = {
    DB_DIALECT: process.env.DB_DIALECT,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_NAME: process.env.DB_NAME,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD
  };
  try {
    const Sequelize = jest.fn();
    jest.doMock('sequelize', () => ({ Sequelize }));
    process.env.DB_DIALECT = 'mysql';
    process.env.DB_NAME = 'atividades';
    process.env.DB_USER = 'usuario';
    process.env.DB_PASSWORD = 'senha';
    delete process.env.DB_HOST;
    delete process.env.DB_PORT;
    jest.isolateModules(() => require('../src/config/database'));
    expect(Sequelize).toHaveBeenCalledWith('atividades', 'usuario', 'senha', expect.objectContaining({
      host: 'localhost', port: 3306, dialect: 'mysql'
    }));
    process.env.DB_HOST = 'servidor';
    process.env.DB_PORT = '3307';
    jest.isolateModules(() => require('../src/config/database'));
    expect(Sequelize).toHaveBeenLastCalledWith('atividades', 'usuario', 'senha', expect.objectContaining({
      host: 'servidor', port: 3307
    }));
  } finally {
    for (const [key, value] of Object.entries(old)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
    jest.unmock('sequelize');
  }
});
