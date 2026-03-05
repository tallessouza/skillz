# Deep Explanation: Font Size no CSS

## O modelo mental de heranca

O font-size no CSS segue um modelo de heranca em cascata. O ponto de partida e o **root element** (`<html>`), que por padrao tem `font-size: 16px` em todos os navegadores.

### A cadeia do `em`

Quando voce usa `em`, o navegador faz uma busca **ascendente**:

1. Olha o `font-size` do elemento pai direto
2. Se o pai nao tem font-size definido, sobe para o avo
3. Continua subindo ate chegar no root element
4. Multiplica o valor encontrado pelo numero de `em`

**Perigo:** Em aninhamentos profundos, `em` compoe. Se `.card` tem `1.2em` e `.card .text` tem `1.2em`, o texto fica com `1.2 * 1.2 = 1.44` do root — nao `1.2`.

### O atalho do `rem`

O `rem` (root em) foi criado para resolver esse problema. Ele **ignora toda a arvore** e vai direto ao root element. Nao importa quantos niveis de aninhamento existam, `1rem` sempre sera o font-size do root.

Analogia do instrutor: "ele pula toda a etapa, ele nao vai olhar o pai nunca e vai direto pegar o root element."

### Porcentagem

Funciona como `em` na pratica — busca no pai e sobe a arvore. `100%` = tamanho do pai, `120%` = 20% maior. A diferenca e semantica: porcentagem comunica "proporcao", enquanto `em` comunica "escala tipografica".

## Nomes predefinidos (absolute-size e relative-size)

O CSS aceita nomes como valores de font-size:

**Absolute-size (tamanhos fixos):**
- `xx-small`, `x-small`, `small`, `medium`, `large`, `x-large`, `xx-large`

**Relative-size (relativo ao pai):**
- `smaller`, `larger`

O instrutor menciona que "geralmente eu nao uso os nomes, mas e legal voce saber que tem." Na pratica, projetos profissionais preferem unidades numericas porque dao controle preciso.

## Valores absolutos vs relativos

| Tipo | Exemplos | Comportamento |
|------|----------|---------------|
| Absoluto | `px`, nomes como `large` | Fixo, nao muda com contexto |
| Relativo | `em`, `rem`, `%` | Flexivel, se adapta ao contexto |

O instrutor destaca: "a gente acaba usando pixels quando a gente quer coisas fixas e unidades de medidas relativas como porcentagem."

## Math values

O CSS tambem aceita funcoes matematicas como `calc()`, `min()`, `max()`, `clamp()` para font-size. O instrutor menciona que nunca usou `math-value` diretamente, mas e util saber que existe para tipografia responsiva avancada (ex: `font-size: clamp(1rem, 2vw, 2rem)`).

## Valor padrao: 16px

Este e um dos numeros mais importantes do CSS. O root element (`<html>`) tem `font-size: 16px` por padrao em todos os navegadores modernos. Toda a matematica de `rem` parte desse valor:

- `1rem` = 16px
- `2rem` = 32px
- `0.5rem` = 8px
- `0.875rem` = 14px
- `1.25rem` = 20px

Se o usuario mudar o tamanho base do navegador (acessibilidade), todos os valores `rem` escalam proporcionalmente — por isso `rem` e preferido sobre `px`.