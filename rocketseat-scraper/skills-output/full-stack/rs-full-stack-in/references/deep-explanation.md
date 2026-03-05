# Deep Explanation: SQL IN

## Por que IN existe

O operador IN é açúcar sintático para múltiplos OR na mesma coluna. A razão principal de usá-lo não é performance (o otimizador do banco geralmente trata ambos da mesma forma), mas **legibilidade e manutenção**. Quando você tem 2 valores, OR funciona. Quando tem 10, IN é claramente superior.

## Modelo mental do instrutor

O instrutor apresenta IN como um "filtro de lista" — você passa uma lista de valores aceitáveis e o banco retorna apenas as linhas que correspondem a qualquer um deles. É como um checklist: "me dê tudo que bate com qualquer item desta lista".

## Dois tipos de valores

O instrutor enfatiza que IN funciona com:
1. **Valores numéricos** — sem aspas: `IN (800, 550, 1200)`
2. **Valores de texto** — com aspas simples: `IN ('image', 'audio')`

Essa distinção é fundamental porque esquecer as aspas em texto causa erro de sintaxe (o banco interpreta como nome de coluna), e colocar aspas em números pode causar coerção de tipo inesperada.

## Escalabilidade da lista

O instrutor demonstra adicionando valores progressivamente: começa com 2 (800, 550), depois adiciona um terceiro (1200). Isso mostra que IN escala naturalmente — basta adicionar mais valores separados por vírgula.

## Quando IN não é ideal

- **Listas muito grandes** (centenas de valores): considere uma tabela temporária ou JOIN
- **Ranges contínuos**: use BETWEEN em vez de listar cada valor
- **Padrões de texto**: use LIKE ou expressões regulares
- **Negação**: NOT IN funciona mas cuidado com NULLs — `NOT IN` com NULL na lista retorna conjunto vazio

## Edge cases com NULL

```sql
-- Cuidado: isso NÃO retorna linhas onde category é NULL
SELECT * FROM products WHERE category IN ('image', 'audio');

-- Cuidado: isso retorna ZERO linhas se qualquer valor for NULL
SELECT * FROM products WHERE category NOT IN ('image', NULL);
```

NULL em listas IN/NOT IN é uma armadilha clássica. NOT IN com NULL sempre retorna vazio por causa da lógica ternária do SQL.