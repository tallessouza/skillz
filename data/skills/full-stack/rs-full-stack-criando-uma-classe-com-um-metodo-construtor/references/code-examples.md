# Code Examples: Classes e Método Construtor

## Exemplo 1: Estrutura basica de classe (do transcript)

```javascript
// Definindo a classe com PascalCase
class Person {
  // Constructor executa automaticamente ao instanciar
  constructor() {
    console.log('Classe instanciada')
  }
}

// Instanciando com new
const person = new Person()
// Output: "Classe instanciada"
```

## Exemplo 2: Constructor com parametro (do transcript)

```javascript
class Person {
  constructor(name) {
    // console.log com multiplos args adiciona espaco automaticamente
    console.log('Ola', name)
  }
}

const person = new Person('Rodrigo')
// Output: "Ola Rodrigo"
```

## Exemplo 3: Armazenando parametros como propriedades

```javascript
class Person {
  constructor(name, age) {
    this.name = name
    this.age = age
  }
}

const person = new Person('Rodrigo', 30)
console.log(person.name) // "Rodrigo"
console.log(person.age)  // 30
```

## Exemplo 4: Multiplas instancias

```javascript
class Person {
  constructor(name) {
    this.name = name
  }
}

// Cada new cria uma instancia independente
const person1 = new Person('Rodrigo')
const person2 = new Person('Maria')

console.log(person1.name) // "Rodrigo"
console.log(person2.name) // "Maria"
```

## Exemplo 5: Classe com valores padrao

```javascript
class Settings {
  constructor(theme, language) {
    this.theme = theme || 'light'
    this.language = language || 'pt-BR'
  }
}

const defaultSettings = new Settings()
console.log(defaultSettings.theme)    // "light"
console.log(defaultSettings.language) // "pt-BR"

const customSettings = new Settings('dark', 'en-US')
console.log(customSettings.theme)    // "dark"
```

## Comparacao de nomenclaturas (do transcript)

```javascript
// PascalCase — para classes
class MyClass {}

// camelCase — para variaveis e funcoes
const myVariable = 'value'
function myFunction() {}

// snake_case — para chaves de configuracao
const config = {
  max_retries: 3,
  api_key: 'abc123'
}
```