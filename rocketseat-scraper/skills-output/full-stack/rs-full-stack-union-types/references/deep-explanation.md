# Deep Explanation: Union Types

## Por que union types existem

No TypeScript, cada variavel tem um tipo. Quando voce declara `let response: string`, esta dizendo que essa variavel so aceita strings. Mas no mundo real, variaveis frequentemente precisam aceitar mais de um tipo.

O cenario classico e uma resposta de banco de dados ou API externa: a consulta pode retornar um texto (string) ou pode nao retornar nada (null). Se voce declara apenas `string`, o TypeScript vai reclamar quando voce tentar atribuir `null`.

## Null e um tipo primitivo

Um ponto importante que o instrutor enfatiza: **null nao e "ausencia de tipo" — e um tipo primitivo proprio**. Assim como `string`, `number` e `boolean`, `null` e um tipo que significa "sem conteudo nenhum".

Isso muda a forma de pensar: quando uma variavel pode ser null, voce nao esta "sem tipo", voce esta dizendo que ela tem dois tipos possiveis.

## O operador pipe `|`

A sintaxe e simples: coloque `|` (pipe, barra vertical) entre cada tipo possivel:

```typescript
let variavel: tipo1 | tipo2 | tipo3
```

Voce pode encadear quantos tipos precisar. Cada tipo adicionado amplia o que a variavel aceita, mas tambem exige que o codigo que consome essa variavel trate todos os casos.

## Quando usar

O cenario mais comum e o **nullable**: uma variavel que pode ter um valor ou ser null. Isso aparece constantemente em:

- Respostas de APIs (pode retornar dados ou null)
- Consultas a banco de dados (registro pode nao existir)
- Parametros opcionais de funcoes
- Estados iniciais de variaveis antes de receberem valor

## Relacao com narrowing

Quando voce tem uma union type, o TypeScript exige que voce "estreite" (narrow) o tipo antes de usar metodos especificos. Por exemplo, se `response` e `string | null`, voce nao pode chamar `response.toUpperCase()` diretamente — precisa verificar se nao e null primeiro:

```typescript
if (response !== null) {
  response.toUpperCase() // OK, TypeScript sabe que aqui e string
}
```

Isso e um beneficio: o compilador te forca a tratar todos os casos possiveis, evitando erros em runtime.

## Union vs Any

Usar `any` parece resolver o problema de aceitar multiplos tipos, mas e uma armadilha: voce perde toda a seguranca de tipos. Union types dao flexibilidade **com seguranca** — voce aceita exatamente os tipos que fazem sentido, e o TypeScript te ajuda a tratar cada um.