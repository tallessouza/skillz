# Deep Explanation: Tipagem em Arrays no TypeScript

## Conceito central

No TypeScript, arrays sao tipados adicionando `[]` apos o tipo base. Isso cria um contrato: o array so aceita valores daquele tipo. O compilador bloqueia qualquer insercao que viole o contrato.

## Duas formas de tipar

### 1. Tipagem explicita (Type Annotation)

O instrutor chama de "deixar explicito as regras do jogo". Voce declara qual tipo de conteudo o array aceita antes de atribuir valores.

```typescript
let names: string[] = ["Rodrigo", "Mayk"]
```

O instrutor demonstra que ao tentar `names.push(8)`, o TypeScript rejeita porque `number` nao e `string`. E vice-versa: `numbers.push("texto")` tambem falha. Isso e o TypeScript "dizendo as regras do jogo".

### 2. Inferencia de tipo

Quando voce atribui valores imediatamente, o TypeScript deduz o tipo sozinho:

```typescript
let products = ["Product x", "Product y", "Product z"]
// TypeScript infere: string[]
```

O instrutor mostra que ao passar o mouse sobre `products` no editor, o TypeScript ja exibe `string[]` automaticamente.

## Nomenclatura

O instrutor menciona que "tipagem explicita" e "anotacao de tipo" (type annotation) sao nomes diferentes para a mesma coisa. Nao importa qual nome voce usa — o importante e saber aplicar na pratica.

## Quando usar cada abordagem

- **Anotacao**: quando o array comeca vazio, quando o tipo nao e obvio pelos valores, ou em parametros/retornos de funcao
- **Inferencia**: quando os valores sao atribuidos na declaracao e o tipo e claro

## O que muda em relacao a variaveis simples

A unica diferenca sintatica e o `[]` apos o tipo. `string` = um texto, `string[]` = uma lista de textos. O colchetes e "o simbolo, a representacao de uma lista, de um array no JavaScript", como o instrutor explica.