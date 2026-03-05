# Deep Explanation: Instalacao Next.js com Pages Router

## Por que Pages Router primeiro?

O instrutor enfatiza que aprender Pages Router antes da App Router e estrategico. A Pages Router ainda e amplamente utilizada no mercado — muitos projetos em producao rodam com ela. Dominar Pages Router primeiro permite:

1. **Sentir as melhorias** — Quando migrar para App Router, voce entende o que mudou e por que
2. **Empregabilidade** — Projetos legados (que sao a maioria) usam Pages Router
3. **Fundamentos solidos** — O modelo mental de roteamento por arquivo e mais simples de internalizar

## Estrutura de pastas: o que importa

A pasta `pages/` (ou `src/pages/` com src habilitado) e onde "tudo ganha forma no browser". Cada arquivo dentro dessa pasta se torna automaticamente uma rota.

O arquivo `index.tsx` e a **porta de entrada** — corresponde a rota raiz `/`. Isso e um conceito fundamental do Next.js: o sistema de arquivos define as rotas.

## Processo de instalacao

O `create-next-app` faz tres coisas:
1. Cria a estrutura de pastas
2. Instala dependencias: `react`, `react-dom`, `next` (producao) + dependencias de dev
3. Configura TypeScript, Tailwind, ESLint conforme as respostas

A velocidade da instalacao depende da internet — o instrutor nota que "costuma ser bem rapido" mas pode variar.

## Verificacao imediata

Apos instalar, o fluxo e:
1. Abrir no editor
2. `npm run dev`
3. Acessar `localhost:3000`
4. Editar `index.tsx` → ver mudanca no browser

Esse ciclo rapido de feedback e intencional — Next.js com hot reload permite desenvolvimento iterativo sem restart manual.