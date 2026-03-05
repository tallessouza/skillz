# Deep Explanation: Perguntas de Dados

## Por que perguntas de negocio nao servem para analise direta

Pessoas de negocio sao stakeholders que pensam estrategicamente. Elas focam no objetivo final da empresa, nao em como medir ou investigar. Nao e responsabilidade delas saber formular perguntas de dados — e responsabilidade do analista traduzir.

Uma pergunta como "como podemos melhorar nossa retencao de clientes?" abre dezenas de caminhos:
- Melhorar por que? Esta ruim ou normal?
- Se esta ruim, quando esteve boa? E sazonalidade? Outlier?
- Quais fatores influenciam? Ja sabemos ou precisamos explorar?
- Tem problema nos dados ou e um fator externo?
- A queda ja vai se recuperar naturalmente?

Cada vertente e um tipo diferente de analise (exploratoria, diagnostica, preditiva, prescritiva). Sem refinamento, o analista nao sabe por onde comecar, e com deadline curta e recursos limitados, isso e critico.

## A analogia do tradutor

A instrutora (Isla) enfatiza: o analista de dados e, antes de tudo, um **tradutor**. Traduz de negocio para dado e de dado para negocio. Sem conhecimento de negocio (KPIs, metricas do setor, vocabulario corporativo), essa traducao falha.

## O pipeline de refinamento

A transformacao segue uma logica:
1. **Especificar objetivo** — Conversar com o stakeholder para entender a real necessidade
2. **Definir metrica** — Encontrar um indicador quantificavel (NPS, churn rate, taxa de conversao)
3. **Recorte temporal** — Definir periodo adequado. As vezes so funciona com recorte muito pequeno, as vezes muito grande (empresas pequenas podem precisar de trimestral por volume insuficiente de dados)
4. **Segmentacoes** — Regiao, canal, tipo de cliente. Um segmento especifico pode estar distorcendo o todo

## Correlacao vs Causalidade — O exemplo do sorvete

A instrutora usa uma analogia memoravel: "Quanto mais pessoas comem sorvete, mais pessoas sao atacadas por tubaroes." Existe correlacao (ambos aumentam no verao), mas nao causalidade (sorvete nao causa ataques).

No contexto empresarial: clientes do produto X dao mais churn. Conclusao precipitada: descontinuar produto X. Realidade: produto X foi lancado quando clientes ja estavam insatisfeitos com produto Y. O produto X e inocente — o problema e anterior.

## Metodo SMART aplicado a perguntas de dados

O SMART nao e exclusivo de analise de dados — funciona para objetivos pessoais e profissionais. Mas aplicado a perguntas de dados, funciona como checklist de validacao:

- **Especifica**: "Nosso app e popular?" falha. "Qual a taxa de retencao nos ultimos 3 meses comparada ao benchmark do setor?" passa.
- **Mensuravel**: "Clientes estao felizes?" falha (como quantificar felicidade?). "Qual o NPS por canal nos ultimos 6 meses?" passa.
- **Atingivel**: Nao adianta querer comparar maturidade tecnologica com o mercado se nao ha dados de mercado disponiveis.
- **Relevante**: Sera que a pergunta resolve a causa raiz ou so um efeito colateral?
- **Temporal**: O periodo adequado depende do contexto e volume de dados.

## Exemplos completos da aula

| Pergunta de negocio | Pergunta de dados refinada |
|---------------------|---------------------------|
| Como podemos melhorar nossa retencao de clientes? | Qual a taxa de churn nos ultimos 3 meses e quais fatores mais influenciam na saida de clientes? |
| Nossos anuncios estao funcionando? | Qual a taxa de conversao por canal de aquisicao nos ultimos 3 meses? |
| Nosso app e popular? | Qual a taxa de retencao de usuarios do app nos ultimos 3 meses e como se compara com o benchmark do setor? |
| Nossos clientes gostam do nosso suporte? | Qual o NPS por canal de atendimento nos ultimos 6 meses? Quais os principais motivos de reclamacao? |
| Nosso e-mail marketing esta trazendo clientes? | Qual a taxa de abertura, clique e conversao das campanhas de e-mail nos ultimos 3 meses? |

## Perguntas para exercicio (propostas pela instrutora)

- Nossa marca tem reconhecimento no mercado?
- O desconto que oferecemos esta ajudando nas vendas?
- Por que a nossa taxa de cancelamento aumentou?
- As redes sociais estao trazendo clientes novos?
- Os usuarios estao satisfeitos com o tempo de carregamento do nosso site?

## Cadeia de analises

A instrutora destaca que, para responder uma pergunta de negocio complexa como "melhorar retencao", muitas vezes e necessario encadear tipos de analise:

1. **Exploratoria** — Entender o cenario atual
2. **Diagnostica** — Identificar o que aconteceu
3. **Preditiva** — Projetar o que vai acontecer
4. **Prescritiva** — Recomendar acoes

A pergunta de dados refinada geralmente ataca os passos 1-2, que sao pre-requisitos para os passos 3-4.