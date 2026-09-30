const express = require("express");
const validarUsuario = require("../validacoes");
const pool = require("../database");
const router = express.Router();

router.post("/usuarios", async (req, res) => {
  const { nome, email, telefone } = req.body || {};

  console.log("BODY RECEBIDO:", req.body);

  const erro = validarUsuario(nome, email, telefone);

  if (erro) {
    return res.status(400).json({
      erro
    });
  }

  try {
    const resultado = await pool.query(
      "INSERT INTO usuarios (nome, email, telefone) VALUES ($1, $2, $3) RETURNING *",
      [nome, email, telefone]
    );

    res.status(201).json({
      mensagem: "Usuário criado com sucesso!",
      usuario: resultado.rows[0]
    });

  } catch (erro) {
    console.error("Erro ao inserir usuário:", erro.message);

    res.status(500).json({
      erro: "Erro interno do servidor"
    });
  }
});

router.get("/usuarios", async (req, res) => {
  try {
    const resultado = await pool.query(
      "SELECT * FROM usuarios"
    );

    res.status(200).json(resultado.rows);

  } catch (erro) {
    console.error("Erro ao buscar usuários:", erro.message);

    res.status(500).json({
      erro: "Erro interno do servidor"
    });
  }
});

module.exports = router;