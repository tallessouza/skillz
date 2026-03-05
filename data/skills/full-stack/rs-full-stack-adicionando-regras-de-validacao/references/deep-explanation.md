# Deep Explanation: Regras de Validação com Zod

## Por que Zod em vez de if/else manual?

O instrutor demonstra lado a lado: a validação manual com if/else para verificar nome obrigatório, tamanho mínimo e preço positivo ocupa 6-10 linhas de código imperativo. Com Zod, o mesmo resultado é alcançado de forma declarativa em uma chain fluente. A vantagem não é só menos código — é que as regras ficam **co-localizadas** no schema, em vez de espalhadas em blocos condicionais.

O instrutor enfatiza: "não tem nenhum problema utilizar if para fazer validação manual, mas olha como fica bem mais interessante utilizando o Zod."

## A pegadinha do trim antes do min

Este é o insight mais importante da aula. O instrutor demonstra ao vivo:

1. Define `z.string().min(6)` para o nome
2. Testa com espaços: `"      "` (6 espaços) → **passa na validação!**
3. Espaços são contados como caracteres pelo `.min()`
4. Solução: adicionar `.trim()` **antes** do `.min(6)`
5. Agora espaços são removidos primeiro, depois o tamanho real é validado

**Analogia pipeline:** O Zod processa da esquerda para a direita. `.trim()` transforma o valor (remove espaços), depois `.min()` valida o resultado transformado. A ordem importa porque cada step opera sobre o output do anterior.

## positive() vs min(1) vs gte(0)

O instrutor usa `.positive()` para preços, que rejeita zero E negativos. Ele faz uma analogia comercial: "imagina só, você dá um produto para o cliente e ainda você tem que pagar para o cliente."

Ele também mostra `.gte(10)` como alternativa quando o produto tem uma faixa de valor mínimo. A escolha depende da regra de negócio:
- `.positive()` → maior que zero (rejeita zero)
- `.gte(0)` → maior ou igual a zero (aceita zero)
- `.gte(10)` → maior ou igual a 10 (faixa mínima)

## Mensagens customizadas

O Zod gera mensagens padrão em inglês genérico como "String must contain at least 6 character(s)". O instrutor mostra que o segundo parâmetro de qualquer validação aceita `{ message: "..." }`:

```typescript
.min(6, { message: "name must be 6 or more characters" })
.positive({ message: "price must be positive" })
```

## Formatação em múltiplas linhas

O instrutor menciona explicitamente que prefere quebrar a chain em linhas separadas para legibilidade: "eu gosto dessa visualização, uma em cada linha, acho que fica fácil da gente entender." Isso permite ler as regras como uma lista vertical de validações aplicadas ao campo.

## Métodos disponíveis explorados

O instrutor demonstra o autocomplete do Zod e menciona:
- `.email()` — validação de email
- `.url()` — validação de URL
- `.min()` / `.max()` — para strings (tamanho)
- `.positive()` — número > 0
- `.gte()` / `.lte()` — maior/menor ou igual (para faixas)