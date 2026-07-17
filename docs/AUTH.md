# Autenticação e autorização

## Estratégia atual

O backend utiliza JWT enviado no cabeçalho `Authorization`.

```http
Authorization: Bearer <token>
```

O token contém:

- `sub`: identificador do usuário
- `email`: e-mail do usuário

A expiração atual é de sete dias.

## Senhas

As senhas são transformadas em hash com bcrypt, usando custo 10. O banco armazena apenas `senhaHash`.

## Middleware

`verificarAutenticacao` valida o token e disponibiliza o payload em `request.user`.

## Autorização por empresa

O vínculo é representado por `MembroEmpresa` e possui um cargo:

- `ADMIN`
- `GERENTE`
- `MEMBRO`

No estado atual, operações administrativas de empresas e projetos exigem `ADMIN`.

## Evolução recomendada

Quando o frontend estiver integrado, considere mover a sessão para cookie `HttpOnly`, com `Secure`, `SameSite`, CORS restritivo, proteção CSRF e refresh token rotativo.
