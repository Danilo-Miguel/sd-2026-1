const express = require("express");
const app = express();


app.use(express.json());

let usuarios = [];
let pedidos = [];

app.post("/usuarios", (req, res) => {
    const usuario = req.body;
    usuarios.push(usuario);
    res.send({ message: "Usuário criado com sucesso", usuario})

});

app.post("/pedidos", (req, res) => {
    const pedido = req.body;
    pedidos.push(pedido);
    res.send({ message: "Pedido criado com sucesso", pedido})
});

app.get("/dados", (req, res) =>{
    res.send({usuarios, pedidos})
})

app.listen(3000, () => console.log("Servidor rodando na porta 3000"))