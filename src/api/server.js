const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const sqlite3 = require('sqlite3').verbose();
const bcrypt = require("bcryptjs")

const app = express();
app.use(express.json());
const port = 3000;

app.use(cors());

app.use(bodyParser.json());

app.get('/usuarios', (req, res) => {
    let db = new sqlite3.Database('./users.db', (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Conectou no banco de dados!');
    });

    // Seleciona todos os usuários da tabela 'usuario'
    db.all('SELECT * FROM usuario', [], (err, rows) => {
        if (err) {
            return res.status(500).json({
                status: 'failed',
                message: 'Erro ao consultar o banco de dados!',
                error: err.message
            });
        }

        // Fecha a conexão com o banco de dados
        db.close((err) => {
            if (err) {
                return console.error(err.message);
            }
            console.log('Fechou a conexão com o banco de dados.');
        });

        // Retorna os dados dos usuários em formato JSON
        res.status(200).json({
            status: 'success',
            usuarios: rows
        });
    });
});


app.post('/usuarios/novo', (req, res) => {
    const { nome, email, idade, senha, conf_senha } = req.body;
    console.log(req);
    // Aqui começa a validação dos campos do formulário
    let erro = "";
    if (nome.length < 1 || email.length < 1 || idade.length < 1 || senha.length < 1 || conf_senha.length < 1) {
        erro += 'Por favor, preencha todos os campos corretamente!';
    }
    if (senha != conf_senha) {
        erro += 'As senhas digitadas não são iguais!';
    }
    if (erro) {
        res.status(500).json({
            status: 'failed',
            message: erro,
        });
    } else {
        // aqui começa o código para inserir o registro no banco de dados
        let db = new sqlite3.Database('./users.db', (err) => {
            if (err) {
                return console.error(err.message);
            }
            console.log('Conectou no banco de dados!');
        });
        db.get('SELECT email FROM usuario WHERE email = ?', [email], async(error, result) => {
            if (error) {
                console.log(error)
            } else if (result) {
                db.close((err) => {
                    if (err) {
                        return console.error(err.message);
                    }
                    console.log('Fechou a conexão com o banco de dados.');
                });
                return res.status(500).json({
                    status: 'failed',
                    message: 'Este e-mail já está em uso!',
                });
            } else {
                let senha_criptografada = await bcrypt.hash(senha, 8)
                db.run('INSERT INTO usuario(nome, email, idade, senha) VALUES (?, ?, ?, ?)', [nome,
                    email, idade, senha_criptografada
                ], (error2) => {
                    if (error2) {
                        console.log(error2)
                    } else {
                        db.close((err) => {
                            if (err) {
                                return console.error(err.message);
                            }
                            console.log('Fechou a conexão com o banco de dados.');
                        });
                        return res.status(200).json({
                            status: 'success',
                            message: 'Registro feito com sucesso!',
                            campos: req.body
                        });
                    }
                });
            }
        });
    }
});

app.delete('/usuarios/:id_usuario', (req, res) => {
    const { id_usuario } = req.params;

    // Conectar ao banco de dados SQLite
    let db = new sqlite3.Database('./users.db', (err) => {
        if (err) {
            return res.status(500).json({
                status: 'failed',
                message: 'Erro ao conectar ao banco de dados!',
                error: err.message
            });
        }
        console.log('Conectou no banco de dados!');
    });

    // Deletar o usuário pelo ID
    db.run('DELETE FROM usuario WHERE id_usuario = ?', [id_usuario], function(err) {
        if (err) {
            return res.status(500).json({
                status: 'failed',
                message: 'Erro ao tentar remover o usuário ${id_usuario}!',
                error: err.message
            });
        }
        // Fechar a conexão com o banco de dados
        db.close((err) => {
            if (err) {
                return console.error(err.message);
            }
            console.log('Fechou a conexão com o banco de dados.');
        });

        // Retornar uma resposta de sucesso
        return res.status(200).json({
            status: 'success',
            message: `Usuário com id ${id_usuario} removido com sucesso!`
        });
    });
});





//Rota para verificação de Login
app.post('/login', (req, res) => {
    const { email, senhaDigitada } = req.body;
  
    const sql = 'SELECT * FROM usuario WHERE email = ?';
    db.get(sql, [email], async (err, row) => {
      if (err) {
        return res.status(500).json({ message: 'Erro ao acessar o banco de dados.' });
      }
      if (!row) {
        return res.status(401).json({ message: 'Usuário não encontrado.' });
      }
  
      const match = await bcrypt.compare(senhaDigitada, row.senha);
      if (match) {
        return res.status(200).json({ message: 'Login bem-sucedido!' });
      } else {
        return res.status(401).json({ message: 'Senha incorreta.' });
      }
    });
  });
  





        app.listen(port, () => {
            console.log(`Example app listening at http://localhost:${port}`);
        });