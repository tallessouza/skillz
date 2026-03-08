# Code Examples: Criando Projeto no Insomnia

## Configuracao do Base Environment

### Formato JSON (preferido pelo instrutor)

```json
{
  "base_url": "http://localhost:3333"
}
```

### Formato Table View

| Variable | Value | Type |
|----------|-------|------|
| base_url | http://localhost:3333 | Text |

## Exemplos de uso da variavel em requisicoes

### Requisicao de teste basica

```
GET {{ base_url }}
```

Resultado esperado: resposta da API (mensagem ou JSON configurado na rota raiz).

### Requisicoes tipicas de um projeto CRUD

```
GET    {{ base_url }}/users
POST   {{ base_url }}/users
GET    {{ base_url }}/users/:id
PUT    {{ base_url }}/users/:id
DELETE {{ base_url }}/users/:id
```

## Configuracao com multiplos ambientes

### Base Environment (compartilhado)

```json
{
  "base_url": "http://localhost:3333"
}
```

### Sub-environment: Production

```json
{
  "base_url": "https://api.refound.com"
}
```

### Sub-environment: Staging

```json
{
  "base_url": "https://staging-api.refound.com"
}
```

## Passo a passo visual resumido

```
1. Create → Request Collection → "Refound" → Create
2. Base Environment → Edit
3. Adicionar: "base_url": "http://localhost:3333"
4. Close
5. + → HTTP Request → Renomear "teste"
6. GET → digitar "base" → selecionar base_url
7. Send → verificar resposta
```

## Variacoes de porta comuns

```json
// Express padrao
{ "base_url": "http://localhost:3333" }

// Next.js
{ "base_url": "http://localhost:3000" }

// Fastify
{ "base_url": "http://localhost:3333" }

// NestJS
{ "base_url": "http://localhost:3000" }
```