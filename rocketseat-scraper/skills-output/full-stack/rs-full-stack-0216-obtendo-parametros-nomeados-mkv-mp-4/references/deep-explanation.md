# Deep Explanation: Obtendo Parâmetros Nomeados

## Dois tipos de parâmetros em URLs

O instrutor faz uma distinção fundamental entre dois tipos de parâmetros que coexistem numa URL de API:

1. **Parâmetros não nomeados (route params):** Aparecem no path com `:nome` — ex: `/products/:id`. São parte da estrutura da rota.
2. **Parâmetros nomeados (query params):** Aparecem após `?` com `chave=valor` — ex: `?page=3&category=computer`. São filtros opcionais.

A terminologia "nomeado" vs "não nomeado" é específica do curso. No ecossistema geral:
- Route params = path parameters = URL parameters
- Query params = query string parameters = search parameters

## Por que escapar a interrogação

Na regex, `?` é um **quantificador** que significa "zero ou uma ocorrência do caractere anterior". Para usar `?` como caractere literal (a interrogação que separa o path da query string na URL), é preciso escapar: `\?`.

Em JavaScript, dentro de uma string, a barra invertida também precisa ser escapada: `\\?`. Dentro de `new RegExp(...)`, isso se torna a regex `/\?/`.

## Composição de regex com template literals

O instrutor demonstra uma técnica elegante: ao invés de escrever uma regex monolítica, ele compõe a expressão final a partir de partes:

```javascript
// Parte 1: regex de route params (já existia)
const routePart = path.replaceAll(/:([a-zA-Z]+)/g, '(?<$1>[a-z0-9\\-_]+)')

// Parte 2: regex de query params (nova)
const queryPart = '(?<query>\\?(.*))?'

// Composição via template literal
const fullRegex = new RegExp(`^${routePart}${queryPart}$`)
```

Isso mantém cada responsabilidade separada e testável independentemente.

## Anatomia da regex de query params

```
(?<query>\\?(.*))? $
│  │      │  │  │ │
│  │      │  │  │ └─ Fim da string
│  │      │  │  └─── Grupo externo é opcional (URL pode não ter query)
│  │      │  └────── .* = qualquer caractere, qualquer quantidade
│  │      └───────── \? = interrogação literal
│  └──────────────── Nome do grupo: "query"
└─────────────────── Início do grupo nomeado
```

## Grupos nomeados no resultado do match

Quando a regex tem grupos nomeados (`(?<nome>...)`), o resultado de `.match()` inclui uma propriedade `groups` com os valores capturados:

```javascript
const match = url.match(regex)
match.groups.id    // route param capturado
match.groups.query // query string completa (com ? incluso)
```

Isso é muito mais legível que acessar por índice (`match[1]`, `match[2]`).

## Próximo passo: separar os parâmetros

A captura retorna a query string inteira como uma string única (ex: `?page=3&category=computer`). O próximo passo (não coberto nesta aula) é fazer o parsing dessa string em um objeto `{ page: '3', category: 'computer' }`.

## Dica prática do Insomnia

O instrutor mostra que no Insomnia (ferramenta de teste de API), é possível **desabilitar** query params individualmente sem deletá-los. Isso é útil para testar combinações diferentes de filtros sem precisar redigitar os valores.