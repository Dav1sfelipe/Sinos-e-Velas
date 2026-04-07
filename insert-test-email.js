const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.db', (err) => {
  if (err) {
    console.error('Erro ao abrir database.db:', err.message);
    process.exit(1);
  }
});

const email = process.argv[2] || 'teste@exemplo.com';

db.run('INSERT INTO newsletter (email) VALUES (?)', [email], function(err) {
  if (err) {
    console.error('Erro ao inserir email:', err.message);
  } else {
    console.log(`Email inserido com sucesso: ${email}`);
    console.log(`ID gerado: ${this.lastID}`);
  }
  db.close();
});
