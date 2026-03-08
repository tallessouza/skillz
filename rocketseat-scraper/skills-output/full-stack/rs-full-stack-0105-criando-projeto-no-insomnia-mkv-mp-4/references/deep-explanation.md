# Deep Explanation: Criando Projeto no Insomnia

## Por que usar o Insomnia para testar APIs

O Insomnia e uma ferramenta dedicada para testar APIs REST (e GraphQL). Diferente de testar via browser ou curl no terminal, o Insomnia oferece uma interface visual que organiza requisicoes, gerencia ambientes e facilita o ciclo de desenvolvimento de APIs.

## Request Collection vs Design Document

O Insomnia oferece diferentes tipos de projeto. Para testar APIs ja existentes ou em desenvolvimento, a **Request Collection** e a escolha correta. Ela permite criar, organizar e executar requisicoes HTTP agrupadas em pastas.

## A importancia da variavel de ambiente (Base URL)

### O problema sem variavel de ambiente

Sem uma variavel de ambiente, voce precisa digitar a URL completa em cada requisicao:
- `http://localhost:3333/users`
- `http://localhost:3333/products`
- `http://localhost:3333/orders`

Se a porta mudar, ou se voce precisar testar em outro servidor, precisa alterar TODAS as requisicoes manualmente.

### A solucao com `base_url`

Configurando `base_url` no Base Environment, todas as requisicoes referenciam essa variavel. Para trocar o endereco, basta alterar em um unico lugar.

O instrutor enfatiza que o **Base Environment** e o ambiente que ja vem selecionado por padrao — qualquer variavel definida nele estara disponivel em todas as requisicoes do projeto.

## Visualizacao: Table View vs JSON View

O Insomnia oferece duas formas de visualizar as variaveis de ambiente:

1. **Table View** (flag verde ativa): Mostra as variaveis como tabela com colunas de nome, valor e tipo. Util para quem prefere interface visual.

2. **JSON View** (flag desativada): Mostra o JSON puro. O instrutor prefere essa visualizacao porque mostra exatamente o que esta configurado, sem abstraco.

Ambas as visualizacoes editam os mesmos dados — o que voce altera em uma, reflete na outra.

## Autocomplete de variaveis

Quando voce digita o inicio do nome de uma variavel no campo de URL (ex: `base`), o Insomnia automaticamente sugere as variaveis disponiveis. Isso confirma que a variavel foi configurada corretamente e economiza tempo.

## Fluxo recomendado ao iniciar um novo projeto

1. **Primeiro**: Crie a Request Collection com o nome do projeto
2. **Segundo**: Configure o Base Environment com `base_url`
3. **Terceiro**: Crie uma requisicao GET simples para validar a conexao
4. **Depois**: Comece a criar as requisicoes reais dos endpoints da API

Esse fluxo garante que o ambiente esta funcional antes de comecar a testar endpoints complexos. E um "teste do teste" — voce valida que o Insomnia esta conectando na API antes de depender dele para desenvolvimento.

## Contexto do projeto Refound

O projeto Refound e a API que esta sendo desenvolvida no curso. Nesse ponto, a API ja esta rodando em `http://localhost:3333` e retorna uma mensagem basica. O Insomnia sera usado ao longo de todo o desenvolvimento para testar cada novo endpoint conforme for implementado.