---
name: rs-electron-assinatura-distribuicao
description: "Guides Electron app signing and distribution decisions when building desktop apps. Use when user asks to 'distribute electron app', 'sign electron app', 'build desktop app', 'setup auto-update', or 'publish electron app'. Covers code signing costs, auto-update alternatives via GitHub releases, and Electron Builder configuration. Make sure to use this skill whenever planning Electron app distribution strategy. Not for web app deployment, mobile app store publishing, or CI/CD pipeline configuration."
---

# Assinatura e Distribuição de Apps Electron

> Escolha a estrategia de distribuicao baseada no nivel de maturidade da aplicacao: sem assinatura para MVPs, com certificacao apenas quando o desktop e o core do negocio.

## Key concept

Distribuir apps Electron e diferente de web (deploy instantaneo) e de mobile (loja com revisao). No Electron, voce gera executaveis (`.exe`, `.dmg`, `.AppImage`) e disponibiliza para download. A decisao principal e: assinar o codigo ou nao.

Sem assinatura, o OS exibe aviso de "desenvolvedor nao identificado". Com assinatura, o app e reconhecido como confiavel — mas custa dinheiro e exige renovacao anual.

## Decision framework

| Situacao | Estrategia |
|----------|-----------|
| MVP, projeto pessoal, app interno | Sem assinatura — build simples com Electron Builder |
| App desktop e o core do negocio | Certificacao completa + Electron Updater |
| Precisa auto-update sem certificacao | Checar versao via GitHub Releases API |
| Quer publicar em Mac App Store / Windows Store | Conta de desenvolvedor paga obrigatoria |

## How to think about it

### Distribuicao sem assinatura

Funciona perfeitamente para a maioria dos casos. Usuarios de Mac ja estao acostumados a aceitar apps de "desenvolvedores nao identificados". Gere os executaveis com Electron Builder e disponibilize via site ou GitHub Releases.

### Custo da assinatura

- **Windows:** EV Code Signing Certificate — a partir de ~R$400/ano, renovacao anual (similar a certificado SSL)
- **macOS:** Conta de desenvolvedor Apple paga
- Referencia: documentacao do Electron Builder em Guides > Code Signing

### Auto-update sem certificacao (alternativa ao Electron Updater)

O Electron Updater so funciona com apps assinados. A alternativa:

1. Armazene a versao atual no `package.json`
2. Ao abrir o app, consulte a API do GitHub para a ultima release
3. Compare as versoes (semantic versioning: major.minor.patch)
4. Se diferente, exiba modal: "Nova versao disponivel" com link para a pagina de releases
5. Usuario baixa manualmente — a nova versao substitui a anterior automaticamente

### Ferramentas

- **Electron Builder** — biblioteca padrao para build de apps Electron (suporta macOS, Windows, Linux)
- **Electron Updater** — auto-update automatico (requer app assinado)
- **GitHub Actions** — para CI/CD de build e releases multiplataforma

## Common misconceptions

| Pensam | Realidade |
|--------|-----------|
| Preciso assinar o app para distribuir | Nao — assinatura remove o aviso de seguranca, mas o app funciona sem ela |
| Electron Updater funciona em qualquer app | So funciona em apps assinados com certificado valido |
| Auto-update e impossivel sem certificacao | Pode checar versao via GitHub API e direcionar usuario para download |
| Distribuir Electron e como mobile (loja obrigatoria) | Pode simplesmente disponibilizar executavel para download no site |

## When to apply

- Ao planejar a estrategia de distribuicao de um app Electron
- Ao decidir se vale investir em code signing
- Ao implementar mecanismo de atualizacao sem Electron Updater
- Ao configurar Electron Builder para build multiplataforma

## Limitations

- Este skill nao cobre configuracao detalhada do Electron Builder (veja skill especifico)
- Nao cobre o processo passo-a-passo de obtencao de certificados
- Nao cobre publicacao em lojas oficiais (Mac App Store, Windows Store)

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
