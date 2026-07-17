# Segurança

## Controles atuais

- Hash de senha com bcrypt
- JWT com expiração
- Validação de entrada com Zod
- Rate limit global
- Tratamento centralizado de erros
- Verificação de vínculo com empresas
- Restrição de operações administrativas
- Respostas sem `senhaHash`

## Pontos de atenção

### Segredo JWT

O fallback `segredo-de-teste` não deve ser permitido em produção. A aplicação deve falhar na inicialização quando `JWT_SECRET` estiver ausente fora do ambiente de teste.

### CORS

`origin: true` aceita origens dinamicamente. Em produção, use uma lista explícita de origens permitidas.

### Token

A validade atual de sete dias é ampla para um access token. Reduza a duração quando refresh tokens forem implementados.

### Logs

Nunca registre senhas, tokens, cookies ou objetos completos de autenticação.

## Melhorias planejadas

- Helmet
- Cookies HttpOnly
- Refresh token rotativo
- Proteção CSRF
- Revogação de sessões
- Auditoria
- Limite específico para login e cadastro
- Política de senha
- Recuperação segura de senha
- Verificação de e-mail
