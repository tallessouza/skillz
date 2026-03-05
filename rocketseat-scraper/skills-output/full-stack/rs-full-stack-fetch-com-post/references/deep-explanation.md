# Deep Explanation: Fetch com POST

## Por que JSON.stringify e obrigatorio

O fetch envia o body como string pela rede. Quando voce passa um objeto JavaScript diretamente, ele e convertido para `"[object Object]"` — uma string inutil que a API nao consegue interpretar.

`JSON.stringify()` serializa o objeto em uma string JSON valida:
- `{ name: "Mouse" }` → `'{"name":"Mouse"}'`

O caminho inverso e `JSON.parse()`:
- `'{"name":"Mouse"}'` → `{ name: "Mouse" }`

O instrutor enfatiza: **stringify = objeto → texto, parse = texto → objeto**. Ambos exigem JSON valido.

## Content-Type: por que declarar

A propriedade `headers` carrega metadados da requisicao. O `Content-Type` informa a API qual formato os dados estao usando.

JSON nao e o unico formato de troca de dados. O XML usa tags para representar estrutura:

```xml
<endereco>
  <cep>01001-000</cep>
  <cidade>Sao Paulo</cidade>
</endereco>
```

Equivalente em JSON:
```json
{
  "endereco": {
    "cep": "01001-000",
    "cidade": "Sao Paulo"
  }
}
```

Sem o Content-Type, a API pode tentar interpretar o body como texto puro ou form-urlencoded, causando erros silenciosos.

## Anatomia de um fetch POST

O fetch aceita dois parametros:
1. **URL** — endpoint da API
2. **Objeto de configuracao** com:
   - `method` — "POST" (padrao e "GET")
   - `headers` — metadados como Content-Type
   - `body` — dados serializados com JSON.stringify

O navegador so faz GET nativamente (barra de endereco, links, tags img/script). Para POST, PUT, DELETE, voce precisa de JavaScript.

## Sequenciamento com async/await

O instrutor mostra um problema pratico: ao cadastrar um produto e depois listar todos, sem `await` a listagem executa antes do cadastro completar.

```javascript
// PROBLEMA: loadProducts executa antes do fetch completar
fetch(url, { method: "POST", ... });
loadProducts(); // dados desatualizados

// SOLUCAO: await garante sequencia
await fetch(url, { method: "POST", ... });
await loadProducts(); // agora sim, dados atualizados
```

Para usar `await`, a funcao deve ser `async`. No caso de um event listener:

```javascript
form.addEventListener("submit", async (event) => {
  // async aqui permite await dentro
});
```

## preventDefault no submit

Formularios HTML tem comportamento padrao: ao submeter, recarregam a pagina enviando dados via GET na URL. O `event.preventDefault()` cancela esse comportamento, dando controle total ao JavaScript.

Sem preventDefault:
1. Usuario clica "Cadastrar"
2. Pagina recarrega
3. Fetch pode nao completar
4. Estado da aplicacao se perde

Com preventDefault:
1. Usuario clica "Cadastrar"
2. JavaScript intercepta
3. Fetch POST executa completamente
4. Aplicacao atualiza sem recarregar

## Geracao de IDs no cliente

O instrutor usa `new Date().getTime().toString()` para gerar IDs unicos. Isso retorna o timestamp em milissegundos como string (ex: "1709312400000").

Nao e aleatorio — e baseado no momento exato. Para a maioria das APIs em producao, o backend gera o ID (auto-increment, UUID). Essa tecnica e util para APIs simples como json-server ou prototipos.