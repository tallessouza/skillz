# Deep Explanation: Caso de Uso Buscar Pergunta pelo Slug

## Por que slug?

O instrutor usa o Stack Overflow como exemplo real: ao acessar uma pergunta, a URL contem o slug da pergunta. Isso torna o slug o identificador principal para acesso via frontend/web. O use case `GetQuestionBySlug` existe porque e assim que usuarios navegam — por URLs amigaveis, nao por IDs internos.

## Separacao de responsabilidades: repositorio vs use case

A decisao arquitetural central desta aula e **onde tratar o caso de entidade nao encontrada**:

- **Repositorio retorna `null`** — ele nao sabe se "nao encontrar" e um erro ou nao. Em alguns contextos, nao encontrar e perfeitamente valido (ex: verificar se email ja existe).
- **Use case lanca erro** — ele conhece a regra de negocio. Se o usuario esta buscando uma pergunta que nao existe, isso e um erro de negocio.

O instrutor menciona explicitamente: "a gente ainda nao vai focar tanto em fazer uma tratativa de erros mais profissional. Mais pra frente a gente vai ver uma forma mais legal de tratar erros." Isso indica que o `throw new Error` e provisorio — sera substituido por um pattern mais robusto (provavelmente Either/Result pattern).

## Value Object: Slug com constructor privado

O instrutor faz uma refatoracao ao vivo importante: transforma o constructor do `Slug` em privado e cria dois metodos estaticos:

1. **`createFromText(text)`** — converte texto livre em slug formatado (usado na criacao real)
2. **`create(slug)`** — aceita slug ja formatado (usado em testes e reconstrucao do banco)

A motivacao e pragmatica: nos testes, voce precisa saber exatamente qual slug foi criado para poder buscar por ele. Se usar `createFromText`, voce depende da logica de formatacao e pode errar a comparacao.

## Pattern de teste para query use cases

O instrutor destaca um pattern fundamental: **testes de busca precisam de dados pre-existentes**. O fluxo e:

1. Crie a entidade com dados conhecidos
2. Persista no repositorio in-memory
3. Execute o use case de busca
4. Valide o resultado

A observacao sobre `await` ser opcional no `repository.create()` e interessante: "pode ser com await ou sem, tanto faz, porque o codigo que tem la dentro e sincrono." O repositorio in-memory e sincrono por natureza, mas a interface e async para manter compatibilidade com implementacoes reais.

## SUT pattern

O instrutor nota que ao trocar o use case no teste, "nao precisei trocar o sut, entao isso ai ja ajuda bastante." O pattern `sut` (System Under Test) desacopla o nome da variavel do use case especifico, facilitando copiar a estrutura de teste entre use cases.

## Retorno futuro expandido

O instrutor menciona: "por enquanto eu vou retornar apenas os dados principais da pergunta, mas mais pra frente a gente pode colocar para retornar outras informacoes tambem" (como respostas). Isso mostra o principio de desenvolvimento incremental — comece simples, expanda depois.