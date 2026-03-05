# Deep Explanation: Strict Mode do JavaScript

## Por que o strict mode existe

O JavaScript e famoso pela flexibilidade, mas essa flexibilidade tem um custo em aplicacoes grandes e a longo prazo. Erros silenciosos — situacoes onde o codigo faz algo errado mas nao avisa — sao a raiz de bugs dificeis de rastrear.

O strict mode transforma esses erros silenciosos em **excecoes explicitas**, forcando o desenvolvedor a corrigir o problema na hora em vez de descobrir semanas depois em producao.

## Mecanismo de hoisting sem strict mode

Quando voce escreve `personName = "Rodrigo"` dentro de uma funcao sem `let`/`const`/`var`, o JavaScript nao reclama. Em vez disso, ele "eleva" (hoisting) a variavel para o **escopo global** (`window.personName` no browser). Isso significa:

1. A variavel vaza para fora da funcao
2. Qualquer outro codigo pode acessar e modificar essa variavel
3. Colisoes de nome sao inevitaveis em aplicacoes grandes
4. `window.personName` fica poluindo o escopo global

Com strict mode, isso gera um `ReferenceError: personName is not defined` — forcando voce a declarar corretamente.

## A armadilha dos parametros duplicados

Este e o exemplo mais perigoso da aula. Sem strict mode:

```javascript
function sum(a, a, c) {
  return a + a + c;
}
sum(1, 3, 2); // Retorna 8, nao 6
```

O que acontece internamente:
1. Primeiro parametro `a` recebe valor `1`
2. Segundo parametro `a` **sobrepoe** o primeiro, agora `a = 3`
3. Terceiro parametro `c` recebe `2`
4. `a + a + c` = `3 + 3 + 2` = `8`

Voce espera `1 + 3 + 2 = 6`, mas recebe `8`. Sem strict mode, **nenhum aviso e gerado**. Com strict mode, voce recebe um `SyntaxError` na **declaracao** da funcao, antes mesmo de chama-la.

## Getters e atribuicao silenciosa

Quando uma classe tem um `get` sem `set`:

```javascript
class Student {
  get point() {
    return 7;
  }
}
const student = new Student();
student.point = 10; // Sem strict: silenciosamente ignorado
                     // Com strict: TypeError
```

Sem strict mode, `student.point` continua retornando `7` — a atribuicao simplesmente e descartada sem nenhum aviso. Isso pode levar horas de debug tentando entender por que o valor nao muda.

## Delete em propriedades nao-deletaveis

```javascript
delete window.document; // Sem strict: retorna false silenciosamente
                        // Com strict: TypeError
```

O `delete` retorna `false` indicando falha, mas quem verifica o retorno de `delete`? Com strict mode, a excecao garante que voce saiba imediatamente.

## Escopo global vs escopo de funcao

O `"use strict"` pode ser colocado:

- **No topo do arquivo**: aplica para todo o codigo do arquivo
- **Dentro de uma funcao**: aplica apenas para aquela funcao

A recomendacao e usar no escopo global. A ativacao por funcao e util apenas quando voce esta migrando codigo legado e nao pode ativar strict mode em tudo de uma vez.

## Quando strict mode ja e implicito

- **ES Modules** (`import`/`export`): strict mode automatico
- **Classes ES6**: o corpo da classe ja opera em strict mode
- **TypeScript**: o compilador ja e mais restritivo que strict mode
- **Frameworks modernos** (React, Vue, etc.): geralmente usam modules, entao strict mode ja esta ativo

## Outros erros que strict mode captura (nao mencionados na aula)

- Atribuicao a `NaN`, `undefined`, `Infinity` (que sao variaveis globais readonly)
- Uso de `with` statement
- `this` em funcoes nao-metodo aponta para `undefined` (em vez de `window`)
- Numeros octais com prefixo `0` (ex: `var x = 010`)
- Definir propriedades duplicadas em objeto literal (versoes antigas)