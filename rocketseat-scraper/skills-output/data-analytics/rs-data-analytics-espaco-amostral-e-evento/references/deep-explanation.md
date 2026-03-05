# Deep Explanation: Espaço Amostral e Evento

## Por que probabilidade fica entre 0 e 1

O instrutor Rodolfo usa um raciocínio intuitivo: se eu jogo um dado e pergunto "qual a chance de sair 7?", a resposta é 0% — não existe o 7 no dado. Se pergunto "qual a chance de sair um número natural?", a resposta é 100% — todos os números de 1 a 6 são naturais.

A sacada é que 0% = 0/100 = 0, e 100% = 100/100 = 1. Portanto, qualquer probabilidade é um número no intervalo [0, 1].

Exemplo intermediário: moeda. P(cara) = 1/2 = 0.5 = 50%. O 0.5 está exatamente no meio do intervalo [0, 1].

## Espaço Amostral — "Tudo aquilo que eu tenho"

O espaço amostral é o conjunto COMPLETO de resultados possíveis de um experimento. Representado pela letra **S** (ou pela letra grega **Ω** em alguns livros).

Para um dado: S = {1, 2, 3, 4, 5, 6}

A definição do espaço amostral é o primeiro passo obrigatório antes de qualquer cálculo de probabilidade. Sem saber o "todo", não há como calcular a "parte".

## Evento — "Tudo aquilo que você quer"

O instrutor define evento de forma muito intuitiva: "evento é tudo aquilo que você quer". É o subconjunto de S que satisfaz a condição do problema.

Exemplos com dado:
- **Evento 1 (face par):** E₁ = {2, 4, 6} → 3 elementos
- **Evento 2 (face 5):** E₂ = {5} → 1 elemento
- **Evento 3 (face ímpar):** E₃ = {1, 3, 5} → 3 elementos

## Três tipos de evento

### 1. Evento Certo
Quando E = S. O evento contempla todos os resultados possíveis.
- Exemplo: jogar dado e querer que saia número natural → todos os números de 1 a 6 são naturais → P = 1

### 2. Evento Impossível
Quando E = ∅ (conjunto vazio). Nenhum resultado possível satisfaz a condição.
- Exemplo: jogar dado e querer que saia π, ou √2, ou 8 → nenhum desses existe no dado → P = 0

### 3. Eventos Complementares
Dois eventos são complementares quando satisfazem DUAS condições simultâneas:
1. **E₁ ∩ E₂ = ∅** — não têm elementos em comum (interseção vazia)
2. **E₁ ∪ E₂ = S** — juntos cobrem todo o espaço amostral

Exemplo: E₁ (par) = {2, 4, 6} e E₃ (ímpar) = {1, 3, 5}
- Interseção: nenhum número é par E ímpar ao mesmo tempo → ∅ ✓
- União: {1, 2, 3, 4, 5, 6} = S ✓
- São complementares.

## Insight do instrutor

A frase-chave que resume tudo: **"Espaço amostral é tudo aquilo que eu tenho. Evento é o que você quer."** Essa distinção simples resolve a maioria das confusões iniciais em probabilidade.