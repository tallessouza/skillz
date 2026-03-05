# Deep Explanation: Métodos em Classes JavaScript

## Por que não usar `function` dentro da classe?

A sintaxe de classes no JavaScript (ES6+) introduziu uma forma concisa de definir métodos. Dentro do corpo de uma `class`, o parser espera **method definitions**, que seguem a sintaxe `nomeDoMetodo() {}`. Colocar `function` antes causa um `SyntaxError` porque o parser interpreta `function` como um identificador inesperado naquele contexto.

Isso é diferente de objetos literais, onde você pode ter:
```javascript
const obj = {
  metodo: function() {} // válido em objeto literal
}
```

Mas em classes:
```javascript
class Foo {
  function metodo() {} // SyntaxError
}
```

## O papel do `this` nos métodos

Quando o instrutor faz `this.name = name` no constructor, ele está dizendo: "pegue o valor recebido como parâmetro e disponibilize no contexto do objeto". Isso é fundamental porque:

1. O constructor recebe os dados como parâmetros temporários
2. `this.propriedade = parametro` persiste esses dados no objeto
3. Qualquer método da classe pode então acessar via `this.propriedade`

O `this` dentro de um método refere-se à instância que chamou o método. Então quando fazemos `user.sendEmail()`, dentro de `sendEmail`, `this` aponta para `user`.

## Fluxo de execução

```
1. new User("Rodrigo", "rodrigo@email.com")
   → Chama o constructor
   → this.name = "Rodrigo"
   → this.email = "rodrigo@email.com"
   → Retorna o objeto instanciado

2. user.sendEmail()
   → this dentro de sendEmail = user
   → this.name = "Rodrigo"
   → this.email = "rodrigo@email.com"
   → Executa o console.log
```

## Analogia do instrutor

O instrutor apresenta métodos como "funções que você pode acessar dentro da classe" — ou seja, capacidades que todo objeto daquela classe possui. Se a classe é User, todo User sabe enviar e-mail (`sendEmail`). As propriedades são os dados (nome, email) e os métodos são as ações que operam sobre esses dados.

## Edge cases

### Método chamando outro método
Métodos podem chamar outros métodos da mesma classe usando `this`:
```javascript
class User {
  constructor(name, email) {
    this.name = name
    this.email = email
  }

  getFormattedInfo() {
    return `${this.name} (${this.email})`
  }

  sendEmail() {
    console.log(`E-mail enviado para ${this.getFormattedInfo()}`)
  }
}
```

### Cuidado com destructuring de métodos
```javascript
const { sendEmail } = user
sendEmail() // this será undefined (ou window em non-strict)
```

Isso acontece porque ao extrair o método, ele perde a referência ao objeto original.