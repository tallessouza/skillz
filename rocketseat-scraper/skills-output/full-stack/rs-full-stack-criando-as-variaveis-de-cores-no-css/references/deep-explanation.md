# Deep Explanation: Variáveis de Cores no CSS

## Por que reset com asterisco

O seletor `*` aplica estilos a todos os elementos, mas sua especificidade é a mais baixa possível (0,0,0). Isso significa que qualquer estilo do user-agent stylesheet do navegador com especificidade maior vai sobrepor.

Na prática: tags como `<h1>`, `<ul>`, `<body>` têm margens e paddings padrão definidos pelo navegador com especificidade de tag (0,0,1), que é maior que `*` (0,0,0). Então o `margin: 0` do asterisco **não vai funcionar em todas as tags automaticamente**.

A abordagem do instrutor é pragmática: "não se preocupe, na hora que a gente olhar e perceber que não aplicou alguma dessas coisas, a gente vai lá e aplica na tag." Ou seja, o reset com `*` pega a maioria dos casos, e os que escapam são tratados pontualmente.

### Por que `box-sizing: border-box`

O modelo padrão (`content-box`) calcula largura/altura apenas pelo conteúdo — padding e border são adicionados por fora. Com `border-box`, o cálculo vai "de borda a borda", incluindo padding e border na largura declarada. Isso evita surpresas em layouts onde `width: 100%` + padding quebraria o container.

## Nomeação semântica vs. descritiva

O instrutor extrai os nomes **exatamente como aparecem no Style Guide do Figma**:
- "Brand Color" → `--brand-color`
- "Brand Color Light" → `--brand-color-light`
- "Beige Color" → `--beige-color`
- "Stroke Color" → `--stroke-color`
- "Text Color Primary" → `--text-color-primary`
- "Color Secondary" → `--color-secondary`

A convenção é: pegar o nome do Style Guide, converter para kebab-case, prefixar com `--`. Isso mantém a "linguagem compartilhada" entre design e desenvolvimento.

## O erro do hex faltando caractere

O instrutor encontrou um bug real: a cor `--text-color-primary` estava com um caractere faltando no valor hex. O resultado visual era uma cor completamente diferente.

A solução: ir no Figma, clicar no color swatch, selecionar "Custom", e copiar o valor hex correto de lá. Essa é uma armadilha comum — copiar cores do painel lateral do Figma pode truncar valores.

**Lição:** sempre valide visualmente as cores após definir as variáveis. Um `#1A1A1` (5 chars) é interpretado diferente de `#1A1A1A` (6 chars).

## Estratégia de workflow

O instrutor usa uma abordagem em duas passadas:
1. **Primeira passada:** escreve todos os nomes das variáveis sem valores (esqueleto)
2. **Segunda passada:** volta preenchendo os valores hex

Isso dá agilidade porque você mapeia a estrutura completa antes de preencher detalhes. É como criar a interface antes da implementação.

## Aplicação no body

O body recebe `color` e `background-color` via variáveis porque:
- `color` é herdável — todos os elementos filhos herdam automaticamente
- `background-color` NÃO é herdável, mas ao definir no body, você cobre o viewport inteiro
- Usar variáveis aqui significa que trocar o tema inteiro é questão de mudar valores no `:root`