# Deep Explanation: Context e Preview da Imagem

## Por que useId e não randomUUID?

O instrutor explica um ponto sutil: todo código dentro de um componente React é re-executado a cada render. Se você usar `crypto.randomUUID()` diretamente no corpo do componente, o ID muda cada vez que o componente renderiza — por alteração de props, estado, ou render do pai.

O React introduziu o hook `useId` exatamente para resolver isso. Ele gera um ID único que **persiste entre renderizações** do mesmo componente. O ID gerado tem um formato "esquisito" (como `:r1:`, `:r2:`), mas o importante é que o `htmlFor` do label e o `id` do input ficam sincronizados.

## O padrão Compound Component com Context

A arquitetura usada aqui é o padrão **Compound Component**:

1. **Root** — componente wrapper que cria o Context Provider
2. **Trigger** (label) — consome o `id` do contexto para o `htmlFor`
3. **Control** (input) — consome o `id` para o atributo `id` e o `onFilesSelected` para o onChange
4. **ImagePreview** — consome `files` para exibir preview

Cada `FileInput` na tela tem seu próprio Root, portanto seu próprio Context Provider, portanto seu próprio `id` e `files`. Isso resolve naturalmente o problema de múltiplos file inputs na mesma página.

## Por que não expor setState diretamente?

O instrutor explica que a tipagem de `setFiles` seria `Dispatch<SetStateAction<File[]>>`, que é complexa e pouco intuitiva para quem consome o contexto. Criar uma função `onFilesSelected: (files: File[]) => void` mantém a mesma funcionalidade com tipagem limpa.

## FileList vs Array

O `event.target.files` retorna uma `FileList`, que é um objeto iterável do HTML mas **não é um array**. Não tem `.map()`, `.filter()`, etc. O `Array.from()` converte para um array real de `File[]`.

## useMemo para URL de preview

`URL.createObjectURL()` cria uma URL temporária em memória para o arquivo. O instrutor usa `useMemo` para que isso só seja recalculado quando `files` mudar, evitando criar object URLs desnecessárias em re-renders causados por outros motivos.

## object-cover no CSS

A classe `object-cover` do Tailwind aplica `object-fit: cover`, que faz a imagem preencher o container (64x64 pixels) sem distorção, cortando o excesso. Isso é importante porque fotos de perfil podem ter proporções variadas.

## Diretiva 'use client' no Next.js

No Next.js App Router, componentes são Server Components por padrão. Qualquer componente que use hooks do React (useState, useContext, useMemo, useId) precisa da diretiva `'use client'` no topo do arquivo. O instrutor destaca isso como obrigatório.