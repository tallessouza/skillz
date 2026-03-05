# Deep Explanation: Como Estender Interfaces

## Por que estender interfaces?

O instrutor usa um cenario de aplicacao escolar para demonstrar o problema: ao criar `Teacher` e `Student`, ambos precisam de `id` e `name`. Copiar e colar essas propriedades funciona, mas cria dois problemas:

1. **Inconsistencia silenciosa** — se voce adiciona `email` em `Teacher` mas esquece em `Student`, os tipos divergem sem aviso
2. **Trabalho repetitivo** — cada nova propriedade comum precisa ser adicionada em N lugares

## Como o TypeScript resolve

A keyword `extends` cria uma relacao de heranca entre interfaces. Quando voce escreve:

```typescript
interface Teacher extends Person { ... }
```

O TypeScript "copia" todas as propriedades de `Person` para dentro de `Teacher` em tempo de compilacao. Nao e uma referencia em runtime — e puramente um mecanismo de tipos.

## Analogia com orientacao a objetos

O instrutor menciona explicitamente: "esse e um conceito bem parecido com classe". De fato, `extends` em interfaces funciona de forma analoga a heranca de classes em OOP, mas:

- **Interfaces sao apenas tipos** — nao geram codigo JavaScript
- **Interfaces suportam heranca multipla** — `interface C extends A, B` e valido
- **Nao ha construtores ou metodos** — apenas contratos de forma

## Propagacao automatica de mudancas

O ponto-chave demonstrado na aula: quando o instrutor adiciona `email` em `Person`, o TypeScript imediatamente mostra erros em `teacher` e `student`, porque ambos agora precisam do campo `email`. Isso e o beneficio real — **mudancas na base propagam para todos os filhos**.

## Comportamento do TypeScript com erros

O instrutor observa que o TypeScript mostra apenas o primeiro erro de cada objeto. Ao remover `id` e `name` de `Teacher`, o erro aparece so para `id`. Ao corrigir `id`, aparece o erro de `name`. Isso e comportamento normal do compilador — ele reporta erros incrementalmente.

## Quando NAO usar extends

- **Propriedades opcionais divergentes** — se um filho precisa de `name?` (opcional) mas a base tem `name` (obrigatorio), extends nao permite relaxar a restricao
- **Heranca profunda (3+ niveis)** — cria acoplamento dificil de rastrear. Prefira composicao com `type` e intersecao (`&`)
- **Tipos union** — se os tipos nao compartilham uma "identidade" comum, nao force uma base