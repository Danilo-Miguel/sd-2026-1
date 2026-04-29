const express = require("express")
const app = express()


app.use(express.json())


let usuarios = []

app.get("/health", function(req, res){
    res.status(200).json({servico: "usuários", status:"ok"})
})


app.post("/usuarios", function(req,res){
    const nome = req.body.nome
    const email = req.body.email
    const idade = req.body.idade

    if(!nome || !email){
        return res.status(400).json({erro: "Nome e email são obrigatórios"})
    }

    const usuario = {
        id: usuarios.length+ 1,
        nome: nome,
        email: email,
        idade: idade
    }

    usuarios.push(usuario)
    res.status(201).json({message: "Usuário criado", usuario: usuario})


})


app.get("/usuarios", function(req, res){
    res.status(200).json(usuarios)
})

app.get("/usuarios/:id", function(req, res){
    const id = parseInt(req.params.id)
    const usuario = usuarios.find(function(u) {return u.id === id})

     if(!usuario){
        return res.status(400).json({erro: "Usuário não encontrado"})
    }

    res.status(200).json(usuario)
})


app.put("/usuarios/:id", function(req, res){
    const id = parseInt(req.params.id)
    const index = usuarios.find(function(u) {return u.id === id})

     if(index === -1){
        return res.status(400).json({erro: "Usuário não encontrado"})
    }

    const nome = req.body.nome
    const email = req.body.email
    const idade = req.body.idade

    res.status(200).json(usuario)

     if(!nome || !email){
        return res.status(400).json({erro: "Nome e email são obrigatórios  no PUT"})
    }

      usuarios[index] = {
        id: id,
        nome: nome,
        email: email,
        idade: idade
    }

        res.status(200).json({message: "Usuário atualizado", usuario: usuarios[index]})


})

app.patch("/usuarios/:id", function(req, res){
    const id = parseInt(req.params.id)
    const index = usuarios.find(function(u) {return u.id === id})

     if(index === -1){
        return res.status(400).json({erro: "Usuário não encontrado"})
    }

    if(req.body.nome !== undefined){
        usuarios[index].nome = req.body.nome

    }

    if(req.body.email !== undefined){
        usuarios[index].email = req.body.email

    }

     if(req.body.idade !== undefined){
        usuarios[index].idade = req.body.idade

    }

        res.status(200).json({message: "Usuário atualizado", usuario: usuarios[index]})

})


app.delete("/usuarios/:id", function(req, res){
    const id = parseInt(req.params.id)
    const index = usuarios.find(function(u) {return u.id === id})

     if(index === -1){
        return res.status(400).json({erro: "Usuário não encontrado"})
    }

    const removido = usuarios.splice(index, 1)
    res.status(200).json({message: "Usuário removido", usuario: removido[0]})

})

const PORTA = process.env.PORT || 401
app.listen(PORTA, function(){
 console.log("[usuarios-service] rodando em localhost://" + PORTA )
})

