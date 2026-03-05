# Deep Explanation: Preparando para Deploy

## O que e deploy

Deploy e o processo de enviar o projeto para producao — colocar no ar. Existe uma infinidade de opcoes:

### Servicos
- **Cloud providers:** AWS, Google Cloud Platform (GCP), Azure
- **Servicos gerenciados:** Render, Fly.io, Vercel

### Arquiteturas de deploy
- Serverless
- Docker com Kubernetes
- Escalonamento horizontal gerenciado
- Servicos gerenciados (mais simples, automatizam mais, custo maior)

Para primeiros projetos, o instrutor recomenda nao se preocupar demais com infraestrutura complexa e usar servicos gerenciados.

## Por que nao usar tsc para build

O compilador TypeScript (`tsc`) funciona, mas tem problemas praticos:

1. **Lento** — especialmente em codebases grandes, porque faz type-checking completo
2. **Gera arquivos onde nao devia** — ao rodar `tsc`, ele pode gerar `.js` dentro de `test/` e na raiz do projeto (arquivos como `vitest.config.js`), nao apenas dentro da pasta de build
3. **Configuracao extra necessaria** — precisa configurar `rootDir` e `outDir` no tsconfig, e mesmo assim gera erros como "file is not under rootDir"

Na aula, o instrutor demonstrou o problema: ao rodar `npx tsc`, apareceu o erro "TransactionsSpec is not under root dir" e arquivos `.js` foram criados dentro de `test/` — codigo que nao deveria existir.

## Por que tsup

O tsup usa o ESBuild internamente — a mesma engine usada pelo:
- **TSX** (execucao de TypeScript em dev)
- **Vitest** (execucao de testes)

ESBuild e extremamente rapido porque nao faz type-checking — apenas transpila. Na demonstracao, a build completa levou **14 milissegundos**.

O tsup so converte o que esta dentro da pasta `src/`, ignorando testes e arquivos de configuracao. Isso e exatamente o que queremos para producao.

## Convenção de nome da pasta de saida

- `dist` e o default do tsup
- `build` e mais convencional e descritivo
- Para mudar: usar `--out-dir build` ou `-d build`

## .gitignore categorizado

O instrutor recomenda organizar o .gitignore com comentarios por categoria:
- Dependencies
- Database
- Environment
- Build

Isso facilita a manutencao conforme o projeto cresce.

## Wildcard para arquivos de banco

Usar `db/*.db` ao inves de `db/app.db` — se um dia o nome do banco mudar, o gitignore continua funcionando.

## GitHub CLI

O instrutor usa `gh` (GitHub CLI) para criar repositorios direto do terminal:

```bash
gh repo create  # interativo
gh repo view -w  # abre no browser
```

Opcoes usadas:
- Push de codigo local existente (nao criar do zero)
- Path: `.` (diretorio atual)
- Repositorio privado
- Adicionar remote como `origin`
- Enviar commits imediatamente