const express = require("express");
const app = express();


app.use(express.json());

let usuarios = [];
let pedidos = [];

app.post("/usuarios", (req, res) => {
    const usuario = req.body;

    usuario.id = usuarios.length + 1

    usuarios.push(usuario);

    res.status(201).json({ message: "Usuário criado com sucesso", usuario})

});


app.get("/usuarios", (req, res) => {
    res.status(200).json(usuarios)
})


app.get("/usuarios/:id", (req, res) => {

     const id = parseInt(req.params.id)

     const usuario = usuarios.find(u => u.id === id);

     if(!usuario){
        return res.status(404).json({erro: "Usuário não encontrado"})
     }

    res.status(200).json(usuario)
})



app.put("/usuarios/:id", (req, res) => {

    const id = parseInt(req.params.id)


    const index = usuarios.findIndex(u => u.id === id)

    if (index === -1){
        return res.status(404).json({erro: "Usuário não encontrado"})
    }

    usuarios[index] = {...req.body, id}

    res.status(200).json({message: "Usuário atualizado completamente", usuario: usuarios[index]})

})


app.patch("/usuarios/:id", (req, res) => {

    const id = parseInt(req.params.id)


    const index = usuarios.findIndex(u => u.id === id)

    if (index === -1){
        return res.status(404).json({erro: "Usuário não encontrado"})
    }

    usuarios[index] = {...usuarios[index], ...req.body}

    res.status(200).json({message: "Usuário atualizado parcialmente", usuario: usuarios[index]})

})

app.delete("/usuarios/:id", (req, res) => {

    const id = parseInt(req.params.id)


    const index = usuarios.findIndex(u => u.id === id)

    if (index === -1){
        return res.status(404).json({erro: "Usuário não encontrado"})
    }

    const removido = usuarios.splice(index, 1)

    res.status(200).json({message: "Usuário removido", usuario: removido[0]})

})



app.post("/pedidos", (req, res) => {

    const pedido = req.body;

    pedido.id = pedidos.length + 1

    pedidos.push(pedido);

    res.status(201).json({ message: "Pedido criado com sucesso", pedido})
});

app.get("/pedidos", (req, res) =>{
    res.status(200).json({pedidos})
})

app.get("/dados", (req, res) =>{
    res.send({usuarios, pedidos})
})

app.listen(3000, () => console.log("Servidor rodando na porta 3000"))