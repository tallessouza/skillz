# Deep Explanation: Argumentos e Parâmetros

## A diferença fundamental

O instrutor faz questão de separar os dois conceitos logo no início:

- **Parâmetro** = a variável declarada na assinatura da função. É um "slot" que espera um valor.
- **Argumento** = o valor concreto passado quando a função é chamada. É o que preenche o slot.

Essa distinção parece trivial, mas em code reviews e discussões técnicas, usar os termos corretamente demonstra precisão. Quando alguém diz "passe o parâmetro X", tecnicamente deveria dizer "passe o argumento X para o parâmetro X".

## Escopo: por que o parâmetro "vence"

O instrutor demonstra um cenário revelador:

```javascript
let username = "João"

function message(username) {
  console.log(`Olá, ${username}`)
}

message("Rodrigo") // Olá, Rodrigo — NÃO João
```

Isso acontece porque JavaScript resolve variáveis pelo escopo mais interno primeiro (lexical scoping). O parâmetro `username` cria uma variável local no escopo da função que "sombreia" (shadows) a variável externa.

**Quando o parâmetro é removido**, a função passa a buscar no escopo externo:

```javascript
let username = "João"

function message() {
  console.log(`Olá, ${username}`) // Agora busca no escopo externo
}

message() // Olá, João
```

### Implicação prática
Se você nomear um parâmetro igual a uma variável externa, nunca conseguirá acessar a externa dentro da função. Isso não é bug — é o comportamento esperado do escopo léxico. Mas pode causar confusão se não for intencional.

## Por que a ordem importa (e quando não importar)

O instrutor demonstra com `joinText("Gonçalves", "Rodrigo", "Santana")` que inverter a ordem dos argumentos inverte o resultado. Isso é porque JavaScript faz **matching posicional**: primeiro argumento → primeiro parâmetro, segundo → segundo, etc.

O instrutor menciona brevemente que **usando objeto como parâmetro, a ordem não importa**. Isso é destructuring:

```javascript
function joinText({ text1, text2, text3 }) {
  console.log(`${text1} ${text2} ${text3}`)
}

// Ordem não importa aqui:
joinText({ text3: "Santana", text1: "Rodrigo", text2: "Gonçalves" })
```

Essa técnica será abordada em aulas futuras, mas é a solução definitiva para funções com muitos parâmetros.

## Valores padrão: proteção contra undefined

Quando um argumento não é passado, o parâmetro recebe `undefined`. O instrutor mostra isso explicitamente:

```javascript
joinText("Rodrigo") // "Rodrigo undefined undefined"
```

A solução é o **default parameter** com `=`:

```javascript
function joinText(text1, text2 = '', text3 = '') { ... }
```

### Regra importante sobre defaults
Valores padrão só são ativados quando o argumento é `undefined` (não passado ou explicitamente `undefined`). Passar `null`, `0`, `false` ou `''` **não** ativa o default.

```javascript
function test(x = 10) { return x }
test()          // 10 (default ativado)
test(undefined) // 10 (default ativado)
test(null)      // null (default NÃO ativado)
test(0)         // 0 (default NÃO ativado)
```

## Mental model: parâmetros como contrato

Pense nos parâmetros como o **contrato** da função — eles declaram o que a função precisa para funcionar. Os argumentos são o **cumprimento** desse contrato. Valores padrão são **cláusulas opcionais** do contrato.