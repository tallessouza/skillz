---
name: rs-full-stack-ask-mode-professor-ia
description: "Guides how to use AI as a learning assistant when studying code. Use when user asks to 'explain this code', 'help me understand', 'what does this do', 'teach me', or 'explain like I'm a beginner'. Applies first principles prompting, context isolation, and hallucination awareness. Make sure to use this skill whenever the user is in learning mode and wants code explanations. Not for code generation, debugging, or refactoring tasks."
---

# Ask Mode: Professor Particular com IA

> Use IA como professor particular: selecione codigo, peca explicacoes com first principles, e mantenha contextos isolados.

## Rules

1. **Sempre abra um novo contexto por assunto** — nunca misture CSS com JavaScript no mesmo chat, porque a IA faz paralelos probabilisticos entre os contextos e pode alucinar
2. **Peca explicacoes com didatica simplificada** — "explique como se fosse para uma crianca da quinta serie" forca a IA a gerar explicacoes com analogias concretas e linguagem acessivel
3. **Peca first principles** — ao pedir "explique os first principles", a IA da um passo atras e reforca fundamentos antes de explicar o especifico, gerando uma aula mais completa
4. **Selecione trechos especificos** — nao cole arquivos inteiros, selecione o pedaco exato que nao entendeu, porque contexto focado gera explicacoes mais precisas
5. **Desconfie e verifique** — IA e probabilistica, nao deterministica; ela pode alucinar informacoes, especialmente quando voce a contradiz e ela tenta "concordar"
6. **Evolua o nivel dos prompts** — comece com "explique como quinta serie + first principles", depois passe para "explique com detalhes" conforme seu conhecimento avanca

## How to use

### Prompt basico para iniciantes

```
[selecione o trecho de codigo]

Explique com detalhes como se fosse para uma crianca
da quinta serie, explique os first principles.
```

### Prompt intermediario

```
[selecione o trecho de codigo]

Explique com detalhes o que esse codigo esta fazendo.
```

### Regra de ouro do contexto

```
Assunto novo = Chat novo

CSS num chat, JavaScript em outro.
Nunca misture assuntos no mesmo contexto.
```

## Example

**Prompt do usuario:**
```
[seleciona trecho CSS com :hover]

Explique com detalhes como se fosse para uma crianca
da quinta serie, explique os first principles.
```

**Resposta esperada da IA (estrutura):**
```
1. Analogia concreta: "CSS e como as cores e decoracao de uma casa"
2. Explicacao do trecho: "Quando alguem coloca o mouse em cima
   do botao, tres coisas acontecem: cursor vira mao, botao sobe
   2px, aparece sombra amarelada"
3. First principles: "Tudo na tela e uma caixa. Texto e caixa,
   botao e caixa, imagem e caixa. Voce pode pintar, espacar
   e colocar borda nessas caixas."
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Nao entendeu um trecho de codigo | Selecione, abra chat novo, peca first principles |
| Ja entende o basico mas quer aprofundar | Use "explique com detalhes" sem a parte da quinta serie |
| IA respondeu algo que parece errado | Verifique na documentacao oficial antes de confiar |
| IA concordou rapido demais com sua correcao | Sinal de alucinacao — ela tende a concordar sempre |
| Mudou de assunto (CSS → JS) | Abra um novo chat imediatamente |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Misturar assuntos no mesmo chat | Um chat por assunto/contexto |
| Colar arquivo inteiro e pedir explicacao | Selecionar trecho especifico |
| Aceitar tudo que a IA diz como verdade | Verificar com documentacao e aulas oficiais |
| Contradizer a IA e aceitar a "correcao" dela | Pesquisar por conta propria quando discordar |
| Achar humilhante pedir explicacao simplificada | Usar didatica simples — e a forma mais eficaz de extrair explicacoes |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre alucinacao, probabilidade vs determinismo, e evolucao de prompts
- [code-examples.md](references/code-examples.md) — Exemplos completos de interacao com IA para aprendizado