---
name: rs-full-stack-o-que-e-o-type-script
description: "Applies TypeScript mental models when deciding whether to add types, migrate from JavaScript, or explain TypeScript fundamentals. Use when user asks 'what is TypeScript', 'why use TypeScript', 'should I add types', 'migrate JS to TS', or 'TypeScript vs JavaScript'. Guides gradual adoption strategy and explains the compilation pipeline. Make sure to use this skill whenever TypeScript adoption decisions arise. Not for specific TypeScript syntax, generics, or advanced type patterns."
---

# O Que é o TypeScript

> TypeScript adiciona tipagem ao JavaScript como ferramenta de desenvolvimento — no build final, tudo vira JavaScript puro.

## Key concept

JavaScript é uma linguagem não tipada: variáveis aceitam qualquer valor, parâmetros não exigem tipos específicos. Essa flexibilidade popularizou o JavaScript, mas dificulta o crescimento consistente de aplicações. TypeScript resolve isso adicionando tipagem estática que existe apenas em tempo de desenvolvimento — o código final é sempre JavaScript.

**Pipeline de compilação em 3 etapas:**
1. Código TypeScript (com tipos)
2. Remoção das tipagens (compilação)
3. JavaScript puro (executável em qualquer ambiente JS)

## Decision framework

| Situação | Decisão |
|----------|---------|
| Projeto novo com mais de 1 dev | Usar TypeScript desde o início |
| Projeto JS existente grande | Adotar TypeScript gradualmente — não precisa migrar tudo de uma vez |
| Script pequeno e descartável | JavaScript puro é suficiente |
| Função usada por outros devs | Tipar parâmetros e retorno — deixa as "regras do jogo" claras |
| Sensação de código verboso | Normal no início — a consistência compensa o esforço extra |

## How to think about it

### TypeScript como contrato entre desenvolvedores

Quando você tipa os parâmetros de uma função de cadastro (string para nome, number para idade), está definindo regras claras. Outro desenvolvedor que usar essa função sabe exatamente o que passar, sem precisar ler a implementação.

### TypeScript existe só no desenvolvimento

O navegador e o Node.js não executam TypeScript. O compilador remove toda tipagem antes do deploy. TypeScript é uma ferramenta para o desenvolvedor, não para o runtime.

### Adoção gradual é válida

Um projeto 100% JavaScript pode receber TypeScript arquivo por arquivo. Não existe obrigação de migrar tudo de uma vez para que funcione.

## Vantagens concretas

| Vantagem | Exemplo prático |
|----------|----------------|
| Feedback rápido de erros | Editor mostra erro antes de executar a aplicação |
| Código mais consistente | Variáveis mantêm o tipo esperado ao longo do fluxo |
| Trabalho em equipe | Parâmetros tipados comunicam a intenção da função |
| Autocomplete melhor | VSCode sugere propriedades de objetos tipados automaticamente |
| Refatoração segura | Renomear ou mudar tipos revela todos os pontos afetados |

## Common misconceptions

| Pessoas pensam | Realidade |
|----------------|-----------|
| TypeScript é uma linguagem separada | É uma extensão do JavaScript — todo JS válido é TS válido |
| Precisa migrar tudo de uma vez | Adoção gradual funciona, arquivo por arquivo |
| TypeScript roda no navegador | Não — é compilado para JS antes da execução |
| Adicionar tipos é escrever mais código à toa | A verbosidade extra previne bugs que só apareceriam em runtime |
| TypeScript deixa a aplicação mais lenta | Tipos são removidos no build — zero impacto em performance |

## Limitations

- TypeScript não substitui testes — tipos verificam forma, não lógica de negócio
- Tipos complexos demais podem reduzir legibilidade ao invés de melhorar
- Bibliotecas sem tipos (@types) podem exigir declarações manuais
- O overhead inicial de configuração (tsconfig, build pipeline) existe

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre tipagem vs não-tipagem, analogias e contexto histórico
- [code-examples.md](references/code-examples.md) — Exemplos do pipeline de compilação e comparações JS vs TS