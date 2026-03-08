# Deep Explanation: Paginação em Banco de Dados

## A analogia do livro

O instrutor usa a analogia de um livro para explicar paginação: um livro é composto por várias páginas, e cada livro pode ter quantidades diferentes de páginas dependendo do tema e da profundidade. Se ao invés de várias páginas, todo o conteúdo estivesse numa única folha gigante, seria difícil de carregar, difícil de levar e difícil de preservar. A mesma lógica se aplica ao banco de dados.

**Insight do instrutor:** "A gente não consegue ler tudo de uma vez. A gente vai lendo em porções." — Essa é a essência da paginação: dividir dados em porções consumíveis tanto para a máquina (performance) quanto para o humano (usabilidade).

## Por que paginar?

Imagine uma tabela com milhares de registros. Se você devolver tudo de uma vez:
- A consulta fica muito lenta
- Demora muito para o resultado aparecer para o usuário
- O usuário nem consegue ler tudo de uma vez

A solução: dividir o resultado da pesquisa em porções — em páginas. Daí vem o nome "paginação".

## Os 4 elementos da paginação

### 1. `perPage` — Itens por página

Uma variável que define quantos itens por página serão exibidos. É o **limite** de registros por página.

- Você escolhe: 5, 10, 20, 30... é flexível
- Define o tamanho de cada "porção" de dados
- É um limite máximo — a última página pode ter menos itens

### 2. `page` — Número da página atual

Indica qual página o usuário está visualizando. Começa em 1.

**Cálculo do total de páginas:**
```
totalPages = totalRecords / perPage
```

Exemplos do instrutor:
- 100 registros ÷ 10 perPage = **10 páginas**
- 4.352 registros ÷ 10 perPage = **435,2 → 436 páginas** (última página com poucos registros)
- 253 registros ÷ 10 perPage = **25,3 → 26 páginas** (última página com 3 registros)

**Edge case importante:** Quando a divisão não é exata, a última página terá menos registros que o `perPage`. Isso é comportamento normal — "pode ser que a gente tenha uma última página não com esse limite, mas com o valor quebrado. Então, às vezes sobra só três registros, às vezes só sobra quatro."

### 3. `take` — Quantos registros pegar

Garante que apenas o número de registros definido em `perPage` seja retornado. É simplesmente dizer ao banco: "pega no máximo 10."

`take = perPage` — são equivalentes na prática.

### 4. `skip` — Quantos registros ignorar

Controla quantos registros serão pulados antes de começar a buscar. É o que permite "avançar" para a próxima página.

**A fórmula do skip:**
```
skip = (page - 1) * perPage
```

**Raciocínio por trás da fórmula (explicação do instrutor):**

- **Página 1:** `(1 - 1) * 10 = 0` → Não pula ninguém, pega os primeiros 10
- **Página 2:** `(2 - 1) * 10 = 10` → Pula 10 registros (toda a página 1), pega os próximos 10
- **Página 3:** `(3 - 1) * 10 = 20` → Pula 20 registros (páginas 1 e 2), pega os próximos 10

O `-1` existe porque na página 1, não queremos pular nada. Sem o `-1`, na página 1 já pularíamos 10 registros.

## Visualização mental (do FigJam do instrutor)

```
Página 1 de 3     Página 2 de 3     Página 3 de 3
┌──────────┐      ┌──────────┐      ┌──────────┐
│ registro 1│      │registro 11│      │registro 21│
│ registro 2│      │registro 12│      │registro 22│
│ ...       │      │ ...       │      │registro 23│
│registro 10│      │registro 20│      │ (só 3)    │
└──────────┘      └──────────┘      └──────────┘
                  ↑                  ↑
                  skip=10            skip=20
```

Quando o usuário clica no botão para ir para a página 2, o banco precisa **ignorar todos os registros da página 1** (skip) e **pegar apenas os próximos 10** (take).

## Conexão com o protótipo

No protótipo da aplicação (Refund APP), há uma interface que mostra "1 de 3" com botões para avançar e voltar entre páginas. Cada clique altera o `page`, recalcula o `skip`, e faz uma nova consulta ao banco respeitando o `perPage` como limite.

## Resumo da estratégia

| Elemento | O que faz | Analogia |
|----------|-----------|----------|
| `perPage` | Define o tamanho da porção | Quantas linhas cabem em cada página do livro |
| `page` | Qual porção estamos olhando | Qual página do livro estamos lendo |
| `take` | Garante o limite por consulta | "Leia apenas esta página" |
| `skip` | Pula registros anteriores | "Vá direto para a página X" |