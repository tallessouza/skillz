# Deep Explanation: Estrutura dos Cards

## Por que compound components?

O instrutor segue um padrao consistente no projeto: tanto o componente Section quanto o Card usam a mesma arquitetura de subcomponentes. Isso nao e acidental — e uma decisao arquitetural que permite:

1. **Reordenacao livre** — o consumidor decide a ordem dos elementos (Number antes ou depois do Title)
2. **Omissao seletiva** — nem todo card precisa de Footer ou Number
3. **Extensibilidade** — adicionar um novo subcomponente (ex: `Card.Badge`) nao quebra nenhum card existente

O instrutor menciona que "poderia ate criar um snippet para facilitar a criacao do componente nesse formato" — indicando que esse e um padrao que ele repete em todos os projetos.

## O conceito de Card Number (inspirado no Linear)

O instrutor faz referencia ao Linear (ferramenta de gerenciamento de projetos) para explicar o conceito de Number. No Linear, cada issue tem um identificador incremental por projeto (ex: `ENG-142`). Isso e diferente do ID no banco de dados porque:

- E mais facil de comunicar verbalmente ("terminei a task 120")
- E sequencial e previsivel (o proximo sempre e +1)
- Tem contexto do projeto pelo prefixo de 3 letras

O formato e: `{PREFIXO_PROJETO}-{NUMERO_INCREMENTAL}`, ex: `ECO-001` para um e-commerce.

## Root como link desde o inicio

Uma decisao importante: o instrutor transforma o Root de `<div>` para `<a>` desde o inicio, mesmo antes de ter a rota de destino definida. Justificativa:

- Cards de board sao inerentemente navegaveis
- Usar `<a>` desde o inicio garante semantica correta (acessibilidade, SEO)
- A classe `block` e necessaria porque `<a>` e inline por padrao, e o card precisa ocupar a largura total
- O `href` comeca como "/" temporario ate a integracao com a API

## Hierarquia visual com Tailwind em dark theme

O instrutor define uma hierarquia visual clara:

| Elemento | Background | Border | Text |
|----------|-----------|--------|------|
| Card Root | `bg-navy-700` | `border-navy-600` (mais claro) | — |
| Card Title | — | — | `text-sm font-medium` (destaque) |
| Card Number | — | — | `text-xs text-navy-200` (sutil) |
| Footer buttons | `bg-navy-600` | — | `text-navy-100` |

A tecnica de border "0.5 pixels" (borda fina) e mencionada como padrao consistente em todo o projeto.

## Botoes de acao no Footer

Os botoes de like e comentario seguem um padrao:
- `type="button"` explicito (nao submete forms acidentalmente)
- Icone pequeno (`size-3`) + contador em `text-xs`
- Estilizacao com `cursor-pointer` para feedback visual
- Background sutil (`bg-navy-600`) para diferenciar do fundo do card

O instrutor nota que ainda faltam estilos de hover — serao adicionados depois. Isso demonstra uma abordagem incremental: estrutura primeiro, refinamento depois.

## Proximos passos mencionados

O instrutor lista o que vem depois neste projeto:
- Efeitos de hover no card e botoes
- Criar mais sections/boards para ter visual completo
- Integracao com API para buscar dados reais
- Busca
- Cabecalho
- Autenticacao