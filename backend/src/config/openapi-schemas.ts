export const erroSchema = {
  type: "object",
  required: ["erro", "codigo"],
  properties: {
    erro: { type: "string" },
    codigo: { type: "string" },
    detalhes: {},
  },
} as const;

export const usuarioSchema = {
  type: "object",
  required: ["id", "nome", "email"],
  properties: {
    id: { type: "string", format: "uuid" },
    nome: { type: "string" },
    email: { type: "string", format: "email" },
  },
} as const;

export const empresaSchema = {
  type: "object",
  properties: {
    id: { type: "string", format: "uuid" },
    nome: { type: "string" },
    criadoEm: { type: "string", format: "date-time" },
    atualizadoEm: { type: "string", format: "date-time" },
    cargo: { type: "string", enum: ["ADMIN", "GERENTE", "MEMBRO"] },
  },
  additionalProperties: true,
} as const;

export const projetoSchema = {
  type: "object",
  properties: {
    id: { type: "string", format: "uuid" },
    nome: { type: "string" },
    descricao: { anyOf: [{ type: "string" }, { type: "null" }] },
    status: {
      type: "string",
      enum: ["ATIVO", "PAUSADO", "CONCLUIDO", "CANCELADO"],
    },
    dataInicio: { anyOf: [{ type: "string", format: "date-time" }, { type: "null" }] },
    dataLimite: { anyOf: [{ type: "string", format: "date-time" }, { type: "null" }] },
    empresaId: { type: "string", format: "uuid" },
    criadoEm: { type: "string", format: "date-time" },
    atualizadoEm: { type: "string", format: "date-time" },
  },
  additionalProperties: true,
} as const;

export const segurancaBearer = [{ bearerAuth: [] }] as const;
