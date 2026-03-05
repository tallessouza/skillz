# Deep Explanation: Listagem de Arquivos

## Por que composicao de componentes

O instrutor cria `FileList` como componente separado dentro do sistema `FileInput`, nao como parte do componente principal. Isso segue o padrao de compound components do React — cada sub-componente (`Trigger`, `FileList`, `Control`) e independente mas compartilha estado via contexto (`useFileInput`).

O `FileList` usa `'use client'` porque precisa acessar o contexto React, que so funciona no client side no Next.js App Router.

## A decisao items-start vs items-center

O instrutor destaca que no layout, tanto o icone quanto o texto estao alinhados ao topo, nao ao centro. Isso e importante porque quando voce tem um item de arquivo com nome, tamanho E barra de progresso, o conteudo da direita e mais alto que o icone. Com `items-center`, o icone ficaria no meio — com `items-start`, fica no topo onde visualmente faz mais sentido.

## Badge de icone circular

O padrao `rounded-full border-4 border-violet-100 bg-violet-200 p-2 text-violet-600` cria um efeito de "badge" com tres camadas visuais:
1. **Borda clara** (`border-violet-100`) — anel externo sutil
2. **Fundo medio** (`bg-violet-200`) — area do badge
3. **Icone escuro** (`text-violet-600`) — contraste alto para o icone

Esse padrao e reutilizado em varios lugares do Ignite Tailwind.

## Barra de progresso com Tailwind puro

Nao usa nenhuma lib de progress bar. Sao apenas duas divs:
- Externa: define o "trilho" com `h-2 flex-1 rounded-full bg-zinc-100`
- Interna: define o "preenchimento" com `h-2 rounded-full bg-violet-600` e width dinamico

O `flex-1` na externa faz ela ocupar todo espaco disponivel, deixando espaco para o texto de porcentagem ao lado.

## formatBytes — por que criar uma utilidade

O instrutor mostra que `file.size` retorna bytes crus (numeros grandes e ilegiveis). Em vez de inline a conversao, cria uma funcao em `utils/format-bytes.ts`. Usa `toFixed(1)` (1 casa decimal) baseado no layout do Figma, nao `toFixed(2)` que o GPT sugeriu inicialmente.

## Logica de multiple files

O insight chave: quando o usuario seleciona novos arquivos, o comportamento padrao do input `type="file"` sobrescreve a selecao anterior. O instrutor resolve isso no `handleSelectedFiles`:

```typescript
if (multiple) {
  setFiles(prev => [...prev, ...newFiles]) // concatena
} else {
  setFiles(newFiles) // sobrescreve
}
```

A prop `multiple` e passada do `Control` para a funcao `onFileSelected`, com default `false`. Isso permite que cada instancia do FileInput decida se acumula ou sobrescreve arquivos.

## Re-exportacao via index

O componente `FileList` e criado como arquivo separado mas re-exportado via `index.ts` do `FileInput`. Isso permite usar `FileInput.FileList` como API publica, mantendo a organizacao interna.