# Deep Explanation: Estruturas de Repetição

## A analogia do Mário (completa)

O instrutor usa o jogo do Mário para explicar repetições de forma visual:

- O Mário está no **bloco 1** e precisa chegar ao **bloco 6** para pular e descobrir o que tem na interrogação
- Existe uma função `marioAndar()` que move o Mário para o próximo bloco
- **Sem repetição:** você escreveria `marioAndar()` 5 vezes — código duplicado, difícil de manter
- **Com repetição:** uma variável `step` começa em 1, e enquanto `step < 6`, o Mário anda e o step incrementa

### Passo a passo da execução

| Iteração | step antes | step < 6? | Ação | step depois |
|----------|-----------|-----------|------|------------|
| 1 | 1 | Sim | marioAndar() → bloco 2 | 2 |
| 2 | 2 | Sim | marioAndar() → bloco 3 | 3 |
| 3 | 3 | Sim | marioAndar() → bloco 4 | 4 |
| 4 | 4 | Sim | marioAndar() → bloco 5 | 5 |
| 5 | 5 | Sim | marioAndar() → bloco 6 | 6 |
| 6 | 6 | **Não** | Loop encerra | 6 |

Após o loop: `marioPular()` — o Mário pula e descobre o cogumelo.

**Insight chave do instrutor:** "6 é menor do que 6? Não, 6 é **igual** a 6 e não menor." — Este é o momento exato em que a condição deixa de ser satisfeita. Entender a diferença entre `<` e `<=` é fundamental para evitar erros off-by-one.

## Verificação no início vs no final

O instrutor menciona que dependendo da estrutura de repetição, a verificação pode acontecer:

- **No início:** A condição é verificada ANTES de executar o bloco. Se a condição já for falsa, o bloco nunca executa. Exemplo: `while`
- **No final:** A condição é verificada DEPOIS de executar o bloco. O bloco sempre executa pelo menos uma vez. Exemplo: `do...while`

No exemplo do Mário, a verificação é no início — antes de pedir para o Mário andar, verificamos se ele ainda não chegou ao destino.

## Conceito universal

O instrutor enfatiza que estruturas de repetição **não são exclusivas do JavaScript** — existem em todas as linguagens de programação. O conceito é o mesmo: executar um bloco de código várias vezes de acordo com uma condição.

## Os três componentes obrigatórios

Toda repetição precisa de:

1. **Estado inicial** — `let step = 1` (de onde partimos)
2. **Condição de continuidade** — `step < 6` (quando parar)
3. **Atualização do estado** — `step++` (como avançamos em direção à parada)

Se faltar o componente 3 (atualização), o loop nunca termina — **loop infinito**. O `step` seria sempre 1, `1 < 6` seria sempre verdadeiro, e o programa travaria.

## Por que não duplicar código?

O instrutor diz: "Ao invés de eu duplicar o código ou de eu escrever o mesmo código 5 vezes, eu posso pedir para uma estrutura de repetição repetir aquilo para mim 5 vezes."

Razões implícitas:
- **Manutenibilidade:** se a lógica mudar, você muda em 1 lugar, não em 5
- **Escalabilidade:** e se fossem 100 blocos em vez de 6? Impossível duplicar
- **Legibilidade:** um loop comunica intenção ("repita N vezes") melhor que código copiado

## Edge cases a considerar

- **Condição já falsa no início:** se `step` começasse em 6, o `while (step < 6)` nunca executaria
- **Off-by-one:** `step < 6` executa 5 vezes (1,2,3,4,5). `step <= 6` executaria 6 vezes (1,2,3,4,5,6)
- **Incremento errado:** se incrementasse por 2 (`step += 2`), pularia blocos: 1→3→5→7 (saiu do range)