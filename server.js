const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Servir arquivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

// Conectar ao banco SQLite (cria arquivo se não existir)
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco:', err);
  } else {
    console.log('Conectado ao banco de dados SQLite!');
  }
});

// Criar tabela newsletter (execute isso uma vez)
db.run(`CREATE TABLE IF NOT EXISTS newsletter (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  data_inscricao DATETIME DEFAULT CURRENT_TIMESTAMP
)`, (err) => {
  if (err) {
    console.error('Erro ao criar tabela:', err);
  } else {
    console.log('Tabela newsletter pronta!');
  }
});

// Endpoint para salvar email na newsletter
app.post('/subscribe', (req, res) => {
  const { email, name } = req.body;
  
  if (!email) {
    return res.status(400).json({ error: 'Email é obrigatório' });
  }

  db.run(`INSERT INTO newsletter (email) VALUES (?)`, [email], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(400).json({ error: 'Este email já está inscrito' });
      }
      return res.status(500).json({ error: 'Erro ao salvar: ' + err.message });
    }
    res.json({ message: 'Inscrito com sucesso!', id: this.lastID });
  });
});

// Endpoint para obter todos os emails (apenas para verificação)
app.get('/newsletter', (req, res) => {
  db.all(`SELECT * FROM newsletter ORDER BY data_inscricao DESC`, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
