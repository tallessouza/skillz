# Deep Explanation: Seed de Tabelas

## Por que usar seeds?

Seeds existem para popular o banco com dados de exemplo durante o desenvolvimento. A ideia e simples: ao inves de inserir dados manualmente toda vez que resetar o banco, voce tem um script reproduzivel que faz isso automaticamente.

No contexto da aula, o instrutor cria um seed para popular a tabela de mesas (`tables`) de um restaurante. A logica e direta — um restaurante precisa de mesas cadastradas para funcionar, entao o seed garante que existam mesas disponiveis para testes.

## O padrao connect-seed do Drizzle

O Drizzle usa um sistema de seeds baseado em comandos numerados:

1. `npm run connect-seed 2.make insert-tables` — Cria o arquivo de seed a partir de um template
2. `npm run connect-seed 2.run` — Executa o seed

O numero `2` indica a ordem de execucao. Seeds podem ser encadeados: `1.run` executa primeiro, `2.run` segundo, etc. Isso e importante quando ha dependencias entre tabelas.

## Principio: minimalismo nos campos

O instrutor enfatiza que voce so precisa informar os campos que nao tem default. No caso da tabela `tables`:

- `id` — tem default (auto-increment ou UUID), nao precisa informar
- `tableNumber` — campo obrigatorio, precisa informar
- `createdAt` — tem `defaultNow()`, nao precisa informar

Isso reduz ruido no codigo e deixa claro quais campos sao realmente necessarios para criar um registro.

## Quantidade de dados

O instrutor usa 5 mesas como exemplo e comenta que "5 ja esta excelente, e o suficiente". Para desenvolvimento, voce nao precisa de centenas de registros. O objetivo e ter dados suficientes para testar os fluxos, nao simular producao.

## Quando NAO usar seeds

- Producao: seeds sao para desenvolvimento e testes
- Dados sensiveis: nunca coloque senhas reais ou dados pessoais em seeds
- Dados que mudam frequentemente: use a interface da aplicacao para esses