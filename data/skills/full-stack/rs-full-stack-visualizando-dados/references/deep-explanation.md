# Deep Explanation: Visualizando Dados com SELECT

## O que o SELECT realmente faz

O SELECT e o comando fundamental de leitura em SQL. Ele nao altera dados — apenas controla **como voce visualiza** o que esta armazenado. O instrutor enfatiza um ponto crucial: a ordem das colunas no SELECT muda apenas a exibicao, nunca a ordem de armazenamento na tabela.

Isso significa que `SELECT price, name FROM products` e `SELECT name, price FROM products` retornam os mesmos dados, mas em ordem visual diferente. A tabela fisica permanece inalterada.

## O asterisco (`*`) como atalho

O `*` significa "todas as colunas". E um atalho util para exploracao rapida, mas em codigo de producao traz problemas:

1. **Fragilidade** — se alguem adiciona uma coluna na tabela, sua query retorna dados inesperados
2. **Performance** — busca colunas que voce nao precisa, consumindo memoria e banda
3. **Legibilidade** — quem le o codigo nao sabe quais colunas sao realmente usadas

## Comentarios em SQL

O padrao ANSI SQL define `--` (dois tracos) para comentarios de linha unica. O instrutor demonstra isso diretamente:

```sql
-- Seleciona todas as colunas
SELECT * FROM products;
```

Alguns bancos aceitam `#` ou `/* */` para blocos, mas `--` e o mais universal e portavel.

## Selecao de colunas especificas

Ao listar colunas explicitamente, voce:
- Documenta a intencao da query
- Evita buscar dados desnecessarios
- Protege contra mudancas no schema
- Facilita otimizacao pelo banco (pode usar indice covering)

## Ordem de exibicao vs ordem de armazenamento

O instrutor reforça: o SELECT **nao muda como os dados estao salvos**. Ele apenas define a projecao — quais colunas aparecem e em qual sequencia no resultado. Isso e um conceito fundamental de algebra relacional: a operacao de projecao seleciona e reordena atributos sem modificar a relacao base.