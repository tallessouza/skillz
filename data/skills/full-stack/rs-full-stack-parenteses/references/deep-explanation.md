# Deep Explanation: Parênteses e Precedência em SQL

## Por que a precedência importa

Em SQL, o operador AND tem precedência maior que o operador OR. Isso significa que, sem parênteses, o banco de dados avalia todas as condições AND primeiro e depois aplica o OR sobre os resultados.

### A analogia dos grupos

O instrutor (Rodrigo) usa a metáfora de "grupinhos" — cada conjunto de condições entre parênteses forma um grupo independente que retorna um "veredito": verdadeiro ou falso. Os operadores fora dos parênteses conectam esses vereditos.

```
(grupo1_verdadeiro?) AND (grupo2_verdadeiro?)
         ↓                      ↓
    verdadeiro    AND      verdadeiro    →  resultado: verdadeiro
    verdadeiro    AND      falso         →  resultado: falso
```

## Passo a passo da avaliação

### Sem parênteses

```sql
WHERE price > 45 AND price < 1000 AND category = 'audio' OR category = 'image'
```

O SQL avalia assim (AND primeiro):
1. `(price > 45 AND price < 1000 AND category = 'audio')` → grupo implícito AND
2. `OR category = 'image'` → qualquer registro com categoria imagem entra INDEPENDENTE do preço

Para o produto Webcam (preço 1200, categoria imagem):
- Grupo AND: 1200 > 45 ✓, 1200 < 1000 ✗ → **falso**
- OR category = 'image' → **verdadeiro**
- Resultado: falso OR verdadeiro → **verdadeiro** (aparece no resultado!)

### Com parênteses

```sql
WHERE (price > 45 AND price < 1000) AND (category = 'audio' OR category = 'image')
```

Para o mesmo produto Webcam (preço 1200, categoria imagem):
- Grupo 1: 1200 > 45 ✓, 1200 < 1000 ✗ → **falso**
- Grupo 2: categoria = imagem → **verdadeiro**
- Resultado: falso AND verdadeiro → **falso** (NÃO aparece!)

## Insight chave do instrutor

> "Olha só como um parênteses muda o resultado da pesquisa"

A mesma query, com as mesmas condições, retorna resultados completamente diferentes apenas pela adição de parênteses. Isso não é estético — é funcional. Um parênteses mal colocado é um bug silencioso que retorna dados errados sem gerar erro.

## Ordem de precedência SQL

1. `NOT` (maior precedência)
2. `AND`
3. `OR` (menor precedência)

Parênteses sobrescrevem qualquer precedência — sempre são avaliados primeiro.

## Quando os parênteses mudam vs. não mudam o resultado

**Não mudam:** quando todas as condições usam o mesmo operador
```sql
WHERE a AND b AND c        -- parênteses opcionais
WHERE a OR b OR c           -- parênteses opcionais
```

**Mudam:** quando AND e OR são misturados
```sql
WHERE a AND b OR c          -- resultado diferente de WHERE a AND (b OR c)
```

## Edge case: múltiplos níveis de aninhamento

Para queries complexas, aninhe parênteses:
```sql
WHERE (price > 45 AND price < 1000)
  AND (category = 'audio' OR (category = 'image' AND brand = 'logitech'))
```

Cada nível é avaliado de dentro para fora, como em matemática.