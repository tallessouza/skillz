# Deep Explanation: Requisições HTTP com Fetch

## Por que fetch é o padrão

O `fetch` é a API nativa do navegador (e do Node.js moderno) para fazer requisições HTTP. Antes do fetch, usava-se `XMLHttpRequest` (XHR), que tinha uma API verbosa e baseada em callbacks. O fetch trouxe uma API baseada em Promises, que se integra naturalmente com async/await.

A Skillz ensina fetch como **a estratégia padrão** para consumir APIs no JavaScript — não axios, não XHR, não bibliotecas externas. O motivo: entender fetch é entender o fundamento. Bibliotecas como axios são abstrações sobre o mesmo conceito.

## O ciclo de uma requisição fetch

1. **Chamada** — `fetch(url, options)` inicia a requisição HTTP
2. **Promise resolvida** — retorna um objeto `Response` quando os headers chegam (NÃO quando o body completa)
3. **Parse do body** — `.json()`, `.text()`, `.blob()` são métodos assíncronos que leem o body stream
4. **Dados disponíveis** — agora você tem os dados para usar

Ponto crucial: fetch resolve a Promise assim que recebe os headers. Isso significa que um status 404 ou 500 **resolve** normalmente — fetch só rejeita em falhas de rede (DNS, timeout, CORS). Por isso verificar `response.ok` é obrigatório.

## GET vs POST — Quando usar cada um

O instrutor destaca dois fluxos fundamentais:

- **Ler dados** → GET (padrão do fetch, não precisa especificar method)
- **Enviar dados** → POST (precisa de method, headers e body explícitos)

A analogia é simples: GET é como pedir um cardápio no restaurante (só leitura). POST é como fazer um pedido (envia informação que modifica o estado do servidor).

### Por que POST precisa de mais configuração

Quando você envia dados, o servidor precisa saber:
1. **Que método HTTP está sendo usado** — `method: 'POST'`
2. **Em que formato os dados estão** — `Content-Type: application/json`
3. **Os dados em si** — `body: JSON.stringify(dados)`

Omitir qualquer um desses causa falhas silenciosas ou erros confusos.

## Fetch NÃO é só para REST

Embora o contexto da aula seja consumir uma API REST (buscar e cadastrar produtos), fetch serve para qualquer requisição HTTP:
- APIs REST
- APIs que retornam HTML
- Download de arquivos
- Upload de arquivos (com FormData)
- Webhooks

## Armadilha clássica: .then() encadeado

Iniciantes frequentemente escrevem:
```javascript
fetch(url)
  .then(res => res.json())
  .then(data => {
    // usar data aqui
  })
  .catch(err => console.log(err))
```

Isso funciona, mas tem problemas:
1. Difícil de compor com outras operações assíncronas
2. O erro pode ser engolido pelo catch genérico
3. Não permite verificar `response.ok` facilmente entre o fetch e o .json()

Com async/await:
```javascript
const response = await fetch(url)
if (!response.ok) throw new Error(`Status: ${response.status}`)
const products = await response.json()
```

Cada linha faz uma coisa. O fluxo é linear. O erro é tratável em cada etapa.

## Contexto da aula

Esta é uma aula introdutória do módulo "JavaScript antes do framework" do curso Full Stack da Skillz. O objetivo é que o aluno entenda requisições HTTP na prática ANTES de usar React, Next.js ou qualquer framework. Isso garante que, quando o framework abstrai o fetch (como em server components ou data fetching hooks), o aluno entende o que está acontecendo por baixo.