# Deep Explanation: Criando Servicos de Requisicao POST

## Por que async/await e nao .then()

O instrutor usa `export async function` porque o `await` torna o fluxo linear e legivel. Sem o `async` na declaracao, o `await` dentro da funcao gera erro de sintaxe — o instrutor demonstrou isso removendo o `async` e mostrando que o `await` para de funcionar.

## Por que desestruturar parametros como objeto

O insight principal do instrutor: **"nao importa a ordem que a pessoa que chamar a funcao passar esses parâmetros"**. Quando voce usa argumentos posicionais (`id, name, when`), quem chama precisa lembrar a ordem exata. Com objeto desestruturado (`{ id, name, when }`), a ordem e irrelevante — ganha-se flexibilidade.

Isso e especialmente util em servicos que podem crescer. Se amanha precisar de um campo `notes`, basta adicionar na desestruturacao sem quebrar chamadas existentes.

## Estrutura do arquivo de servico

O instrutor organiza servicos na pasta `servers/` (ou `services/`), com cada arquivo representando uma operacao:
- `schedule-new.js` — criar agendamento
- Cada servico importa a config centralizada da API

A convencao e: **um arquivo por operacao**, nao um arquivo monolitico com todas as operacoes.

## Import com extensao .js

O instrutor enfatiza: **"e importante lembrar de usar aqui a extensao do arquivo"**. Em projetos sem bundler ou usando ES modules nativos no browser, a extensao e obrigatoria. O import fica: `import { apiConfig } from "./api-config.js"`.

## Por que JSON.stringify no body

O `fetch` envia o body como texto. O `JSON.stringify` converte o objeto JavaScript em string JSON. Combinado com o header `Content-Type: application/json`, a API consegue interpretar o conteudo corretamente. Sem o stringify, o body seria `[object Object]`.

## Tratamento de erros com feedback ao usuario

O padrao do instrutor:
1. `console.log(error)` — para o desenvolvedor ver no console o que aconteceu
2. `alert("mensagem amigavel")` — para o usuario saber que algo deu errado

O `try-catch` envolve toda a requisicao. Se qualquer etapa falhar (rede, servidor, parsing), o catch captura e da feedback.

## Interpolacao da URL

O instrutor usa template literal para montar a URL:
```javascript
`${apiConfig.baseUrl}/schedules`
```

O `baseUrl` vem da config centralizada, e o recurso (`/schedules`) e adicionado fora das chaves da interpolacao. Isso permite trocar a URL base (dev/prod) sem alterar os servicos.