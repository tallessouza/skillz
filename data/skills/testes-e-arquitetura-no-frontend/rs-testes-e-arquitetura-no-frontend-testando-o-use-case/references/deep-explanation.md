# Deep Explanation: Testando Use Cases com Fakes e Spies

## Por que fakes sao superiores a mocks neste contexto

O instrutor enfatiza que fakes sao "test doubles" assim como mocks e stubs, mas com uma vantagem crucial: **controle total**. Um fake e basicamente um objeto que implementa a interface real com logica simplificada. Isso significa que:

- Voce nao depende do framework de mock (Jest, Vitest)
- O comportamento e previsivel e inspecionavel
- Pode ser reutilizado entre testes
- Pode ser implementado como objeto literal ou como classe

O instrutor mostra que o fake pode ser tao simples quanto um objeto com metodos async que retornam dados pre-definidos, mas tambem pode conter logica real (como o `filter` no `searchMany`), o que o torna muito mais util para testar comportamentos complexos.

## A piramide de testes e o custo/beneficio

O instrutor faz uma reflexao importante: **nem todo teste precisa existir em todas as camadas**. Ele reconhece que o comportamento de "retornar todos quando o termo e vazio" ja foi testado na action, mas escolhe testar novamente no use case por fins didaticos.

Na pratica, a decisao depende de:
- **Mais testes = maior confianca** mas tambem pipeline mais lento
- **Testes de unidade sao rapidos** — por isso a piramide tem mais deles na base
- **Testes E2E sao lentos e sensiveis** — qualquer mudanca na UI pode quebra-los
- A decisao de duplicar ou nao um teste entre camadas **nao e certo/errado**, e uma analise de custo/beneficio

## Spies como complemento aos fakes

O instrutor mostra uma tecnica hibrida onde combina fakes com spies:
1. Cria `jest.fn()` com `mockResolvedValue` para ter tanto o comportamento fake quanto a capacidade de espionagem
2. Usa o spread do repository original (`...repository`) para manter os metodos que nao precisam de spy
3. Verifica com `toHaveBeenCalledTimes` e `not.toHaveBeenCalled` para validar o fluxo de decisao

Isso e especialmente util quando o use case tem logica condicional (como decidir entre `findMany` e `searchMany` baseado no input).

## Validacao de falso positivo

O instrutor demonstra consistentemente a pratica de **quebrar o teste intencionalmente** apos ele passar:
- Comenta um item do input para verificar se o `toHaveLength(2)` falha
- Muda o ID esperado para verificar se o assertion de igualdade funciona
- Remove o `not` do `toHaveBeenCalled` para verificar se o spy esta funcionando

Essa pratica e crucial porque um teste que sempre passa (independente do codigo) e pior do que nenhum teste — ele da falsa confianca.

## O padrao de estrutura de pastas espelhada

O instrutor cria os testes em `src/core/application/prompts/search-prompt-use-case.spec.ts`, espelhando exatamente a estrutura do codigo fonte. Isso facilita:
- Encontrar o teste correspondente a qualquer arquivo
- Manter a organizacao conforme o projeto cresce
- Entender a arquitetura do projeto pela estrutura de testes

## Cast de tipo para inputs invalidos

Para testar o cenario de `undefined`, o instrutor usa `as unknown as string` para contornar o TypeScript. Isso e uma tecnica valida em testes porque:
- Em runtime, o usuario pode enviar qualquer coisa
- O TypeScript so garante tipos em compile-time
- Testar inputs invalidos e essencial para robustez
- O cast duplo (`unknown` primeiro, depois o tipo alvo) e a forma segura de fazer isso no TypeScript