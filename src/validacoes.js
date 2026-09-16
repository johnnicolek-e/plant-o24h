function validarUsuario(nome, email, telefone) {

  // Nome obrigatório
  if (!nome) {
    return "O nome é obrigatório";
  }

  // Email obrigatório
  if (!email) {
    return "O email é obrigatório";
  }

  // Email precisa conter @
  if (!email.includes("@")) {
    return "Email inválido";
  }

  // Telefone obrigatório
  if (!telefone) {
    return "O telefone é obrigatório";
  }

  // Telefone precisa ter pelo menos 8 caracteres
  if (telefone.length < 8) {
    return "Telefone inválido";
  }

  // Telefone deve conter apenas números
  if (isNaN(telefone)) {
    return "Telefone deve conter apenas números";
  }

  return null; // Retorna null se não houver erros
}

module.exports = validarUsuario;


