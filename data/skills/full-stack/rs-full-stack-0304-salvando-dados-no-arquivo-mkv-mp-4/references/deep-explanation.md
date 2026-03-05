# Deep Explanation: Salvando Dados no Arquivo

## Por que persistir apos cada mutacao?

O instrutor demonstra um pattern fundamental: o banco de dados em memoria (um objeto JavaScript) e a source of truth para performance, mas precisa ser espelhado no disco para durabilidade.

A abordagem e simples e intencional para o contexto de aprendizado:
- **Memoria** = rapido para leitura e escrita
- **Arquivo** = duravel entre restarts do processo

Quando o instrutor chama `this.persist()` dentro do `insert`, ele garante que cada operacao de escrita resulta em uma atualizacao do arquivo. Isso e o pattern **write-through cache** na sua forma mais simples.

## O fluxo demonstrado

1. O arquivo `db.json` comeca vazio
2. Uma requisicao POST e feita via Insomnia (ex: mouse, 200)
3. O `insert` adiciona ao objeto em memoria
4. `this.#persist()` serializa o objeto inteiro e escreve no arquivo
5. O arquivo agora contem os dados
6. Uma segunda requisicao (ex: teclado, 500) repete o ciclo
7. O arquivo agora contem ambos os registros

## Trade-offs desta abordagem

### Vantagens
- **Simplicidade**: nenhuma dependencia externa
- **Transparencia**: o arquivo JSON e legivel por humanos
- **Durabilidade basica**: dados sobrevivem restart

### Limitacoes (aceitaveis no contexto de aprendizado)
- **Performance**: `writeFileSync` e bloqueante — em producao, usar `writeFile` async
- **Concorrencia**: sem controle de acesso concorrente ao arquivo
- **Escala**: reescrever o arquivo inteiro a cada mutacao nao escala para grandes volumes
- **Atomicidade**: se o processo crashar durante o write, o arquivo pode corromper

## Quando usar este pattern

- Projetos de aprendizado e estudo
- Prototipos rapidos
- CLIs que precisam de persistencia simples
- Aplicacoes com poucos dados e baixa concorrencia

## Quando NAO usar

- Producao com multiplos usuarios simultaneos
- Dados criticos que nao podem ser perdidos
- Volume de dados acima de alguns MB
- Necessidade de queries complexas (usar SQLite, PostgreSQL, etc.)