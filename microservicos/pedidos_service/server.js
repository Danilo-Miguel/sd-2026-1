const express = require('express');
const app = express();

app.use(express.json());

let pedidos = []

const USUARIO_SERVICE_URL = process.env.USUARIO_SERVICE_URL || 'http://localhost:4001';

app.get("/health", function(req, res){
    res.status(200).json({ servico: 'pedidos', status: 'OK' });
});

async function usuarioExiste(usuarioId){
    const url = USUARIO_SERVICE_URL + "/usuarios" + usuarioId

    try{
        const resposta = await fetch(url)
        return resposta.status === 200
    }catch(erro){
        return null
    }
}

app.post("/pedidos", function(req, res){

    const { produto, quantidade, usuarioId } = req.body;

    if(!produto || !quantidade || !usuarioId){
        return res.status(400).json({ error: 'Produto e quantidade são obrigatórios - POST' });
    }

    const existe = usuarioExiste(usuarioId)
    if(existe === null){
        return res.status(404).json({ error: 'Produto e quantidade são obrigatórios - POST' });
    }
    if(existe === false){
        return res.status(404).json({ error: 'Usuário não localizado no serviço' });
    }

    const pedido = {
        id: pedidos.length + 1,
        produto: produto,
        quantidade: quantidade,
        usuarioId: usuarioId,
        criadoEm: new Date().toISOString()
    }

    pedidos.push(pedido);

    return res.status(201).json(pedido);
})

app.get("/pedidos", function(req, res){
    return res.status(200).json(pedidos);
});

app.get("/pedidos/:id", function(req, res){

    const id = parseInt(req.params.id);
    const pedido = pedidos.find(function(u){ return u.id === id; });

    if(!pedido){
        return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    return res.status(200).json(pedido);
});

app.put("/pedidos/:id", function(req, res){

    const id = parseInt(req.params.id);
    const index = pedidos.find(function(u){ return u.id === id; });

    if(index === -1){
        return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    const { produto, quantidade, usuarioId } = req.body;

    if(!produto || !quantidade || !usuarioId){
        return res.status(400).json({ error: 'Produto e quantidade são obrigatórios - PUT' });
    }

    pedidos[index] = {
        id: id,
        produto: produto,
        quantidade: quantidade,
        usuarioId: usuarioId
    }

    return res.status(200).json({message: 'Pedido atualizado com sucesso PUT', pedido: pedidos[index]});
});

app.patch("/pedidos/:id", function(req, res){

    const id = parseInt(req.params.id);
    const index = pedidos.find(function(u){ return u.id === id; });

    if(index === -1){
        return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    if(req.body.produto !== undefined){
        pedidos[index].produto = req.body.produto;
    }

    if(req.body.quantidade !== undefined){
        pedidos[index].quantidade = req.body.quantidade;
    }

    if(req.body.usuarioId !== undefined){
        pedidos[index].usuarioId = req.body.usuarioId;
    }

    return res.status(200).json({message: 'Pedido atualizado com sucesso PATCH', pedido: pedidos[index]});
});

app.delete("/pedidos/:id", function(req, res){

    const id = parseInt(req.params.id);
    const index = pedidos.find(function(u){ return u.id === id; });

    if(index === -1){
        return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    const removido = pedidos.splice(index, 1);
    return res.status(200).json({message: 'Pedido removido com sucesso', pedido: pedidos[0]});
});

const PORTA = process.env.PORT || 4002;
app.listen(PORTA, function(){
    console.log(`Pedido-service tá rodando na porta http://localhost:${PORTA}`);
});