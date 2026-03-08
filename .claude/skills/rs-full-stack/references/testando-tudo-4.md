---
name: rs-full-stack-testando-tudo-4
description: "Enforces manual testing procedures for frontend currency converter applications. Use when user asks to 'test the app', 'verify the converter', 'check if it works', 'validate the application', or 'do manual QA' on a currency conversion feature. Applies systematic input validation testing, currency switching verification, and output format checks. Make sure to use this skill whenever completing a currency converter project or similar form-based UI. Not for unit testing, automated testing, or backend API testing."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: javascript-projetos
  tags: [testing, manual-testing, qa, frontend, validation, currency-converter]
---

# Teste Manual de Aplicacao Frontend

> Teste sistematicamente cada input, cada selecao e cada output antes de considerar o projeto concluido.

## Rules

1. **Teste inputs invalidos primeiro** — digite letras, caracteres especiais e valores vazios antes de testar o caminho feliz, porque validacao de input e a primeira linha de defesa
2. **Teste cada moeda individualmente** — selecione cada opcao do dropdown e converta, porque um bug pode existir apenas para uma moeda especifica
3. **Verifique formatacao do output** — confira simbolo da moeda, casas decimais e separadores de milhar, porque dados corretos com formatacao errada confundem o usuario
4. **Teste troca de moeda sem recarregar** — mude a moeda e converta novamente sem refresh, porque estado residual pode causar bugs
5. **Teste com valores diferentes** — use valores pequenos, grandes e quebrados, porque edge cases aparecem em extremos

## Checklist de teste manual

### Step 1: Recarregar a aplicacao
Comece com estado limpo — recarregue a pagina para garantir que nenhum estado anterior interfira.

### Step 2: Testar validacao de input
- Tentar digitar letras (deve ser bloqueado)
- Tentar caracteres especiais (deve ser bloqueado)
- Verificar que apenas numeros sao aceitos

### Step 3: Testar conversao para cada moeda
```
Para cada moeda disponivel (dolar, euro, libra):
  1. Digitar um valor (ex: 700)
  2. Selecionar a moeda no dropdown
  3. Clicar em "Converter"
  4. Verificar:
     - Simbolo da moeda correto
     - Valor da cotacao formatado
     - Valor total em reais formatado
     - Separadores de milhar presentes
```

### Step 4: Testar troca de moeda
- Converter com dolar → verificar resultado
- Trocar para euro sem recarregar → converter → verificar que TODOS os valores atualizaram
- Trocar para libra → converter → verificar novamente

### Step 5: Testar valores variados
| Valor | Verificar |
|-------|-----------|
| 300 | Resultado menor que teste anterior |
| 425 | Valor quebrado funciona |
| 1000+ | Separador de milhar aparece |

## Heuristics

| Situacao | Acao |
|----------|------|
| Output nao atualizou ao trocar moeda | Verificar se o event listener do select esta correto |
| Simbolo da moeda errado | Verificar mapeamento moeda → simbolo |
| Formatacao sem separador de milhar | Verificar uso de toLocaleString ou Intl.NumberFormat |
| Input aceita letras | Verificar type="number" ou event listener de keypress |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Testar so o caminho feliz | Testar inputs invalidos primeiro |
| Testar uma moeda e assumir que todas funcionam | Testar cada moeda individualmente |
| Ignorar formatacao visual | Verificar simbolos, decimais e separadores |
| Testar sem recarregar a pagina | Comecar com estado limpo |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Output nao atualiza ao trocar moeda | Event listener do select nao esta disparando | Verifique se o evento `change` esta vinculado ao elemento correto |
| Simbolo da moeda aparece errado | Mapeamento moeda-simbolo incorreto | Revise o objeto/mapa que associa cada moeda ao seu simbolo |
| Formatacao sem separador de milhar | Usando `toString()` em vez de formatador | Use `toLocaleString()` ou `Intl.NumberFormat` para formatar valores |
| Input aceita letras e caracteres especiais | Faltando `type="number"` ou filtro de keypress | Adicione `type="number"` no input ou filtre eventos de teclado |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre estrategia de teste manual
- [code-examples.md](references/code-examples.md) — Exemplos de validacao e formatacao testados na aula

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-testando-tudo-4/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-testando-tudo-4/references/code-examples.md)
