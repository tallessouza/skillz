# Deep Explanation: Setup do Cliente HTTP (Ky)

## Por que nao Axios?

O instrutor explica uma nuance importante: Axios nao e ruim — a API dele e "perfeita". O problema e estrutural. Axios usa XMLHttpRequest, uma API antiga do navegador. A fetch API e nativa, o browser ja entende, e muito mais leve.

A consequencia pratica: features novas do JavaScript (como Web Streams para streaming) funcionam naturalmente com fetch, mas sao "chatinhas" de fazer com Axios. A tendencia e que mais features surjam que o Axios vai "sofrer pra implementar, se vai implementar".

## Por que Ky especificamente?

Ky e descrito como "basicamente um Axios em cima da fetch API". Ele resolve o dilema: voce quer a ergonomia do Axios (base URL, interceptors) mas a leveza e compatibilidade futura da fetch API.

Features que Ky herda do modelo Axios:
- **prefixUrl** (equivalente a baseURL do Axios) — todas as requisicoes partem desse endereco
- **Interceptors** (hooks beforeRequest/afterResponse) — interceptar requisicoes para adicionar tokens, tratar erros
- **API fluente** — `.post().json()` encadeado

## A decisao de nao usar Zod nas respostas

O instrutor faz uma distincao importante entre validacao de dados do usuario vs dados da propria API:

> "Como nao e uma informacao que esta vindo do usuario, nao tem muito sentido eu fazer um processo de validacao dessa informacao, porque eu estaria colocando uma carga de processamento a mais [...] sendo que e uma informacao que vem da minha API, ou seja, e meu controle, nao e controle do usuario."

Isso significa: use interfaces TypeScript (zero-cost em runtime) para tipar respostas da sua propria API. Reserve Zod para inputs do usuario (FormData, query params, etc).

## O problema da barra inicial no Ky

O instrutor destaca que no Ky, ao contrario do Axios, incluir `/` no inicio da rota causa comportamento inesperado — o Ky descarta o prefixUrl. A convencao e sempre escrever como se ja houvesse uma barra no final do prefixUrl:

```typescript
// prefixUrl: 'http://localhost:3333'
api.post('sessions/password')  // OK: http://localhost:3333/sessions/password
api.post('/sessions/password') // ERRO: descarta prefixUrl
```

## FormData para tipos TypeScript

Valores do FormData vem como `FormDataEntryValue` (que pode ser `string | File`). O instrutor explica que o JavaScript converte automaticamente quando o objeto tem `toString()` implementado, mas para satisfazer o TypeScript, a conversao explicita com `String()` e necessaria:

```typescript
email: String(data.get('email'))  // FormDataEntryValue → string
```

## Organizacao em modulos por rota

A motivacao e clara: conforme a aplicacao cresce, ter todas as chamadas HTTP inline nas Server Actions vira ingerenciavel. Separar em `src/http/{rota}.ts` traz:

1. **Tipagem isolada** — cada arquivo define exatamente o que entra e sai
2. **Reuso** — a mesma rota pode ser chamada de multiplos lugares
3. **Autocomplete** — ao importar a funcao, ctrl+space mostra exatamente os campos necessarios
4. **Manutencao** — se a API muda, voce altera um unico arquivo