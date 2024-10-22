// src/api/server.js
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
require('dotenv').config(); // Importa as variáveis de ambiente

const app = express();
const db = new sqlite3.Database('./users.db'); // Conecta ao banco de dados SQLite

app.use(cors({ credentials: true, origin: 'http://localhost:5173' })); // Permite requisições de outros domínios
app.use(express.json()); // Use express.json() em vez de body-parser
app.use(cookieParser());


// Função para verificar as credenciais do usuário utilizando bcrypt.compare
const verificarCredenciais = (email, senha, callback) => {
  db.get('SELECT * FROM usuario WHERE email = ?', [email], (err, row) => {
    if (err) return callback(err);
    if (!row) return callback(null, null); // Usuário não encontrado

    bcrypt.compare(senha, row.senha, (err, isMatch) => {
      if (err) return callback(err);
      if (isMatch) {
        return callback(null, row); // Credenciais corretas
      } else {
        return callback(null, null); // Senha incorreta
      }
    });
  });
};

// Rota de login
app.post('/api/login', (req, res) => {
  const { email, senha } = req.body;

  verificarCredenciais(email, senha, (err, usuario) => {
    if (err) return res.status(500).json({ message: 'Erro interno do servidor.' });
    if (!usuario) return res.status(401).json({ message: 'Credenciais inválidas.' });

    const token = jwt.sign({ id: usuario.id_usuario }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Configure o cookie com o token
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use HTTPS em produção
      sameSite: 'Strict', // Ou 'Lax'
      maxAge: 3600000, // 1 hora
    });

    return res.status(200).json({ message: 'Login bem-sucedido!', token }); // Incluindo token na resposta
  });
});

// Endpoint para verificar o usuário logado
app.get('/api/usuarios/me', (req, res) => {
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ message: 'Não autorizado.' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Token inválido.' });

    db.get('SELECT * FROM usuario WHERE id_usuario = ?', [decoded.id], (err, usuario) => {
      if (err) return res.status(500).json({ message: 'Erro interno do servidor.' });
      res.json(usuario);
    });
  });
});

// Rota para cadastrar um novo usuário
app.post('/usuarios/novo', (req, res) => {
  const { nome, email, idade, senha } = req.body;

  // Verifique se o email já está cadastrado
  db.get('SELECT * FROM usuario WHERE email = ?', [email], (err, row) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao verificar email.' });
    }
    if (row) {
      return res.status(400).json({ message: 'Email já cadastrado.' });
    }

    // Hash da senha antes de salvar no banco de dados
    bcrypt.hash(senha, 10, (err, hashedPassword) => {
      if (err) {
        return res.status(500).json({ message: 'Erro ao gerar hash da senha.' });
      }

      // Inserir o novo usuário com a senha criptografada
      db.run('INSERT INTO usuario (nome, email, idade, senha) VALUES (?, ?, ?, ?)', [nome, email, idade, hashedPassword], function (err) {
        if (err) {
          return res.status(500).json({ message: 'Erro ao cadastrar usuário.' });
        }
        return res.status(201).json({ id: this.lastID, message: 'Usuário cadastrado com sucesso!' });
      });
    });
  });
});

// Rota para listar todos os usuários (protegida por autenticação)
app.get('/usuarios', (req, res) => {
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ message: 'Não autorizado.' });

  jwt.verify(token, process.env.JWT_SECRET, (err) => {
    if (err) return res.status(401).json({ message: 'Token inválido.' });

    db.all('SELECT id_usuario, nome, email, idade FROM usuario', [], (err, rows) => {
      if (err) return res.status(500).json({ message: 'Erro interno do servidor.' });
      res.json({ usuarios: rows });
    });
  });
});

// Rota para deletar um usuário por ID (protegida por autenticação)
app.delete('/usuarios/:id_usuario', (req, res) => {
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ message: 'Não autorizado.' });

  jwt.verify(token, process.env.JWT_SECRET, (err) => {
    if (err) return res.status(401).json({ message: 'Token inválido.' });

    const { id_usuario } = req.params;
    db.run('DELETE FROM usuario WHERE id_usuario = ?', id_usuario, function (err) {
      if (err) return res.status(500).json({ message: 'Erro ao deletar usuário.' });
      res.json({ message: 'Usuário deletado com sucesso!' });
    });
  });
});

// Inicie o servidor
const httpPort = 3000; // Porta do servidor HTTP
app.listen(httpPort, () => {
  console.log(`Servidor HTTP rodando na porta ${httpPort}`);
});
