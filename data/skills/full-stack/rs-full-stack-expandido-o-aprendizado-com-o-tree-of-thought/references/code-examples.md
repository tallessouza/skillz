# Code Examples: Tree of Thought no Aprendizado

## Exemplo completo: Historico de pesquisa

### Contexto
A IA implementou um historico de pesquisa usando Local Storage em JavaScript.

### Prompt Etapa 1 — Justificativa
```
Gostaria que explicasse no detalhe o motivo dessa implementacao que voce escolheu.
```

### Resposta esperada (resumo)
- Persistencia simples e local com Local Storage
- Limite de tamanho controlado para evitar crescimento infinito
- Modelo minimo util: cada item tem resposta, jogo e timestamp

### Prompt Etapa 2 — Arvore de pensamento
```
Sugira mais duas implementacoes diferentes e para cada
explique detalhes dos pontos positivos e negativos de cada escolha.
```

### Resposta esperada (resumo)

**Alternativa 1: Delegar a eventos + render de HTML**
- Positivos: separacao de responsabilidades, mais testavel
- Negativos: mais complexo para algo simples, overhead de eventos

**Alternativa 2: IndexedDB**
- Positivos: suporta grandes volumes, queries complexas, dados estruturados
- Negativos: overkill para app leve com historico curto, API muito verbosa e complexa

### Prompt Etapa 3 — Deep-dive (NOVO CHAT)
```
Poderia explicar melhor o que e IndexedDB?
Explique em detalhes como se fosse para uma crianca da quinta serie,
explique os first principles.
```

## Variacoes do prompt Tree of Thought

### Para decisoes de arquitetura
```
Voce escolheu [arquitetura X] para este projeto.
Explique por que essa escolha e nao outra.
Sugira 2 arquiteturas alternativas com pros e contras detalhados.
Para cada uma, diga em que cenario ela seria MELHOR que a sua escolha.
```

### Para escolha de bibliotecas
```
Voce usou [biblioteca X] para [funcionalidade].
Por que essa e nao as alternativas?
Liste 2 alternativas e para cada uma:
- Quando ela seria melhor
- Quando ela seria pior
- Qual o custo de migrar depois
```

### Para patterns de codigo
```
Voce implementou isso usando [pattern X].
Explique a motivacao.
Mostre como ficaria com 2 patterns diferentes.
Para cada um, liste trade-offs de manutenibilidade, testabilidade e legibilidade.
```

## Fluxo visual completo

```
[IA gera codigo] 
       |
       v
[Selecionar trecho relevante]
       |
       v
[Prompt: "Por que essa implementacao?"]
       |
       v
[Prompt: "Sugira 2 alternativas com pros/contras"]
       |
       v
[Ler trade-offs] ──> [Conceito desconhecido?]
       |                      |
       v                      v
[Anotar e seguir]    [Abrir NOVO chat]
                              |
                              v
                     ["Explique [X] como para
                      crianca da 5a serie,
                      first principles"]
```