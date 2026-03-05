# Deep Explanation: Finalizando Testes E2E da Aplicacao

## Principio central: teste se adapta ao codigo

O Diego enfatiza um principio fundamental: **o teste deve se adaptar ao codigo, nao o contrario**. No exemplo concreto, a rota de criacao de transacao nao retorna o ID do recurso criado. Em vez de modificar a rota para retornar o ID (o que seria uma mudanca motivada pelo teste, nao pelo negocio), o teste faz uma listagem para obter o ID e entao busca o recurso especifico.

Isso reflete uma filosofia de testes E2E: eles simulam o usuario real. Se o usuario precisaria listar para obter o ID, o teste tambem faz isso.

## Encadeamento de cookies (sessao stateful)

Todas as requisicoes apos a criacao precisam enviar os cookies de volta. Isso porque a aplicacao usa cookies para identificar o usuario/sessao. Esquecer os cookies e o erro mais comum e resulta em 401 ou dados vazios.

O padrao e:
1. Primeira requisicao (POST de criacao) → extrair cookies do response
2. Todas as requisicoes seguintes → enviar cookies no header

## Debugging ao vivo: os erros que o Diego cometeu

### Erro 1: `undefined` no summary
O Diego esperava `res.body.amount` mas a rota retornava `{ summary: { amount: 3000 } }`. Ele foi ao Insomnia verificar a shape real. Licao: **sempre confirme a estrutura real da resposta antes de escrever a assertion**.

### Erro 2: 404 no summary
O path estava `/summary` mas deveria ser `/transactions/summary`. Licao: **404 em teste E2E = verifique o path primeiro, nao a logica**.

Esses dois erros sao extremamente comuns e o Diego os mostra propositalmente para ensinar o processo de debugging.

## Cenario de teste realista para resumo

Para testar o summary, o Diego cria duas transacoes:
- Credit: 5000
- Debit: 2000
- Expected summary: 3000

Usar apenas uma transacao nao provaria que a logica de soma/subtracao funciona. Com duas transacoes de tipos diferentes, voce valida que o calculo esta correto.

## Contexto: testes E2E vs outros tipos

O Diego menciona que todos os testes feitos ate agora sao E2E (end-to-end) — testam a aplicacao de ponta a ponta, passando por todas as camadas (HTTP → rotas → banco). Ele avisa que nas proximas aulas vao trabalhar com outros tipos de testes (unitarios, integracao).