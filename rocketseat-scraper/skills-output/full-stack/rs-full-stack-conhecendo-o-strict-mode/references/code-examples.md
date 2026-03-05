# Code Examples: Strict Mode do JavaScript

## Exemplo 1: Variavel sem declaracao (hoisting para global)

### Sem strict mode (erro silencioso)

```javascript
function showMessage() {
  personName = "Rodrigo"; // Sem let/const/var
  console.log("Hola,", personName);
}

showMessage(); // Funciona! Output: "Hola, Rodrigo"

// Mas a variavel vazou para o escopo global:
console.log(window.personName); // "Rodrigo"
```

### Com strict mode (erro explicito)

```javascript
"use strict";

function showMessage() {
  personName = "Rodrigo"; // ReferenceError: personName is not defined
  console.log("Hola,", personName);
}

showMessage();
```

### Correcao

```javascript
"use strict";

function showMessage() {
  const personName = "Rodrigo"; // Declarado corretamente
  console.log("Hola,", personName);
}

showMessage(); // "Hola, Rodrigo"
```

## Exemplo 2: Getter sem setter — atribuicao silenciosa

### Sem strict mode

```javascript
class Student {
  get point() {
    return 7;
  }
}

const student = new Student();
student.point = 10; // Silenciosamente ignorado
console.log(student.point); // 7 (nao 10!)
```

### Com strict mode

```javascript
"use strict";

class Student {
  get point() {
    return 7;
  }
}

const student = new Student();
student.point = 10; // TypeError: Cannot set property point of #<Student>
```

### Uso correto do getter

```javascript
"use strict";

class Student {
  get point() {
    return 7;
  }
}

const student = new Student();
console.log(student.point); // 7 — apenas leitura, como esperado
```

## Exemplo 3: Deletar propriedade nao-deletavel

### Sem strict mode

```javascript
delete window.document; // Retorna false silenciosamente
console.log(window.document); // Ainda existe, nada aconteceu
```

### Com strict mode

```javascript
"use strict";

delete window.document; // TypeError: Cannot delete property 'document'
```

## Exemplo 4: Parametros duplicados (a grande armadilha)

### Sem strict mode — resultado inesperado

```javascript
function sum(a, a, c) {
  return a + a + c;
}

// Voce pensa: 1 + 3 + 2 = 6
// Resultado real: 3 + 3 + 2 = 8
console.log(sum(1, 3, 2)); // 8

// Explicacao passo a passo:
// Parametro 1: a = 1
// Parametro 2: a = 3 (sobrepoe o primeiro 'a')
// Parametro 3: c = 2
// return a + a + c = 3 + 3 + 2 = 8
```

### Com strict mode — erro na declaracao

```javascript
"use strict";

// SyntaxError: Duplicate parameter name not allowed
function sum(a, a, c) {
  return a + a + c;
}
// O erro acontece na DECLARACAO da funcao
// Nem precisa chamar sum() para o erro aparecer
```

### Correcao

```javascript
"use strict";

function sum(a, b, c) {
  return a + b + c;
}

console.log(sum(1, 3, 2)); // 6 — resultado correto
```

## Exemplo 5: Strict mode por funcao vs global

### Apenas uma funcao protegida

```javascript
function protegida() {
  "use strict";
  nome = "teste"; // ReferenceError — protegida pelo strict mode
}

function desprotegida() {
  nome = "teste"; // Funciona — cria variavel global silenciosamente
}
```

### Todo o arquivo protegido (recomendado)

```javascript
"use strict";

function funcaoA() {
  nome = "teste"; // ReferenceError
}

function funcaoB() {
  nome = "teste"; // ReferenceError tambem — strict mode global
}
```

## Variacoes adicionais

### Strict mode com arrow functions

```javascript
"use strict";

const showMessage = () => {
  personName = "Rodrigo"; // ReferenceError
  console.log(personName);
};
```

### Strict mode e `this` em funcoes

```javascript
"use strict";

function showThis() {
  console.log(this); // undefined (nao window!)
}

showThis();
```

### Strict mode e octais

```javascript
"use strict";

const num = 010; // SyntaxError: Octal literals are not allowed
const numCorreto = 0o10; // Use o prefixo 0o para octais
```