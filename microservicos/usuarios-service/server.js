// ==================================================
// MICROSSERVICO DE USUARIOS
// ==================================================
//
// Conceito:
// Em microsservicos, cada dominio de negocio tem seu proprio servico.
// Este servico e responsavel SOMENTE por usuarios.
//
// Responsabilidades deste servico:
// - cadastrar usuarios
// - listar usuarios
// - buscar usuario por id
// - atualizar usuario (PUT/PATCH)
// - remover usuario
//
// Porta padrao: 4001

const express = require("express")
const app = express()

app.use(express.json())

// Banco em memoria apenas para estudo.
// Em producao, cada servico teria seu proprio banco de dados real.
let usuarios = []

// Health-check: endpoint simples para saber se o servico esta vivo.
app.get("/health", function(req, res) {
    res.status(200).json({ servico: "usuarios", status: "ok" })
})

// POST /usuarios - cria um usuario.
app.post("/usuarios", function(req, res) {
    const nome = req.body.nome
    const email = req.body.email
    const idade = req.body.idade

    if (!nome || !email) {
        return res.status(400).json({ erro: "nome e email sao obrigatorios" })
    }

    const usuario = {
        id: usuarios.length + 1,
        nome: nome,
        email: email,
        idade: idade
    }

    usuarios.push(usuario)
    res.status(201).json({ message: "usuario criado", usuario: usuario })
})

// GET /usuarios - lista todos.
app.get("/usuarios", function(req, res) {
    res.status(200).json(usuarios)
})

// GET /usuarios/:id - busca um por id.
app.get("/usuarios/:id", function(req, res) {
    const id = parseInt(req.params.id)
    const usuario = usuarios.find(function(u) { return u.id === id })

    if (!usuario) {
        return res.status(404).json({ erro: "usuario nao encontrado" })
    }

    res.status(200).json(usuario)
})

// PUT /usuarios/:id - substitui usuario inteiro.
app.put("/usuarios/:id", function(req, res) {
    const id = parseInt(req.params.id)
    const index = usuarios.findIndex(function(u) { return u.id === id })

    if (index === -1) {
        return res.status(404).json({ erro: "usuario nao encontrado" })
    }

    const nome = req.body.nome
    const email = req.body.email
    const idade = req.body.idade

    if (!nome || !email) {
        return res.status(400).json({ erro: "nome e email sao obrigatorios no PUT" })
    }

    usuarios[index] = {
        id: id,
        nome: nome,
        email: email,
        idade: idade
    }

    res.status(200).json({ message: "usuario atualizado (PUT)", usuario: usuarios[index] })
})

// PATCH /usuarios/:id - atualiza parcialmente.
app.patch("/usuarios/:id", function(req, res) {
    const id = parseInt(req.params.id)
    const index = usuarios.findIndex(function(u) { return u.id === id })

    if (index === -1) {
        return res.status(404).json({ erro: "usuario nao encontrado" })
    }

    // Atualiza apenas os campos enviados.
    if (req.body.nome !== undefined) {
        usuarios[index].nome = req.body.nome
    }

    if (req.body.email !== undefined) {
        usuarios[index].email = req.body.email
    }

    if (req.body.idade !== undefined) {
        usuarios[index].idade = req.body.idade
    }

    res.status(200).json({ message: "usuario atualizado (PATCH)", usuario: usuarios[index] })
})

// DELETE /usuarios/:id - remove usuario.
app.delete("/usuarios/:id", function(req, res) {
    const id = parseInt(req.params.id)
    const index = usuarios.findIndex(function(u) { return u.id === id })

    if (index === -1) {
        return res.status(404).json({ erro: "usuario nao encontrado" })
    }

    const removido = usuarios.splice(index, 1)
    res.status(200).json({ message: "usuario removido", usuario: removido[0] })
})

const PORTA = process.env.PORT || 4001
app.listen(PORTA, function() {
    console.log("[usuarios-service] rodando em http://localhost:" + PORTA)
})
