---
name: rs-full-stack-o-que-sao-pacotes
description: "Applies package and dependency management concepts when working with JavaScript/Node.js projects. Use when user asks to 'install a package', 'add a library', 'manage dependencies', 'use npm', or 'choose between writing custom code vs using a package'. Guides decisions on when to use existing packages vs building from scratch. Make sure to use this skill whenever evaluating third-party dependencies or setting up project dependencies. Not for specific package API usage, framework configuration, or deployment pipelines."
---

# O que são Pacotes (Bibliotecas)

> Antes de implementar qualquer funcionalidade, verifique se existe um pacote mantido pela comunidade que resolve o problema — reutilizar codigo testado e mantido e sempre preferivel a reinventar a roda.

## Key concept

Pacotes (ou bibliotecas) sao funcionalidades prontas, distribuidas e mantidas pela comunidade, que podem ser reutilizadas em qualquer projeto. Ao usar um pacote, a aplicacao passa a **depender** dele — por isso o termo "dependencia". Um **gerenciador de pacotes** (npm, yarn, pnpm) controla instalacao, atualizacao e remocao dessas dependencias.

## Decision framework

| Situacao | Decisao |
|----------|---------|
| Tarefa repetitiva ou padrao comum (datas, HTTP, validacao) | Usar pacote existente |
| Precisa de alta flexibilidade e controle total | Implementar do zero |
| Funcionalidade critica com requisitos muito especificos | Avaliar pacote + adapter pattern |
| Pacote existe mas esta abandonado (sem commits em 1+ ano) | Buscar alternativa ou implementar |
| Pacote tem comunidade ativa e atualizacoes frequentes | Usar com confianca |

## Como pacotes funcionam

1. **Distribuicao** — pacotes sao publicados em registros (npm registry) pela comunidade ou organizacoes
2. **Instalacao** — gerenciador de pacotes baixa e registra a dependencia no projeto
3. **Dependencia** — a aplicacao passa a depender do pacote para funcionar
4. **Manutencao** — comunidade atualiza, corrige bugs e adiciona recursos
5. **Atualizacao** — gerenciador de pacotes facilita manter tudo atualizado

## Formas de incluir pacotes

### Via gerenciador de pacotes (recomendado)
```bash
npm install nome-do-pacote
```

### Via script injetado (CDN)
```html
<script src="https://cdn.exemplo.com/pacote.min.js"></script>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Precisa de funcionalidade comum | Pesquise no npm antes de implementar |
| Pacote tem milhoes de downloads semanais | Sinal de confiabilidade |
| Pacote tem 0 downloads ou sem manutencao | Evite, busque alternativa |
| Aplicacao em producao | Use versoes fixas, atualize com cuidado |
| Prototipo rapido | Pacotes aceleram muito o desenvolvimento |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Reescrever formatacao de datas do zero | Usar pacote como `date-fns` ou `dayjs` |
| Copiar codigo de pacote para o projeto | Instalar o pacote como dependencia |
| Ignorar atualizacoes de seguranca | Manter dependencias atualizadas |
| Instalar pacote para funcionalidade trivial (ex: `is-odd`) | Implementar funcoes simples inline |
| Usar pacote sem verificar manutencao e comunidade | Avaliar downloads, issues, ultimo commit |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre ecossistema de pacotes e comunidade
- [code-examples.md](references/code-examples.md) — Exemplos praticos de instalacao e uso de pacotes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-o-que-sao-pacotes/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-o-que-sao-pacotes/references/code-examples.md)
