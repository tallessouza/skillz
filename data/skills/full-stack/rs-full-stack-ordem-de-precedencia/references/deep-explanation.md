# Deep Explanation: Ordem de Precedência

## Analogia do instrutor

O instrutor compara diretamente com a matematica escolar: assim como na matematica voce aprendeu que multiplicacao vem antes de adicao, JavaScript segue a mesma logica. A diferenca e que em programacao, erros de precedencia nao sao apenas "errar a conta" — podem gerar bugs silenciosos em sistemas reais.

## Por que isso importa

O instrutor usa o exemplo concreto: **"Imagina se voce nao conhece a ordem de precedencia e vai la fazer um sistema financeiro que vai dar mais dinheiro ou menos dinheiro, imagina a confusao que isso vira."**

Esse e o ponto central: erros de precedencia nao geram exceptions. O codigo roda normalmente, retorna um numero, e voce so descobre o bug quando o cliente reclama que o valor esta errado.

## Tabela completa de precedencia (JavaScript)

Do mais alto para o mais baixo:

| Prioridade | Categoria | Operadores |
|-----------|-----------|------------|
| 1 (mais alta) | Agrupamento | `()` |
| 2 | Exponenciacao | `**` |
| 3 | Multiplicacao/Divisao/Modulo | `*`, `/`, `%` |
| 4 | Adicao/Subtracao | `+`, `-` |
| 5 | Relacionais | `<`, `>`, `<=`, `>=` |
| 6 | Igualdade | `==`, `!=`, `===`, `!==` |
| 7 | AND logico | `&&` |
| 8 | OR logico | `||` |
| 9 | Nullish coalescing | `??` |
| 10 | Ternario | `? :` |
| 11 (mais baixa) | Atribuicao | `=`, `+=`, `-=`, etc. |

## O papel dos parenteses

Parenteses tem a **mais alta precedencia** de todas. Quando voce envolve uma expressao em parenteses, esta dizendo ao JavaScript: "faca isso primeiro, independente de qualquer regra."

Isso significa que parenteses sao a ferramenta definitiva para controlar ordem de avaliacao. O instrutor enfatiza: **"O parenteses permite definir o que a gente quer que seja feito primeiro."**

## Associatividade (conceito complementar)

Quando operadores tem a mesma precedencia, a associatividade define a direcao:
- **Esquerda para direita:** `+`, `-`, `*`, `/` → `10 - 5 - 2` = `(10 - 5) - 2` = `3`
- **Direita para esquerda:** `**`, `=` → `2 ** 3 ** 2` = `2 ** (3 ** 2)` = `512`

## Edge cases

1. **Unary minus vs subtraction:** `-2 ** 2` gera erro em JS (ambiguo). Use `(-2) ** 2` ou `-(2 ** 2)`.
2. **String concatenation com `+`:** `"5" + 3 * 2` = `"56"` (multiplicacao primeiro, depois concatenacao).
3. **Nullish coalescing com logicos:** `a ?? b || c` gera SyntaxError — precisa de parenteses explicitos.