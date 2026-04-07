const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.db', (err) => {
  if (err) {
    console.error('Erro ao abrir database.db:', err.message);
    process.exit(1);
  }
});

db.serialize(() => {
  db.each("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name", (err, row) => {
    if (err) {
      console.error(err.message);
      return;
    }
    console.log('Tabela:', row.name);
  }, () => {
    console.log('--- Dados da tabela newsletter ---');
    db.all('SELECT * FROM newsletter', [], (err, rows) => {
      if (err) {
        console.error('Erro ao ler newsletter:', err.message);
      } else {
        console.log(JSON.stringify(rows, null, 2));
      }
      db.close();
    });
  });
});
