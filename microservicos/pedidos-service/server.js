// ==================================================
// MICROSSERVICO DE PEDIDOS
// ==================================================
//
// Conceito:
// Este servico cuida apenas do dominio "pedidos".
// Ele precisa conversar com usuarios-service para validar se
// o usuarioId informado no pedido realmente existe.
//
// Comunicacao entre servicos:
// pedidos-service -> usuarios-service
//
// Porta padrao: 4002

const express = require("express")
const app = express()

app.use(express.json())

let pedidos = []

// URL do servico de usuarios (pode ser alterada por variavel de ambiente).
const USUARIOS_SERVICE_URL = process.env.USUARIOS_SERVICE_URL || "http://localhost:4001"

app.get("/health", function(req, res) {
    res.status(200).json({ servico: "pedidos", status: "ok" })
})

// Funcao utilitaria para checar se o usuario existe no usuarios-service.
async function usuarioExiste(usuarioId) {
    const url = USUARIOS_SERVICE_URL + "/usuarios/" + usuarioId

    try {
        const resposta = await fetch(url)
        return resposta.status === 200
    } catch (erro) {
        // Se o usuarios-service estiver fora do ar, tratamos como indisponivel.
        return null
    }
}

// POST /pedidos - cria pedido com validacao de usuario.
app.post("/pedidos", async function(req, res) {
    const produto = req.body.produto
    const quantidade = req.body.quantidade
    const usuarioId = req.body.usuarioId

    if (!produto || !quantidade || !usuarioId) {
        return res.status(400).json({ erro: "produto, quantidade e usuarioId sao obrigatorios" })
    }

    const existe = await usuarioExiste(usuarioId)

    if (existe === null) {
        return res.status(503).json({ erro: "usuarios-service indisponivel" })
    }

    if (existe === false) {
        return res.status(404).json({ erro: "usuario do pedido nao existe" })
    }

    const pedido = {
        id: pedidos.length + 1,
        produto: produto,
        quantidade: quantidade,
        usuarioId: usuarioId,
        criadoEm: new Date().toISOString()
    }

    pedidos.push(pedido)
    res.status(201).json({ message: "pedido criado", pedido: pedido })
})

// GET /pedidos - lista todos.
app.get("/pedidos", function(req, res) {
    res.status(200).json(pedidos)
})

// GET /pedidos/:id - busca por id.
app.get("/pedidos/:id", function(req, res) {
    const id = parseInt(req.params.id)
    const pedido = pedidos.find(function(p) { return p.id === id })

    if (!pedido) {
        return res.status(404).json({ erro: "pedido nao encontrado" })
    }

    res.status(200).json(pedido)
})

// GET /pedidos/usuario/:usuarioId - lista pedidos de um usuario.
app.get("/pedidos/usuario/:usuarioId", function(req, res) {
    const usuarioId = parseInt(req.params.usuarioId)

    const lista = pedidos.filter(function(p) {
        return p.usuarioId === usuarioId
    })

    res.status(200).json(lista)
})

// DELETE /pedidos/:id - remove pedido.
app.delete("/pedidos/:id", function(req, res) {
    const id = parseInt(req.params.id)
    const index = pedidos.findIndex(function(p) { return p.id === id })

    if (index === -1) {
        return res.status(404).json({ erro: "pedido nao encontrado" })
    }

    const removido = pedidos.splice(index, 1)
    res.status(200).json({ message: "pedido removido", pedido: removido[0] })
})

const PORTA = process.env.PORT || 4002
app.listen(PORTA, function() {
    console.log("[pedidos-service] rodando em http://localhost:" + PORTA)
    console.log("[pedidos-service] usando usuarios-service em " + USUARIOS_SERVICE_URL)
})
