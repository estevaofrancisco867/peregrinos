export function translateUserMessage(message: string): string {
  const lower = message.toLowerCase().trim();

  const map: Record<string, string> = {
    "invalid login credentials": "E-mail ou senha incorretos.",
    "email not confirmed": "E-mail ainda não confirmado. Verifique sua caixa de entrada.",
    "user already registered": "Este e-mail já está cadastrado.",
    "signup requires a valid password": "A senha informada não é válida.",
    "password should be at least 6 characters": "A senha deve ter pelo menos 6 caracteres.",
    "password should be at least 6 charactersb": "A senha deve ter pelo menos 6 caracteres.",
    "unable to validate email address: invalid format": "O formato do e-mail está inválido.",
    "invalid email": "E-mail inválido.",
    "request rate limit reached, please wait a few seconds and try again":
      "Muitas tentativas. Aguarde alguns segundos e tente novamente.",
    "over email send rate limit": "Muitas tentativas de envio. Tente mais tarde.",
    "for security purposes, you can only request this after":
      "Por segurança, aguarde antes de tentar novamente.",
    "jwt expired": "Sessão expirada. Faça login novamente.",
    "invalid jwt": "Sessão inválida. Faça login novamente.",
    "user not found": "Usuário não encontrado.",
    "new password should be different from the old password.":
      "A nova senha deve ser diferente da senha atual.",
    "auth session missing": "Sessão não encontrada. Faça login novamente.",
    "network error": "Erro de conexão. Verifique sua internet.",
    "failed to fetch": "Erro de conexão. Verifique sua internet.",
  };

  for (const key of Object.keys(map)) {
    if (lower.includes(key)) return map[key]!;
  }

  // Fallbacks for common Supabase/database errors
  if (lower.includes("duplicate key value violates unique constraint")) {
    return "Já existe um registro com estes dados.";
  }
  if (lower.includes("violates foreign key constraint")) {
    return "Não é possível remover este item porque está sendo usado em outro lugar.";
  }
  if (lower.includes("value too long")) {
    return "Um dos campos ultrapassou o tamanho permitido.";
  }
  if (lower.includes("check constraint")) {
    return "Um dos valores não atende às regras exigidas.";
  }
  if (lower.includes("not null")) {
    return "Preencha todos os campos obrigatórios.";
  }

  return message;
}
