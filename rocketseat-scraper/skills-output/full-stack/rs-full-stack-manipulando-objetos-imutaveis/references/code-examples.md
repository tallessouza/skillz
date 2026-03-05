# Code Examples: Manipulando Objetos Imutáveis

## Exemplo base da aula — objeto livro

```javascript
const book = {
  title: 'Objetos imutáveis',
  category: 'JavaScript',
  author: {
    name: 'Diego',
    email: 'diego@rocketseat.com.br'
  }
}
```

## 1. Atualizar propriedades mantendo o original intacto

```javascript
const updatedBook = {
  ...book,
  title: 'Criando front-end moderno com HTML',
  category: 'HTML'
}

console.log(book)
// { title: 'Objetos imutáveis', category: 'JavaScript', author: { ... } }

console.log(updatedBook)
// { title: 'Criando front-end moderno com HTML', category: 'HTML', author: { ... } }
```

O `author` (nome e email) permanece identico porque o spread copiou e nenhum override foi feito.

## 2. Adicionar propriedade nova que nao existia

```javascript
const updatedBook = {
  ...book,
  title: 'Criando front-end moderno com HTML',
  category: 'HTML',
  type: 'programacao'
}

console.log(updatedBook)
// { title: '...', category: 'HTML', author: { ... }, type: 'programacao' }

console.log(book)
// original sem 'type' — intacto
```

## 3. Remover propriedade com destructuring rest

### Remover `category`:

```javascript
const { category, ...bookWithoutCategory } = book

console.log(bookWithoutCategory)
// { title: 'Objetos imutáveis', author: { name: 'Diego', email: '...' } }
// sem category!
```

### Remover `author`:

```javascript
const { author, ...bookWithoutAuthor } = book

console.log(bookWithoutAuthor)
// { title: 'Objetos imutáveis', category: 'JavaScript' }
// sem author!
```

### Remover multiplas propriedades:

```javascript
const { category, author, ...bookMinimal } = book

console.log(bookMinimal)
// { title: 'Objetos imutáveis' }
```

## 4. Variacoes praticas (alem da aula)

### Atualizar propriedade aninhada (shallow copy nao resolve)

```javascript
// ERRADO — muta o author do original
const wrong = { ...book }
wrong.author.name = 'Outro'
// book.author.name tambem mudou!

// CORRETO — spread em cada nivel
const correct = {
  ...book,
  author: { ...book.author, name: 'Outro' }
}
// book.author.name continua 'Diego'
```

### Atualizar condicionalmente

```javascript
const updatedBook = {
  ...book,
  ...(shouldUpdateTitle ? { title: 'Novo titulo' } : {}),
}
```

### Combinar dois objetos (merge)

```javascript
const defaults = { theme: 'dark', lang: 'pt-BR' }
const userPrefs = { lang: 'en-US' }

const config = { ...defaults, ...userPrefs }
// { theme: 'dark', lang: 'en-US' }
```

### Renomear propriedade (remover antiga + adicionar nova)

```javascript
const { category, ...rest } = book
const renamedBook = { ...rest, tag: category }
// 'category' virou 'tag'
```