# Code Examples: O que é CI

## Contexto do curso

Esta aula é conceitual — não contém código prático. O instrutor prepara o terreno para a próxima aula onde a pipeline será construída na prática. Os exemplos abaixo ilustram os conceitos discutidos.

## Scripts de automação típicos referenciados

O instrutor menciona que scripts de automação são os comandos que rodam no build e nos testes:

```bash
# Comandos que tipicamente compõem uma pipeline CI (mencionados pelo instrutor)
npm test          # Rodar testes automatizados
npm run build     # Fazer build da aplicação
npm run lint      # Validar padrões de código (mencionado como parte da padronização)
```

## Estrutura conceitual de uma pipeline CI

Baseado na explicação do instrutor sobre os componentes:

```yaml
# Exemplo conceitual de pipeline CI (GitHub Actions - ferramenta escolhida no curso)
name: CI Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  validate:
    runs-on: ubuntu-latest  # Runner/agent em container
    steps:
      - uses: actions/checkout@v4      # Versionamento (Git)

      - name: Install dependencies
        run: npm ci

      - name: Lint                      # Padronização
        run: npm run lint

      - name: Type check                # Validação de tipos
        run: npm run typecheck

      - name: Tests                     # Testes automatizados (obrigatório!)
        run: npm test

      - name: Build                     # Gera artefato validado
        run: npm run build
```

## O problema que CI resolve — lefthook pode ser pulado

```bash
# Dev pode pular hooks locais intencionalmente
git commit --no-verify -m "subindo código quebrado"

# CI garante que validações rodam INDEPENDENTE do setup local
# Mesmo que o dev pule lefthook, a pipeline vai pegar o problema
```

## Fluxo CI → CD → CD

```
Developer commit
       │
       ▼
┌─────────────┐
│     CI      │  Build + Test + Lint
│  (Validar)  │  Resultado: artefato validado (ex: Docker image)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Continuous │  Envia para homologação automaticamente
│  Delivery   │  Deploy para produção: MANUAL (botão)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Continuous │  Tudo que passa no CI vai direto
│  Deployment │  Deploy para produção: AUTOMÁTICO
└─────────────┘
```