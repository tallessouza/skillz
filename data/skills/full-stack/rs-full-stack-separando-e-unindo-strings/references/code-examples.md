# Code Examples: Separando e Unindo Strings

## Exemplo 1: Split basico por virgula (da aula)

```javascript
const text = "estudar,aprender,praticar"
const separate = text.split(",")
console.log(separate)
// Output: ["estudar", "aprender", "praticar"]
```

## Exemplo 2: Split por espaco (da aula)

```javascript
const message = "estou aprendendo javascript"
const words = message.split(" ")
console.log(words)
// Output: ["estou", "aprendendo", "javascript"]
```

## Exemplo 3: Split com separador inesperado (da aula)

```javascript
const message = "estou aprendendo javascript"
const parts = message.split("en")
console.log(parts)
// Output: ["estou apr", "d", "do javascript"]
// Resultado confuso — separador nao representa limite logico
```

## Exemplo 4: Join sem parametro (da aula)

```javascript
const separate = ["estudar", "aprender", "praticar"]
const joined = separate.join()
console.log(joined)
// Output: "estudar,aprender,praticar"
```

## Exemplo 5: Join com separador customizado (da aula)

```javascript
const separate = ["estudar", "aprender", "praticar"]

const withDash = separate.join(" - ")
console.log(withDash)
// Output: "estudar - aprender - praticar"

const withHash = separate.join(" # ")
console.log(withHash)
// Output: "estudar # aprender # praticar"

const withAt = separate.join(" @ ")
console.log(withAt)
// Output: "estudar @ aprender @ praticar"
```

## Variacao: Gerar slug a partir de titulo

```javascript
const title = "Separando e Unindo Strings"
const slug = title.toLowerCase().split(" ").join("-")
console.log(slug)
// Output: "separando-e-unindo-strings"
```

## Variacao: Parsear query string simples

```javascript
const query = "name=João&age=25&city=SP"
const pairs = query.split("&")
console.log(pairs)
// Output: ["name=João", "age=25", "city=SP"]

// Extrair chave-valor de cada par
const params = {}
pairs.forEach(pair => {
  const [key, value] = pair.split("=")
  params[key] = value
})
console.log(params)
// Output: { name: "João", age: "25", city: "SP" }
```

## Variacao: Formatar lista para exibicao

```javascript
const technologies = ["React", "Node.js", "TypeScript", "PostgreSQL"]

const commaList = technologies.join(", ")
// "React, Node.js, TypeScript, PostgreSQL"

const bulletList = technologies.join("\n• ")
// Precedido de "• " no primeiro:
const display = "• " + technologies.join("\n• ")
// "• React\n• Node.js\n• TypeScript\n• PostgreSQL"
```

## Variacao: Trocar delimitador CSV para TSV

```javascript
const csvLine = "João,25,São Paulo,Developer"
const tsvLine = csvLine.split(",").join("\t")
console.log(tsvLine)
// "João\t25\tSão Paulo\tDeveloper"
```

## Variacao: Capitalizar primeira letra de cada palavra

```javascript
const name = "joão da silva"
const capitalized = name
  .split(" ")
  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
  .join(" ")
console.log(capitalized)
// "João Da Silva"
```

## Variacao: Extrair extensao de arquivo

```javascript
const filename = "documento.final.v2.pdf"
const parts = filename.split(".")
const extension = parts[parts.length - 1]
console.log(extension)
// "pdf"
```

## Variacao: Reverter palavras

```javascript
const phrase = "javascript aprendendo estou"
const reversed = phrase.split(" ").reverse().join(" ")
console.log(reversed)
// "estou aprendendo javascript"
```