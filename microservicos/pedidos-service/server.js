const express = require("express")
const app = express()


app.use(express.json())

let pedidos = []

const USUARIO_SERVICE_URL =  process.env.USUARIO_SERVICE_URL || "http://localhost:4001"


app.get("/health", function(req, res){
    res.status(200).json({servico: "pedidos", status:"ok"})
})


async function usuarioExiste(usuarioId) {
    const url =  USUARIO_SERVICE_URL + "/usuarios" + usuarioId

    try{
        const resposta = await fetch(url)
        return resposta.status === 200
    }catch(erro){
        return null
    }
    
}


app.post("/pedidos", function(req,res){
    const produto = req.body.produto
    const quantidade = req.body.quantidade
    const usuarioId = req.body.usuarioId

    if(!produto || !quantidade || !usuarioId){
        return res.status(400).json({erro: "Produto, quantidade e usuário são obrigatórios"})
    }

    const existe = usuarioExiste(usuarioId)

    if(existe === null){
        return res.status(503).json({erro: "Falha ao verificar usuário no serviço de usuários"})
    }

    if(existe === false){
        return res.status(404).json({erro: "Usuário não encontrado no serviço de usuários"})
    }

    const pedido = {
        id: pedidos.length + 1,
        produto: produto,
        quantidade: quantidade,
        usuarioId: usuarioId,
        criadoEm: new Date().toISOString()
    }

    pedidos.push(pedido)
    res.status(201).json({message: "Pedido criado", pedido: pedido})


})


app.get("/pedidos", function(req, res){
    res.status(200).json(pedidos)
})

app.get("/pedidos/:id", function(req, res){
    const id = parseInt(req.params.id)
    const pedido = pedidos.find(function(p) {return p.id === id})

     if(!pedido){
        return res.status(400).json({erro: "Pedido não encontrado"})
    }

    res.status(200).json(pedido)
})


app.put("/pedidos/:id", function(req, res){
    const id = parseInt(req.params.id)
    const index = pedidos.find(function(p) {return p.id === id})

     if(index === -1){
        return res.status(400).json({erro: "Pedido não encontrado"})
    }

    const produto = req.body.produto
    const quantidade = req.body.quantidade
    const usuarioId = req.body.usuarioId

    res.status(200).json(pedido)

     if(!produto || !quantidade || !usuarioId){
        return res.status(400).json({erro: "Produto, quantidade e usuário são obrigatórios no PUT"})
    }

      pedidos[index] = {
        id: id,
        produto: produto,
        quantidade: quantidade,
        usuarioId: usuarioId
    }

        res.status(200).json({message: "Pedido atualizado", pedido: pedidos[index]})


})

app.patch("/pedidos/:id", function(req, res){
    const id = parseInt(req.params.id)
    const index = pedidos.find(function(p) {return p.id === id})

     if(index === -1){
        return res.status(400).json({erro: "Pedido não encontrado"})
    }

    if(req.body.produto !== undefined){
        pedidos[index].produto = req.body.produto

    }

    if(req.body.quantidade !== undefined){
        pedidos[index].quantidade = req.body.quantidade

    }

     if(req.body.usuarioId !== undefined){
        pedidos[index].usuarioId = req.body.usuarioId

    }

        res.status(200).json({message: "Pedido atualizado", pedido: pedidos[index]})

})


app.delete("/pedidos/:id", function(req, res){
    const id = parseInt(req.params.id)
    const index = pedidos.find(function(p) {return p.id === id})

     if(index === -1){
        return res.status(400).json({erro: "Pedido não encontrado"})
    }

    const removido = pedidos.splice(index, 1)
    res.status(200).json({message: "Pedido removido", pedido: removido[0]})

})

const PORTA = process.env.PORT || 4002
app.listen(PORTA, function(){
 console.log("[pedidos-service] rodando em localhost://" + PORTA )
})

