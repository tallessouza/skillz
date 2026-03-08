---
name: rs-full-stack-o-projeto-2029
description: "Enforces pre-deployment local validation workflow when preparing a frontend project for production deploy. Use when user asks to 'deploy frontend', 'prepare for deploy', 'test before production', 'validate project locally', or 'run before deploying'. Ensures project runs locally before any deploy attempt: clone/download, install dependencies, run dev server, verify in browser. Make sure to use this skill whenever deploying any web project to production. Not for backend deploy, Docker setup, or CI/CD pipeline configuration."
---

# Validacao Local Pre-Deploy

> Antes de fazer deploy, execute o projeto localmente e confirme que tudo funciona — produção nao é lugar para descobrir erros.

## Prerequisites

- Node.js instalado
- Acesso ao repositorio do projeto (GitHub ou download local)
- Terminal disponivel

## Steps

### Step 1: Obter o projeto

Clone ou faca download do repositorio. Se o projeto ja existe localmente, pule para o Step 2.

```bash
git clone <repository-url>
cd <project-directory>
```

### Step 2: Instalar dependencias

O projeto baixado nao inclui `node_modules`. Instale as dependencias antes de qualquer outra acao.

```bash
npm install
```

Verifique que a pasta `node_modules` foi criada com sucesso.

### Step 3: Executar em modo desenvolvimento

```bash
npm run dev
```

Anote a URL local exibida no terminal (ex: `http://localhost:5173`).

### Step 4: Validar no navegador

Abra a URL no navegador (Ctrl+click no terminal ou copie manualmente). Teste os fluxos principais da aplicacao:

1. Pagina carrega sem erros no console
2. Interacoes do usuario funcionam (formularios, botoes, navegacao)
3. Nenhum erro de rede ou recursos faltando

## Output format

Confirmacao de que o projeto roda localmente sem erros, pronto para deploy.

## Error handling

- Se `npm install` falha: verifique versao do Node.js e se o `package.json` existe
- Se `npm run dev` falha: verifique se a porta nao esta ocupada por outro processo
- Se a pagina nao carrega: confirme a URL correta exibida no terminal

## Verification

- Abra o DevTools (F12) e confirme zero erros no console
- Teste pelo menos um fluxo completo do usuario
- Projeto funcionando local = seguro para deploy em producao

## Heuristics

| Situacao | Acao |
|----------|------|
| Projeto clonado sem node_modules | Executar `npm install` antes de tudo |
| Porta padrao ocupada | Vite automaticamente sugere outra porta, ou encerre o processo na porta |
| Projeto usa Vite | URL padrao sera `localhost:5173` |
| Projeto usa CRA | URL padrao sera `localhost:3000` |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Deploy sem testar local | Sempre execute `npm run dev` e valide no navegador primeiro |
| Ignorar erros no console | Corrija todos os erros antes de fazer deploy |
| Pular `npm install` apos download | Sempre instale dependencias — node_modules nao vem no repositorio |
| Assumir que funciona porque funcionou antes | Teste toda vez antes de cada deploy |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre por que validacao local e essencial
- [code-examples.md](references/code-examples.md) — Exemplos de comandos e fluxos de validacao