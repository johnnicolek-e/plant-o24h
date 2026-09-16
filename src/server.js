const express = require("express");

const usuariosRouter = require("./routes/usuarios");

const app = express();

const PORT = 3000;

// ==============================
// MIDDLEWARE
// ==============================

// Permite que a API receba dados em JSON
app.use(express.json());

app.use("/api", usuariosRouter);



// ==============================
// ROTA PRINCIPAL
// ==============================

app.get("/", (req, res) => {

  res.json({
    message: "API Plantão 24h funcionando!"
  });

});


// ==============================
// STATUS DA API
// ==============================

app.get("/api/status", (req, res) => {

  res.json({
    sistema: "Plantão 24h",
    status: "online"
  });

});


// ==============================
// INFORMAÇÕES DA API
// ==============================

app.get("/api/info", (req, res) => {

  res.json({
    nome: "Plantão 24h",
    versao: "1.0",
    ambiente: "desenvolvimento"
  });

});


// ==============================
// CADASTRAR USUÁRIO
// ==============================

app.post("/api/usuarios", (req, res) => {

  // Recebe os dados enviados pelo Postman
  const { nome, email, telefone } = req.body;


  // Executa a função de validação
  const erro = validarUsuario(nome, email, telefone);


  // Se existir algum erro, retorna 400
  if (erro) {

    return res.status(400).json({
      erro: erro
    });

  }


  // ==============================
  // TRY / CATCH
  // ==============================

  try {

    const usuario = {
      nome: nome,
      email: email,
      telefone: telefone
    };


    res.json({
      mensagem: "Usuário recebido com sucesso!",
      usuario: usuario
    });


  } catch (erro) {

    console.log(erro);

    res.status(500).json({
      erro: "Erro interno do servidor"
    });

  }

});


// ==============================
// INICIAR SERVIDOR
// ==============================

app.listen(PORT, () => {

  console.log(`Servidor rodando em http://localhost:${PORT}`);

});