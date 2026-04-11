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
  }
});

// Criar tabela newsletter (execute isso uma vez)
db.run(
  `CREATE TABLE IF NOT EXISTS newsletter (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  data_inscricao DATETIME DEFAULT CURRENT_TIMESTAMP
)`,
  (err) => {
    if (err) {
      console.error('Erro ao criar tabela:', err);
    }
  },
);

// Criar tabela de pedidos de personalização
db.run(
  `CREATE TABLE IF NOT EXISTS product_customizations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  fragrancia TEXT NOT NULL,
  embalagem_cor TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT NOT NULL,
  quantidade INTEGER NOT NULL,
  embalagem_presente INTEGER NOT NULL DEFAULT 0,
  mensagem TEXT,
  data_pedido DATETIME DEFAULT CURRENT_TIMESTAMP
)`,
  (err) => {
    if (err) {
      console.error('Erro ao criar tabela product_customizations:', err);
    }
  },
);

db.all(`PRAGMA table_info(product_customizations)`, (err, columns) => {
  if (!err && columns) {
    const names = columns.map((col) => col.name);
    if (!names.includes('email')) {
      db.run(`ALTER TABLE product_customizations ADD COLUMN email TEXT`);
    }
    if (!names.includes('telefone')) {
      db.run(`ALTER TABLE product_customizations ADD COLUMN telefone TEXT`);
    }
  }
});

// Endpoint para salvar email na newsletter
app.post('/subscribe', (req, res) => {
  const { email, name } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email é obrigatório' });
  }

  db.run(`INSERT INTO newsletter (email) VALUES (?)`, [email], function (err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(400).json({ error: 'Este email já está inscrito' });
      }
      return res.status(500).json({ error: 'Erro ao salvar: ' + err.message });
    }
    res.json({ message: 'Inscrito com sucesso!', id: this.lastID });
  });
});

// Endpoint para salvar pedido de personalização
app.post('/personalize', (req, res) => {
  const { fragrancia, embalagem_cor, email, telefone, quantidade, embalagem, mensagem } = req.body;

  if (!fragrancia || !embalagem_cor || !email || !telefone || !quantidade) {
    return res.status(400).json({
      error: 'Fragrância, cor/embalagem, email, telefone e quantidade são obrigatórios',
    });
  }

  const embalagemPresente = embalagem ? 1 : 0;
  const quantidadeInt = parseInt(quantidade, 10) || 1;

  db.run(
    `INSERT INTO product_customizations (fragrancia, embalagem_cor, email, telefone, quantidade, embalagem_presente, mensagem) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      fragrancia,
      embalagem_cor,
      email,
      telefone,
      quantidadeInt,
      embalagemPresente,
      mensagem || null,
    ],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Erro ao salvar pedido: ' + err.message });
      }
      res.json({ message: 'Pedido de personalização salvo com sucesso!', id: this.lastID });
    },
  );
});

// Endpoint para obter todos os pedidos de personalização
app.get('/personalizations', (req, res) => {
  db.all(`SELECT * FROM product_customizations ORDER BY data_pedido DESC`, (err, rows) => {
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
