const express = require("express");
const validarUsuario = require("../validacoes");
const pool = require("../database");

const router = express.Router();

// ======================================================
// POST - Criar usuário
// ======================================================
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

    // E-mail já cadastrado
    if (erro.code === "23505") {
      return res.status(409).json({
        erro: "Este email já está cadastrado"
      });
    }

    res.status(500).json({
      erro: "Erro interno do servidor"
    });
  }
});

// ======================================================
// GET - Listar todos os usuários
// ======================================================
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

// ======================================================
// GET - Buscar usuário por ID
// ======================================================
router.get("/usuarios/:id", async (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    return res.status(400).json({
      erro: "ID deve ser um número"
    });
  }

  try {
    const resultado = await pool.query(
      "SELECT * FROM usuarios WHERE id = $1",
      [id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        erro: "Usuário não encontrado"
      });
    }

    res.status(200).json(resultado.rows[0]);

  } catch (erro) {
    console.error("Erro ao buscar usuário:", erro.message);

    res.status(500).json({
      erro: "Erro interno do servidor"
    });
  }
});

// ======================================================
// PUT - Atualizar usuário por ID
// ======================================================
router.put("/usuarios/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, email, telefone } = req.body || {};

  // Validar ID
  if (isNaN(id)) {
    return res.status(400).json({
      erro: "ID deve ser um número"
    });
  }

  const erro = validarUsuario(nome, email, telefone);

  if (erro) {
    return res.status(400).json({
      erro
    });
  }

  try {
    const resultado = await pool.query(
      `UPDATE usuarios
       SET nome = $1, email = $2, telefone = $3
       WHERE id = $4
       RETURNING *`,
      [nome, email, telefone, id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        erro: "Usuário não encontrado"
      });
    }

    res.status(200).json({
      mensagem: "Usuário atualizado com sucesso!",
      usuario: resultado.rows[0]
    });

  } catch (erro) {
    console.error("Erro ao atualizar usuário:", erro.message);

    // E-mail já cadastrado
    if (erro.code === "23505") {
      return res.status(409).json({
        erro: "Este email já está cadastrado"
      });
    }

    res.status(500).json({
      erro: "Erro interno do servidor"
    });
  }
});

// ======================================================
// DELETE - Excluir usuário por ID
// ======================================================
router.delete("/usuarios/:id", async (req, res) => {
  const { id } = req.params;

  // Validar ID
  if (isNaN(id)) {
    return res.status(400).json({
      erro: "ID deve ser um número"
    });
  }

  try {
    const resultado = await pool.query(
      "DELETE FROM usuarios WHERE id = $1 RETURNING *",
      [id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        erro: "Usuário não encontrado"
      });
    }

    res.status(200).json({
      mensagem: "Usuário excluído com sucesso!",
      usuario: resultado.rows[0]
    });

  } catch (erro) {
    console.error("Erro ao excluir usuário:", erro.message);

    res.status(500).json({
      erro: "Erro interno do servidor"
    });
  }
});

module.exports = router;