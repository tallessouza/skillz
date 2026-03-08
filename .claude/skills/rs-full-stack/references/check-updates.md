---
name: rs-full-stack-check-updates
description: "Enforces npm dependency update workflow using npm-check-updates when managing Node.js project packages. Use when user asks to 'update packages', 'check outdated dependencies', 'upgrade npm modules', 'list available updates', or 'manage project dependencies'. Applies npx npm-check-updates workflow with semver interpretation. Make sure to use this skill whenever auditing or updating Node.js project dependencies. Not for installing new packages, removing packages, or configuring package.json scripts."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [npm, npm-check-updates, dependencies, semver, package-management]
---

# Check Updates — Atualizando Dependências com npm-check-updates

> Utilize `npx npm-check-updates` para visualizar, interpretar e atualizar dependências do projeto de forma segura e informada.

## Prerequisitos

- Node.js e npm instalados
- Projeto com `package.json` existente
- Se `npx` não disponível: atualizar npm (`npm install -g npm`)

## Steps

### Step 1: Listar atualizações disponíveis

```bash
npx npm-check-updates
```

O `npx` instala o pacote temporariamente (confirme com `y` quando solicitado) e lista todos os pacotes com atualizações disponíveis, mostrando versão atual e versão recomendada.

### Step 2: Interpretar o output pelo versionamento semântico

A ferramenta usa cores para indicar o tipo de atualização:

| Cor | Tipo de mudança | Significado semver |
|-----|----------------|-------------------|
| Verde | Patch (x.y.**Z**) | Correção de bugs |
| Ciano | Minor (x.**Y**.z) | Novas funcionalidades, retrocompatível |
| Vermelho | Major (**X**.y.z) | Breaking changes, pode quebrar código |

### Step 3: Aplicar atualizações

```bash
# Atualizar package.json com as versões recomendadas
npx npm-check-updates -u

# Instalar as novas versões
npm install
```

### Step 4: Verificar integridade

```bash
# Rodar testes após atualização
npm test
```

## Output format

```
Checking /path/to/project/package.json
[====================] 3/3 100%

 express           ^4.18.2  →  ^4.19.2
 jsonwebtoken      ^9.0.0   →  ^9.0.2

Run npx npm-check-updates -u to upgrade package.json
```

## Error handling

- Se `npx` pedir confirmação para instalar: confirmar com `y` (instalação temporária, não polui o projeto)
- Se nenhuma atualização disponível: output vazio indica que tudo está na versão mais recente
- Se atualização major quebrar código: reverter com `git checkout package.json package-lock.json && npm install`

## Heuristics

| Situação | Ação |
|----------|------|
| Só patches disponíveis (verde) | Atualizar sem preocupação, são correções de bugs |
| Minor updates (ciano) | Atualizar com confiança, novas funcionalidades retrocompatíveis |
| Major updates (vermelho) | Verificar changelog antes de atualizar, pode ter breaking changes |
| Projeto em produção | Atualizar em branch separada, rodar testes antes de merge |
| Muitos pacotes desatualizados | Atualizar em lotes por tipo (patches primeiro, depois minors, depois majors) |

## Anti-patterns

| Nunca faça | Faça em vez disso |
|------------|-------------------|
| `npm update` sem verificar o que muda | `npx npm-check-updates` para visualizar antes |
| Atualizar todos os majors de uma vez | Atualizar um major por vez, testar entre cada |
| Ignorar atualizações de patch | Aplicar patches regularmente, porque corrigem bugs e vulnerabilidades |
| Instalar `npm-check-updates` globalmente | Usar `npx npm-check-updates` para execução temporária |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| `npx` pede confirmacao toda vez | Pacote nao instalado globalmente | Confirme com `y` (instalacao temporaria, sem poluir o projeto) |
| Nenhuma atualizacao listada | Todas as deps ja estao na versao mais recente | Nenhuma acao necessaria |
| Atualizacao major quebrou o projeto | Breaking changes na nova versao | Reverta com `git checkout package.json package-lock.json && npm install` |
| `npm install` falha apos `ncu -u` | Conflito de versoes entre dependencias | Atualize uma dependencia por vez e teste entre cada |
| Output sem cores no terminal | Terminal sem suporte a cores ANSI | Use flag `--color` ou verifique configuracao do terminal |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre versionamento semântico e estratégias de atualização
- [code-examples.md](references/code-examples.md) — Todos os exemplos de uso do npm-check-updates com variações