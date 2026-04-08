// Importando o módulo Express para criar o servidor web
const express = require("express");
// Criando uma instância do aplicativo Express
const app = express();

// Middleware para permitir o parsing de JSON no corpo das requisições
app.use(express.json());

// Arrays para armazenar dados temporariamente (em memória)
let usuarios = [];
let pedidos = [];

// Endpoint POST para criar um novo usuário
app.post("/usuarios", (req, res) => {
    const usuario = req.body;
    usuarios.push(usuario);
    res.send({ message: "Usuário criado com sucesso: ", usuario})
})

// Endpoint POST para criar um novo pedido
app.post("/pedidos", (req, res) => {
    const pedido = req.body;
    pedidos.push(pedido);
    // Nota: A mensagem de resposta está incorreta, deveria ser "Pedido criado com sucesso"
    res.send({ message: "Usuário criado com sucesso: ", pedido})
})

// Endpoint GET para listar usuários e pedidos
app.get("/dados", (req, res) => {
    res.send({ usuarios, pedidos})
})

// Iniciando o servidor na porta 3000
app.listen(3000, () => console.log("Servidor rodando na porta 3000"))