import { AppError } from "./app-error.js";

export class RecursoNaoEncontradoError extends AppError {
  constructor(recurso: string, mensagem = `${recurso} não encontrado`) {
    super(mensagem, 404, "RECURSO_NAO_ENCONTRADO");
  }
}

export class SemPermissaoError extends AppError {
  constructor() {
    super(
      "Você não possui permissão para realizar esta operação",
      403,
      "SEM_PERMISSAO",
    );
  }
}

export class RecursoDuplicadoError extends AppError {
  constructor(message: string) {
    super(message, 409, "RECURSO_DUPLICADO");
  }
}

export class DadosInvalidosError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 400, "DADOS_INVALIDOS", details);
  }
}

export class CredenciaisInvalidasError extends AppError {
  constructor() {
    super("E-mail ou senha inválidos", 401, "CREDENCIAIS_INVALIDAS");
  }
}
