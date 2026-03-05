# Deep Explanation: SQL SUM

## Por que SUM em coluna texto retorna zero?

O instrutor demonstra um ponto sutil: ao executar `SUM(name)` em uma coluna de texto, o SQL nao retorna erro — retorna zero. Isso e perigoso porque cria um **bug silencioso**. O desenvolvedor pode achar que nao ha dados, quando na verdade a coluna simplesmente nao e numerica.

Bancos como PostgreSQL lancam erro explícito em SUM de texto, mas SQLite e MySQL tentam converter e acabam retornando 0. Sempre verifique o tipo da coluna antes de usar SUM.

## Modelo mental: SUM como calculadora de coluna

Pense no SUM como alguem percorrendo uma coluna de cima para baixo com uma calculadora:
- Se encontra numeros: soma normalmente
- Se encontra texto: tenta converter, falha silenciosamente, soma zero
- Se encontra NULL: ignora (nao soma nem quebra)

## WHERE como filtro pre-soma

O WHERE atua ANTES do SUM. Primeiro filtra as linhas, depois soma apenas as que passaram. Isso e importante para entender performance — o banco nao soma tudo e depois filtra.

### Ordem de execucao logica:
1. FROM products (identifica tabela)
2. WHERE category = 'Áudio' (filtra linhas)
3. SELECT SUM(price) (soma apenas as linhas filtradas)

## Edge cases

- **Tabela vazia:** SUM retorna NULL, nao zero. Use `COALESCE(SUM(price), 0)` se precisar de zero.
- **Todos os valores NULL:** Mesmo comportamento — retorna NULL.
- **Valores negativos:** SUM soma negativos normalmente, o que pode ser util para calcular saldos.
- **Overflow:** Em tabelas muito grandes com valores altos, considere o tipo de dado do resultado.

## Quando usar SUM vs outras abordagens

| Cenario | Use |
|---------|-----|
| Total de uma coluna inteira | `SUM(coluna)` |
| Total por grupo | `SUM(coluna) ... GROUP BY outra_coluna` |
| Total acumulado (running total) | Window function: `SUM(coluna) OVER (ORDER BY ...)` |
| Soma no codigo da aplicacao | Evite — deixe o banco fazer, e mais eficiente |