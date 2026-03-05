# Deep Explanation: Hook de Compartilhamento Social

## Por que separar providers do hook?

O instrutor demonstra uma decisao arquitetural importante: ao perceber que o arquivo do hook precisaria de JSX (por causa dos icones dos providers), ele conscientemente decide **nao transformar o hook inteiro em TSX**. Em vez disso, cria um arquivo separado `social-providers.tsx` apenas para os providers que contem JSX, mantendo o hook em `.ts` puro.

A razao e pragmatica: hooks sao logica. Misturar JSX na logica cria acoplamento desnecessario e dificulta testes. Se o hook fosse `.tsx`, qualquer teste precisaria de um ambiente que suporte JSX, mesmo que a logica sendo testada seja pura.

## Providers como objeto, nao array

O instrutor escolhe um objeto `{ linkedin: {...}, facebook: {...} }` em vez de um array `[{...}, {...}]`. Isso permite:

1. **Acesso direto**: `socialProviders.linkedin` sem `.find()`
2. **Extensao estavel**: adicionar `threads` nao muda indices
3. **Chave como identificador**: o nome do provider e a chave, sem campo `id` redundante

## Spreading condicional — o padrao `...(val && { val })`

O instrutor mostra como construir o objeto `shareConfig` sem incluir chaves opcionais quando nao tem valor:

```typescript
const shareConfig = {
  url,
  ...(title && { title }),
  ...(text && { text }),
}
```

Quando `title` e `undefined` ou `""`, o spread de `false` nao adiciona nada ao objeto. Quando tem valor, `{ title }` e espalhado. Isso e mais limpo que checar com `if` e mais correto que incluir `undefined`.

## encodeURIComponent — por que e obrigatorio

Cada provider social recebe a URL via query string. Se a URL do post contem caracteres como `&`, `?`, `=`, `#` ou espacos, a query string quebra silenciosamente. O `encodeURIComponent` garante que a URL inteira e tratada como um unico valor de parametro.

## Clipboard timeout — feedback visual

O instrutor referencia o padrao usado pela propria documentacao do Next.js: ao clicar no botao de copiar, o icone muda temporariamente para dar feedback, depois volta ao original. O `clipboardTimeout` controla essa duracao. Definir como parametro com default (ex: 2000ms) permite que cada consumidor ajuste sem alterar o hook.

## Estrutura de layout

Para os botoes de compartilhamento, o instrutor usa:
- `flex` com `items-start` para alinhar ao topo
- `gap-2` (8px) para espaco entre botoes
- Icones com `h-4 w-4` (16x16px)

## Exercicio sugerido pelo instrutor

O instrutor sugere adicionar o Threads como provider adicional, seguindo o mesmo padrao dos demais. Isso valida que a estrutura de objeto e extensivel.