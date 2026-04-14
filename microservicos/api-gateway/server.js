// ==================================================
// API GATEWAY
// ==================================================
//
// Conceito:
// Em microsservicos, o cliente pode falar com N servicos diferentes,
// mas isso complica o front-end e aumenta o acoplamento.
// O API Gateway centraliza o acesso.
//
// Cliente -> API Gateway -> servicos internos
//
// Vantagens do gateway:
// - ponto unico de entrada
// - roteamento centralizado
// - esconder portas internas dos servicos
// - lugar ideal para auth, logs, rate-limit e cache
//
// Porta padrao: 4000

const express = require("express")
const app = express()

app.use(express.json())

const USUARIOS_SERVICE_URL = process.env.USUARIOS_SERVICE_URL || "http://localhost:4001"
const PEDIDOS_SERVICE_URL = process.env.PEDIDOS_SERVICE_URL || "http://localhost:4002"

// Funcao helper para encaminhar requisicoes para outro servico.
async function encaminhar(req, res, destinoBaseUrl, caminho) {
    const url = destinoBaseUrl + caminho

    // Monta opcoes da requisicao encaminhada.
    const opcoes = {
        method: req.method,
        headers: { "Content-Type": "application/json" }
    }

    // Envia body apenas para metodos que normalmente usam corpo.
    if (req.method === "POST" || req.method === "PUT" || req.method === "PATCH") {
        opcoes.body = JSON.stringify(req.body)
    }

    try {
        const resposta = await fetch(url, opcoes)
        const texto = await resposta.text()

        // Tenta devolver JSON quando possivel.
        try {
            const dados = JSON.parse(texto)
            return res.status(resposta.status).json(dados)
        } catch (erro) {
            return res.status(resposta.status).send(texto)
        }
    } catch (erro) {
        return res.status(502).json({ erro: "falha ao acessar servico interno", detalhe: erro.message })
    }
}

app.get("/health", function(req, res) {
    res.status(200).json({ servico: "api-gateway", status: "ok" })
})

// ------------------------------
// Rotas de usuarios (pass-through)
// ------------------------------
app.post("/usuarios", function(req, res) {
    return encaminhar(req, res, USUARIOS_SERVICE_URL, "/usuarios")
})

app.get("/usuarios", function(req, res) {
    return encaminhar(req, res, USUARIOS_SERVICE_URL, "/usuarios")
})

app.get("/usuarios/:id", function(req, res) {
    return encaminhar(req, res, USUARIOS_SERVICE_URL, "/usuarios/" + req.params.id)
})

app.put("/usuarios/:id", function(req, res) {
    return encaminhar(req, res, USUARIOS_SERVICE_URL, "/usuarios/" + req.params.id)
})

app.patch("/usuarios/:id", function(req, res) {
    return encaminhar(req, res, USUARIOS_SERVICE_URL, "/usuarios/" + req.params.id)
})

app.delete("/usuarios/:id", function(req, res) {
    return encaminhar(req, res, USUARIOS_SERVICE_URL, "/usuarios/" + req.params.id)
})

// ------------------------------
// Rotas de pedidos (pass-through)
// ------------------------------
app.post("/pedidos", function(req, res) {
    return encaminhar(req, res, PEDIDOS_SERVICE_URL, "/pedidos")
})

app.get("/pedidos", function(req, res) {
    return encaminhar(req, res, PEDIDOS_SERVICE_URL, "/pedidos")
})

app.get("/pedidos/:id", function(req, res) {
    return encaminhar(req, res, PEDIDOS_SERVICE_URL, "/pedidos/" + req.params.id)
})

app.get("/pedidos/usuario/:usuarioId", function(req, res) {
    return encaminhar(req, res, PEDIDOS_SERVICE_URL, "/pedidos/usuario/" + req.params.usuarioId)
})

app.delete("/pedidos/:id", function(req, res) {
    return encaminhar(req, res, PEDIDOS_SERVICE_URL, "/pedidos/" + req.params.id)
})

// Endpoint agregado: junta dados de mais de um servico.
app.get("/dados", async function(req, res) {
    try {
        const respUsuarios = await fetch(USUARIOS_SERVICE_URL + "/usuarios")
        const respPedidos = await fetch(PEDIDOS_SERVICE_URL + "/pedidos")

        const usuarios = await respUsuarios.json()
        const pedidos = await respPedidos.json()

        return res.status(200).json({ usuarios: usuarios, pedidos: pedidos })
    } catch (erro) {
        return res.status(502).json({ erro: "falha ao montar dados agregados", detalhe: erro.message })
    }
})

const PORTA = process.env.PORT || 4000
app.listen(PORTA, function() {
    console.log("[api-gateway] rodando em http://localhost:" + PORTA)
    console.log("[api-gateway] usuarios-service -> " + USUARIOS_SERVICE_URL)
    console.log("[api-gateway] pedidos-service  -> " + PEDIDOS_SERVICE_URL)
})
