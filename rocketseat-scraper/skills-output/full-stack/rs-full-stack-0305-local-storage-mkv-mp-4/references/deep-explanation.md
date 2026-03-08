# Deep Explanation: Local Storage — Persistência de Sessão

## Por que localStorage e não apenas variáveis em memória?

Variáveis JavaScript vivem apenas enquanto a página está carregada. Ao recarregar (`F5`, `Ctrl+R`, ou navegar para outra URL e voltar), todo o estado em memória é destruído. O instrutor demonstra isso explicitamente: ao fazer login e depois recarregar a página, a sessão do usuário é perdida.

O localStorage resolve isso porque:
- Persiste dados **entre recarregamentos** de página
- Persiste dados **entre sessões** do navegador (fechar e reabrir)
- É vinculado ao **domínio/origem** da aplicação (ex: `localhost:5173`)
- Funciona como um "banco de dados" simples no navegador com estrutura **chave-valor**

## Escopo por domínio (origin)

O instrutor destaca que o conteúdo do localStorage fica **vinculado ao endereço da aplicação**. Na aba Application do DevTools, cada origem tem seu próprio espaço. Isso significa:
- `localhost:5173` e `localhost:3000` têm localStorages **separados**
- `app.exemplo.com` e `api.exemplo.com` também são separados
- Não há risco de colisão entre aplicações em domínios diferentes

Dentro do mesmo domínio, porém, múltiplas aplicações podem colidir se usarem chaves genéricas como `"user"`. Por isso o instrutor adota o padrão de namespace `@refound:user`.

## A API do localStorage — 4 operações fundamentais

O instrutor demonstra as 4 operações no DevTools antes de aplicar no código:

### 1. setItem(chave, valor) — Criar ou atualizar
```javascript
localStorage.setItem("name", "Rodrigo")
// Se "name" já existe, sobrescreve
localStorage.setItem("name", "Rodrigo Gonçalves")
```

### 2. getItem(chave) — Recuperar
```javascript
const name = localStorage.getItem("name") // "Rodrigo Gonçalves"
const missing = localStorage.getItem("inexistente") // null
```

### 3. removeItem(chave) — Deletar
```javascript
localStorage.removeItem("name")
// Após remoção, getItem retorna null
```

### 4. Visualização no DevTools
- Abrir DevTools → aba Application → Local Storage → selecionar origem
- Cada entrada mostra chave e valor
- Clicar em uma entrada mostra o valor expandido na parte inferior

## Por que separar user e token?

O instrutor explicitamente separa os dados em duas chaves:
- `@refound:user` — dados do usuário (nome, email, etc.)
- `@refound:token` — token de autenticação

A razão: **o token será usado nas requisições HTTP** (como header Authorization). Ao separar, o código que faz requisições pode buscar apenas o token sem precisar parsear o objeto inteiro do usuário.

## Por que JSON.stringify é necessário?

localStorage armazena **apenas strings**. Se você tentar salvar um objeto diretamente:

```javascript
localStorage.setItem("user", { name: "Rodrigo" })
// Armazena: "[object Object]" — DADOS PERDIDOS
```

Por isso o instrutor usa `JSON.stringify`:
```javascript
localStorage.setItem("user", JSON.stringify({ name: "Rodrigo" }))
// Armazena: '{"name":"Rodrigo"}' — dados preservados
```

O token, sendo já uma string, pode ser salvo diretamente sem stringify.

## Padrão de constante em caixa alta

O instrutor cria `LOCAL_STORAGE_KEY` em caixa alta. Esse é um padrão comum em JavaScript para indicar que o valor é uma **constante de referência** — não será alterado durante a execução. Centralizar a chave evita:
- Typos espalhados (`"@refound"` vs `"@Refound"`)
- Mudança de namespace requer editar apenas um lugar
- Facilita busca no codebase (grep por `LOCAL_STORAGE_KEY`)

## Analogia do instrutor

O instrutor compara localStorage a "um banco de dados no navegador" com estrutura chave-valor. A analogia é útil mas tem limites:
- **Semelhante:** CRUD (create/read/update/delete), persistência, vinculado a um "contexto" (domínio ≈ database)
- **Diferente:** sem queries, sem índices, sem relações, limite de ~5MB, síncrono, sem schema

## Limitações importantes (não mencionadas na aula mas relevantes)

- **Limite de ~5MB** por origem na maioria dos navegadores
- **Síncrono** — operações bloqueiam a thread principal (irrelevante para poucos dados)
- **Sem criptografia** — qualquer script no mesmo domínio pode ler os dados
- **Vulnerável a XSS** — se houver injeção de script, o atacante acessa o localStorage
- **Não transmitido automaticamente** — diferente de cookies, não vai em requests HTTP