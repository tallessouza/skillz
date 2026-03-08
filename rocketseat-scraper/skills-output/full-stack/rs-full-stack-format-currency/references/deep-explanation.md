# Deep Explanation: Formatação de Moeda (formatCurrency)

## Por que usar Intl.NumberFormat

O `Intl.NumberFormat` é uma API nativa do JavaScript que lida com formatação numérica respeitando localidades. Diferente de soluções manuais com `toFixed` + `replace`, o `Intl` entende:

- **Separador de milhar**: `1.000` em pt-BR vs `1,000` em en-US
- **Separador decimal**: `,` em pt-BR vs `.` em en-US
- **Símbolo de moeda**: `R$` para BRL, `$` para USD, `€` para EUR
- **Posição do símbolo**: antes do número em BRL, depois em algumas moedas europeias
- **Casas decimais padrão**: 2 para a maioria das moedas, 0 para JPY

## O fluxo do dado monetário

O instrutor enfatiza que o valor chega como **número** da API, não como string:

```
API retorna: { amount: 34.5 }
                        ↓
JavaScript recebe como number (ponto decimal é padrão)
                        ↓
formatCurrency(34.5) → "34,50" (formatado para exibição)
                        ↓
UI renderiza: R$ 34,50
```

O zero final (`34.50` → `34,50`) é adicionado automaticamente pelo `Intl.NumberFormat` porque moedas BRL usam 2 casas decimais por padrão.

## Por que remover o R$

No contexto da aula, o layout do componente `RefundItem` já possui o símbolo `R$` estilizado via CSS. Quando o `Intl.NumberFormat` com `style: "currency"` formata o valor, ele inclui `R$` automaticamente. Isso resultaria em duplicação:

```
R$ R$ 34,50  ← duplicado
```

A solução é o `.replace("R$", "").trim()` que remove o símbolo da string formatada, mantendo apenas o valor numérico formatado corretamente.

## Quando NÃO remover o R$

Se o componente não inclui o símbolo de moeda no layout, mantenha o retorno completo:

```typescript
export function formatCurrencyWithSymbol(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
  // Retorna: "R$ 34,50" — com símbolo
}
```

## Separação de responsabilidades

O instrutor cria o arquivo em `utils/format-currency.ts` — uma função utilitária pura que:

1. Recebe um `number`
2. Retorna uma `string` formatada
3. Não tem efeitos colaterais
4. Não depende de estado do componente
5. Pode ser reutilizada em qualquer componente que exiba valores monetários

Essa abordagem segue o princípio de manter lógica de formatação **fora dos componentes** e em funções utilitárias dedicadas.

## Edge cases a considerar

- **Valores negativos**: `formatCurrency(-34.5)` → `-34,50` (Intl lida automaticamente)
- **Zero**: `formatCurrency(0)` → `0,00`
- **Valores grandes**: `formatCurrency(1234567.89)` → `1.234.567,89` (separador de milhar automático)
- **NaN**: `formatCurrency(NaN)` → `NaN` (validar antes de chamar)
- **Valores com muitas casas**: `formatCurrency(34.567)` → `34,57` (arredondamento automático)