---
name: rs-full-stack-versionamento-semantico
description: "Enforces semantic versioning interpretation when managing Node.js dependencies, updating packages, or choosing library versions. Use when user asks to 'update a package', 'check outdated dependencies', 'upgrade a library', 'install a specific version', or 'understand version numbers'. Applies semver rules: Major = breaking changes, Minor = new features backward-compatible, Patch = bug fixes. Make sure to use this skill whenever evaluating dependency updates or reading package.json versions. Not for application versioning strategy, git tagging, or release management workflows."
---

# Versionamento Semântico

> Cada número em uma versão tem um significado preciso — interprete-os antes de decidir qualquer atualização de dependência.

## Key concept

Versionamento semântico (semver) é um padrão que usa três números separados por ponto (`MAJOR.MINOR.PATCH`) para comunicar o tipo e o impacto de cada atualização. Compreender semver permite decidir com segurança se uma atualização é segura ou se pode quebrar o projeto.

## Decision framework

| Quando encontrar | Ação |
|-----------------|------|
| Número MAJOR mudou (ex: 1.x.x → 2.x.x) | ALERTA: breaking changes — verificar changelog e guia de migração antes de atualizar |
| Número MINOR mudou (ex: 1.12.x → 1.13.x) | SEGURO: novas funcionalidades compatíveis com versão anterior — atualizar com confiança |
| Número PATCH mudou (ex: 1.12.7 → 1.12.8) | SEGURO: correções de bugs e melhorias pequenas — atualizar sem preocupação |
| Múltiplos números mudaram | Avaliar do mais significativo (MAJOR) para o menos (PATCH) |

## Estrutura da versão

```
1.12.7
│  │  └── PATCH — correções de bugs, melhorias pequenas (compatível)
│  └───── MINOR — novas funcionalidades (compatível com versões anteriores)
└──────── MAJOR — mudanças significativas (pode quebrar compatibilidade = breaking change)
```

## How to think about it

### Atualizando uma dependência
Antes de rodar `npm update` ou alterar a versão no `package.json`, leia a versão atual e a versão alvo. Se o MAJOR mudou, busque o changelog da biblioteca para entender o que quebrou. Se apenas MINOR ou PATCH mudaram, a atualização é segura.

### Escolhendo versão para o projeto
Ao instalar uma nova dependência, prefira versões com MAJOR estável (não 0.x.x em produção). Uma biblioteca em `0.x.x` indica que a API ainda não é considerada estável pelos mantenedores.

## Common misconceptions

| O que pensam | Realidade |
|-------------|-----------|
| "Atualizar sempre é seguro" | Atualizações MAJOR podem quebrar a aplicação — sempre verificar breaking changes |
| "Número maior = melhor" | Número maior indica mudanças incompatíveis, não necessariamente qualidade superior |
| "PATCH não importa" | Correções de bugs podem ser críticas para segurança e estabilidade |
| "Bibliotecas não devem mudar" | Atualizações são normais e saudáveis — trazem correções, funcionalidades e eficiência |

## Anti-patterns

| Nunca faça | Faça em vez disso |
|------------|-------------------|
| Atualizar MAJOR sem ler changelog | Verificar breaking changes e guia de migração antes |
| Ignorar atualizações PATCH por meses | Aplicar PATCH regularmente — contêm correções de segurança |
| Usar `*` como versão no package.json | Usar range específico (`^1.12.7` ou `~1.12.7`) |
| Atualizar todas as deps de uma vez | Atualizar uma por uma, testando entre cada atualização |

## When to apply

- Ao adicionar uma nova dependência ao projeto
- Ao avaliar se deve atualizar uma biblioteca existente
- Ao interpretar versões no `package.json` ou `package-lock.json`
- Ao investigar incompatibilidades após uma atualização

## Limitations

- Semver é uma convenção — nem todas as bibliotecas seguem rigorosamente
- Uma mudança MINOR pode, na prática, ter side effects inesperados mesmo sendo "compatível"
- Versões `0.x.x` não garantem estabilidade entre MINOR releases

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo, analogias e edge cases do versionamento semântico
- [code-examples.md](references/code-examples.md) — Exemplos práticos de versões em package.json e cenários de atualização