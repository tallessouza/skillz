# Deep Explanation: Formulários em React

## Por que existem múltiplas estratégias?

O React opera com um Virtual DOM, mas inputs HTML nativos mantêm seu próprio estado interno no DOM real. Isso cria uma tensão fundamental: quem é o "dono" do valor do input?

### Input controlado — React é o dono
Quando usamos `useState` + `value` + `onChange`, o React assume total controle. Cada keystroke:
1. Dispara `onChange`
2. Atualiza o estado
3. Re-renderiza o componente
4. O input recebe o novo valor via prop `value`

**Vantagem:** controle total sobre o valor em qualquer momento.
**Custo:** re-render a cada keystroke, múltiplos `useState` para múltiplos campos.

### Input não controlado — DOM é o dono
Quando usamos apenas `ref`, o DOM mantém o valor internamente. O React só acessa quando explicitamente pedido (`ref.current.value`).

**Vantagem:** sem re-renders por digitação, mais simples.
**Custo:** sem reatividade — não dá para reagir em tempo real.

### FormData no submit — sem dono intermediário
A estratégia mais leve: nenhum estado React, nenhum ref. No momento do submit, `FormData` captura todos os valores usando o atributo `name` dos inputs.

**Insight do instrutor:** "Conseguir captar todos os dados de um formulário a partir de um submit e tudo isso sem utilizar estados." Essa é a abordagem que o React moderno incentiva para formulários simples — reduz complexidade e re-renders desnecessários.

## Validação como camada obrigatória

O instrutor enfatiza que validação não é opcional: "garantir que aqueles campos que são obrigatórios, eles sejam fornecidos, inclusive fazendo a validação de cada tipo de dado."

Isso significa duas camadas:
1. **Presença:** o campo foi preenchido?
2. **Tipo:** o dado é do formato esperado? (email válido, número dentro do range, etc.)

A validação deve acontecer independente da estratégia de captura escolhida. Mesmo com `FormData`, valide antes de processar.

## Quando escalar para bibliotecas

As três estratégias nativas cobrem a maioria dos casos. Considere bibliotecas (React Hook Form, Zod) quando:
- Validação complexa com dependências entre campos
- Formulários com muitos passos (wizard)
- Performance crítica com dezenas de campos
- Schema validation compartilhado entre frontend e backend