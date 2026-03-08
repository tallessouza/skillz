---
name: rs-full-stack-como-resolver-bugs-com-ia
description: "Applies AI-assisted debugging workflow when fixing bugs or troubleshooting code errors. Use when user says 'fix this bug', 'not working', 'getting an error', 'debug this', or 'help me find the issue'. Enforces context-rich problem descriptions, screenshot usage, and file referencing for effective AI interaction. Make sure to use this skill whenever helping users debug or when teaching debugging practices. Not for writing new features, refactoring, or code review."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [debugging, ai, troubleshooting, bugs, workflow, best-practices]
---

# Como Resolver Bugs com IA

> Forneça contexto rico e especifico ao descrever problemas — a IA resolve melhor quando sabe exatamente onde olhar.

## Rules

1. **Descreva o sintoma, nao o erro generico** — "nao consigo ver a opacidade na minha lista" em vez de "tenho um erro no codigo", porque a IA precisa de direcao para investigar
2. **Referencie arquivos explicitamente no contexto** — adicione os arquivos relevantes ao contexto da conversa, porque conforme o projeto cresce a IA nao consegue adivinhar onde olhar
3. **Use screenshots quando palavras nao bastam** — tire print da tela mostrando o problema e cole na conversa, porque a IA analisa imagens e identifica erros visuais
4. **Valide a linha indicada pela IA** — a IA e probabilistica e pode errar o numero da linha exato, sempre confira manualmente a localizacao sugerida
5. **Busque indicadores visuais no editor** — sublinhados vermelhos, warnings e erros no terminal sao pistas que a IA pode confirmar, porque muitos bugs tem sinalizacao visual que passa despercebida

## Workflow

### Passo 1: Descreva o problema com riqueza de detalhes

```
// RUIM — generico demais
"Estou com um erro no codigo"

// BOM — sintoma especifico
"Nao consigo ver a opacidade na minha lista de IAs"

// MELHOR — sintoma + contexto visual
"Nao consigo ver a opacidade na minha lista de IAs" + screenshot da tela
```

### Passo 2: Adicione contexto explicitamente

Abra os arquivos relevantes ou adicione-os manualmente ao contexto. Nao confie que a IA vai encontrar sozinha conforme o projeto cresce.

### Passo 3: Valide a resposta da IA

A IA pode indicar a linha errada (ex: dizer linha 105 quando o erro esta na 103). Sempre:
- Confira o numero da linha no seu editor
- Procure indicadores visuais (sublinhado vermelho)
- Leia a explicacao do erro, nao apenas a localizacao

## Example

**Problema real:** ponto e virgula faltando no JavaScript

**Interacao ruim:**
```
Usuario: "Tenho um erro no codigo"
// IA nao sabe onde olhar, resposta generica
```

**Interacao boa:**
```
Usuario: "Nao consigo ver a opacidade na minha lista"
// IA investiga os arquivos, encontra o ponto e virgula faltando
// Indica a correcao exata, mas pode errar o numero da linha
```

**Interacao otima:**
```
Usuario: "Nao consigo ver a opacidade na minha lista" + screenshot + arquivo aberto no contexto
// IA resolve com precisao maxima
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Consegue descrever o problema em palavras | Descreva o sintoma especifico com detalhes |
| Nao consegue explicar por palavras | Tire um screenshot e cole na conversa |
| IA indicou uma linha que nao parece correta | Busque sublinhados vermelhos proximo da area indicada |
| Projeto pequeno (poucos arquivos) | IA pode investigar sozinha com boa precisao |
| Projeto grande (muitos arquivos) | Adicione arquivos manualmente ao contexto |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| "Tenho um erro" (generico) | "Nao consigo ver X na tela Y" (especifico) |
| Confiar cegamente na linha indicada | Validar no editor e buscar indicadores visuais |
| Deixar a IA buscar contexto em projeto grande | Referenciar os arquivos explicitamente |
| Ignorar sublinhados vermelhos no editor | Verificar todos os warnings visuais antes de perguntar |
| Enviar apenas texto quando o problema e visual | Incluir screenshot da tela com o problema |

## Conceito-chave: IA e nao-deterministica

A IA e probabilistica — para a mesma entrada, pode dar respostas diferentes. Ela e um "autocomplete" avancado que completa baseado em contexto. Por isso:
- A mesma pergunta pode gerar respostas diferentes
- Ela tende a acertar (puxa pro mais provavel) mas nao garante
- Quanto melhor o contexto, maior a probabilidade de acerto

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| IA da resposta generica ou irrelevante | Contexto insuficiente na descricao do problema | Adicione arquivos relevantes, screenshots e descreva o sintoma especifico |
| IA indica linha errada | Natureza probabilistica da IA | Busque indicadores visuais (sublinhado vermelho) proximo da area indicada |
| Mesma pergunta gera respostas diferentes | IA e nao-deterministica | Refine o prompt com mais contexto para convergir na resposta correta |
| IA sugere solucao que nao funciona | Falta de contexto sobre versao/framework | Especifique versoes das dependencias e framework usado |
| Problema visual que texto nao descreve bem | Descricao textual insuficiente | Tire screenshot e cole na conversa com a IA |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre IA nao-deterministica, analogias e modelo mental
- [code-examples.md](references/code-examples.md) — Exemplos praticos de debugging com IA e tecnicas de contexto