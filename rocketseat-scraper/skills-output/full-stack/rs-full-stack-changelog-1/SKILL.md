---
name: rs-full-stack-changelog-1
description: "Applies changelog reading and version tracking practices when managing Node.js dependencies, updating packages, or evaluating library upgrades. Use when user asks to 'update a dependency', 'check what changed in a version', 'upgrade a package', 'migrate to a new version', or 'review release notes'. Ensures developers consult changelogs before upgrading, identify breaking changes, and follow migration guides. Make sure to use this skill whenever evaluating or performing dependency updates. Not for writing changelogs, generating release notes, or semantic versioning configuration."
---

# Changelog — Entendendo Atualizações de Dependências

> Antes de atualizar qualquer dependência, consulte o changelog para entender o que mudou, identificar breaking changes e seguir guias de migração.

## Key concept

Um changelog é um relatório que detalha o que mudou em cada versão de uma biblioteca ou ferramenta. Nele se encontram correções de bugs, novas funcionalidades e breaking changes (incompatibilidades com versões anteriores). Consultar o changelog antes de atualizar é essencial para garantir compatibilidade do projeto.

## Decision framework

| Quando você encontra | Faça |
|---------------------|------|
| Atualização de patch (ex: 4.18.1 → 4.18.2) | Consulte changelog — geralmente correções de bugs, baixo risco |
| Atualização de minor (ex: 4.18 → 4.19) | Consulte changelog — pode trazer novas funcionalidades |
| Atualização de major (ex: 4.x → 5.x) | Consulte changelog E guia de migração — provavelmente tem breaking changes |
| Comunidade reportou bugs na versão nova | Aguarde próximo patch ou consulte issues no GitHub |
| Changelog não disponível ainda | Espere a documentação ficar pronta antes de atualizar em produção |

## Onde encontrar changelogs

| Local | Exemplo |
|-------|---------|
| Site oficial da biblioteca | Express JS changelog na documentação |
| Repositório GitHub → Releases | React changelog no GitHub |
| Blog da ferramenta | React Native lista mudanças em formato de blog/artigo |
| NPM → link para repositório → Issues | Relatar bugs, perguntas, vulnerabilidades |

## How to think about it

### Atualizações rápidas são normais

É comum uma biblioteca lançar uma versão e no dia seguinte já lançar outra correção. Quando a comunidade começa a usar uma versão nova, cenários que não foram previstos aparecem. Isso faz parte do ciclo open source — a comunidade encontra problemas e contribui com reports.

### Nem todo changelog segue o mesmo formato

Algumas bibliotecas usam tópicos objetivos e sucintos. Outras produzem artigos completos com benchmarks, highlights e guias detalhados. Não existe padrão único — o importante é saber que o changelog existe e onde encontrá-lo.

### Breaking changes exigem guia de migração

Quando uma versão traz mudanças drásticas (ex: mudança de major version), bibliotecas bem mantidas disponibilizam um guia de migração. Sempre procure esse guia antes de atualizar — ele mostra exatamente o que adaptar no seu projeto.

## Workflow de atualização segura

1. **Identificar** a versão atual e a versão alvo
2. **Consultar** o changelog entre as duas versões
3. **Verificar** se há breaking changes listadas
4. **Seguir** o guia de migração (se existir)
5. **Testar** a aplicação após a atualização
6. **Reportar** problemas encontrados via Issues no GitHub

## Como contribuir via Issues

| Tipo | Quando usar |
|------|-------------|
| Bug report | Encontrou um comportamento inesperado |
| Documentation | Erro ou falta de informação na documentação |
| Question | Dúvida sobre comportamento ou uso |
| Security/Vulnerability | Encontrou falha de segurança |

## Common misconceptions

| Pessoas pensam | Realidade |
|---------------|-----------|
| Atualizar dependência é só mudar o número da versão | Sem consultar changelog, breaking changes podem quebrar o projeto silenciosamente |
| Só major versions trazem mudanças importantes | Minor e patch versions também podem trazer correções críticas de segurança |
| Changelog é só para mantenedores da biblioteca | Changelog é para todos que usam a biblioteca — é o primeiro recurso antes de atualizar |
| Reportar bugs é só para contribuidores avançados | Qualquer desenvolvedor pode abrir uma issue — isso é a essência do open source |

## Limitations

- Nem todas as bibliotecas mantêm changelogs atualizados ou detalhados
- Guias de migração podem não estar prontos no momento do lançamento
- Changelogs não substituem testes — sempre teste após atualizar

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre importância de changelogs, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Exemplos práticos de consulta de changelogs e fluxo de atualização