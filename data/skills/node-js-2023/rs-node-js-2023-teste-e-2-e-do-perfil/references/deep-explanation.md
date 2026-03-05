# Deep Explanation: Teste E2E de Rotas Autenticadas

## O padrao cascata e por que ele existe

O instrutor chama de "cascatinha" o padrao onde testes E2E de rotas protegidas precisam executar pre-requisitos em sequencia. Para acessar o perfil de um usuario, voce precisa estar logado. Para estar logado, precisa ter criado conta. Essa cadeia de dependencias e inevitavel em testes E2E porque, diferente de testes unitarios, voce esta testando o fluxo real da aplicacao.

### Por que nao mockar a autenticacao em testes E2E?

O objetivo do E2E e validar que o sistema funciona de ponta a ponta. Se voce mockar o JWT ou injetar o usuario direto no banco, voce perde a garantia de que o fluxo real de autenticacao funciona. O custo da cascata e pequeno comparado ao valor de testar o caminho completo.

## A decisao de otimizar depois

O instrutor deliberadamente escolhe a abordagem mais simples primeiro (cascata inline) e menciona que vai otimizar depois. Isso reflete um principio importante: **nao abstraia prematuramente**. Ele observa que "quase todas as rotas vao exigir que o usuario esteja logado", entao a cascata vai se repetir. Mas ao inves de criar o helper imediatamente, ele espera ate ter evidencia concreta de repeticao.

O momento certo de extrair o helper: quando voce tem 2-3 testes com a mesma cascata.

## Supertest: `.set()` para headers

O metodo `.set('Authorization', `Bearer ${token}`)` do Supertest define headers HTTP na requisicao. O instrutor momentaneamente hesita entre `.set()` e `.header()` — ambos funcionam no Supertest, mas `.set()` e o idiomatico.

## Validacao parcial com `expect.objectContaining`

Ao validar a resposta do perfil, o instrutor valida apenas o `email` ao inves de todo o objeto. Isso e intencional: campos como `id` e `created_at` sao gerados dinamicamente e nao sao previsiveis no teste. Validar pelo email confirma que o usuario correto foi retornado sem acoplar o teste a valores dinamicos.

## Estrutura de resposta

A rota `GET /me` retorna status 200 com o usuario dentro de `body.user`. Essa convencao de encapsular o recurso em uma chave nomeada (ao inves de retornar direto no body) e um padrao comum em APIs REST que facilita extensao futura (adicionar metadata, pagination, etc).