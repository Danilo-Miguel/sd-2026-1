const express = require('express');
const app = express();

app.use(express.json());

let usuarios = []

app.get("/health", function(req, res){
    res.status(200).json({ servico: 'usuarios', status: 'OK' });
});

app.post("/usuarios", function(req, res){

    const { nome, email, idade } = req.body;

    if(!nome || !email){
        return res.status(400).json({ error: 'Nome e email são obrigatórios - POST' });
    }

    const usuario = {
        id: usuarios.length + 1,
        nome: nome,
        email: email,
        idade: idade || null,
        criadoEm: new Date().toISOString()
    }

    usuarios.push(usuario);

    return res.status(201).json(usuario);
})

app.get("/usuarios", function(req, res){
    return res.status(200).json(usuarios);
});

app.get("/usuarios/:id", function(req, res){

    const id = parseInt(req.params.id);
    const usuario = usuarios.find(function(u){ return u.id === id; });

    if(!usuario){
        return res.status(404).json({ error: 'Usuario não encontrado' });
    }

    return res.status(200).json(usuario);
});

app.put("/usuarios/:id", function(req, res){

    const id = parseInt(req.params.id);
    const index = usuarios.find(function(u){ return u.id === id; });

    if(index === -1){
        return res.status(404).json({ error: 'Usuario não encontrado' });
    }

    const { nome, email, idade } = req.body;

    if(!nome || !email){
        return res.status(400).json({ error: 'Nome e email são obrigatórios - PUT' });
    }

    usuarios[index] = {
        id: id,
        nome: nome,
        email: email,
        idade: idade || null
    }

    return res.status(200).json({message: 'Usuario atualizado com sucesso PUT', usuario: usuarios[index]});
});

app.patch("/usuarios/:id", function(req, res){

    const id = parseInt(req.params.id);
    const index = usuarios.find(function(u){ return u.id === id; });

    if(index === -1){
        return res.status(404).json({ error: 'Usuario não encontrado' });
    }

    if(req.body.nome !== undefined){
        usuarios[index].nome = req.body.nome;
    }

    if(req.body.email !== undefined){
        usuarios[index].email = req.body.email;
    }

    if(req.body.idade !== undefined){
        usuarios[index].idade = req.body.idade;
    }

    return res.status(200).json({message: 'Usuario atualizado com sucesso PATCH', usuario: usuarios[index]});
});

app.delete("/usuarios/:id", function(req, res){

    const id = parseInt(req.params.id);
    const index = usuarios.find(function(u){ return u.id === id; });

    if(index === -1){
        return res.status(404).json({ error: 'Usuario não encontrado' });
    }

    const removido = usuarios.splice(index, 1);
    return res.status(200).json({message: 'Usuario removido com sucesso', usuario: removido[0]});
});

const PORTA = process.env.PORT || 4001;
app.listen(PORTA, function(){
    console.log(`User-service tá rodando na porta http://localhost:${PORTA}`);
});