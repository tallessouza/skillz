# Deep Explanation: Colocando o Projeto no GitHub

## Por que colocar no GitHub antes do deploy?

O fluxo moderno de deploy segue o padrão **Git-based deployment**: o ambiente de deploy (Vercel, Railway, Render, etc.) monitora um repositório GitHub e automaticamente faz build + deploy quando detecta novos commits. Isso elimina upload manual de arquivos e garante rastreabilidade — cada deploy corresponde a um commit específico.

## Conventional Commits para configuração

O instrutor usa o prefixo `chore:` no commit. No padrão Conventional Commits:

- `feat:` — nova funcionalidade
- `fix:` — correção de bug
- `chore:` — tarefas de manutenção/configuração que não alteram funcionalidade
- `docs:` — documentação
- `refactor:` — refatoração sem mudança de comportamento

`chore: deploy config` comunica que este commit é preparação para deploy, não código novo. Isso facilita leitura do histórico e automações (changelogs, versionamento semântico).

## O papel do .gitignore

O `.gitignore` é crítico para deploy porque:

1. **`node_modules/`** — O ambiente de deploy roda `npm install` automaticamente a partir do `package.json`. Enviar `node_modules/` desperdiça banda, aumenta tempo de push, e pode causar incompatibilidades de OS (binários nativos compilados para sua máquina local podem não funcionar no servidor).

2. **`build/` ou `dist/`** — O ambiente de deploy executa `npm run build` no servidor. Enviar artefatos de build locais é redundante e pode mascarar erros de build no servidor.

3. **`.env`** — Contém secrets (chaves de API, senhas de banco). Nunca deve ir para o repositório. O ambiente de deploy tem sua própria interface para configurar variáveis de ambiente de forma segura.

## git remote add origin

O comando `git remote add origin <URL>` registra o repositório GitHub como "remote" chamado `origin`. `origin` é apenas uma convenção de nome — o importante é a URL que aponta para o repositório. Após configurar, `git push -u origin main` envia a branch `main` e configura o tracking, para que futuros pushes precisem apenas de `git push`.

## Repositório privado vs público

O instrutor escolhe **privado** porque:
- Projetos de deploy frequentemente contêm configurações específicas do ambiente
- Código de produção não precisa ser público
- Ambientes de deploy (Vercel, Railway) acessam repos privados via OAuth/token

## Fluxo completo: local → GitHub → deploy

```
Máquina local          GitHub              Ambiente de deploy
    │                    │                       │
    ├─ git init          │                       │
    ├─ git add .         │                       │
    ├─ git commit        │                       │
    ├─ git remote add ───┤                       │
    ├─ git push ─────────┤                       │
    │                    ├── webhook trigger ─────┤
    │                    │                       ├─ git clone
    │                    │                       ├─ npm install
    │                    │                       ├─ npm run build
    │                    │                       └─ serve application
```

Este é o pipeline que será completado nas próximas aulas — colocar no GitHub é o primeiro passo necessário.