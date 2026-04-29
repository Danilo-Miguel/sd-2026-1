// Importa o módulo Express para criar o servidor HTTP
const express = require("express");
// Cria a instância do aplicativo Express
const app = express();

// Habilita parsing automático de JSON no corpo das requisições
app.use(express.json());

// Armazena temporariamente os usuários e pedidos em memória (simulando um banco de dados simples)
let usuarios = [];
let pedidos = [];

// Endpoint POST /usuarios: Cria um novo usuário
// Recebe os dados do usuário no corpo da requisição (JSON)
// Atribui um ID sequencial único ao usuário
// Retorna o usuário criado com status 201
app.post("/usuarios", (req, res) => {
    const usuario = req.body;

    usuario.id = usuarios.length + 1;
    usuarios.push(usuario);

    res.status(201).json({ message: "Usuário criado com sucesso", usuario });
});

// Endpoint GET /usuarios: Retorna a lista de todos os usuários cadastrados
// Não requer parâmetros, retorna todos os usuários em memória
app.get("/usuarios", (req, res) => {
    res.status(200).json({ usuarios });
});

// Endpoint GET /usuarios/:id: Retorna um usuário específico pelo ID
// O ID é passado como parâmetro na URL
// Se o usuário não for encontrado, retorna erro 404
app.get("/usuarios/:id", (req, res) => {
    const id = parseInt(req.params.id, 10);
    const usuario = usuarios.find(u => u.id === id);

    if (!usuario) {
        return res.status(404).json({ message: "Usuário não encontrado" });
    }

    res.status(200).json({ usuario });
});

// Endpoint PUT /usuarios/:id: Atualiza completamente um usuário existente
// Recebe os novos dados no corpo da requisição
// Substitui todos os dados do usuário, mantendo o ID original
// Se o usuário não existir, retorna erro 404
app.put("/usuarios/:id", (req, res) => {
    const id = parseInt(req.params.id, 10);
    const usuarioIndex = usuarios.findIndex(u => u.id === id);

    if (usuarioIndex === -1) {
        return res.status(404).json({ message: "Usuário não encontrado" });
    }

    usuarios[usuarioIndex] = { ...req.body, id};

    res.status(200).json({ message: "Usuário atualizado completamente", usuario: usuarios[usuarioIndex] });
});

// Endpoint PATCH /usuarios/:id: Atualiza parcialmente um usuário existente
// Recebe apenas os campos a serem atualizados no corpo da requisição
// Mescla os novos dados com os existentes, mantendo o ID
// Se o usuário não existir, retorna erro 404
app.patch("/usuarios/:id", (req, res) => {
    const id = parseInt(req.params.id, 10);
    const usuarioIndex = usuarios.findIndex(u => u.id === id);

    if (usuarioIndex === -1) {
        return res.status(404).json({ message: "Usuário não encontrado" });
    }

    usuarios[usuarioIndex] = { ...usuarios[usuarioIndex], ...req.body};

    res.status(200).json({ message: "Usuário atualizado parcialmente", usuario: usuarios[usuarioIndex] });
});

// Endpoint DELETE /usuarios/:id: Remove um usuário pelo ID
// Remove o usuário da lista em memória
// Retorna o usuário excluído
// Se o usuário não existir, retorna erro 404
app.delete("/usuarios/:id", (req, res) => {
    const id = parseInt(req.params.id, 10);
    const usuarioIndex = usuarios.findIndex(u => u.id === id);

    if (usuarioIndex === -1) {
        return res.status(404).json({ message: "Usuário não encontrado" });
    }

    const usuarioExcluido = usuarios.splice(usuarioIndex, 1);

    res.status(200).json({ message: "Usuário excluído", usuario: usuarioExcluido[0] });
});

// Endpoint POST /pedidos: Cria um novo pedido
// Similar ao usuário, atribui ID sequencial
// Armazena em memória
app.post("/pedidos", (req, res) => {
    const pedido = req.body;

    pedido.id = pedidos.length + 1;
    pedidos.push(pedido);

    res.status(201).json({ message: "Pedido criado com sucesso", pedido });
});

// Endpoint GET /pedidos: Retorna todos os pedidos cadastrados
app.get("/pedidos", (req, res) => {
    res.status(200).json({ pedidos });
});

// Endpoint GET /dados: Retorna os dados completos de usuários e pedidos
// Útil para visualizar todo o estado da aplicação
app.get("/dados", (req, res) => {
    res.status(200).json({ usuarios, pedidos });
});

// Inicia o servidor na porta 3000
// Exibe mensagem no console quando o servidor estiver rodando
app.listen(3000, () => console.log("Servidor rodando na porta 3000"));