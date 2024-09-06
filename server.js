const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));
app.use(cookieParser());
app.use(session({
    secret: 'seu-segredo-aqui',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Para HTTPS, altere para true
}));

// Rota para servir a página de cadastro
app.get('/cadastro', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'formulario.html'));
});

// Rota para servir a página de login
app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Rota para servir a página de agendamento
app.get('/agendamento.html', (req, res) => {
    if (req.session.loggedin) {
        res.sendFile(path.join(__dirname, 'public', 'agendamento.html'));
    } else {
        res.redirect('/login.html');
    }
});

// Rota de Log-Out
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ status: 'failed', message: 'Erro ao encerrar sessão.' });
        }
        res.redirect('/login.html');
    });
});


// Rota para checar sessao ativa
app.get('/check-session', (req, res) => {
    if (req.session.loggedin) {
        res.json({ loggedin: true });
    } else {
        res.json({ loggedin: false });
    }
});


app.post('/registra-usuario', (req, res) => {
    const { nome, email, idade, senha, conf_senha } = req.body;
    let erro = "";
    if (nome.length < 1 || email.length < 1 || senha.length < 1 || conf_senha.length < 1) {
        erro += 'Por favor, preencha todos os campos corretamente!<br>';
    }
    if (senha !== conf_senha) {
        erro += 'As senhas digitadas não são iguais!<br>';
    }
    if (erro) {
        res.status(200).json({
            status: 'failed',
            message: erro,
        });
    } else {
        let db = new sqlite3.Database('./db/bancoDeDados.db', (err) => {
            if (err) {
                return console.error(err.message);
            }
            console.log('Conectou no banco de dados!');
        });
        db.get('SELECT email FROM users WHERE email = ?', [email], async (error, result) => {
            if (error) {
                console.log(error);
            } else if (result) {
                db.close((err) => {
                    if (err) {
                        return console.error(err.message);
                    }
                    console.log('Fechou a conexão com o banco de dados.');
                });
                return res.status(200).json({
                    status: 'failed',
                    message: 'Este e-mail já está em uso!',
                });
            } else {
                let senha_criptografada = await bcrypt.hash(senha, 8);
                db.run('INSERT INTO users(nome, email, idade, senha) VALUES (?, ?, ?, ?)', [nome, email, idade, senha_criptografada], (error2) => {
                    if (error2) {
                        console.log(error2);
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
                        });
                    }
                });
            }
        });
    }
});

app.post('/login', (req, res) => {
    const { email, senha } = req.body;
    let db = new sqlite3.Database('./db/bancoDeDados.db', (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Conectou no banco de dados!');
    });
    db.get('SELECT senha FROM users WHERE email = ?', [email], async (error, result) => {
        if (error) {
            console.log(error);
            return res.status(200).json({
                status: 'failed',
                message: 'Erro ao verificar usuário.',
            });
        } else if (result && await bcrypt.compare(senha, result.senha)) {
            req.session.loggedin = true;
            db.close((err) => {
                if (err) {
                    return console.error(err.message);
                }
                console.log('Fechou a conexão com o banco de dados.');
            });
            return res.status(200).json({
                status: 'success',
                message: 'Login realizado com sucesso!',
            });
        } else {
            db.close((err) => {
                if (err) {
                    return console.error(err.message);
                }
                console.log('Fechou a conexão com o banco de dados.');
            });
            return res.status(200).json({
                status: 'failed',
                message: 'E-mail ou senha incorretos.',
            });
        }
    });
});

app.listen(PORT, () => {
    console.log('Servidor iniciado na porta', PORT);
});
