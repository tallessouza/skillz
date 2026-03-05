# Deep Explanation: Rotas de Recuperacao e Troca de Senha

## Por que sempre retornar sucesso no recover?

O instrutor destaca um principio fundamental de seguranca: **"We don't want people to know if user really exists."**

O raciocinio e direto: se um atacante esta tentando roubar senhas, ele pode usar a rota de recuperacao para descobrir quais emails estao cadastrados no sistema. Se a rota retorna erro quando o usuario nao existe e sucesso quando existe, o atacante consegue enumerar todas as contas validas.

A solucao e simples mas contra-intuitiva para desenvolvedores iniciantes: **retorne exatamente a mesma resposta (201) independente do usuario existir ou nao.** Do ponto de vista do cliente, a requisicao sempre "deu certo". Internamente, o token so e criado se o usuario existir.

## Fluxo completo de recuperacao

O processo e dividido em duas etapas distintas:

### Etapa 1: Solicitar recuperacao (`POST /password/recover`)
1. Recebe o email
2. Busca o usuario (silenciosamente)
3. Se existe: cria token do tipo `PASSWORD_RECOVER` vinculado ao userId
4. Em producao: envia email com link contendo o token
5. Em desenvolvimento: loga o token no console (o instrutor enfatiza: "jamais colocar isso em producao")
6. Retorna 201 sempre

### Etapa 2: Resetar a senha (`POST /password/reset`)
1. Recebe o `code` (id do token) e a nova `password`
2. Busca o token pelo id
3. Se nao encontra: lance UnauthorizedError (aqui sim podemos rejeitar, porque o code nao esta vinculado a um email)
4. Hash da nova senha com bcrypt
5. Atualiza o usuario vinculado ao token
6. Retorna 204 (sucesso sem conteudo)

## Por que 201 no recover e 204 no reset?

- **201 (Created)**: indica que um recurso foi criado (o token de recuperacao). Mesmo quando o usuario nao existe, retornamos 201 para manter a resposta identica.
- **204 (No Content)**: indica sucesso mas sem corpo na resposta. Usado no reset porque a operacao e um update — nao ha dados para retornar ao cliente.

## Validacao de senha

O instrutor define um minimo de 6 caracteres para a nova senha no schema de validacao. O hash usa bcrypt com 6 rounds (cost factor), que e o mesmo padrao usado no cadastro.

## Teste via Swagger

O instrutor demonstra o fluxo completo:
1. Chama `/password/recover` com `diego@acme.com`
2. Copia o token do console
3. Chama `/password/reset` com o token e nova senha `654321`
4. Verifica fazendo login com a nova senha na rota `/sessions`

Isso confirma que o fluxo funciona de ponta a ponta.

## Schema Fastify/Zod

A rota de recover define o body como:
```typescript
body: z.object({
  email: z.string().email(),
})
```

A rota de reset define:
```typescript
body: z.object({
  code: z.string(),
  password: z.string().min(6),
})
```

Ambas definem response schemas indicando que nao ha conteudo no body da resposta.