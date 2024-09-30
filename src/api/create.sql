CREATE TABLE usuario (
    id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    idade INT NOT NULL,
    senha TEXT NOT NULL
);
