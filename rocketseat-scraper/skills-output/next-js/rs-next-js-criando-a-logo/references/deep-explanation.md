# Deep Explanation: Criando a Logo — Extracao de Componentes Reutilizaveis

## Por que extrair um componente?

O instrutor enfatiza que a duplicacao de codigo entre header e footer "nao e um alarme" por si so, mas quando voce ja esta copiando e colando, faz sentido criar um componente. O ponto chave e o momento certo: nao e sobre regras dogmaticas de DRY, mas sobre pragmatismo — quando a copia comeca, o componente nasce.

## Retorno unico no React

O instrutor lembra que "o JSX e sempre uma funcao que retorna um unico elemento". Isso e fundamental: React components sao funcoes, e funcoes retornam um valor. Se voce precisa de multiplos elementos, use um fragment `<>...</>`. No caso da Logo, o `<Link>` ja serve como elemento raiz unico, entao fragment nao foi necessario.

## Props como mecanismo de variacao

O instrutor sugere duas abordagens para variacoes:
1. **Props semanticas** — `variant="light"` ou `variant="dark"` para controlar a cor
2. **className direto** — passar className para estilizacao customizada por contexto

A escolha depende do caso: se as variacoes sao previsíveis e finitas, use props semanticas. Se sao abertas e customizaveis, aceite className.

## Principio da fonte unica de verdade

"Se a gente tiver alguma alteracao na logo, basta ir no componente, alterar la e automaticamente altera nos dois." Este e o beneficio central: uma mudanca de marca, de link, de alt text — tudo propaga automaticamente. Hoje sao 2 usos, amanha podem ser 10.

## Padrao de organizacao

O instrutor segue o padrao:
- Pasta por componente (`Logo/`)
- Arquivo do componente (`logo.tsx`)
- Barrel export (`index.ts`)

Isso permite imports limpos: `import { Logo } from "@/components/Logo"` sem expor detalhes internos.