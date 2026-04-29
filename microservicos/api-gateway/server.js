const e = require("express")
const express = require("express")
const app = express()


app.use(express.json())

const USUARIO_SERVICE_URL =  process.env.USUARIO_SERVICE_URL || "http://localhost:4001"
const PEDIDO_SERVICE_URL =  process.env.PEDIDO_SERVICE_URL || "http://localhost:4002"

async function encaminhar(req, res, destinoBaseUrl, caminho) {
    const url = destinoBaseUrl + caminho

    const opcoes = {
        method: req.method,
        headers:{ "Content-Type": "application/json"}
    }
    

    if(req.method === "POST" || req.method === "PUT" || req.method ==="PATCH"){
        opcoes.body = JSON.stringify(req.body)
    }
    
    try{
        const resposta = await fetch(url, opcoes)
        const texto = await resposta.text


        try{
            const dados = JSON.parse(texto)
            return res.status(resposta.status).json(dados)

        }catch(erro){
            return res.status(resposta.status).send(texto)
        }
    }catch(erro){
        return res.status(502).json({erro: "Falha ao acessar o serviço interno", detalhe:erro.message})
    }
}



app.get("/health", function(req, res){
    res.status(200).json({servico: "user-service", status:"ok"})
})

app.get("/health", function(req, res){
    res.status(200).json({servico: "api-gateway", status:"ok"})
})


// Roats de usuários

app.post("/usuarios", function(req, res){
    return encaminhar(req, res, USUARIO_SERVICE_URL, "/usuarios")
})

app.get("/usuarios", function(req, res){
    return encaminhar(req, res, USUARIO_SERVICE_URL, "/usuarios")
})

app.get("/usuarios/:id", function(req, res){
    return encaminhar(req, res, USUARIO_SERVICE_URL, "/usuarios" + req.params.id)
})


app.put("/usuarios/:id", function(req, res){
    return encaminhar(req, res, USUARIO_SERVICE_URL, "/usuarios" + req.params.id)
})

app.patch("/usuarios/:id", function(req, res){
    return encaminhar(req, res, USUARIO_SERVICE_URL, "/usuarios" + req.params.id)
})

app.delete("/usuarios/:id", function(req, res){
    return encaminhar(req, res, USUARIO_SERVICE_URL, "/usuarios" + req.params.id)
})

// Rotas de pedidos

app.post("/pedidos", function(req, res){
    return encaminhar(req, res, PEDIDO_SERVICE_URL, "/pedidos")
})

app.get("/pedidos", function(req, res){
    return encaminhar(req, res, PEDIDO_SERVICE_URL, "/pedidos")
})

app.get("/pedidos/:id", function(req, res){
    return encaminhar(req, res, PEDIDO_SERVICE_URL, "/pedidos" + req.params.id)
})


app.put("/pedidos/:id", function(req, res){
    return encaminhar(req, res, PEDIDO_SERVICE_URL, "/pedidos" + req.params.id)
})

app.patch("/pedidos/:id", function(req, res){
    return encaminhar(req, res, PEDIDO_SERVICE_URL, "/pedidos" + req.params.id)
})

app.delete("/pedidos/:id", function(req, res){
    return encaminhar(req, res, PEDIDO_SERVICE_URL, "/pedidos" + req.params.id)
})


app.get("/dados", async function(req, res){

    try{
        const respostaUsuarios = await fetch(USUARIO_SERVICE_URL + "/usuarios")
        const usuarios = await respostaUsuarios.json()


        const respostaPedidos = await fetch(PEDIDO_SERVICE_URL + "/pedidos")
        const pedidos = await respostaPedidos.json()

        return res.status(200).json({usuarios: usuarios, pedidos: pedidos})

    }catch(erro){
        return res.status(502).json({erro: "Falha ao acessar os serviços internos", detalhe: erro.message})
    }   
})

const PORTA = process.env.PORT || 4000

app.listen(PORTA, function(){
    console.log("[api-gateway] rodando em http://localhost:" + PORTA)
    console.log("[api-gateway] usuarios-service" + USUARIO_SERVICE_URL)
    console.log("[api-gateway] pedidos-service" + PEDIDO_SERVICE_URL)


})