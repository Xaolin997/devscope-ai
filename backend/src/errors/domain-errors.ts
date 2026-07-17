import { AppError } from "./app-error.js";

export class RecursoNaoEncontradoError extends AppError {
  constructor(recurso: string, mensagem = `${recurso} não encontrado`) {
    super(mensagem, 404, "RECURSO_NAO_ENCONTRADO");
  }
}

export class SemPermissaoError extends AppError {
  constructor(
    mensagem = "Você não possui permissão para realizar esta operação",
  ) {
    super(mensagem, 403, "SEM_PERMISSAO");
  }
}

export class RecursoDuplicadoError extends AppError {
  constructor(mensagem: string) {
    super(mensagem, 409, "RECURSO_DUPLICADO");
  }
}

export class DadosInvalidosError extends AppError {
  constructor(mensagem: string, detalhes?: unknown) {
    super(mensagem, 400, "DADOS_INVALIDOS", detalhes);
  }
}

export class CredenciaisInvalidasError extends AppError {
  constructor() {
    super("E-mail ou senha inválidos", 401, "CREDENCIAIS_INVALIDAS");
  }
}

export class TokenInvalidoError extends AppError {
  constructor() {
    super(
      "Token inválido ou não informado",
      401,
      "TOKEN_INVALIDO",
    );
  }
}
