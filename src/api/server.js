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

const verificarTokenAdm = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Não autorizado. Token não encontrado.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token inválido.' });
    }

    // Verifica se o token pertence a um administrador
    db.get('SELECT * FROM adm WHERE id_adm = ?', [decoded.id], (err, adm) => {
      if (err) return res.status(500).json({ message: 'Erro interno do servidor.' });
      if (!adm) return res.status(403).json({ message: 'Não autorizado. Acesso restrito a administradores.' });

      req.userId = decoded.id; // Adiciona o ID do administrador no request
      next();
    });
  });
};


// Middleware para verificar o token JWT
const verificarToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Não autorizado.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token inválido.' });
    }
    req.userId = decoded.id; // Armazena o ID do usuário decodificado na requisição
    next();
  });
};


// Função para verificar as credenciais do usuário
const verificarCredenciaisUsuario = (email, senha, callback) => {
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


// Endpoint para verificar o usuário logado
app.get('/api/usuarios/me', verificarToken, (req, res) => {
  db.get('SELECT * FROM usuario WHERE id_usuario = ?', [req.userId], (err, usuario) => {
    if (err) return res.status(500).json({ message: 'Erro interno do servidor.' });
    res.json(usuario);
  });
});

// Função para verificar as credenciais do administrador
const verificarCredenciaisADM = (user, senha, callback) => {
  // Busca o administrador pelo username no banco de dados
  db.get('SELECT * FROM adm WHERE user = ?', [user], (err, row) => {
    if (err) return callback(err);

    if (!row) {
      return callback(null, null); // Administrador não encontrado
    }

    // Comparação da senha fornecida com a senha armazenada (criptografada)
    bcrypt.compare(senha, row.senha, (err, isPasswordMatch) => {
      if (err) return callback(err);
      if (isPasswordMatch) {
        return callback(null, row); // Credenciais corretas
      } else {
        return callback(null, null); // Senha incorreta
      }
    });
  });
};

app.post('/api/login', (req, res) => {
  const { userOrEmail, senha } = req.body;

  // Verifica credenciais de administrador
  verificarCredenciaisADM(userOrEmail, senha, (err, adm) => {
    if (err) return res.status(500).json({ message: 'Erro interno do servidor.' });
    if (adm) {
      const token = jwt.sign({ id: adm.id_adm, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 3600000,
      });

      return res.status(200).json({
        message: 'Login bem-sucedido como administrador!',
        token,
        role: 'admin', // Inclua o role explicitamente
      });
    }

    // Verifica credenciais de usuário
    verificarCredenciaisUsuario(userOrEmail, senha, (err, usuario) => {
      if (err) return res.status(500).json({ message: 'Erro interno do servidor.' });
      if (usuario) {
        const token = jwt.sign({ id: usuario.id_usuario, role: 'user' }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'Strict',
          maxAge: 3600000,
        });

        return res.status(200).json({
          message: 'Login bem-sucedido como usuário!',
          token,
          role: 'user', // Inclua o role explicitamente
        });
      }

      return res.status(401).json({ message: 'Credenciais inválidas.' });
    });
  });
});


// Endpoint para verificar o adm logado
app.get('/api/adms/me', verificarTokenAdm, (req, res) => {
  db.get('SELECT * FROM adm WHERE id_adm = ?', [req.userId], (err, adm) => {
    if (err) return res.status(500).json({ message: 'Erro interno do servidor.' });
    if (!adm) return res.status(404).json({ message: 'Administrador não encontrado.' });
    res.json(adm);
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

// Rota de cadastro de novo administrador
app.post('/adm/novo', verificarTokenAdm, async (req, res) => {
  const { nome, user, senha, conf_senha } = req.body;

  // Verifica se a senha e a confirmação da senha são iguais
  if (senha !== conf_senha) {
    return res.status(400).json({ message: 'As senhas não coincidem.' });
  }

  // Verifica se o usuário já existe no banco de dados
  db.get('SELECT user FROM adm WHERE user = ?', [user], (err, row) => {
    if (err) return res.status(500).json({ message: 'Erro interno do servidor.' });

    if (row) {
      return res.status(409).json({ message: 'Usuário já existe.' }); // Usuário já cadastrado
    }

    // Criptografa a senha
    bcrypt.hash(senha, 10, (err, hashedPassword) => {
      if (err) return res.status(500).json({ message: 'Erro ao criptografar a senha.' });

      // Insere o novo administrador no banco de dados
      db.run(
        'INSERT INTO adm (nome, user, senha) VALUES (?, ?, ?)',
        [nome, user, hashedPassword],
        function (err) {
          if (err) return res.status(500).json({ message: 'Erro ao cadastrar administrador.' });

          return res.status(201).json({ message: 'Administrador cadastrado com sucesso!', id_adm: this.lastID });
        }
      );
    });
  });
});

// Rota de logout
app.post('/api/logout', (req, res) => {
  res.clearCookie('token'); // Limpa o cookie do token
  return res.status(200).json({ message: 'Logout bem-sucedido.' });
});

// Rota para listar todos os usuários
app.get('/usuarios', verificarTokenAdm, (req, res) => {
  db.all('SELECT * FROM usuario', [], (err, usuarios) => {
    if (err) return res.status(500).json({ message: 'Erro ao listar usuários.' });
    res.json({ result: { usuarios } });  // Modificado para ter a chave "result.usuarios"
  });
});

// Rota para listar todos os adms
app.get('/adms', verificarTokenAdm, (req, res) => {
  db.all('SELECT * FROM adm', [], (err, adms) => {
    if (err) return res.status(500).json({ message: 'Erro ao listar usuários.' });
    res.json({ result: { adms } });  // Modificado para ter a chave "result.usuarios"
  });
});

// Rota para listar todos os servicos
app.get('/servicos', verificarTokenAdm, (req, res) => {
  db.all('SELECT * FROM servico', [], (err, servicos) => {
    if (err) return res.status(500).json({ message: 'Erro ao listar usuários.' });
    res.json({ result: { servicos } });  // Modificado para ter a chave "result.usuarios"
  });
});

// Rota para editar um usuário
app.put('/usuarios/:id_usuario', verificarTokenAdm, (req, res) => {
  const { id_usuario } = req.params;
  const { nome, email, idade, senha } = req.body;
  const usuarioAtualizado = { nome, email, idade };

  const existingUser =  db.get('SELECT * FROM usuario WHERE email = ?', [email]);
  if (existingUser) {
    return res.status(409).send({ message: 'Email já existe.' });
  }
  res.status(200).send({ message: 'Email disponível.' });
  // Se a senha foi fornecida, atualizar a senha após criptografá-la
  if (senha) {
    bcrypt.hash(senha, 10, (err, hashedPassword) => {
      if (err) {
        return res.status(500).json({ message: 'Erro ao gerar hash da senha.' });
      }
      usuarioAtualizado.senha = hashedPassword;

      // Atualiza o usuário no banco de dados
      db.run('UPDATE usuario SET nome = ?, email = ?, idade = ?, senha = ? WHERE id_usuario = ?', 
        [usuarioAtualizado.nome, usuarioAtualizado.email, usuarioAtualizado.idade, usuarioAtualizado.senha, id_usuario], 
        function (err) {
          if (err) return res.status(500).json({ message: 'Erro ao atualizar usuário.' });
          res.json({ message: 'Usuário atualizado com sucesso!' });
        });
    });
  } else {
    // Se não houver senha, apenas atualiza os outros campos
    db.run('UPDATE usuario SET nome = ?, email = ?, idade = ? WHERE id_usuario = ?', 
      [usuarioAtualizado.nome, usuarioAtualizado.email, usuarioAtualizado.idade, id_usuario], 
      function (err) {
        if (err) return res.status(500).json({ message: 'Erro ao atualizar usuário.' });
        res.json({ message: 'Usuário atualizado com sucesso!' });
      });
  }
});



// Rota para editar um adm
app.put('/adms/:id_adm', verificarTokenAdm, (req, res) => {
  const { id_adm } = req.params;
  const { nome, user } = req.body;
  const admAtualizado = { nome, user };

  const existingAdmin = db.get('SELECT * FROM adm WHERE user = ?', [user]);
  if (existingAdmin) {
    return res.status(409).send({ message: 'Usuário já existe.' });
  }
  res.status(200).send({ message: 'Usuário disponível.' });
  db.run('UPDATE adm SET nome = ?, user = ? WHERE id_adm = ?',
    [admAtualizado.nome, admAtualizado.user, id_adm],
    function (err) {
      if (err) return res.status(500).json({ message: 'Erro ao atualizar adm.' });
      res.json({ message: 'Adm atualizado com sucesso!' });
    });
});

// Rota para cadastro de novo serviço
app.post('/servicos/novo', verificarTokenAdm,(req, res) => {
  const { tamanho, complexidade, cores, preco } = req.body;
  // Verifica se todos os campos foram fornecidos e possuem valores válidos
  if (!tamanho || !complexidade || !cores || !preco) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  // Insere o novo serviço no banco de dados
  db.run(
    'INSERT INTO servico (tamanho, complexidade, cores, preco) VALUES (?, ?, ?, ?)',
    [tamanho, complexidade, cores, preco],
    function (err) {
      if (err) {
        console.error("Erro ao inserir no banco de dados:", err);  // Log para depuração
        return res.status(500).json({ message: 'Erro ao cadastrar serviço.' });
      }
      console.log("Serviço cadastrado com sucesso:", { tamanho, complexidade, cores, preco });
      return res.status(201).json({ message: 'Serviço cadastrado com sucesso!', id_servico: this.lastID });
    }
  );
});

// Rota para editar um servico
app.put('/servicos/:id_servico', verificarTokenAdm, (req, res) => {
  const { id_servico } = req.params;
  const { tamanho, complexidade, cores, preco } = req.body;

  const servicoAtualizado = { tamanho, complexidade, cores, preco };

  db.run('UPDATE servico SET tamanho = ?, compexidade = ?, cores = ?, preco = ? WHERE id_servico = ?',
    [servicoAtualizado.tamanho, servicoAtualizado.complexidade, servicoAtualizado.cores, servicoAtualizado.preco, id_servico],
    function (err) {
      if (err) return res.status(500).json({ message: 'Erro ao atualizar serviço.' });
      res.json({ message: 'Serviço atualizado com sucesso!' });
    });
});


// Rota para excluir um usuário por ID
app.delete('/usuarios/:id_usuario', verificarTokenAdm, (req, res) => {
  const { id_usuario } = req.params;
  db.run('DELETE FROM usuario WHERE id_usuario = ?', [id_usuario], function (err) {
    if (err) return res.status(500).json({ message: 'Erro ao excluir usuário.' });
    res.json({ message: 'Usuário excluído com sucesso!' });
  });
});

// Rota para excluir um adm por ID
app.delete('/adms/:id_adm', (req, res) => {
  const { id_adm } = req.params;
  db.run('DELETE FROM adm WHERE id_adm = ?', [id_adm], function (err) {
    if (err) return res.status(500).json({ message: 'Erro ao excluir adm.' });
    res.json({ message: 'Adms excluído com sucesso!' });
  });
});


// Rota para excluir um servico por ID
app.delete('/servicos/:id_servico', verificarTokenAdm, (req, res) => {
  const { id_servico } = req.params;
  db.run('DELETE FROM servico WHERE id_servico = ?', [id_servico], function (err) {
    if (err) return res.status(500).json({ message: 'Erro ao excluir serviço.' });
    res.json({ message: 'Serviço excluído com sucesso!' });
  });
});


// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
