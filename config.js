const SECRET_KEY = 'zzzzzxxxxcccvvb';
const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

module.exports = {
  SECRET_KEY,
  PORT,
  DB_URL,
};
